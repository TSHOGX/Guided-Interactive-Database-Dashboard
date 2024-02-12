import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { TextLoader } from "langchain/document_loaders/fs/text";

// import { createClient } from "@supabase/supabase-js";
import { Chroma } from "@langchain/community/vectorstores/chroma";
const { ChromaClient } = require("chromadb");

import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";

export const runtime = "edge";

// Before running, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/docs/modules/data_connection/document_transformers/text_splitters/recursive_text_splitter
 * https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase
 */
export async function POST(req: NextRequest) {
  // if (process.env.NEXT_PUBLIC_DEMO === "true") {
  //   return NextResponse.json(
  //     {
  //       error: [
  //         "Ingest is not supported in demo mode.",
  //         "Please set up your own version of the repo here: https://github.com/langchain-ai/langchain-nextjs-template",
  //       ].join("\n"),
  //     },
  //     { status: 403 },
  //   );
  // }

  try {
    // const client = createClient(
    //   process.env.SUPABASE_URL!,
    //   process.env.SUPABASE_PRIVATE_KEY!,
    // );
    const client = new ChromaClient();
    const heartbeatFn = async () => {
      return await client.heartbeat();
    };
    let heartbeat = heartbeatFn();
    console.log(heartbeat);

    // Create docs with a loader
    const body = await req.json();
    const text =
      "Ingest is not supported in demo mode. Please set up your own version of the repo here: https://github.com/langchain-ai/langchain-nextjs-template";
    // const filePath = body.filePath;
    // const loader = new TextLoader(filePath);
    // const docs = await loader.load();

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 256,
      chunkOverlap: 20,
    });

    const splitDocuments = await splitter.createDocuments([text]);

    // const vectorstore = await SupabaseVectorStore.fromDocuments(
    //   splitDocuments,
    //   new OpenAIEmbeddings(),
    //   {
    //     client,
    //     tableName: "documents",
    //     queryName: "match_documents",
    //   },
    // );

    // Create vector store and index the docs
    const vectorstore = await Chroma.fromDocuments(
      splitDocuments,
      new OllamaEmbeddings({
        model: "mistral",
        baseUrl: "https://localhost:11434", // default value
        // requestOptions: {
        //   useMMap: true,
        //   numThread: 6,
        //   numGpu: 1,
        // },
      }),
      {
        collectionName: "a-test-collection",
        url: "http://localhost:8000", // Optional, will default to this value
        collectionMetadata: {
          "hnsw:space": "cosine",
        }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
      },
    );

    // Search for the most similar document
    const response = await vectorstore.similaritySearch("hello", 1);
    console.log("response", response, splitDocuments.toString());
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
