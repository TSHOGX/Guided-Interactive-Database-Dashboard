import React, { useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const DB_ENDPOINT = "http://localhost:8000/";

export default function DropFile({ fileFormData, setFileFormData }) {
  const onDrop = useCallback((acceptedFiles) => {
    let newFormData = new FormData();
    newFormData.append("file", acceptedFiles[0]);
    setFileFormData(newFormData);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  // when fileFormData change, fetch (POST query) for file url
  useEffect(() => {
    async function fetchData() {
      if (fileFormData.get("file")) {
        const response = await fetch(
          `${DB_ENDPOINT}file-manager/files-router/`,
          {
            method: "POST",
            body: fileFormData,
          },
        );
      }
    }
    fetchData();
  }, [fileFormData]);

  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-md border border-dotted px-4 text-gray-500"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <svg
        className="mr-2 h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
      Drop the files here
    </div>
  );
}
