'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AdvancedTable } from '@/components/AdvancedTable';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ColumnDef } from '@tanstack/react-table';

// Existing code from original (interface and mock data)
interface ComplianceCase {
  id: string;
  runName: string;
  formulaId: string;
  formulaName: string;
  status: string;
  assessmentType: string;
  targetMarkets: string[];
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  overallCompliance: string;
  criticalIssues: number;
}

const mockComplianceRuns: ComplianceCase[] = [
  {
    id: 'COMP-001',
    runName: 'Ocean Breeze EDT Compliance Check',
    formulaId: 'FORM-001',
    formulaName: 'Ocean Breeze EDT',
    status: 'completed',
    assessmentType: 'full_regulatory',
    targetMarkets: ['EU', 'US', 'Canada'],
    createdBy: 'Dr. Sarah Chen',
    createdAt: '2024-01-20T10:30:00Z',
    completedAt: '2024-01-20T14:45:00Z',
    overallCompliance: 'COMPLIANT',
    criticalIssues: 0
  },
  {
    id: 'COMP-002',
    runName: 'Midnight Rose EDP IFRA Review',
    formulaId: 'FORM-002',
    formulaName: 'Midnight Rose EDP',
    status: 'running',
    assessmentType: 'ifra_standards',
    targetMarkets: ['EU', 'UK'],
    createdBy: 'Mark Rodriguez',
    createdAt: '2024-01-25T09:15:00Z',
    overallCompliance: 'PENDING',
    criticalIssues: 0
  },
  {
    id: 'COMP-003',
    runName: 'Citrus Splash Safety Assessment',
    formulaId: 'FORM-003',
    formulaName: 'Citrus Splash Cologne',
    status: 'completed',
    assessmentType: 'safety_assessment',
    targetMarkets: ['US', 'Canada'],
    createdBy: 'Dr. Emily Watson',
    createdAt: '2024-01-18T13:20:00Z',
    completedAt: '2024-01-18T16:30:00Z',
    overallCompliance: 'COMPLIANT',
    criticalIssues: 0
  },
  {
    id: 'COMP-004',
    runName: 'Vanilla Dreams Allergen Analysis',
    formulaId: 'FORM-004',
    formulaName: 'Vanilla Dreams Body Mist',
    status: 'failed',
    assessmentType: 'allergen_analysis',
    targetMarkets: ['EU'],
    createdBy: 'Lisa Thompson',
    createdAt: '2024-01-22T14:15:00Z',
    completedAt: '2024-01-22T15:20:00Z',
    overallCompliance: 'NON_COMPLIANT',
    criticalIssues: 2
  },
  {
    id: 'COMP-005',
    runName: 'Amber Nights Full Compliance',
    formulaId: 'FORM-005',
    formulaName: 'Amber Nights Perfume Oil',
    status: 'completed',
    assessmentType: 'full_regulatory',
    targetMarkets: ['EU', 'US', 'Canada', 'Australia'],
    createdBy: 'Dr. Sarah Chen',
    createdAt: '2024-01-15T08:45:00Z',
    completedAt: '2024-01-15T12:30:00Z',
    overallCompliance: 'COMPLIANT_WITH_WARNINGS',
    criticalIssues: 0
  }
];

