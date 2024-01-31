"use client";

import FilesBox from "@/components/FilesBox";
import QueryBox from "@/components/QueryBox";
import QueryRstBox from "@/components/QueryRstBox";
import VisBox from "@/components/VisBox";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface QueryResult {
  [key: string]: any;
}

export default function DuckDB() {
  const [queryRst, setQueryRst] = useState<QueryResult[]>([
    { "": "Write some queries above to get results!" },
  ]);

  return (
    <div className=" container mx-auto">
      <ToastContainer className=" absolute right-4 top-4" />
      <div className=" flex min-h-[10svh] flex-col items-center justify-between py-[5svh]">
        <div className=" text-2xl">Guided Interactive Database Dashboard</div>
      </div>
      <div className=" grid min-h-[80svh] grid-cols-4 gap-8">
        <div className=" ">
          <FilesBox />
        </div>
        <div className=" col-span-3 flex flex-col gap-8">
          <QueryBox setQueryRst={setQueryRst} />
          <QueryRstBox queryRst={queryRst as QueryResult[]} />
          <VisBox />
        </div>
      </div>
    </div>
  );
}
