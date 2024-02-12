import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import {
  AgentExecutor,
  createOpenAIFunctionsAgent,
  createReactAgent,
} from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { Calculator } from "langchain/tools/calculator";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";

import { pull } from "langchain/hub";
import type { PromptTemplate } from "@langchain/core/prompts";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export const runtime = "edge";

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const AGENT_SYSTEM_TEMPLATE = `You are a helpfull assistent. All final responses must be concise.`;

/**
 * This handler initializes and calls an OpenAI Functions agent.
 * See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/agents/agent_types/openai_functions_agent
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const returnIntermediateSteps = true;

    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === "user" || message.role === "assistant",
    );
    const previousMessages = messages
      .slice(0, -1)
      .map(convertVercelMessageToLangChainMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const tools = [new Calculator(), new SerpAPI()];

    // const chatOpenAI = new ChatOpenAI({
    //   modelName: "gpt-3.5-turbo-1106",
    //   temperature: 0,
    //   // IMPORTANT: Must "streaming: true" on OpenAI to enable final output streaming below.
    //   streaming: true,
    // });

    // const prompt = ChatPromptTemplate.fromMessages([
    //   ["system", AGENT_SYSTEM_TEMPLATE],
    //   new MessagesPlaceholder("chat_history"),
    //   ["human", "{input}"],
    //   new MessagesPlaceholder("agent_scratchpad"),
    // ]);

    // const agent = await createOpenAIFunctionsAgent({
    //   llm: chat,
    //   tools,
    //   prompt,
    // });

    // const agentExecutor = new AgentExecutor({
    //   agent,
    //   tools,
    //   // Set this if you want to receive all intermediate steps in the output of .invoke().
    //   returnIntermediateSteps,
    // });

    // https://js.langchain.com/docs/modules/agents/agent_types/react

    const chat = new ChatOllama({
      baseUrl: "http://localhost:11434", // Default value
      model: "mistral",
    });

    const prompt = await pull<PromptTemplate>("hwchase17/react-chat");

    console.log(prompt.toJSON());

    const agent = await createReactAgent({
      llm: chat,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      returnIntermediateSteps,
    });

    if (!returnIntermediateSteps) {
      /**
       * Agent executors also allow you to stream back all generated tokens and steps
       * from their runs.
       *
       * This contains a lot of data, so we do some filtering of the generated log chunks
       * and only stream back the final response.
       *
       * This filtering is easiest with the OpenAI functions or tools agents, since final outputs
       * are log chunk values from the model that contain a string instead of a function call object.
       *
       * See: https://js.langchain.com/docs/modules/agents/how_to/streaming#streaming-tokens
       */
      const logStream = await agentExecutor.streamLog({
        input: currentMessageContent,
        chat_history: previousMessages.join("\n"),
      });

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of logStream) {
            if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
              const addOp = chunk.ops[0];
              if (
                addOp.path.startsWith("/logs/ChatOpenAI") &&
                typeof addOp.value === "string" &&
                addOp.value.length
              ) {
                controller.enqueue(textEncoder.encode(addOp.value));
              }
            }
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(transformStream);
    } else {
      /**
       * Intermediate steps are the default outputs with the executor's `.stream()` method.
       * We could also pick them out from `streamLog` chunks.
       * They are generated as JSON objects, so streaming them is a bit more complicated.
       */
      const result = await agentExecutor.invoke({
        input: currentMessageContent,
        chat_history: previousMessages.join("\n"),
      });
      return NextResponse.json(
        { output: result.output, intermediate_steps: result.intermediateSteps },
        { status: 200 },
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
