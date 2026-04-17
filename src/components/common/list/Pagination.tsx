import type { Table } from "@tanstack/react-table";
import React from "react";

interface PaginationProps {
    table: Table<any>
}

const Pagination:React.FC<PaginationProps> = ({table}) => {
  return (
    <div className="flex justify-between bg-bg items-center p-2">
      <div className="text-sm">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <div className="inline-flex gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
