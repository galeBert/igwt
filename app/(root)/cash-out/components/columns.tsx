import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CashTransactionData } from "@/hooks/use-create-transaction";
import { translateStatus } from "@/lib/helpers";
import { formatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<CashTransactionData>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className={clsx("border-green-600 text-white", {
            "border-red-600": row.original.type === "outcome",
          })}
        >
          {row.original.type}
        </Badge>
      );
    },
  },

  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => {
      return <div>{row.original.from}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "amount",
    cell: ({ row }) => {
      return <div>{formatter.format(Number(row.original.amount))}</div>;
    },
  },
  {
    accessorKey: "status",

    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant="outline"
          className={clsx("text-white", {
            "border-green-400": status === "DONE",
            "border-yellow-500": status === "PENDING",
            "bg-red-400": status === "FAILED",
          })}
        >
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
];
