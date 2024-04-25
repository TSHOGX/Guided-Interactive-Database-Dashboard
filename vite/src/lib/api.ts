type FileFormData = any;
type SetFileListFunction = (fileList: any) => void;
type SetTableArrowFunction = (blobResponse: Blob) => void;
type SetTableListFunction = (tableList: any[]) => void;
type SelectedCodeType = string;
type DBEndpointType = string;

export async function postNewFile(
  fileFormData: FileFormData,
  setFileList: SetFileListFunction,
  DB_ENDPOINT: DBEndpointType,
): Promise<void> {
  if (fileFormData.get("file")) {
    await fetch(`${DB_ENDPOINT}api/file-router/`, {
      method: "POST",
      body: fileFormData,
    })
      .then(() => {
        updateFileList(setFileList, DB_ENDPOINT);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.warn("No file to upload");
  }
}

export async function excuteQuery(
  selectedCode: SelectedCodeType,
  setTableArrow: SetTableArrowFunction,
  setLlmResult: SetTableArrowFunction,
  DB_ENDPOINT: DBEndpointType,
): Promise<void> {
  await fetch(`${DB_ENDPOINT}duckduck/execute-query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: selectedCode,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blobResponse) => {
      if (selectedCode.startsWith("-- llm: ")) {
        setLlmResult(blobResponse);
      } else {
        setTableArrow(blobResponse);
      }
    })
    .catch((error) => {
      throw error("Error:", error);
    });
}

export async function updateTableList(
  setTableList: SetTableListFunction,
  DB_ENDPOINT: DBEndpointType,
): Promise<void> {
  await fetch(`${DB_ENDPOINT}duckduck/get-table-list/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((table_list) => {
      return table_list["table_list"]["name"];
    })
    .then((table_list) => {
      setTableList(table_list);
    })
    .catch((error) => {
      throw error("Error:", error);
    });
}

export async function updateFileList(
  setFileList: SetFileListFunction,
  DB_ENDPOINT: DBEndpointType,
): Promise<void> {
  await fetch(`${DB_ENDPOINT}api/file-router/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((file_list) => {
      setFileList(file_list);
    })
    .catch((error) => {
      throw error("Error:", error);
    });
}

// delete file and refresh file list
export async function deleteFile(
  fileId: string,
  setFileList: SetFileListFunction,
  DB_ENDPOINT: DBEndpointType,
): Promise<void> {
  await fetch(`${DB_ENDPOINT}api/file-router/${fileId}/`, {
    method: "DELETE",
  })
    .then(() => {
      updateFileList(setFileList, DB_ENDPOINT);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
