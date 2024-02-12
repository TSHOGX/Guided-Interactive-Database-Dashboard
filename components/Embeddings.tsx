import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Define the path to the repo to perform RAG on.
const REPO_PATH = "/docs";

const loader = new DirectoryLoader(REPO_PATH, {
  ".txt": (path) => new TextLoader(path),
});
const docs = await loader.load();

const mdSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
  chunkSize: 2000,
  chunkOverlap: 200,
});
const texts = await mdSplitter.splitDocuments(docs);
console.log("Loaded ", texts.length, " documents.");

const embeddings = new OllamaEmbeddings({
  model: "mistral",
  baseUrl: "http://localhost:11434", // default value
  requestOptions: {
    useMMap: true,
    numThread: 6,
    numGpu: 1,
  },
});

const documents = ["Hello World!", "Bye Bye"];

const documentEmbeddings = await embeddings.embedDocuments(documents);
