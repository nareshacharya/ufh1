
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdvancedTable } from '@/components/AdvancedTable';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ColumnDef } from '@tanstack/react-table';

interface Formula {
  id: string;
  name: string;
  category: string;
  status: string;
  lastModified: string;
  creator: string;
  ingredients: number;
  compliance: number;
  version: string;
  batchSize?: number;
  cost?: number;
  complexity?: string;
  notes?: string;
}

const mockFormulas: Formula[] = [
  {
    id: '1',
    name: 'Summer Breeze',
    category: 'Fresh Citrus',
    status: 'Active',
    lastModified: '2024-01-15',
    creator: 'Sarah Johnson',
    ingredients: 12,
    compliance: 98,
    version: '2.1',
    batchSize: 1000,
    cost: 24.50,
    complexity: 'Medium',
    notes: 'Updated bergamot concentration for better longevity'
  },
  {
    id: '2',
    name: 'Ocean Mist',
    category: 'Aquatic',
    status: 'In Review',
    lastModified: '2024-01-14',
    creator: 'Michael Chen',
    ingredients: 8,
    compliance: 95,
    version: '1.3',
    batchSize: 500,
    cost: 31.20,
    complexity: 'Low',
    notes: 'Pending compliance approval for EU markets'
  },
  {
    id: '3',
    name: 'Midnight Rose',
    category: 'Floral Oriental',
    status: 'Active',
    lastModified: '2024-01-13',
    creator: 'Emma Davis',
    ingredients: 15,
    compliance: 100,
    version: '3.0',
    batchSize: 2000,
    cost: 67.80,
    complexity: 'High',
    notes: 'Premium formula with rare damascus rose'
  },
  {
    id: '4',
    name: 'Wooden Dreams',
    category: 'Woody',
    status: 'Draft',
    lastModified: '2024-01-12',
    creator: 'James Wilson',
    ingredients: 10,
    compliance: 87,
    version: '1.0',
    batchSize: 250,
    cost: 42.15,
    complexity: 'Medium',
    notes: 'Experimental sandalwood blend'
  },
  {
    id: '5',
    name: 'Vanilla Sunset',
    category: 'Gourmand',
    status: 'Active',
    lastModified: '2024-01-11',
    creator: 'Lisa Thompson',
    ingredients: 9,
    compliance: 96,
    version: '1.8',
    batchSize: 1500,
    cost: 28.90,
    complexity: 'Low',
    notes: 'Popular consumer favorite'
  },
  {
    id: '6',
    name: 'Urban Jungle',
    category: 'Green Fresh',
    status: 'Active',
    lastModified: '2024-01-10',
    creator: 'Alex Parker',
    ingredients: 14,
    compliance: 92,
    version: '2.5',
    batchSize: 800,
    cost: 35.60,
    complexity: 'High',
    notes: 'Complex green accord with moss undertones'
  }
];

