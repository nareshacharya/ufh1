
'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  GroupingState,
  ColumnOrderState,
} from '@tanstack/react-table';

interface AdvancedTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  searchPlaceholder?: string;
  enableSearch?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnVisibility?: boolean;
  enableGrouping?: boolean;
  enableColumnReordering?: boolean;
  onRowSelectionChange?: (selectedRows: T[]) => void;
  onCompareSelected?: (selectedRows: T[]) => void;
  pageSize?: number;
}

export function AdvancedTable<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  enableSearch = true,
  enableSelection = false,
  enablePagination = true,
  enableSorting = true,
  enableFiltering = true,
  enableColumnVisibility = true,
  enableGrouping = false,
  enableColumnReordering = false,
  onRowSelectionChange,
  onCompareSelected,
  pageSize = 10
}: AdvancedTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Refs for dropdown management
  const columnConfigRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Track mounting state to prevent early state updates
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnConfigRef.current && !columnConfigRef.current.contains(event.target as Node)) {
        setShowColumnConfig(false);
      }
      if (columnsRef.current && !columnsRef.current.contains(event.target as Node)) {
        setShowColumnVisibility(false);
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowAdvancedFilters(false);
      }
    };

    if (showColumnConfig || showColumnVisibility || showAdvancedFilters) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColumnConfig, showColumnVisibility, showAdvancedFilters]);

  // Add selection column if enabled
  const finalColumns = useMemo(() => {
    if (!enableSelection) return columns;
    
    const selectionColumn: ColumnDef<T, any> = {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-4 h-4 rounded focus:ring-2 focus:ring-rgb(var(--primary))"
          style={{
            accentColor: 'rgb(var(--primary))'
          }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4 rounded focus:ring-2 focus:ring-rgb(var(--primary))"
          style={{
            accentColor: 'rgb(var(--primary))'
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      enableGrouping: false,
      size: 50,
    };
    
    return [selectionColumn, ...columns];
  }, [columns, enableSelection]);

  // Memoize row selection handler to prevent unnecessary re-renders
  const handleRowSelectionChange = useCallback((updater: any) => {
    setRowSelection(updater);
  }, []);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      grouping,
      columnOrder,
    },
    enableRowSelection: enableSelection,
    enableGrouping: enableGrouping,
    enableColumnResizing: true,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Calculate selected rows safely
  const selectedRows = useMemo(() => {
    if (!isMounted) return [];
    return table.getFilteredSelectedRowModel().rows.map(row => row.original);
  }, [table, rowSelection, isMounted]);

  // Notify parent of selection changes only after component is mounted
  useEffect(() => {
    if (isMounted && onRowSelectionChange) {
      onRowSelectionChange(selectedRows);
    }
  }, [selectedRows, onRowSelectionChange, isMounted]);

  const handleCompareSelected = useCallback(() => {
    if (onCompareSelected && selectedRows.length > 1) {
      onCompareSelected(selectedRows);
    }
  }, [onCompareSelected, selectedRows]);

  const getGroupableColumns = useCallback(() => {
    return table.getAllLeafColumns().filter(column => 
      column.getCanGroup() && column.id !== 'select'
    );
  }, [table]);

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    const draggedColumn = columnOrder[dragIndex];
    const newOrder = [...columnOrder];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedColumn);
    setColumnOrder(newOrder);
  }, [columnOrder]);

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="modern-card p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-shade-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-shade-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-row gap-4 items-center justify-between mb-6">
        <div className="flex flex-row gap-4 items-center flex-1">
          <div className="search-input-container min-w-[300px]">
            <i className="ri-search-line search-icon"></i>
            <input
              className="modern-input"
              placeholder={searchPlaceholder || "Search..."}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Advanced Filters */}
          {enableFiltering && (
            <div className="relative" ref={filtersRef}>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="btn-secondary"
              >
                <i className="ri-filter-2-line"></i>
                Filters
              </button>
              
              {showAdvancedFilters && (
                <div className="dropdown-menu">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                      Advanced Filters
                    </h4>
                    <div className="space-y-2">
                      {/* Filter options would go here */}
                      <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                        No filters configured
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t" style={{ borderColor: 'rgb(var(--shade-200)) !important' }}>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-xs px-3 py-1">
                        Clear All
                      </button>
                      <button 
                        className="btn-primary text-xs px-3 py-1"
                        onClick={() => setShowAdvancedFilters(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Column Visibility */}
          {enableColumnVisibility && (
            <div className="relative" ref={columnsRef}>
              <button
                onClick={() => setShowColumnVisibility(!showColumnVisibility)}
                className="btn-secondary"
              >
                <i className="ri-settings-3-line"></i>
                Columns
              </button>
              
              {showColumnVisibility && (
                <div className="dropdown-menu">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                      Show/Hide Columns
                    </h4>
                    <div className="space-y-2">
                      {table.getAllColumns()
                        .filter(column => column.getCanHide())
                        .map(column => (
                          <div key={column.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={column.getIsVisible()}
                              onChange={column.getToggleVisibilityHandler()}
                              className="w-4 h-4 rounded focus:ring-2 focus:ring-rgb(var(--primary))"
                              style={{ accentColor: 'rgb(var(--primary))' }}
                            />
                            <label className="text-sm capitalize" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                              {typeof column.columnDef.header === 'string' 
                                ? column.columnDef.header 
                                : column.id}
                            </label>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div className="pt-3 border-t" style={{ borderColor: 'rgb(var(--shade-200)) !important' }}>
                    <button 
                      className="btn-secondary text-xs px-3 py-1 w-full"
                      onClick={() => table.toggleAllColumnsVisible(true)}
                    >
                      Show All
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left py-4 px-6 font-semibold"
                      style={{ 
                        color: 'rgb(var(--fg-primary)) !important',
                        width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          {header.column.getCanSort() ? (
                            <div
                              className="flex items-center gap-2 cursor-pointer select-none hover:bg-shade-100 p-1 rounded"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <span className="flex flex-col">
                                {header.column.getIsSorted() === 'desc' ? (
                                  <i className="ri-arrow-down-line w-4 h-4" style={{ color: 'rgb(var(--primary)) !important' }}></i>
                                ) : header.column.getIsSorted() === 'asc' ? (
                                  <i className="ri-arrow-up-line w-4 h-4" style={{ color: 'rgb(var(--primary)) !important' }}></i>
                                ) : (
                                  <i className="ri-expand-up-down-line w-4 h-4 opacity-50"></i>
                                )}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-shade-100"
                  style={{ 
                    background: index % 2 === 0 ? 'transparent' : 'rgb(var(--shade-50))' 
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      className="py-4 px-6"
                      style={{ color: 'rgb(var(--fg-secondary)) !important' }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enablePagination && (
          <div className="table-pagination flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )} of {table.getFilteredRowModel().rows.length} entries
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-arrow-left-line"></i>
              </button>
              <span className="text-sm font-medium px-3 py-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
