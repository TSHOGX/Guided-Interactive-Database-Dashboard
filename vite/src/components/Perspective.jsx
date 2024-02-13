import React, { useEffect } from "react";
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";

const WORKER = perspective.worker();

export default function Perspective({ arrowFile }) {
  // load arrow file into perspective-viewer
  useEffect(() => {
    if (!arrowFile) return;
    try {
      const loadPerspectiveViewer = async () => {
        const resp = await arrowFile;
        const arrow = await resp.arrayBuffer();
        const viewerElement = document.querySelectorAll("perspective-viewer");

        if (viewerElement && viewerElement.length === 1) {
          const table = WORKER.table(arrow);
          viewerElement[0].load(table);
        } else {
          throw Error(
            "Expected exactly one instance of `<perspective-viewer>`.",
          );
        }
      };
      loadPerspectiveViewer().catch((error) => console.warn(error));
    } catch (error) {
      console.warn("CUSTOME", error);
    }
  }, [arrowFile]);

  return (
    <perspective-viewer
      style={{ height: "100%" }}
      settings
      theme="Pro Light"
    ></perspective-viewer>
  );
}