export default function FormulasPage() {
  const [selectedFormulas, setSelectedFormulas] = useState<Formula[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: 'ri-home-line' },
    { label: 'Formula Library', icon: 'ri-test-tube-line' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'In Review': return 'badge-warning';
      case 'Draft': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  const getComplianceBadge = (compliance: number) => {
    if (compliance >= 95) return 'badge-success';
    if (compliance >= 90) return 'badge-warning';
    return 'badge-error';
  };

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'badge-success';
      case 'Medium': return 'badge-warning';
      case 'High': return 'badge-accent-2';
      default: return 'badge-neutral';
    }
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<Formula>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Formula',
      cell: ({ row }) => (
        <div>
          <div className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
            {row.original.name}
          </div>
          <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
            v{row.original.version} • {new Date(row.original.lastModified).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="modern-badge badge-neutral">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`modern-badge ${getStatusBadge(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'creator',
      header: 'Creator',
      cell: ({ row }) => (
        <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
          {row.original.creator}
        </span>
      ),
    },
    {
      accessorKey: 'ingredients',
      header: 'Ingredients',
      cell: ({ row }) => (
        <span className="modern-badge badge-primary">
          {row.original.ingredients} items
        </span>
      ),
    },
    {
      accessorKey: 'complexity',
      header: 'Complexity',
      cell: ({ row }) => (
        <span className={`modern-badge ${getComplexityBadge(row.original.complexity || 'Medium')}`}>
          {row.original.complexity || 'Medium'}
        </span>
      ),
    },
    {
      accessorKey: 'batchSize',
      header: 'Batch Size',
      cell: ({ row }) => (
        <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
          {row.original.batchSize ? `${row.original.batchSize} ml` : 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'cost',
      header: 'Cost/L',
      cell: ({ row }) => (
        <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
          ${row.original.cost?.toFixed(2) || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'compliance',
      header: 'Compliance',
      cell: ({ row }) => (
        <span className={`modern-badge ${getComplianceBadge(row.original.compliance)}`}>
          {row.original.compliance}%
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
            title="View Formula"
          >
            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
          </button>
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--fg-secondary)) !important' }}
            title="Edit Formula"
          >
            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
          </button>
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--accent-1)) !important' }}
            title="Clone Formula"
          >
            <i className="ri-file-copy-line w-4 h-4 flex items-center justify-center"></i>
          </button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], []);

  const handleCompareFormulas = (selected: Formula[]) => {
    setSelectedFormulas(selected);
    setShowComparison(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="animate-fade-in">
        {/* Header Panel */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-3xl font-bold mt-2 mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              Formula Library
            </h1>
            <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Manage and create your fragrance formulations with advanced analytics and compliance tracking.
            </p>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <button className="btn-secondary whitespace-nowrap">
              <i className="ri-download-line w-4 h-4 mr-2"></i>
              Export
            </button>
            <Link href="/case/new/Formula" className="btn-primary whitespace-nowrap">
              <i className="ri-add-line w-4 h-4 mr-2"></i>
              Create Formula
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgb(var(--primary)) !important' }}>
              <i className="ri-test-tube-line text-white text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>{mockFormulas.length}</div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Total Formulas</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgb(var(--accent-1)) !important' }}>
              <i className="ri-check-line text-white text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {mockFormulas.filter(f => f.status === 'Active').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Active</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgb(var(--warning)) !important' }}>
              <i className="ri-time-line text-white text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {mockFormulas.filter(f => f.status === 'In Review').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>In Review</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgb(var(--accent-2)) !important' }}>
              <i className="ri-draft-line text-white text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {mockFormulas.filter(f => f.status === 'Draft').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Drafts</div>
          </div>
        </div>

        {/* Advanced Table with proper spacing */}
        <div className="mt-6">
          <AdvancedTable
            data={mockFormulas}
            columns={columns}
            searchPlaceholder="Search formulas, creators, or categories..."
            enableSelection={true}
            enablePagination={true}
            enableSorting={true}
            enableFiltering={true}
            enableColumnVisibility={true}
            onCompareSelected={handleCompareFormulas}
            pageSize={10}
          />
        </div>

        {/* Comparison Modal */}
        {showComparison && selectedFormulas.length > 1 && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowComparison(false)}
          >
            <div 
              className="max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-6"
              style={{ background: 'rgb(var(--bg-primary)) !important' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                  Compare Formulas ({selectedFormulas.length})
                </h2>
                <button
                  onClick={() => setShowComparison(false)}
                  className="p-2 rounded-lg hover:bg-rgb(var(--bg-tertiary))"
                  style={{ color: 'rgb(var(--fg-secondary)) !important' }}
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Property</th>
                      {selectedFormulas.map((formula) => (
                        <th key={formula.id} className="text-left py-3 px-4 font-semibold" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                          {formula.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Category</td>
                      {selectedFormulas.map((formula) => (
                        <td key={formula.id} className="py-3 px-4">
                          <span className="modern-badge badge-neutral">
                            {formula.category}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Ingredients</td>
                      {selectedFormulas.map((formula) => (
                        <td key={formula.id} className="py-3 px-4">
                          <span className="modern-badge badge-primary">
                            {formula.ingredients} items
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Complexity</td>
                      {selectedFormulas.map((formula) => (
                        <td key={formula.id} className="py-3 px-4">
                          <span className={`modern-badge ${getComplexityBadge(formula.complexity || 'Medium')}`}>
                            {formula.complexity || 'Medium'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Cost per Liter</td>
                      {selectedFormulas.map((formula) => (
                        <td key={formula.id} className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                          ${formula.cost?.toFixed(2) || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Compliance</td>
                      {selectedFormulas.map((formula) => (
                        <td key={formula.id} className="py-3 px-4">
                          <span className={`modern-badge ${getComplianceBadge(formula.compliance)}`}>
                            {formula.compliance}%
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
