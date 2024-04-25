from openai import OpenAI


class LLMConnector:
    def __init__(self):
        self.client = OpenAI(
            api_key="sk-1b1e567890iuyhgvbnmkiuytr6789olkmjuyt",
        )

        # Add the file to the assistant
        self.assistant = self.client.beta.assistants.create(
            name="DB Assistants",
            instructions="You are a professional data scientist. I will provide you with a description of a dataset, which includes labels (descriptions of variables) and SAS variable names (as they appear in the dataset file). Your task is to understand the dataset thoroughly. Based on my question, identify the top four relevant variables in bullet points.",
            model="gpt-3.5-turbo",
            tools=[{"type": "retrieval"}],
            file_ids=["file-Rr0OWkZfRXoz3sAnRQEBTLrx"],
        )

        # Create a new thread
        self.thread = self.client.beta.threads.create()

    def run(self, query):
        print(query)

        # Create a message in the thread
        message = self.client.beta.threads.messages.create(
            thread_id=self.thread.id,
            role="user",
            content=query,
        )

        # Run the assistant
        run = self.client.beta.threads.runs.create_and_poll(
            thread_id=self.thread.id,
            assistant_id=self.assistant.id,
        )
        if run.status == "completed":
            messages = self.client.beta.threads.messages.list(thread_id=self.thread.id)
            message = messages.data[0]
            content = message.content[0]
            reslt = content.text.value  # type: ignore
            print(reslt)
            return reslt
        else:
            print(run.status)
            return run.status
