"use client";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "~/components/ui/button";
import { TbookingsValidator } from "~/utils/validators/bookingValidators";
import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { IoSearchOutline } from "react-icons/io5";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  setSelectedBooking: Function;
  selectedBooking: TbookingsValidator;
  header: any;
  filterData: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  setSelectedBooking,
  selectedBooking,
  header,
  filterData,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const customFilterFunction = (
    row: any,
   columnId: string,    //BY USING THIS INPUT SEARCH BOX WORKING, DONOT REMOVE IT 
    filterValue: string,
  ) => {
    const idMatch = row.original.id.toString().includes(filterValue);
    const nameMatch = row.original.userName
      ?.toString()
      .toLowerCase()
      .includes(filterValue.toLowerCase());
    const hostelNameMatch = row.original.hostelName
      .toString()
      .toLowerCase()
      .includes(filterValue.toLowerCase());
    const emailMatch = row.original.userEmail
      ?.toString()
      ?.toLowerCase()
      ?.includes(filterValue.toLowerCase());
    return idMatch || nameMatch || hostelNameMatch || emailMatch;
  };

  const table = useReactTable({
    data: filterData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customFilterFunction,
    state: {
      globalFilter,
    },
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(event.target.value);
  };

  return (
    <div className="-z-10">
      <div className="flex items-center justify-between py-2">
        <CardHeader className="px-4 py-2">
          <CardTitle>{header.name}</CardTitle>
          <CardDescription>Recent Bookings</CardDescription>
        </CardHeader>

        <div className="flex w-full basis-1/2 items-center gap-2 rounded-md border border-gray-200 px-2 py-1">
          <IoSearchOutline />
          <input
            placeholder="Search by ID, Name, Email or Hostel Name"
            value={globalFilter ?? ""}
            onChange={handleFilterChange}
            className="max-w-sm outline-none w-full"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="">S.No</TableHead>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any, index) => (
                <TableRow
                  className={`${
                    selectedBooking.id == row.original.id ? "bg-muted/50" : ""
                  }`}
                  onClick={() => {
                    setSelectedBooking(row.original);
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  <TableCell>
                    {index +
                      1 +
                      table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize}
                    .
                  </TableCell>
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id} className="min-w-40">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
