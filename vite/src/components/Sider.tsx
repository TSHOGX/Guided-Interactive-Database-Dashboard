import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import { deleteFile } from "../lib/api";
import DropFile from "./DropFile";

import { FaGithub } from "react-icons/fa";

type SiderProps = {
  fileList: { id: string; file: string }[];
  tableList: string[];
  setFileList: (fileList: { id: string; file: string }[]) => void;
  setFileFormData: (formData: FormData) => void;
  isLocal: boolean;
  setIsLocal: (isLocal: boolean) => void;
  DB_ENDPOINT: string;
};

export default function Sider({
  fileList,
  tableList,
  setFileList,
  setFileFormData,
  isLocal,
  setIsLocal,
  DB_ENDPOINT,
}: SiderProps) {
  const label = { inputProps: { "aria-label": "Switch demo" } };

  // delete file and refresh file list
  const handleDelete = async (fileId: string) => {
    toast.promise(deleteFile(fileId, setFileList, DB_ENDPOINT), {
      pending: "Deleting ...",
      success: "Deleted 👌",
      error: "Failed 🤯",
    });
  };

  return (
    <div className=" flex h-screen grow flex-col justify-between overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div className=" flex w-full flex-col">
        <div className=" mx-auto pb-4 pt-8 text-lg">File List</div>
        {/* <hr className=" mx-auto my-4 h-1 w-48 rounded bg-gray-200" /> */}
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
                    `media/files/${target.textContent}`,
                  );
                }}
              >
                {file.file.split("/").pop()}
              </button>
              <div className=" mt-1 flex gap-2">
                <button onClick={() => handleDelete(file.id)}>
                  <svg
                    className="h-4 w-4 text-gray-300 hover:text-gray-400"
                    viewBox="0 0 52 52"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M45.5,10H33V6c0-2.2-1.8-4-4-4h-6c-2.2,0-4,1.8-4,4v4H6.5C5.7,10,5,10.7,5,11.5v3C5,15.3,5.7,16,6.5,16h39
		c0.8,0,1.5-0.7,1.5-1.5v-3C47,10.7,46.3,10,45.5,10z M23,7c0-0.6,0.4-1,1-1h4c0.6,0,1,0.4,1,1v3h-6V7z"
                    />
                    <path
                      d="M41.5,20h-31C9.7,20,9,20.7,9,21.5V45c0,2.8,2.2,5,5,5h24c2.8,0,5-2.2,5-5V21.5C43,20.7,42.3,20,41.5,20z
		 M23,42c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V28c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1V42z M33,42c0,0.6-0.4,1-1,1h-2
		c-0.6,0-1-0.4-1-1V28c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1V42z"
                    />
                  </svg>
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
                    `SELECT * FROM ${target.textContent};`,
                  );
                }}
              >
                {table}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex items-center justify-between space-x-4">
          <div className=" flex flex-row justify-between">
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
          <a
            href="https://github.com/TSHOGX/Guided-Interactive-Database-Dashboard"
            target="_blank"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </div>
  );
}
