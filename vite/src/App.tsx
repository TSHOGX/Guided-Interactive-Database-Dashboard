import { useEffect, useState } from "react";
import Perspective from "./components/Perspective";
import SQLEditor from "./components/SQLEditor";
import Sider from "./components/Sider";
import {
  excuteQuery,
  updateTableList,
  updateFileList,
  postNewFile,
} from "./lib/api";
import { FileType } from "./lib/types";

import { Panel, PanelGroup } from "react-resizable-panels";
import ResizeHandle from "./components/ResizeHandle";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [arrowFile, setArrowFile] = useState<Blob | null>(null);
  const [fileList, setFileList] = useState<FileType[]>([]);
  const [tableList, setTableList] = useState<string[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [fileFormData, setFileFormData] = useState<FormData | null>(null);
  const [isLocal, setIsLocal] = useState<boolean>(true);
  const [DB_ENDPOINT, setDB_ENDPOINT] = useState<string>(
    "http://localhost:8000/",
  );

  // update DB_ENDPOINT when isLocal changes
  useEffect(() => {
    if (isLocal) {
      setDB_ENDPOINT("http://localhost:8000/");
    } else {
      setDB_ENDPOINT("https://duckdb-render.onrender.com/");
    }
  }, [isLocal]);

  // updateTableList & updateFileList when DB_ENDPOINT changes
  useEffect(() => {
    toast.promise(updateTableList(setTableList, DB_ENDPOINT), {
      pending: "Updating Table List ...",
      success: "Table List Updated 👌",
      error: "Failed 🤯",
    });
    toast.promise(updateFileList(setFileList, DB_ENDPOINT), {
      pending: "Updating File List ...",
      success: "File List Updated 👌",
      error: "Failed 🤯",
    });
    console.log("DB_ENDPOINT", DB_ENDPOINT);
  }, [DB_ENDPOINT]);

  // excuteQuery & updateTableList when send selectedCode
  useEffect(() => {
    if (!selectedCode) return;
    toast
      .promise(excuteQuery(selectedCode, setArrowFile, DB_ENDPOINT), {
        pending: "Excuting ...",
        success: "Excuted 👌",
        error: "Failed 🤯",
      })
      .then(() => {
        console.log("selectedCode", selectedCode);
        if (
          selectedCode.toLowerCase().includes("create") ||
          selectedCode.toLowerCase().includes("drop")
        ) {
          toast.promise(updateTableList(setTableList, DB_ENDPOINT), {
            pending: "Updating Table List ...",
            success: "Table List Updated 👌",
            error: "Failed 🤯",
          });
        }
      });
  }, [selectedCode]);

  // upload file and refresh file list
  useEffect(() => {
    if (!fileFormData) return;
    toast.promise(postNewFile(fileFormData, setFileList, DB_ENDPOINT), {
      pending: "Uploading New File ...",
      success: "New File Uploaded 👌",
      error: "Failed 🤯",
    });
  }, [fileFormData]);

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
        // transition:Bounce
      />
      <div className=" hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Sider
          fileList={fileList}
          tableList={tableList}
          setFileList={setFileList}
          setFileFormData={setFileFormData}
          isLocal={isLocal}
          setIsLocal={setIsLocal}
          DB_ENDPOINT={DB_ENDPOINT}
        />
      </div>
      <div className=" h-screen lg:pl-64">
        <PanelGroup autoSaveId="example" direction="vertical">
          <Panel collapsible={true} defaultSize={20} order={1}>
            <SQLEditor setSelectedCode={setSelectedCode} />
          </Panel>
          <ResizeHandle />
          <Panel collapsible={true} order={2}>
            <Perspective arrowFile={arrowFile as Blob | null} />
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
}

export default App;
