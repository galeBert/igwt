"use client";

import { GetTransactionLogProps } from "@/actions/get-transaction-log";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import {
  Check,
  Clock,
  PackageCheck,
  PackagePlus,
  PackageSearch,
  Truck,
  UserCheck,
  X,
} from "lucide-react";
import moment from "moment";

import { labels, priorities, statuses } from "../data/data";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowAction } from "./data-table-row-actions";

export const columns: ColumnDef<GetTransactionLogProps>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div>{moment(row.original.createdAt).fromNow()}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => row.original.role);

      return (
        <div className="flex space-x-2">
          {label && (
            <Badge
              className={clsx("bg-red-500", {
                "bg-orange-500": row.original.role === "sender",
                "bg-blue-500": row.original.role === "reciever",
              })}
              variant="outline"
            >
              {row.original.role}
            </Badge>
          )}
          <span className="max-w-[500px] truncate font-medium">
            {row.original.description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      const renderIcon = () => {
        if (status === "complete") {
          return <Check width={20} />;
        }
        if (status === "failed") {
          return <X width={20} />;
        }
        if (status === "pending" || status === "waiting payment to complete") {
          return <Clock width={20} />;
        }
        if (status === "waiting for courier") {
          return <PackageSearch width={20} />;
        }
        if (status === "allocated") {
          return <UserCheck width={20} />;
        }
        if (status === "picking_up" || status === "picking up") {
          return <Truck width={20} style={{ scale: "-1 1" }} />;
        }
        if (status === "picked") {
          return <PackagePlus width={20} />;
        }
        if (status === "dropping off") {
          return <Truck width={20} />;
        }
        if (status === "delivered") {
          return <PackageCheck width={20} />;
        }

        return null;
      };
      return (
        <div className="flex space-x-1 items-center">
          {renderIcon()}
          <span>{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     );

  //     if (!priority) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
];
