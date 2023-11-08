"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowUpDown, ChevronDown, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNiveaux } from "@/hooks/niveaux";
import { Icons } from "@/components/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useMyStore } from "@/hooks/zustand";
import { Niveau } from "@prisma/client";

export function TableSpinner() {
  return (
    <>
      <TableRow>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px] bg-red-100 dark:bg-muted" />
        </TableCell>
      </TableRow>
    </>
  );
}
type PropsType = {
  func: (data: Niveau) => void;
};
export function DataTableDemo(props: any) {
  const queryClient = useQueryClient();
  const { setIsUpdate } = useMyStore();
  const { data, isLoading } = useNiveaux();
  const [selectedNiveau, setSelectedNiveau] = React.useState<Niveau>();
  props.func(selectedNiveau);

  const { mutate, status } = useMutation({
    mutationKey: ["deleteNiveau"],
    mutationFn: async (id: string) => {
      const config = {
        data: {
          id: id,
        },
      };

      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/niveaux`,
        config
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["niveaux"]);
      toast({
        description: "Niveau supprimé avec succès ✅",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const columns: ColumnDef<Niveau>[] = [
    {
      id: "select",
      header: ({ table }) =>
        !isLoading && (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "nom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("nom")}</div>,
    },
    {
      accessorKey: "anneeScolaire",
      header: "Année scolaire",
      cell: ({ row }) => <div>{row.getValue("anneeScolaire")}</div>,
    },
    {
      accessorKey: "nbrClasses",
      header: "Nombre de Classes",
      cell: ({ row }) => <div>{row.getValue("nbrClasses")}</div>,
    },

    {
      id: "actions",
      enableHiding: false,

      cell: ({ row }) => {
        const niveau = row.original;

        return (
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={status == "loading"}
                  className="hover:bg-red-300"
                >
                  {status == "loading" && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Trash2Icon width={"20px"} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => mutate(niveau.id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedNiveau({
                  id: niveau.id,
                  nom: niveau.nom,
                  anneeScolaire: niveau.anneeScolaire,
                  nbrClasses: niveau.nbrClasses,
                });
                setIsUpdate(true);
              }}
            >
              <PencilIcon width={"20px"} />
            </Button>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data && data.niveau,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Recherche par nom"
          value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nom")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-red-100 dark:bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading ? (
            <TableBody>
              <TableSpinner />
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length && !isLoading ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
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
          )}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {!isLoading && (
          <>
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
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
            </div>{" "}
          </>
        )}
      </div>
    </div>
  );
}
