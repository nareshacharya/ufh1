'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface VersionComparison {
  ingredient: string;
  previousValue: string;
  currentValue: string;
  change: string;
  changeType: 'added' | 'removed' | 'modified' | 'same';
}

interface FormulaVersion {
  version: string;
  timestamp: string;
  ingredients: any[];
  batchSize: number;
  yieldFactor: number;
  notes?: string;
  totals?: {
    totalPercentage: number;
    totalWeight: number;
    totalCost: number;
  };
}

interface VersionComparisonProps {
  versionHistory: FormulaVersion[];
  selectedVersion: string;
  comparisonResults: VersionComparison[];
  onVersionSelect: (version: string) => void;
  onCompare: () => void;
  className?: string;
}

export function VersionComparison({
  versionHistory,
  selectedVersion,
  comparisonResults,
  onVersionSelect,
  onCompare,
  className = ''
}: VersionComparisonProps) {
  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'added':
        return 'ri-add-circle-line text-green-600';
      case 'removed':
        return 'ri-close-circle-line text-red-600';
      case 'modified':
        return 'ri-edit-circle-line text-blue-600';
      case 'same':
        return 'ri-check-circle-line text-gray-400';
      default:
        return 'ri-question-line text-gray-400';
    }
  };

  const getChangeTypeLabel = (changeType: string) => {
    switch (changeType) {
      case 'added':
        return 'Added';
      case 'removed':
        return 'Removed';
      case 'modified':
        return 'Modified';
      case 'same':
        return 'No Change';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasVersions = versionHistory && versionHistory.length > 0;
  const hasComparisons = comparisonResults && comparisonResults.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Version Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          <i className="ri-git-branch-line mr-2" />
          Version Comparison
        </h3>
        
        {!hasVersions ? (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-history-line text-3xl mb-2 block" />
            <p className="text-sm">No previous versions available</p>
            <p className="text-xs mt-1">Save a version in the Tools stage to enable comparisons</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Compare Current Formula With:
              </label>
              <select
                value={selectedVersion}
                onChange={(e) => onVersionSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a version to compare...</option>
                {versionHistory.map((version) => (
                  <option key={version.version} value={version.version}>
                    Version {version.version} - {formatDate(version.timestamp)}
                    {version.notes && ` (${version.notes.substring(0, 30)}...)`}
                  </option>
                ))}
              </select>
            </div>
            
            <Button
              type="primary"
              size="sm"
              onClick={onCompare}
              disabled={!selectedVersion}
              className="w-full"
            >
              <i className="ri-git-compare-line mr-2" />
              Compare Versions
            </Button>
          </div>
        )}
      </div>

      {/* Version History List */}
      {hasVersions && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            <i className="ri-history-line mr-2" />
            Version History
          </h3>
          <div className="space-y-2">
            {versionHistory.map((version, index) => (
              <div
                key={version.version}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      Version {version.version}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(version.timestamp)}
                    </span>
                  </div>
                  {version.notes && (
                    <p className="text-xs text-gray-600 mt-1">{version.notes}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{version.ingredients?.length || 0} ingredients</span>
                    <span>{version.batchSize}ml batch</span>
                    {version.totals && (
                      <span>{version.totals.totalPercentage.toFixed(1)}% total</span>
                    )}
                  </div>
                </div>
                <Button
                  type="secondary"
                  size="xs"
                  onClick={() => onVersionSelect(version.version)}
                  className="ml-3"
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {hasComparisons && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            <i className="ri-file-list-3-line mr-2" />
            Comparison Results
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Ingredient</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Previous</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Current</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Change</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {comparisonResults.map((comparison, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-900">
                      {comparison.ingredient}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {comparison.previousValue}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {comparison.currentValue}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`${
                        comparison.changeType === 'added' ? 'text-green-600' :
                        comparison.changeType === 'removed' ? 'text-red-600' :
                        comparison.changeType === 'modified' ? 'text-blue-600' :
                        'text-gray-500'
                      }`}>
                        {comparison.change}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-1">
                        <i className={getChangeTypeIcon(comparison.changeType)} />
                        <span className="text-xs">
                          {getChangeTypeLabel(comparison.changeType)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-medium text-green-700">
                {comparisonResults.filter(c => c.changeType === 'added').length}
              </div>
              <div className="text-green-600">Added</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-medium text-red-700">
                {comparisonResults.filter(c => c.changeType === 'removed').length}
              </div>
              <div className="text-red-600">Removed</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-medium text-blue-700">
                {comparisonResults.filter(c => c.changeType === 'modified').length}
              </div>
              <div className="text-blue-600">Modified</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-medium text-gray-700">
                {comparisonResults.filter(c => c.changeType === 'same').length}
              </div>
              <div className="text-gray-600">Unchanged</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}