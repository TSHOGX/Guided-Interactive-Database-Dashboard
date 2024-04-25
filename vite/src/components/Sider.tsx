import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import { deleteFile } from "../lib/api";
import DropFile from "./DropFile";
import { tableFromIPC } from "apache-arrow";

import { RiDeleteBin5Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

type SiderProps = {
  fileList: { id: string; file: string }[];
  tableList: string[];
  llmResult: Blob | null;
  setFileList: (fileList: { id: string; file: string }[]) => void;
  setFileFormData: (formData: FormData) => void;
  isLocal: boolean;
  setIsLocal: (isLocal: boolean) => void;
  DB_ENDPOINT: string;
};

export default function Sider({
  fileList,
  tableList,
  llmResult,
  setFileList,
  setFileFormData,
  isLocal,
  setIsLocal,
  DB_ENDPOINT,
}: SiderProps) {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [llmstring, setLlmString] = useState<string>("");

  // delete file and refresh file list
  const handleDelete = async (fileId: string) => {
    toast.promise(deleteFile(fileId, setFileList, DB_ENDPOINT), {
      pending: "Deleting ...",
      success: "Deleted 👌",
      error: "Failed 🤯",
    });
  };

  // load llm result
  useEffect(() => {
    if (!llmResult) return;
    const loadLLMResult = async () => {
      const arrow = await llmResult.arrayBuffer();
      const table = tableFromIPC(arrow);
      const llmColumn = table.getChild("llm");
      if (llmColumn) {
        const data = llmColumn.toArray();
        console.log(data);
        setLlmString(data.join("\n"));
      }
    };
    loadLLMResult().catch((error) => console.warn("error", error));
  }, [llmResult]);

  return (
    <div className=" flex h-screen grow flex-col justify-between overflow-y-auto  bg-white px-6 pb-4">
      <div className=" flex w-full flex-col">
        <div className=" mx-auto pb-4 pt-8 text-lg">File List</div>
        <ul className=" mx-4 space-y-1 text-left text-gray-500 ">
          {fileList.map((file) => (
            <li
              className=" flex w-full items-center justify-between gap-1"
              key={file.id}
            >
              <button
                onClick={(e) => {
                  const target = e.target as HTMLButtonElement;
                  navigator.clipboard.writeText(
                    // `media/files/${target.textContent}`,
                    `${target.textContent}`,
                  );
                  toast("Copied to clipboard");
                }}
              >
                {file.file.split("/").pop()}
              </button>
              <div className=" mt-1 flex gap-2">
                <button onClick={() => handleDelete(file.id)}>
                  <RiDeleteBin5Fill />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <hr className=" mx-auto my-4 h-1 w-48 rounded bg-gray-200" />
        <div className=" mx-auto pb-4 pt-2 text-lg">Table List</div>
        <ul className=" mx-4 space-y-1 text-left text-gray-500">
          {tableList.map((table, index) => (
            <li
              className=" flex w-full items-center justify-between gap-1"
              key={index}
            >
              <button
                onClick={(e) => {
                  const target = e.target as HTMLButtonElement;
                  navigator.clipboard.writeText(
                    // `SELECT * FROM ${target.textContent};`,
                    `${target.textContent}`,
                  );
                  toast("Copied to clipboard");
                }}
              >
                {table}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className=" flex w-full flex-col">
        <hr className=" mx-auto my-4 h-1 w-48 rounded bg-gray-200" />
        <div className=" mx-auto pb-4 pt-2 text-lg">LLM LOG</div>
        <div className=" h-96 w-full overflow-y-scroll p-2 text-gray-500">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {llmstring}
          </ReactMarkdown>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between space-x-4 text-gray-500">
          <div className=" flex flex-row ">
            <div className=" my-auto">
              Run In {isLocal ? "Local" : "Remote"}
            </div>
            <Switch
              {...label}
              defaultChecked
              onChange={() => {
                setIsLocal(!isLocal);
              }}
            />
          </div>
          <DropFile setFileFormData={setFileFormData} />
        </div>
      </div>
    </div>
  );
}
