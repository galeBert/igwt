import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TTransactionData } from "@/hooks/use-create-transaction";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
        return <div>{row.original.reciever?.name}</div>;
      }

      return <div>{row.original.sender?.name}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
