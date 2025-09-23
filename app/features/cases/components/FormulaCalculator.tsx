'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface FormulaIngredient {
  ingredientCode: string;
  ingredientName: string;
  percentage: number;
  weight?: number;
  adjustedWeight?: number;
  function: string;
  supplier?: string;
  costPerMl?: number;
}

interface CalculatedTotals {
  totalPercentage: number;
  totalWeight: number;
  totalCost: number;
}

interface FormulaCalculatorProps {
  ingredients: FormulaIngredient[];
  batchSize: number;
  yieldFactor: number;
  calculatedTotals?: CalculatedTotals;
  onBatchSizeChange: (newSize: number) => void;
  onNormalize: () => void;
  onApplyYield: (factor: number) => void;
  onSaveVersion: (notes: string) => void;
  className?: string;
}

export function FormulaCalculator({
  ingredients,
  batchSize,
  yieldFactor,
  calculatedTotals,
  onBatchSizeChange,
  onNormalize,
  onApplyYield,
  onSaveVersion,
  className = ''
}: FormulaCalculatorProps) {
  const [newBatchSize, setNewBatchSize] = React.useState(batchSize);
  const [yieldInput, setYieldInput] = React.useState(yieldFactor);
  const [versionNotes, setVersionNotes] = React.useState('');

  const handleBatchSizeUpdate = () => {
    if (newBatchSize > 0 && newBatchSize !== batchSize) {
      onBatchSizeChange(newBatchSize);
    }
  };

  const handleYieldApplication = () => {
    if (yieldInput >= 0.5 && yieldInput <= 1.0) {
      onApplyYield(yieldInput);
    }
  };

  const handleVersionSave = () => {
    onSaveVersion(versionNotes);
    setVersionNotes('');
  };

  const isNormalizationNeeded = calculatedTotals && Math.abs(calculatedTotals.totalPercentage - 100) > 0.001;
  const hasIngredients = ingredients && ingredients.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Formula Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Current Formula Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Percentage:</span>
            <div className={`font-medium ${isNormalizationNeeded ? 'text-amber-600' : 'text-green-600'}`}>
              {calculatedTotals?.totalPercentage.toFixed(3) || '0.000'}%
              {isNormalizationNeeded && (
                <i className="ri-alert-line ml-1 text-amber-500" title="Needs normalization" />
              )}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Total Weight:</span>
            <div className="font-medium text-gray-900">
              {calculatedTotals?.totalWeight.toFixed(3) || '0.000'} ml
            </div>
          </div>
          <div>
            <span className="text-gray-500">Batch Size:</span>
            <div className="font-medium text-gray-900">{batchSize} ml</div>
          </div>
          <div>
            <span className="text-gray-500">Ingredients:</span>
            <div className="font-medium text-gray-900">{ingredients?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Batch Size Calculator */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          <i className="ri-calculator-line mr-2" />
          Batch Size Calculator
        </h3>
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              New Batch Size (ml)
            </label>
            <input
              type="number"
              value={newBatchSize}
              onChange={(e) => setNewBatchSize(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="10000"
              step="0.1"
            />
          </div>
          <Button
            type="secondary"
            size="sm"
            onClick={handleBatchSizeUpdate}
            disabled={!hasIngredients || newBatchSize <= 0 || newBatchSize === batchSize}
            className="whitespace-nowrap"
          >
            <i className="ri-refresh-line mr-1" />
            Recalculate
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Adjusts all ingredient weights proportionally while preserving percentages
        </p>
      </div>

      {/* Normalization Tool */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          <i className="ri-percent-line mr-2" />
          Percentage Normalization
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              Current total: <span className="font-medium">{calculatedTotals?.totalPercentage.toFixed(3) || '0.000'}%</span>
            </p>
            <p className="text-xs text-gray-500">
              Normalizes all percentages to total exactly 100% while preserving ratios
            </p>
          </div>
          <Button
            type="secondary"
            size="sm"
            onClick={onNormalize}
            disabled={!hasIngredients || !isNormalizationNeeded}
            className="whitespace-nowrap ml-4"
          >
            <i className="ri-equalizer-line mr-1" />
            Normalize to 100%
          </Button>
        </div>
        {isNormalizationNeeded && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
            <i className="ri-information-line mr-1" />
            Formula needs normalization (current total: {calculatedTotals?.totalPercentage.toFixed(3)}%)
          </div>
        )}
      </div>

      {/* Yield Calculator */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          <i className="ri-scales-3-line mr-2" />
          Yield Adjustment
        </h3>
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Yield Factor (0.5 - 1.0)
            </label>
            <input
              type="number"
              value={yieldInput}
              onChange={(e) => setYieldInput(parseFloat(e.target.value) || 0.95)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0.5"
              max="1.0"
              step="0.01"
            />
          </div>
          <Button
            type="secondary"
            size="sm"
            onClick={handleYieldApplication}
            disabled={!hasIngredients || yieldInput < 0.5 || yieldInput > 1.0}
            className="whitespace-nowrap"
          >
            <i className="ri-calculator-line mr-1" />
            Apply Yield
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Applies yield factor to calculate adjusted weights (accounts for manufacturing losses)
        </p>
      </div>

      {/* Version Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          <i className="ri-save-3-line mr-2" />
          Version Management
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Version Notes
            </label>
            <textarea
              value={versionNotes}
              onChange={(e) => setVersionNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Describe changes made in this version..."
            />
          </div>
          <Button
            type="secondary"
            size="sm"
            onClick={handleVersionSave}
            disabled={!hasIngredients}
            className="w-full"
          >
            <i className="ri-archive-line mr-2" />
            Save Current Version
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Creates a snapshot of the current formula for comparison and version tracking
        </p>
      </div>
    </div>
  );
}