"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  ArrowUpDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T>({ data, columns, onEdit, onDelete, actions }: DataTableProps<T>) {
  return (
    <div className="rounded-2xl border-2 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/50 border-b-2">
            {columns.map((column, i) => (
              <TableHead key={i} className="font-bold py-4">
                <div className="flex items-center gap-2">
                  {column.header}
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                </div>
              </TableHead>
            ))}
            {(onEdit || onDelete || actions) && <TableHead className="text-right font-bold py-4">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, i) => (
              <TableRow key={i} className="group hover:bg-muted/30 transition-colors">
                {columns.map((column, j) => (
                  <TableCell key={j} className="py-4">
                    {column.cell ? column.cell(item) : (item[column.accessorKey] as React.ReactNode)}
                  </TableCell>
                ))}
                {(onEdit || onDelete || actions) && (
                  <TableCell className="text-right py-4">
                    {actions ? actions(item) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Item Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer">
                              Edit Details
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                              Delete Item
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-32 text-center text-muted-foreground italic">
                No items found in this section.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
        <p className="text-xs text-muted-foreground font-medium">Showing {data.length} items</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 px-2" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
