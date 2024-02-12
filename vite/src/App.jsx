import { useEffect, useState } from "react";
import Perspective from "./components/Perspective";
import SQLEditor from "./components/SQLEditor";
import DropFile from "./components/DropFile";

import { Panel, PanelGroup } from "react-resizable-panels";
import ResizeHandle from "./components/ResizeHandle";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DB_ENDPOINT = "http://localhost:8000/";

async function fetchTables() {
  const response = await fetch(`${DB_ENDPOINT}duckduck/get-table-list/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const table_list = await response.json();
  return table_list["table_list"]["name"];
}

async function fetchData() {
  const response = await fetch(`${DB_ENDPOINT}file-manager/files-router/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const file_list = await response.json();
  return file_list;
}

function App() {
  const [fileList, setFileList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [fileFormData, setFileFormData] = useState(new FormData());

  // fetch table list when start
  useEffect(() => {
    async function fetchDataIN() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const table_list = await fetchTables();
      setTableList(table_list);
    }
    fetchDataIN();
  }, []);

  // update table list when selectedCode contains "create"
  useEffect(() => {
    if (selectedCode.toLowerCase().includes("create")) {
      async function fetchDataIN() {
        const table_list = await fetchTables();
        setTableList(table_list);
      }
      fetchDataIN();
    }
  }, [selectedCode]);

  // refresh file list when file uploaded
  useEffect(() => {
    async function fetchDataIN() {
      await toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
        pending: "Uploading...",
        success: "Uploaded 👌",
        error: "Failed 🤯",
      });
      const file_list = await fetchData();
      setFileList(file_list);
    }
    fetchDataIN();
  }, [fileFormData]);

  // delete file and refresh file list
  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(
        `${DB_ENDPOINT}file-manager/delete-file/${fileId}/`,
        {
          method: "DELETE",
        },
      );
      async function fetchDataIN() {
        await toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1000)),
          {
            pending: "Deleting...",
            success: "Deleted 👌",
            error: "Failed 🤯",
          },
        );
        const file_list = await fetchData();
        setFileList(file_list);
      }
      fetchDataIN();
    } catch (error) {
      console.error("Error occurred while deleting file:", error);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
      />
      <div className=" hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className=" flex grow flex-col justify-between overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
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
                      navigator.clipboard.writeText(
                        `media/files/${e.target.textContent}`,
                      );
                    }}
                  >
                    {file.file.split("/").pop()}
                  </button>
                  <div className=" mt-1 flex gap-2">
                    <a href={file.file} target="_blank" rel="noreferrer">
                      <svg
                        className="h-4 w-4 text-gray-400 hover:text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 11V17M12 17L10 15M12 17L14 15M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
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
                      navigator.clipboard.writeText(
                        `SELECT * FROM ${e.target.textContent};`,
                      );
                    }}
                  >
                    {table}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className=" h-32">
            <DropFile
              fileFormData={fileFormData}
              setFileFormData={setFileFormData}
            />
          </div>
        </div>
      </div>
      <div className=" h-screen lg:pl-64">
        <PanelGroup autoSaveId="example" direction="vertical">
          <Panel collapsible={true} defaultSize={20} order={1}>
            <SQLEditor setSelectedCode={setSelectedCode} />
          </Panel>
          <ResizeHandle />
          <Panel collapsible={true} order={2}>
            <Perspective selectedCode={selectedCode} />
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
}

export default App;
