
'use client';

import React from 'react';
import { Tabs } from '@/components/ui/Tabs';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  type: string;
}

interface RecentWork {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  status: string;
  progress: number;
}

interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export function PerformanceDashboard() {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Complete Rose Garden formula validation',
      priority: 'high',
      dueDate: '2024-01-15',
      status: 'in_progress',
      type: 'Formula'
    },
    {
      id: '2',
      title: 'Review compliance report for Citrus Burst',
      priority: 'medium',
      dueDate: '2024-01-18',
      status: 'pending',
      type: 'Compliance'
    },
    {
      id: '3',
      title: 'Finalize ingredients for Spring Collection',
      priority: 'high',
      dueDate: '2024-01-12',
      status: 'pending',
      type: 'Ingredients'
    },
    {
      id: '4',
      title: 'Cost analysis for luxury fragrance line',
      priority: 'low',
      dueDate: '2024-01-25',
      status: 'pending',
      type: 'Analysis'
    }
  ];

  const recentWork: RecentWork[] = [
    {
      id: '1',
      name: 'Midnight Orchid',
      type: 'Formula',
      lastModified: '2 hours ago',
      status: 'In Review',
      progress: 85
    },
    {
      id: '2',
      name: 'Ocean Breeze Collection',
      type: 'Project',
      lastModified: '5 hours ago',
      status: 'Active',
      progress: 62
    },
    {
      id: '3',
      name: 'Vanilla Dreams Compliance',
      type: 'Compliance',
      lastModified: '1 day ago',
      status: 'Completed',
      progress: 100
    },
    {
      id: '4',
      name: 'Bergamot Essential Oil Analysis',
      type: 'Ingredients',
      lastModified: '2 days ago',
      status: 'Draft',
      progress: 45
    }
  ];

  const metrics: PerformanceMetric[] = [
    {
      label: 'Formulas Created',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: 'ri-flask-line'
    },
    {
      label: 'Success Rate',
      value: '94%',
      change: '+3%',
      trend: 'up',
      icon: 'ri-checkbox-circle-line'
    },
    {
      label: 'Avg. Development Time',
      value: '8.2 days',
      change: '-15%',
      trend: 'up',
      icon: 'ri-time-line'
    },
    {
      label: 'Compliance Score',
      value: '98%',
      change: '+2%',
      trend: 'up',
      icon: 'ri-shield-check-line'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-accent-1 bg-accent-1/10';
      default: return 'text-rgb(var(--fg-tertiary)) bg-shade-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-success bg-success/10';
      case 'in_progress': case 'active': case 'in review': return 'text-primary bg-primary/10';
      case 'pending': case 'draft': return 'text-warning bg-warning/10';
      default: return 'text-rgb(var(--fg-tertiary)) bg-shade-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'ri-arrow-up-line text-success';
      case 'down': return 'ri-arrow-down-line text-error';
      default: return 'ri-subtract-line text-rgb(var(--fg-tertiary))';
    }
  };

  const tasksContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-rgb(var(--fg-secondary))">Pending Tasks</h3>
        <span className="text-xs text-rgb(var(--fg-tertiary))">
          {tasks.filter(t => t.status !== 'completed').length} pending
        </span>
      </div>
      <div className="space-y-3">
        {tasks.slice(0, 4).map((task) => (
          <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-shade-50 hover:bg-shade-100 transition-colors cursor-pointer">
            <div className="flex-shrink-0 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                task.status === 'completed' ? 'bg-success' :
                task.status === 'in_progress' ? 'bg-primary' : 'bg-shade-300'
              }`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-rgb(var(--fg-primary)) mb-1 truncate">
                {task.title}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-rgb(var(--fg-tertiary))">•</span>
                <span className="text-rgb(var(--fg-tertiary))">{task.type}</span>
                <span className="text-rgb(var(--fg-tertiary))">•</span>
                <span className="text-rgb(var(--fg-tertiary))">Due {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const recentWorkContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-rgb(var(--fg-secondary))">Recent Activity</h3>
        <span className="text-xs text-rgb(var(--fg-tertiary))">Last 7 days</span>
      </div>
      <div className="space-y-3">
        {recentWork.map((work) => (
          <div key={work.id} className="flex items-center gap-3 p-3 rounded-lg bg-shade-50 hover:bg-shade-100 transition-colors cursor-pointer">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <i className={`${
                  work.type === 'Formula' ? 'ri-flask-line' :
                  work.type === 'Project' ? 'ri-folder-line' :
                  work.type === 'Compliance' ? 'ri-shield-check-line' :
                  'ri-leaf-line'
                } text-primary w-4 h-4 flex items-center justify-center`}></i>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-rgb(var(--fg-primary)) truncate">
                  {work.name}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                  {work.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-rgb(var(--fg-tertiary))">{work.lastModified}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-shade-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${work.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-rgb(var(--fg-tertiary)) w-8 text-right">{work.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const analyticsContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 rounded-lg bg-shade-50 hover:bg-shade-100 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <i className={`${metric.icon} text-primary w-4 h-4 flex items-center justify-center`}></i>
              </div>
              <div className="flex items-center gap-1">
                <i className={`${getTrendIcon(metric.trend)} w-3 h-3 flex items-center justify-center`}></i>
                <span className={`text-xs font-medium ${
                  metric.trend === 'up' ? 'text-success' : 
                  metric.trend === 'down' ? 'text-error' : 'text-rgb(var(--fg-tertiary))'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-rgb(var(--fg-primary))">{metric.value}</p>
              <p className="text-xs text-rgb(var(--fg-tertiary))">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-shade-50">
        <h4 className="text-sm font-medium text-rgb(var(--fg-secondary)) mb-4">Monthly Progress</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-rgb(var(--fg-tertiary))">Formulas Completed</span>
            <span className="font-medium text-rgb(var(--fg-primary))">18/24</span>
          </div>
          <div className="w-full h-2 bg-shade-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-rgb(var(--fg-tertiary))">Compliance Reviews</span>
            <span className="font-medium text-rgb(var(--fg-primary))">12/15</span>
          </div>
          <div className="w-full h-2 bg-shade-200 rounded-full overflow-hidden">
            <div className="h-full bg-accent-1 rounded-full transition-all duration-500" style={{ width: '80%' }}></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-rgb(var(--fg-tertiary))">Quality Assessments</span>
            <span className="font-medium text-rgb(var(--fg-primary))">22/25</span>
          </div>
          <div className="w-full h-2 bg-shade-200 rounded-full overflow-hidden">
            <div className="h-full bg-accent-button rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'tasks',
      label: 'My Tasks',
      icon: 'ri-todo-line',
      content: tasksContent
    },
    {
      id: 'recent',
      label: 'Recent Work',
      icon: 'ri-history-line',
      content: recentWorkContent
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'ri-bar-chart-line',
      content: analyticsContent
    }
  ];

  return (
    <div className="secondary-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-dashboard-line text-lg text-primary"></i>
          </div>
          <h2 className="text-lg font-semibold text-rgb(var(--fg-primary))">Performance Dashboard</h2>
        </div>
        <select className="modern-input text-sm py-2 px-3 min-w-0 w-24">
          <option>7 days</option>
          <option>30 days</option>
          <option>90 days</option>
        </select>
      </div>

      <Tabs tabs={tabs} defaultTab="tasks" />
    </div>
  );
}