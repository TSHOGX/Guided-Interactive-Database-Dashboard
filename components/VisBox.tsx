import { QueryResult } from "@/lib/types";
import Charts from "./Charts";

export default function VisBox({ queryRst }: { queryRst: QueryResult[] }) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-between gap-6 border p-2 pb-3 dark:border-white">
      <div className=" text-lg">VisBox</div>
      <Charts queryRst={queryRst} />
    </div>
  );
}
