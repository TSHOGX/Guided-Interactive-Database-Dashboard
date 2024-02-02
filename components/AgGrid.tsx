import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import React, { useEffect, useMemo, useState } from "react";
import { ColDef } from "ag-grid-community";
import { QueryResult } from "@/lib/types";
import "./ag-theme.css";

export default function AgGrid({ queryRst }: { queryRst: QueryResult[] }) {
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  useEffect(() => {
    if (queryRst.length > 0) {
      const keys = Object.keys(queryRst[0]);
      const newColDefs: ColDef[] = keys.map((key) => ({ field: key }));
      setColDefs(newColDefs);
    }
  }, [queryRst]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      editable: false,
    };
  }, []);

  return (
    <div
      className={"ag-theme-alpine-auto-dark"}
      style={{ width: "100%", height: "100%" }}
    >
      <AgGridReact
        rowData={queryRst}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}
