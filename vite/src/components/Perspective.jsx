import React, { useEffect, useState } from "react";
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";
import { toast } from "react-toastify";

const DB_ENDPOINT = "http://localhost:8000/";

const WORKER = perspective.worker();

export default function Perspective({ selectedCode }) {
  const [tableArrow, setTableArrow] = useState();

  // fetch (POST query) for file url
  useEffect(() => {
    if (!selectedCode) return;
    const fetchData = async () => {
      // excute the query
      const response = await fetch(`${DB_ENDPOINT}duckduck/simple_query/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: selectedCode,
        }),
      });
      const res = await response.json();
      if (res["link"]) {
        const blobResponse = await fetch(`${DB_ENDPOINT}${res["link"]}`).then(
          (response) => response.blob(),
        );
        setTableArrow(blobResponse);
      } else if (res["err"]) {
        toast.error(res["err"]);
        console.error("CUSTOME", res["err"]);
      } else {
        console.error("CUSTOME", "No link or error in response");
      }
    };

    fetchData().catch((error) => console.warn(error));
  }, [selectedCode]);

  // load arrow file into perspective-viewer
  useEffect(() => {
    if (!tableArrow) return;
    const loadPerspectiveViewer = async () => {
      const resp = await tableArrow;
      const arrow = await resp.arrayBuffer();
      const viewerElement = document.querySelectorAll("perspective-viewer");

      if (viewerElement && viewerElement.length === 1) {
        const table = WORKER.table(arrow);
        viewerElement[0].load(table);
      } else {
        throw Error("Expected exactly one instance of `<perspective-viewer>`.");
      }
    };
    loadPerspectiveViewer().catch((error) => console.warn(error));
  }, [tableArrow]);

  return (
    <perspective-viewer
      style={{ height: "100%" }}
      settings
      theme="Pro Light"
    ></perspective-viewer>
  );
}
