
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdvancedTable } from '@/components/AdvancedTable';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ColumnDef } from '@tanstack/react-table';

interface Ingredient {
  id: string;
  name: string;
  type: string;
  origin: string;
  concentration: string;
  safetyRating: string;
  supplier: string;
  cost: number;
  stock: number;
  usage: string;
  lastUpdated: string;
}

const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Bergamot Oil',
    type: 'Essential Oil',
    origin: 'Italy',
    concentration: '100%',
    safetyRating: 'A',
    supplier: 'Aromatics Ltd',
    cost: 45.5,
    stock: 125,
    usage: 'Top Note',
    lastUpdated: '2024-01-20'
  },
  {
    id: '2',
    name: 'Rose Absolute',
    type: 'Absolute',
    origin: 'Bulgaria',
    concentration: '100%',
    safetyRating: 'A',
    supplier: 'Fragrance Supplies',
    cost: 185,
    stock: 45,
    usage: 'Heart Note',
    lastUpdated: '2024-01-18'
  },
  {
    id: '3',
    name: 'Sandalwood Mysore',
    type: 'Essential Oil',
    origin: 'India',
    concentration: '100%',
    safetyRating: 'A',
    supplier: 'Eastern Oils',
    cost: 295,
    stock: 23,
    usage: 'Base Note',
    lastUpdated: '2024-01-15'
  },
  {
    id: '4',
    name: 'Vanilla Extract',
    type: 'Extract',
    origin: 'Madagascar',
    concentration: '95%',
    safetyRating: 'A',
    supplier: 'Natural Extracts Co',
    cost: 78.9,
    stock: 89,
    usage: 'Base Note',
    lastUpdated: '2024-01-22'
  },
  {
    id: '5',
    name: 'Jasmine Grandiflorum',
    type: 'Absolute',
    origin: 'France',
    concentration: '100%',
    safetyRating: 'A',
    supplier: 'French Florals',
    cost: 312.5,
    stock: 15,
    usage: 'Heart Note',
    lastUpdated: '2024-01-12'
  },
  {
    id: '6',
    name: 'Lemon Oil',
    type: 'Essential Oil',
    origin: 'Sicily',
    concentration: '100%',
    safetyRating: 'B',
    supplier: 'Mediterranean Oils',
    cost: 28.75,
    stock: 156,
    usage: 'Top Note',
    lastUpdated: '2024-01-25'
  },
  {
    id: '7',
    name: 'Patchouli Oil',
    type: 'Essential Oil',
    origin: 'Indonesia',
    concentration: '100%',
    safetyRating: 'A',
    supplier: 'Tropical Essences',
    cost: 67.3,
    stock: 78,
    usage: 'Base Note',
    lastUpdated: '2024-01-19'
  },
  {
    id: '8',
    name: 'White Musk',
    type: 'Synthetic',
    origin: 'Germany',
    concentration: '100%',
    safetyRating: 'A',
    supplier: 'Synthetic Solutions',
    cost: 145.2,
    stock: 34,
    usage: 'Base Note',
    lastUpdated: '2024-01-21'
  }
];