export default function CompliancePage() {
  const [complianceRuns, setComplianceRuns] = useState<ComplianceCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRuns, setSelectedRuns] = useState<ComplianceCase[]>([]);

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: 'ri-home-line' },
    { label: 'Compliance', icon: 'ri-shield-check-line' }
  ];

  useEffect(() => {
    const loadComplianceRuns = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setComplianceRuns(mockComplianceRuns);
      } catch (err) {
        console.error('Error loading compliance runs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadComplianceRuns();
  }, []);

  // Existing utility functions and columns definition
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'running': return 'badge-primary';
      case 'pending': return 'badge-warning';
      case 'failed': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'COMPLIANT': return 'badge-success';
      case 'COMPLIANT_WITH_WARNINGS': return 'badge-warning';
      case 'NON_COMPLIANT': return 'badge-error';
      case 'PENDING': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  const getAssessmentTypeLabel = (type: string) => {
    switch (type) {
      case 'full_regulatory': return 'Full Regulatory';
      case 'ifra_standards': return 'IFRA Standards';
      case 'safety_assessment': return 'Safety Assessment';
      case 'allergen_analysis': return 'Allergen Analysis';
      case 'usage_limits': return 'Usage Limits';
      default: return type;
    }
  };

  const columns = useMemo<ColumnDef<ComplianceCase>[]>(() => [
    {
      accessorKey: 'runName',
      header: 'Run Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
            {row.original.runName}
          </div>
          <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
            {row.original.id}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'formulaName',
      header: 'Formula',
      cell: ({ row }) => (
        <div>
          <div className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
            {row.original.formulaName}
          </div>
          <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
            {row.original.formulaId}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'assessmentType',
      header: 'Assessment Type',
      cell: ({ row }) => (
        <span className="modern-badge badge-neutral">
          {getAssessmentTypeLabel(row.original.assessmentType)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`modern-badge ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'overallCompliance',
      header: 'Compliance',
      cell: ({ row }) => (
        <div>
          <span className={`modern-badge ${getComplianceColor(row.original.overallCompliance)}`}>
            {row.original.overallCompliance.replace('_', ' ')}
          </span>
          {row.original.criticalIssues > 0 && (
            <div className="text-xs mt-1" style={{ color: 'rgb(var(--error)) !important' }}>
              {row.original.criticalIssues} critical issues
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'targetMarkets',
      header: 'Markets',
      cell: ({ row }) => (
        <span className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
          {row.original.targetMarkets.join(', ')}
        </span>
      ),
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => (
        <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
          {row.original.createdBy}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/case/Compliance/${row.original.id}`}
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--primary)) !important' }}
            title="View Details"
          >
            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
          </Link>
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--fg-secondary)) !important' }}
            title="Download Report"
          >
            <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
          </button>
          {row.original.status === 'completed' && (
            <button
              className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
              style={{ color: 'rgb(var(--accent-1)) !important' }}
              title="Rerun Analysis"
            >
              <i className="ri-refresh-line w-4 h-4 flex items-center justify-center"></i>
            </button>
          )}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], []);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Loading compliance runs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="animate-fade-in">
        {/* Header Panel */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-3xl font-bold mt-2 mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              Compliance
            </h1>
            <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Regulatory compliance analysis and reports for your fragrance formulations across global markets.
            </p>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <button className="btn-secondary whitespace-nowrap">
              <i className="ri-file-text-line w-4 h-4 mr-2"></i>
              Bulk Reports
            </button>
            <Link href="/case/new/Compliance" className="btn-primary whitespace-nowrap">
              <i className="ri-add-line w-4 h-4 mr-2"></i>
              Start Analysis
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-purple-100">
              <i className="ri-shield-check-line text-purple-600 text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">{complianceRuns.length}</div>
            <div className="text-sm text-gray-600">Total Runs</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-green-100">
              <i className="ri-check-line text-green-600 text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">
              {complianceRuns.filter(r => r.overallCompliance === 'COMPLIANT').length}
            </div>
            <div className="text-sm text-gray-600">Compliant</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-red-100">
              <i className="ri-close-line text-red-600 text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">
              {complianceRuns.filter(r => r.overallCompliance === 'NON_COMPLIANT').length}
            </div>
            <div className="text-sm text-gray-600">Non-Compliant</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-blue-100">
              <i className="ri-play-circle-line text-blue-600 text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">
              {complianceRuns.filter(r => r.status === 'running').length}
            </div>
            <div className="text-sm text-gray-600">Running</div>
          </div>
        </div>

        {/* Advanced Table with proper spacing */}
        <div className="mt-6">
          <AdvancedTable
            data={complianceRuns}
            columns={columns}
            searchPlaceholder="Search by run name, formula, or creator..."
            enableSelection={true}
            enablePagination={true}
            enableSorting={true}
            enableFiltering={true}
            enableColumnVisibility={true}
            onRowSelectionChange={setSelectedRuns}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
