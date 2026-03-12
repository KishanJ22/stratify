"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
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
import { ReactNode, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./pagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    isLoadingRowCount?: number;
    noResultsComponent?: ReactNode;
    initialPaginationState?: PaginationState;
    isPaginationEnabled?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    noResultsComponent,
    isLoadingRowCount = 5,
    initialPaginationState = {
        pageIndex: 0,
        pageSize: 5,
    },
    isPaginationEnabled = true,
}: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>(
        initialPaginationState,
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination: isPaginationEnabled ? pagination : undefined,
        },
        onPaginationChange: setPagination,
        autoResetPageIndex: false,
    });

    return (
        <>
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

                                    const isActionColumn =
                                        header.column.columnDef.meta?.type ===
                                        "action";

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                "text-left xl:text-nowrap",
                                                shouldAlignRight &&
                                                    "text-right",
                                                align === "center" &&
                                                    "text-center",
                                                isActionColumn &&
                                                    "text-center w-12",
                                                header.column.columnDef.meta
                                                    ?.headerClassName,
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
                        {isLoading ? (
                            Array.from({ length: isLoadingRowCount }).map(
                                (_, index) => (
                                    <TableRow
                                        key={index}
                                        data-testid="skeleton-row"
                                    >
                                        {columns.map((column) => {
                                            const key = `${column.header}-${index}`;
                                            return (
                                                <TableCell
                                                    key={key}
                                                    data-testid="skeleton-cell"
                                                >
                                                    <Skeleton className="h-4 w-full" />
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ),
                            )
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="bg-muted-lightest"
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
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
                                <TableCell colSpan={columns.length}>
                                    {noResultsComponent || (
                                        <div className="text-center">
                                            No results.
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {isPaginationEnabled && (
                <Pagination className="flex flex-row mt-2.5 px-2.5 justify-between">
                    <div className="flex flex-row items-center gap-x-2">
                        <div
                            className={cn(
                                "text-sm font-sans font-medium text-center text-primary-darker text-nowrap",
                                table.getPageCount() === 0 && "opacity-50",
                            )}
                        >
                            Rows per page
                        </div>
                        <Select
                            value={pagination.pageSize.toString()}
                            onValueChange={(value) => {
                                setPagination({
                                    ...pagination,
                                    pageSize: parseInt(value),
                                });
                            }}
                        >
                            <SelectTrigger
                                className="max-w-20 items-center border-primary-dark bg-white"
                                disabled={table.getPageCount() === 0}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                                side="bottom"
                                align="start"
                                className="border-primary-dark bg-white"
                            >
                                <SelectGroup className="flex flex-col gap-y-1">
                                    {[5, 10, 20].map((rowCount) => (
                                        <SelectItem
                                            key={rowCount}
                                            value={rowCount.toString()}
                                            className="data-highlighted:bg-primary-lightest"
                                        >
                                            {rowCount}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-row items-center">
                        <PaginationPrevious
                            onClick={() =>
                                table.getCanPreviousPage() &&
                                table.previousPage()
                            }
                            className={cn(
                                !table.getCanPreviousPage() &&
                                    "opacity-50 cursor-default",
                            )}
                            href="#"
                        />
                        <PaginationContent>
                            {Array.from({ length: table.getPageCount() }).map(
                                (_, index) => (
                                    <PaginationLink
                                        key={index}
                                        onClick={() =>
                                            table.setPageIndex(index)
                                        }
                                        isActive={
                                            index === pagination.pageIndex
                                        }
                                        href="#"
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                ),
                            )}
                        </PaginationContent>
                        <PaginationNext
                            onClick={() =>
                                table.getCanNextPage() && table.nextPage()
                            }
                            className={cn(
                                !table.getCanNextPage() &&
                                    "opacity-50 cursor-default",
                            )}
                            href="#"
                        />
                    </div>
                </Pagination>
            )}
        </>
    );
}
