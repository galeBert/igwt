import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TTransactionData } from "@/hooks/use-create-transaction";
import { translateStatus } from "@/lib/helpers";
import { formatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import CellAction from "./cell-action";
export const columns: ColumnDef<TTransactionData>[] = [
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Badge>{row.original.role}</Badge>;
    },
  },

  {
    accessorKey: "reciever",
    header: "Transaction with",
    cell: ({ row }) => {
      if (row.original.role === "sender") {
        return (
          <Link href={`/transactions/${row.original.id}`}>
            <div>{row.original.reciever?.name}</div>
          </Link>
        );
      }

      return (
        <Link href={`/transactions/${row.original.id}`}>
          <div>{row.original.sender?.name}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return <div>{formatter.format(Number(row.original.price))}</div>;
    },
  },
  {
    accessorKey: "status",

    cell: ({ row }) => {
      const status = translateStatus(row.original.status ?? "");

      return (
        <Badge
          className={clsx({
            "bg-green-400": status.status === "ok",
            "bg-yellow-400": status.status === "pending",
            "bg-red-400": status.status === "fail",
          })}
        >
          {status.message}
        </Badge>
      );
    },
  },
];
