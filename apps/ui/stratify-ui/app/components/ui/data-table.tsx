"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-hidden rounded-xl border border-primary-dark">
            <Table>
                <TableHeader className="bg-primary-lighter">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const align =
                                    header.column.columnDef.meta?.align;
                                const isCurrencyColumn =
                                    header.column.columnDef.meta?.type ===
                                    "currency";

                                const isNumericColumn =
                                    header.column.columnDef.meta?.type ===
                                    "number";

                                const shouldAlignRight =
                                    align === "right" ||
                                    isCurrencyColumn ||
                                    isNumericColumn;

                                if (isLoading) {
                                    return (
                                        <TableHead key={header.id}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableHead>
                                    );
                                }

                                return (
                                    <TableHead
                                        key={header.id}
                                        className={cn(
                                            "text-left", //? Default alignment
                                            shouldAlignRight && "text-right",
                                            align === "center" && "text-center",
                                        )}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="bg-muted-lightest"
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const align =
                                        cell.column.columnDef.meta?.align;

                                    const isNumberColumn =
                                        cell.column.columnDef.meta?.type ===
                                        "number";

                                    const cellValue = cell.getValue();

                                    if (
                                        isNumberColumn &&
                                        typeof cellValue === "number"
                                    ) {
                                        const formattedValue =
                                            cellValue.toLocaleString();

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className="text-right"
                                            >
                                                {formattedValue}
                                            </TableCell>
                                        );
                                    }

                                    return (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                "text-left",
                                                align === "right" &&
                                                    "text-right",
                                                align === "center" &&
                                                    "text-center",
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
