
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdvancedTable } from '@/components/AdvancedTable';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ColumnDef } from '@tanstack/react-table';

// Define Project interface
interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  startDate: string;
  deadline: string;
  teamMembers: string[];
  formulas: number;
  budget: number;
  priority: string;
  manager: string;
}

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Luxury Spring Collection',
    client: 'Premium Brands Inc.',
    status: 'In Progress',
    progress: 75,
    startDate: '2024-01-01',
    deadline: '2024-03-15',
    teamMembers: ['Sarah Johnson', 'Michael Chen', 'Emma Davis'],
    formulas: 8,
    budget: 125000,
    priority: 'High',
    manager: 'Sarah Johnson'
  },
  {
    id: '2',
    name: 'Fresh Summer Line',
    client: 'Coastal Fragrances',
    status: 'Planning',
    progress: 25,
    startDate: '2024-02-01',
    deadline: '2024-05-30',
    teamMembers: ['James Wilson', 'Lisa Thompson'],
    formulas: 3,
    budget: 85000,
    priority: 'Medium',
    manager: 'James Wilson'
  },
  {
    id: '3',
    name: 'Holiday Edition 2024',
    client: 'Seasonal Scents Co.',
    status: 'Completed',
    progress: 100,
    startDate: '2023-08-01',
    deadline: '2023-11-15',
    teamMembers: ['Sarah Johnson', 'Emma Davis', 'Michael Chen', 'James Wilson'],
    formulas: 12,
    budget: 200000,
    priority: 'Critical',
    manager: 'Emma Davis'
  },
  {
    id: '4',
    name: 'Corporate Signature Scent',
    client: 'Global Tech Corp',
    status: 'In Progress',
    progress: 45,
    startDate: '2024-01-15',
    deadline: '2024-04-20',
    teamMembers: ['Lisa Thompson', 'Michael Chen'],
    formulas: 2,
    budget: 65000,
    priority: 'Medium',
    manager: 'Lisa Thompson'
  },
  {
    id: '5',
    name: 'Artisan Craft Series',
    client: 'Boutique Perfumery',
    status: 'On Hold',
    progress: 15,
    startDate: '2024-02-10',
    deadline: '2024-06-30',
    teamMembers: ['Alex Parker', 'Emma Davis'],
    formulas: 5,
    budget: 95000,
    priority: 'Low',
    manager: 'Alex Parker'
  }
];

export default function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: 'ri-home-line' },
    { label: 'Project Portfolio', icon: 'ri-folder-line' }
  ];

  // Helper to get badge class based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'In Progress': return 'badge-primary';
      case 'Planning': return 'badge-accent-1';
      case 'On Hold': return 'badge-warning';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  // Helper to get badge class based on priority
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'badge-error';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-primary';
      case 'Low': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  // Helper to format budget values
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<Project>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Project',
      cell: ({ row }) => (
        <div>
          <div className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
            {row.original.name}
          </div>
          <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
            {row.original.client}
          </div>
        </div>
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
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <span className={`modern-badge ${getPriorityBadge(row.original.priority)}`}>
          {row.original.priority}
        </span>
      ),
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="modern-progress w-20">
            <div 
              className="progress-fill"
              style={{ 
                width: `${row.original.progress}%`,
                background: row.original.progress >= 75 ? 'rgb(var(--accent-1))' : 
                           row.original.progress >= 50 ? 'rgb(var(--primary))' : 
                           row.original.progress >= 25 ? 'rgb(var(--warning))' : 'rgb(var(--error))'
              }}
            ></div>
          </div>
          <span className="text-sm font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
            {row.original.progress}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'manager',
      header: 'Manager',
      cell: ({ row }) => (
        <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
          {row.original.manager}
        </span>
      ),
    },
    {
      accessorKey: 'formulas',
      header: 'Formulas',
      cell: ({ row }) => (
        <span className="modern-badge badge-primary">
          {row.original.formulas} items
        </span>
      ),
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      cell: ({ row }) => (
        <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
          {formatBudget(row.original.budget)}
        </span>
      ),
    },
    {
      accessorKey: 'deadline',
      header: 'Deadline',
      cell: ({ row }) => (
        <span className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
          {new Date(row.original.deadline).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'teamMembers',
      header: 'Team',
      cell: ({ row }) => (
        <div className="flex -space-x-2">
          {row.original.teamMembers.slice(0, 3).map((member, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2"
              style={{ 
                background: 'rgb(var(--primary))',
                borderColor: 'rgb(var(--bg-primary))'
              }}
              title={member}
            >
              {member.split(' ').map(n => n[0]).join('')}
            </div>
          ))}
          {row.original.teamMembers.length > 3 && (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2"
              style={{ 
                background: 'rgb(var(--fg-quaternary))',
                borderColor: 'rgb(var(--bg-primary))'
              }}
            >
              +{row.original.teamMembers.length - 3}
            </div>
          )}
        </div>
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
            title="Edit Project"
          >
            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
          </button>
          <button
            className="p-2 rounded-lg transition-colors hover:bg-rgb(var(--bg-tertiary))"
            style={{ color: 'rgb(var(--accent-1)) !important' }}
            title="Project Timeline"
          >
            <i className="ri-calendar-line w-4 h-4 flex items-center justify-center"></i>
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
              Project Portfolio
            </h1>
            <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Track and manage your fragrance development projects with comprehensive timeline and resource management.
            </p>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <button className="btn-secondary whitespace-nowrap">
              <i className="ri-calendar-line w-4 h-4 mr-2"></i>
              Timeline View
            </button>
            <button className="btn-secondary whitespace-nowrap">
              <i className="ri-bar-chart-line w-4 h-4 mr-2"></i>
              Reports
            </button>
            <Link href="/case/new/Project" className="btn-primary whitespace-nowrap">
              <i className="ri-add-line w-4 h-4 mr-2"></i>
              New Project
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-purple-100">
              <i className="ri-folder-line text-purple-600 text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">{mockProjects.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-green-100">
              <i className="ri-play-circle-line text-green-600 text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">
              {mockProjects.filter(p => p.status === 'In Progress').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-blue-100">
              <i className="ri-check-line text-blue-600 text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">
              {mockProjects.filter(p => p.status === 'Completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-yellow-100">
              <i className="ri-currency-line text-yellow-600 text-lg"></i>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">
              {formatBudget(mockProjects.reduce((sum, p) => sum + p.budget, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </div>
        </div>

        {/* Advanced Table with proper spacing */}
        <div className="mt-6">
          <AdvancedTable
            data={mockProjects}
            columns={columns}
            searchPlaceholder="Search projects, clients, or managers..."
            enableSelection={true}
            enablePagination={true}
            enableSorting={true}
            enableFiltering={true}
            enableColumnVisibility={true}
            onRowSelectionChange={setSelectedProjects}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