export default function IngredientsPage() {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: 'ri-home-line' },
    { label: 'Ingredients Database', icon: 'ri-flask-line' }
  ];

  const getStockStatus = (stock: number) => {
    if (stock > 100) return { label: 'High Stock', class: 'badge-success' };
    if (stock > 50) return { label: 'In Stock', class: 'badge-primary' };
    if (stock > 20) return { label: 'Low Stock', class: 'badge-warning' };
    return { label: 'Critical', class: 'badge-error' };
  };

  const getSafetyRatingBadge = (rating: string) => {
    switch (rating) {
      case 'A':
        return 'badge-success';
      case 'B':
        return 'badge-warning';
      case 'C':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getUsageBadge = (usage: string) => {
    switch (usage) {
      case 'Top Note':
        return 'badge-accent-1';
      case 'Heart Note':
        return 'badge-primary';
      case 'Base Note':
        return 'badge-accent-2';
      default:
        return 'badge-neutral';
    }
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<Ingredient>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Ingredient',
      cell: ({ row }) => (
        <div>
          <div className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
            {row.original.name}
          </div>
          <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
            {row.original.type} • {row.original.origin}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'usage',
      header: 'Usage',
      cell: ({ row }) => (
        <span className={`modern-badge ${getUsageBadge(row.original.usage)}`}>
          {row.original.usage}
        </span>
      ),
    },
    {
      accessorKey: 'concentration',
      header: 'Concentration',
      cell: ({ row }) => (
        <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
          {row.original.concentration}
        </span>
      ),
    },
    {
      accessorKey: 'safetyRating',
      header: 'Safety',
      cell: ({ row }) => (
        <span className={`modern-badge ${getSafetyRatingBadge(row.original.safetyRating)}`}>
          {row.original.safetyRating}
        </span>
      ),
    },
    {
      accessorKey: 'stock',
      header: 'Stock Status',
      cell: ({ row }) => {
        const stockStatus = getStockStatus(row.original.stock);
        return (
          <div>
            <span className={`modern-badge ${stockStatus.class}`}>
              {stockStatus.label}
            </span>
            <div className="text-sm mt-1" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
              {row.original.stock} units
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'cost',
      header: 'Cost per Unit',
      cell: ({ row }) => (
        <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
          ${row.original.cost.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => (
        <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
          {row.original.supplier}
        </span>
      ),
    },
    {
      accessorKey: 'lastUpdated',
      header: 'Last Updated',
      cell: ({ row }) => (
        <span className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
          {new Date(row.original.lastUpdated).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--primary)) !important' }}
            title="View Details"
          >
            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
          </button>
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--fg-secondary)) !important' }}
            title="Edit Ingredient"
          >
            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
          </button>
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--accent-1)) !important' }}
            title="Reorder"
          >
            <i className="ri-shopping-cart-line w-4 h-4 flex items-center justify-center"></i>
          </button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="animate-fade-in">
        {/* Header Panel */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-3xl font-bold mt-2 mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              Ingredients Database
            </h1>
            <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Manage and explore your complete ingredient collection with detailed properties and stock tracking.
            </p>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <button className="btn-secondary whitespace-nowrap">
              <i className="ri-download-line w-4 h-4 mr-2"></i>
              Export
            </button>
            <button className="btn-secondary whitespace-nowrap">
              <i className="ri-upload-line w-4 h-4 mr-2"></i>
              Import
            </button>
            <Link href="/case/new/Ingredient" className="btn-primary whitespace-nowrap">
              <i className="ri-add-line w-4 h-4 mr-2"></i>
              Add Ingredient
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgb(var(--primary)) !important' }}>
              <i className="ri-flask-line text-white text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>{mockIngredients.length}</div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Total Ingredients</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgb(var(--accent-1)) !important' }}>
              <i className="ri-check-line text-white text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {mockIngredients.filter(i => i.stock > 50).length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>In Stock</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgb(var(--warning)) !important' }}>
              <i className="ri-alert-line text-white text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {mockIngredients.filter(i => i.stock <= 50 && i.stock > 20).length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Low Stock</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgb(var(--error)) !important' }}>
              <i className="ri-error-warning-line text-white text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {mockIngredients.filter(i => i.stock <= 20).length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Critical</div>
          </div>
        </div>

        {/* Advanced Table with proper spacing */}
        <div className="mt-6">
          <AdvancedTable
            data={mockIngredients}
            columns={columns}
            searchPlaceholder="Search ingredients, origins, or suppliers..."
            enableSelection={true}
            enablePagination={true}
            enableSorting={true}
            enableFiltering={true}
            enableColumnVisibility={true}
            onRowSelectionChange={setSelectedIngredients}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
