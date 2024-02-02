import { QueryResult } from "@/lib/types";
import AgGrid from "./AgGrid";

export default function QueryRstBox({ queryRst }: { queryRst: QueryResult[] }) {
  if (!Array.isArray(queryRst)) {
    return <div>Invalid data format!</div>;
  }

  return (
    <div className="flex min-h-[30svh] flex-col items-center justify-between gap-6 border p-2 pb-3 dark:border-white">
      {/* <div className=" text-lg">QueryRstBox</div> */}
      <div className=" h-full w-full rounded-lg p-2 text-sm dark:bg-black">
        <AgGrid queryRst={queryRst} />
      </div>
    </div>
  );
}
