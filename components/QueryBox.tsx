"use client";

import { useDuckConn } from "@/lib/useDuckConn";
import { Dispatch, SetStateAction } from "react";

export default function QueryBox({
  setQueryRst,
}: Dispatch<SetStateAction<string>> | any) {
  const duckConn = useDuckConn();

  async function runQuery(formData: { get: (arg0: string) => any }) {
    const conn = duckConn?.conn;
    if (!conn) return;

    try {
      const inputQuery = formData.get("inputQuery");
      const results = await conn.query(inputQuery);
      // console.log(results.toString());
      // console.log(results.toArray());
      setQueryRst(results.toArray());
    } catch (e) {
      let msg = e instanceof Error ? e.message : String(e);
      // console.log(msg);
      setQueryRst([{ "SQL Error": msg }]);
    }
  }

  return (
    <div className=" flex min-h-4 flex-col items-center justify-between gap-6 border p-2 pb-3 dark:border-white">
      <div className=" text-lg">QueryBox</div>
      <form action={runQuery} className=" grid w-full grid-cols-5 gap-2">
        <textarea
          name="inputQuery"
          className=" col-span-4 resize-none rounded-lg border border-dashed p-2 text-gray-500 dark:border-white dark:bg-black dark:text-gray-400"
        />
        <button
          type="submit"
          className=" m-2 rounded-lg border-dashed border-white hover:border"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
