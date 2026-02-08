import "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        align?: "left" | "center" | "right"; //? Alignment for headers and cells in a specific column
        type?: "text" | "number" | "currency" | "badge"; //? Type for formatting headers and cells properly
        currency?: string; //? Currency code for currency columns
    }
}
