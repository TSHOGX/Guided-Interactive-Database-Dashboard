import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import React, { useEffect, useMemo, useState } from "react";
import { ColDef } from "ag-grid-community";
import { QueryResult } from "@/lib/types";
import "./ag-theme.css";

export default function AgGrid({ queryRst }: { queryRst: QueryResult[] }) {
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  // let uniqueKeys = new Set();
  // for (const prop in queryRst[0]) {
  //   console.log(prop);
  //   if (!queryRst[0].hasOwnProperty(prop)) {
  //     uniqueKeys.add(prop);
  //   }
  // }
  // const keys = Array.from(uniqueKeys);
  // console.log(keys);

  useEffect(() => {
    if (queryRst.length > 0) {
      const keys = Object.keys(queryRst[0]);
      const newColDefs: ColDef[] = keys.map((key) => ({ field: key }));
      setColDefs(newColDefs);
    }
  }, [queryRst]);

  // useEffect(() => {
  //   if (queryRst.length > 0) {
  //     const allKeys = queryRst.reduce((keys, row) => {
  //       // Check if row is a Proxy object
  //       if (!isProxy(row)) {
  //         Object.keys(row).forEach((key) => {
  //           if (!keys.includes(key)) {
  //             keys.push(key);
  //           }
  //         });
  //       }
  //       return keys;
  //     }, []);

  //     const newColDefs = allKeys.map((key: any) => ({ field: key }));
  //     setColDefs(newColDefs);
  //   }
  // }, [queryRst]);

  // // Helper function to check if an object is a Proxy
  // function isProxy(obj: QueryResult) {
  //   return typeof obj === "object" && obj !== null && !!obj[Symbol.toStringTag];
  // }

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
