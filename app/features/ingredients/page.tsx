'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { dx } from '@/lib/dxapi/client';
import { AdvancedTable } from '@/components/AdvancedTable';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ColumnDef } from '@tanstack/react-table';

interface IngredientCase {
  id: string;
  name: string;
  code: string;
  category: string;
  status: string;
  createdBy: string;
  createdAt: string;
  lastModifiedAt: string;
  owner: string;
  supplier?: string;
  costPerMl?: number;
  stockLevel?: number;
  safetyRating?: string;
  sustainabilityScore?: number;
  ifraCategory?: string;
  restrictions?: string[];
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<IngredientCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientCase[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/', icon: 'ri-dashboard-line' },
    { label: 'Ingredients Database', icon: 'ri-flask-line' }
  ];

  // Load ingredients from DX API
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoading(true);
        // Enhanced mock ingredient data for demonstration
        const mockIngredients: IngredientCase[] = [
          {
            id: 'ING-001',
            name: 'Bulgarian Rose Oil',
            code: 'ING-001',
            category: 'essential_oil',
            status: 'approved',
            createdBy: 'Dr. Sarah Chen',
            createdAt: '2024-01-15T10:30:00Z',
            lastModifiedAt: '2024-01-18T14:20:00Z',
            owner: 'Quality Department',
            supplier: 'Bulgarian Rose Co.',
            costPerMl: 45.50,
            stockLevel: 250,
            safetyRating: 'A',
            sustainabilityScore: 85,
            ifraCategory: 'Category 4',
            restrictions: ['EU: <0.5%', 'US: <1.0%']
          },
          {
            id: 'ING-002',
            name: 'Iso E Super',
            code: 'ING-002',
            category: 'synthetic',
            status: 'under_review',
            createdBy: 'Mark Rodriguez',
            createdAt: '2024-01-20T09:15:00Z',
            lastModifiedAt: '2024-01-22T11:45:00Z',
            owner: 'R&D Team',
            supplier: 'IFF',
            costPerMl: 12.75,
            stockLevel: 1500,
            safetyRating: 'B+',
            sustainabilityScore: 72,
            ifraCategory: 'Category 4',
            restrictions: ['EU: <2.0%']
          },
          {
            id: 'ING-003',
            name: 'Bergamot Essential Oil',
            code: 'ING-003',
            category: 'essential_oil',
            status: 'approved',
            createdBy: 'Dr. Sarah Chen',
            createdAt: '2024-01-25T13:20:00Z',
            lastModifiedAt: '2024-01-25T13:20:00Z',
            owner: 'Dr. Sarah Chen',
            supplier: 'Italian Citrus Ltd.',
            costPerMl: 28.30,
            stockLevel: 800,
            safetyRating: 'A-',
            sustainabilityScore: 90,
            ifraCategory: 'Category 4',
            restrictions: ['Photosensitizing']
          },
          {
            id: 'ING-004',
            name: 'Hedione',
            code: 'ING-004',
            category: 'synthetic',
            status: 'approved',
            createdBy: 'Mark Rodriguez',
            createdAt: '2024-01-12T16:45:00Z',
            lastModifiedAt: '2024-01-16T09:30:00Z',
            owner: 'Quality Department',
            supplier: 'Firmenich',
            costPerMl: 18.90,
            stockLevel: 650,
            safetyRating: 'A',
            sustainabilityScore: 78,
            ifraCategory: 'Category 4',
            restrictions: []
          },
          {
            id: 'ING-005',
            name: 'Sandalwood Australia Extract',
            code: 'ING-005',
            category: 'natural_extract',
            status: 'restricted',
            createdBy: 'Dr. Emily Watson',
            createdAt: '2024-01-08T11:10:00Z',
            lastModifiedAt: '2024-01-19T15:25:00Z',
            owner: 'Compliance Team',
            supplier: 'Australian Sandalwood Network',
            costPerMl: 125.00,
            stockLevel: 45,
            safetyRating: 'A',
            sustainabilityScore: 95,
            ifraCategory: 'Category 4',
            restrictions: ['CITES regulated', 'Limited availability']
          },
          {
            id: 'ING-006',
            name: 'Linalool',
            code: 'ING-006',
            category: 'aromatic_chemical',
            status: 'approved',
            createdBy: 'Dr. James Park',
            createdAt: '2024-01-10T08:20:00Z',
            lastModifiedAt: '2024-01-15T12:15:00Z',
            owner: 'Quality Department',
            supplier: 'Symrise',
            costPerMl: 8.45,
            stockLevel: 2200,
            safetyRating: 'B',
            sustainabilityScore: 65,
            ifraCategory: 'Category 4',
            restrictions: ['Allergen declaration required']
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setIngredients(mockIngredients);
      } catch (err) {
        setError('Failed to load ingredients');
        console.error('Error loading ingredients:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadIngredients();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'under_review': return 'badge-warning';
      case 'draft': return 'badge-neutral';
      case 'rejected': return 'badge-error';
      case 'restricted': return 'badge-accent-2';
      default: return 'badge-neutral';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'essential_oil': return 'Essential Oil';
      case 'synthetic': return 'Synthetic';
      case 'natural_extract': return 'Natural Extract';
      case 'carrier': return 'Carrier';
      case 'modifier': return 'Modifier';
      case 'aromatic_chemical': return 'Aromatic Chemical';
      default: return category;
    }
  };

  const getSafetyColor = (rating: string) => {
    if (rating.startsWith('A')) return 'badge-success';
    if (rating.startsWith('B')) return 'badge-warning';
    return 'badge-error';
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 80) return 'badge-success';
    if (score >= 60) return 'badge-warning';
    return 'badge-error';
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<IngredientCase>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Ingredient',
      cell: ({ row }) => (
        <div>
          <div className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
            {row.original.name}
          </div>
          <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
            {row.original.code}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="modern-badge badge-neutral">
          {getCategoryLabel(row.original.category)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`modern-badge ${getStatusColor(row.original.status)}`}>
          {row.original.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => (
        <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
          {row.original.supplier || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'costPerMl',
      header: 'Cost/ml',
      cell: ({ row }) => (
        <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
          ${row.original.costPerMl?.toFixed(2) || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'stockLevel',
      header: 'Stock',
      cell: ({ row }) => {
        const stock = row.original.stockLevel || 0;
        const isLow = stock < 100;
        return (
          <span className={`modern-badge ${isLow ? 'badge-error' : 'badge-success'}`}>
            {stock} ml
          </span>
        );
      },
    },
    {
      accessorKey: 'safetyRating',
      header: 'Safety',
      cell: ({ row }) => (
        <span className={`modern-badge ${getSafetyColor(row.original.safetyRating || 'C')}`}>
          {row.original.safetyRating || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'sustainabilityScore',
      header: 'Sustainability',
      cell: ({ row }) => {
        const score = row.original.sustainabilityScore || 0;
        return (
          <span className={`modern-badge ${getSustainabilityColor(score)}`}>
            {score}%
          </span>
        );
      },
    },
    {
      accessorKey: 'lastModifiedAt',
      header: 'Last Modified',
      cell: ({ row }) => (
        <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
          {formatDate(row.original.lastModifiedAt)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/case/Ingredient/${row.original.id}`}
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--primary)) !important' }}
          >
            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
          </Link>
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--fg-secondary)) !important' }}
          >
            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
          </button>
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--warning)) !important' }}
          >
            <i className="ri-archive-line w-4 h-4 flex items-center justify-center"></i>
          </button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], []);

  const handleCompareIngredients = (selected: IngredientCase[]) => {
    setSelectedIngredients(selected);
    setShowComparison(true);
  };

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl mb-4" style={{ color: 'rgb(var(--error)) !important' }}></i>
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Error Loading Ingredients</h1>
          <p className="mb-4" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-none space-y-6 animate-fade-in">
        {/* Summary Cards - At Top */}
        <div className="grid grid-cols-4 gap-6">
          <div className="modern-card text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgb(var(--primary)) !important' }}>
              <i className="ri-flask-line text-white text-xl"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>{ingredients.length}</div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Total Ingredients</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgb(var(--accent-1)) !important' }}>
              <i className="ri-check-line text-white text-xl"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {ingredients.filter(i => i.status === 'approved').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Approved</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgb(var(--warning)) !important' }}>
              <i className="ri-time-line text-white text-xl"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {ingredients.filter(i => i.status === 'under_review').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Under Review</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgb(var(--accent-2)) !important' }}>
              <i className="ri-shield-line text-white text-xl"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {ingredients.filter(i => i.status === 'restricted').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Restricted</div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Ingredients Database</h1>
            <Breadcrumb items={breadcrumbItems} />
            <p className="mt-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Comprehensive ingredient management and analysis system
            </p>
          </div>
          <Link
            href="/case/new/Ingredient"
            className="btn-primary"
          >
            <i className="ri-add-line w-4 h-4 mr-2"></i>
            Add New Ingredient
          </Link>
        </div>

        {/* Advanced Table */}
        {isLoading ? (
          <div className="modern-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 mx-auto mb-4" style={{ borderColor: 'rgb(var(--primary)) !important', borderTopColor: 'transparent', border: '2px solid' }}></div>
            <p style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Loading ingredients...</p>
          </div>
        ) : (
          <AdvancedTable
            data={ingredients}
            columns={columns}
            searchPlaceholder="Search by name, code, or supplier..."
            enableSelection={true}
            enablePagination={true}
            enableSorting={true}
            enableFiltering={true}
            enableColumnVisibility={true}
            onCompareSelected={handleCompareIngredients}
            pageSize={15}
          />
        )}

        {/* Comparison Modal */}
        {showComparison && selectedIngredients.length > 1 && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowComparison(false)}
          >
            <div 
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-6"
              style={{ background: 'rgb(var(--bg-primary)) !important' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                  Compare Ingredients ({selectedIngredients.length})
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
                      {selectedIngredients.map((ingredient) => (
                        <th key={ingredient.id} className="text-left py-3 px-4 font-semibold" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                          {ingredient.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Category</td>
                      {selectedIngredients.map((ingredient) => (
                        <td key={ingredient.id} className="py-3 px-4">
                          <span className="modern-badge badge-neutral">
                            {getCategoryLabel(ingredient.category)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Cost per ml</td>
                      {selectedIngredients.map((ingredient) => (
                        <td key={ingredient.id} className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                          ${ingredient.costPerMl?.toFixed(2) || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Safety Rating</td>
                      {selectedIngredients.map((ingredient) => (
                        <td key={ingredient.id} className="py-3 px-4">
                          <span className={`modern-badge ${getSafetyColor(ingredient.safetyRating || 'C')}`}>
                            {ingredient.safetyRating || 'N/A'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--border-primary)) !important' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Sustainability</td>
                      {selectedIngredients.map((ingredient) => (
                        <td key={ingredient.id} className="py-3 px-4">
                          <span className={`modern-badge ${getSustainabilityColor(ingredient.sustainabilityScore || 0)}`}>
                            {ingredient.sustainabilityScore || 0}%
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Stock Level</td>
                      {selectedIngredients.map((ingredient) => (
                        <td key={ingredient.id} className="py-3 px-4">
                          <span className={`modern-badge ${(ingredient.stockLevel || 0) < 100 ? 'badge-error' : 'badge-success'}`}>
                            {ingredient.stockLevel || 0} ml
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