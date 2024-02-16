export async function postNewFile(fileFormData, setFileList, DB_ENDPOINT) {
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

export async function excuteQuery(selectedCode, setTableArrow, DB_ENDPOINT) {
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
      setTableArrow(blobResponse);
    })
    .catch((error) => {
      throw error("Error:", error);
    });
}

export async function updateTableList(setTableList, DB_ENDPOINT) {
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

export async function updateFileList(setFileList, DB_ENDPOINT) {
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
export async function deleteFile(fileId, setFileList, DB_ENDPOINT) {
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
