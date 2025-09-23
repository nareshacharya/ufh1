
import { useState, useCallback, useEffect, useRef } from 'react';
import { dx } from '@/lib/dxapi/client';
import {
  CaseTemplate,
  CaseData,
  Action,
  Step,
  Stage,
  mapActionPayload,
  parseTransitionTarget,
} from '@/lib/caseflow/schema';
import { processTemplate } from '@/lib/caseflow/validator';

interface CaseState {
  caseId?: string;
  template: CaseTemplate;
  data: CaseData;
  currentStageIndex: number;
  currentStepIndex: number;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  lastSaved?: Date;
}

interface CaseControllerOptions {
  caseId?: string;
  templateId: string;
  initialData?: CaseData;
  onSave?: (data: CaseData) => void;
  onError?: (error: string) => void;
}

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

interface FormulaVersion {
  version: string;
  timestamp: string;
  ingredients: FormulaIngredient[];
  batchSize: number;
  yieldFactor: number;
  notes?: string;
  totals?: {
    totalPercentage: number;
    totalWeight: number;
    totalCost: number;
  };
}

interface VersionComparison {
  ingredient: string;
  previousValue: string;
  currentValue: string;
  change: string;
  changeType: 'added' | 'removed' | 'modified' | 'same';
}

interface ComplianceRunResult {
  runId: string;
  status: string;
  reportData: {
    reportSummary: Array<{ metric: string; value: string; status: string }>;
    ifraResults: Array<{
      ingredient: string;
      category: string;
      currentUsage: string;
      maxAllowed: string;
      complianceStatus: string;
      recommendation: string;
    }>;
    allergenResults: Array<{
      allergen: string;
      source: string;
      concentration: string;
      threshold: string;
      declarationRequired: string;
    }>;
    labelingRequirements: Array<{
      market: string;
      requirement: string;
      labelingText: string;
      placement: string;
    }>;
    complianceIssues: Array<{
      severity: string;
      issue: string;
      regulation: string;
      recommendation: string;
      deadline: string;
    }>;
  };
}

/**
 * Custom hook that drives a case workflow.
 *
 * Enhanced with comprehensive formula calculation tools:
 * - Batch size recalculation with ratio preservation
 * - Percentage normalization to 100%
 * - Yield factor applications
 * - Version management with comparison
 * - Real-time totals calculation
 * - Compliance run execution and report generation
 */
export function useCaseController({
  caseId,
  templateId,
  initialData = {} as CaseData,
  onSave,
  onError,
}: CaseControllerOptions) {
  const [state, setState] = useState<CaseState>({
    template: {} as CaseTemplate,
    data: initialData,
    currentStageIndex: 0,
    currentStepIndex: 0,
    isLoading: true,
    error: null,
    isDirty: false,
  });

  const [processedTemplate, setProcessedTemplate] = useState<CaseTemplate>(
    {} as CaseTemplate
  );

  // Use refs to prevent infinite loops - FIXED
  const lastCalculatedTotalsRef = useRef<string>('');
  const isUpdatingTotals = useRef(false);
  const preventInfiniteLoop = useRef(false);

  // Formula calculation helpers
  const calculateIngredientWeights = useCallback((
    ingredients: FormulaIngredient[],
    batchSize: number
  ): FormulaIngredient[] => {
    return ingredients.map(ingredient => ({
      ...ingredient,
      weight: (ingredient.percentage / 100) * batchSize
    }));
  }, []);

  const calculateTotals = useCallback((ingredients: FormulaIngredient[]) => {
    const totalPercentage = ingredients.reduce((sum, ing) => sum + (ing.percentage || 0), 0);
    const totalWeight = ingredients.reduce((sum, ing) => sum + (ing.weight || 0), 0);
    const totalCost = ingredients.reduce((sum, ing) => sum + ((ing.weight || 0) * (ing.costPerMl || 0)), 0);
    
    return {
      totalPercentage: Math.round(totalPercentage * 1000) / 1000, // 3 decimal places
      totalWeight: Math.round(totalWeight * 1000) / 1000,
      totalCost: Math.round(totalCost * 100) / 100 // 2 decimal places for currency
    };
  }, []);

  const updateCalculatedTotals = useCallback((data: CaseData): CaseData => {
    // FIXED: Prevent recursive calls more robustly
    if (isUpdatingTotals.current || preventInfiniteLoop.current) {
      return data;
    }
    
    const ingredients = data.ingredients || [];
    const totals = calculateTotals(ingredients);
    
    const calculatedTotals = [
      { metric: 'Total Percentage', value: `${totals.totalPercentage}%`, unit: '%' },
      { metric: 'Total Weight', value: totals.totalWeight.toString(), unit: 'ml' },
      { metric: 'Total Cost', value: `$${totals.totalCost}`, unit: 'USD' },
      { metric: 'Ingredient Count', value: ingredients.length.toString(), unit: 'items' }
    ];

    return {
      ...data,
      calculatedTotals,
      _computedTotals: totals
    };
  }, [calculateTotals]);

  // Compliance run execution
  const executeComplianceRun = useCallback(async (data: CaseData): Promise<CaseData> => {
    try {
      // Update run status to indicate analysis is starting
      const updatedData = {
        ...data,
        runStatus: 'Running Analysis...',
        analysisProgress: [
          { step: 'Formula Validation', status: 'Running', completion: '10%' },
          { step: 'IFRA Standards Check', status: 'Pending', completion: '0%' },
          { step: 'Allergen Analysis', status: 'Pending', completion: '0%' },
          { step: 'Usage Limit Verification', status: 'Pending', completion: '0%' },
          { step: 'Toxicology Review', status: 'Pending', completion: '0%' },
          { step: 'Labeling Generation', status: 'Pending', completion: '0%' },
          { step: 'Report Compilation', status: 'Pending', completion: '0%' }
        ]
      };

      setState((prev) => ({ ...prev, data: updatedData }));

      // Create compliance run case via DX API
      const runResult = await dx.cases.create({
        templateId: 'ComplianceRun',
        data: {
          runName: data.runName,
          formulaId: data.formulaId,
          targetMarkets: data.targetMarkets,
          regulatoryFrameworks: data.regulatoryFrameworks,
          productCategories: data.productCategories,
          assessmentType: data.assessmentType,
          priority: data.priority
        }
      }) as ComplianceRunResult;

      // Generate comprehensive mock report data
      const reportData = generateMockComplianceReport(data);

      const finalData = {
        ...data,
        runStatus: 'Analysis Complete',
        complianceRunId: runResult.runId,
        analysisProgress: [
          { step: 'Formula Validation', status: 'Complete', completion: '100%' },
          { step: 'IFRA Standards Check', status: 'Complete', completion: '100%' },
          { step: 'Allergen Analysis', status: 'Complete', completion: '100%' },
          { step: 'Usage Limit Verification', status: 'Complete', completion: '100%' },
          { step: 'Toxicology Review', status: 'Complete', completion: '100%' },
          { step: 'Labeling Generation', status: 'Complete', completion: '100%' },
          { step: 'Report Compilation', status: 'Complete', completion: '100%' }
        ],
        ...reportData,
        completedAt: new Date().toISOString()
      };

      return finalData;

    } catch (error) {
      console.error('Compliance run failed:', error);
      return {
        ...data,
        runStatus: 'Analysis Failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }, []);

  // Generate comprehensive mock compliance report
  const generateMockComplianceReport = useCallback((data: CaseData) => {
    const reportSummary = [
      { metric: 'Overall Compliance Status', value: 'COMPLIANT', status: 'pass' },
      { metric: 'IFRA Violations', value: '0', status: 'pass' },
      { metric: 'Allergen Declarations Required', value: '3', status: 'warning' },
      { metric: 'Critical Issues', value: '0', status: 'pass' },
      { metric: 'Target Markets Analyzed', value: data.targetMarkets?.length?.toString() || '0', status: 'info' },
      { metric: 'Analysis Completion', value: '100%', status: 'pass' }
    ];

    const ifraResults = [
      {
        ingredient: 'Bergamot Essential Oil',
        category: 'Category 4 (Fine Fragrance)',
        currentUsage: '2.5%',
        maxAllowed: '3.2%',
        complianceStatus: 'COMPLIANT',
        recommendation: 'Within safe limits'
      },
      {
        ingredient: 'Linalool',
        category: 'Category 4 (Fine Fragrance)',
        currentUsage: '1.8%',
        maxAllowed: '2.0%',
        complianceStatus: 'COMPLIANT',
        recommendation: 'Close to limit, monitor usage'
      },
      {
        ingredient: 'Limonene',
        category: 'Category 4 (Fine Fragrance)',
        currentUsage: '0.9%',
        maxAllowed: '1.5%',
        complianceStatus: 'COMPLIANT',
        recommendation: 'Well within safe limits'
      }
    ];

    const allergenResults = [
      {
        allergen: 'Linalool',
        source: 'Bergamot Essential Oil, Lavender Oil',
        concentration: '1.8%',
        threshold: '0.001% (10 ppm)',
        declarationRequired: 'YES'
      },
      {
        allergen: 'Limonene',
        source: 'Bergamot Essential Oil, Orange Oil',
        concentration: '0.9%',
        threshold: '0.001% (10 ppm)',
        declarationRequired: 'YES'
      },
      {
        allergen: 'Geraniol',
        source: 'Rose Oil',
        concentration: '0.3%',
        threshold: '0.001% (10 ppm)',
        declarationRequired: 'YES'
      }
    ];

    const labelingRequirements = [
      {
        market: 'European Union',
        requirement: 'Allergen Declaration',
        labelingText: 'Contains: Linalool, Limonene, Geraniol',
        placement: 'Ingredient list or separate line'
      },
      {
        market: 'United States',
        requirement: 'Fragrance Declaration',
        labelingText: 'Fragrance (Parfum)',
        placement: 'Ingredient list'
      },
      {
        market: 'Canada',
        requirement: 'Allergen Declaration',
        labelingText: 'Contains: Linalool, Limonene, Geraniol',
        placement: 'Ingredient list'
      }
    ];

    const complianceIssues = [
      {
        severity: 'LOW',
        issue: 'Linalool concentration approaching IFRA limit',
        regulation: 'IFRA Standard 49th Amendment',
        recommendation: 'Monitor concentration in future batches',
        deadline: '30 days for review'
      }
    ];

    const allergenDeclarationText = `
      <p><strong>EU Allergen Declaration:</strong></p>
      <p>This product contains the following allergens as naturally occurring components of fragrance ingredients:</p>
      <ul>
        <li>Linalool (1.8%)</li>
        <li>Limonene (0.9%)</li>
        <li>Geraniol (0.3%)</li>
      </ul>
      <p>These allergens are present above the declaration threshold of 10 ppm (0.001%) and must be listed on the product label.</p>
    `;

    const inci = `
      <p><strong>INCI Declaration:</strong></p>
      <p>Alcohol Denat., Parfum (Fragrance), Aqua (Water), Linalool, Limonene, Geraniol, Citral, Benzyl Salicylate, Alpha-Isomethyl Ionone, Coumarin</p>
    `;

    const nextSteps = `
      <h3>Recommended Next Steps:</h3>
      <ol>
        <li><strong>Review Linalool Usage:</strong> Monitor linalool concentration in future productions to maintain compliance buffer.</li>
        <li><strong>Update Product Labels:</strong> Ensure all product labels include the required allergen declarations for target markets.</li>
        <li><strong>Documentation:</strong> File compliance report with regulatory affairs team and maintain records for audit purposes.</li>
        <li><strong>Market Registration:</strong> Proceed with CPNP notification for EU markets and FDA registration for US market.</li>
        <li><strong>Periodic Review:</strong> Schedule quarterly compliance reviews to monitor any regulatory changes.</li>
      </ol>
    `;

    return {
      reportSummary,
      ifraResults,
      allergenResults,
      labelingRequirements,
      complianceIssues,
      allergenDeclarationText,
      inci,
      nextSteps,
      overallCompliance: 'COMPLIANT - Minor monitoring required'
    };
  }, []);

  // Batch size recalculation - preserves ratios, updates weights
  const recalculateBatch = useCallback((data: CaseData): CaseData => {
    const ingredients = data.ingredients || [];
    const newBatchSize = parseFloat(data.newBatchSize) || data.batchSize || 100;
    
    if (ingredients.length === 0 || newBatchSize <= 0) return data;

    // Recalculate weights based on new batch size, preserving percentages
    const updatedIngredients = calculateIngredientWeights(ingredients, newBatchSize);
    
    const updatedData = {
      ...data,
      batchSize: newBatchSize,
      ingredients: updatedIngredients,
      lastBatchRecalculation: new Date().toISOString()
    };

    return updateCalculatedTotals(updatedData);
  }, [calculateIngredientWeights, updateCalculatedTotals]);

  // Formula normalization - adjusts percentages to total 100%
  const normalizeFormula = useCallback((data: CaseData): CaseData => {
    const ingredients = data.ingredients || [];
    if (ingredients.length === 0) return data;

    const currentTotal = ingredients.reduce((sum: number, ing: any) => sum + (parseFloat(ing.percentage) || 0), 0);
    
    if (currentTotal === 0 || currentTotal === 100) return data;

    // Normalize percentages to total 100% while preserving ratios
    const normalizedIngredients = ingredients.map((ing: any) => ({
      ...ing,
      percentage: parseFloat(((parseFloat(ing.percentage) || 0) / currentTotal * 100).toFixed(3))
    }));

    // Recalculate weights based on normalized percentages
    const batchSize = data.batchSize || 100;
    const ingredientsWithWeights = calculateIngredientWeights(normalizedIngredients, batchSize);

    const updatedData = {
      ...data,
      ingredients: ingredientsWithWeights,
      lastNormalized: new Date().toISOString(),
      normalizationFactor: 100 / currentTotal
    };

    return updateCalculatedTotals(updatedData);
  }, [calculateIngredientWeights, updateCalculatedTotals]);

  // Apply yield calculation - adjusts weights based on yield factor
  const applyYieldToFormula = useCallback((data: CaseData): CaseData => {
    const ingredients = data.ingredients || [];
    const yieldFactor = parseFloat(data.yieldAdjustment || data.yieldFactor) || 0.95;

    if (ingredients.length === 0) return data;

    const adjustedIngredients = ingredients.map((ing: any) => ({
      ...ing,
      adjustedWeight: parseFloat(((ing.weight || 0) * yieldFactor).toFixed(3))
    }));

    const updatedData = {
      ...data,
      ingredients: adjustedIngredients,
      appliedYield: yieldFactor,
      lastYieldApplied: new Date().toISOString()
    };

    return updateCalculatedTotals(updatedData);
  }, [updateCalculatedTotals]);

  // Save formula version - creates snapshot for comparison
  const saveFormulaVersion = useCallback((data: CaseData): CaseData => {
    const currentVersion = data.version || '1.0.0';
    const versionParts = currentVersion.split('.').map(Number);
    versionParts[2] = (versionParts[2] || 0) + 1;
    const newVersion = versionParts.join('.');

    const versionHistory = data.versionHistory || [];
    const totals = data._computedTotals || calculateTotals(data.ingredients || []);
    
    const newVersionEntry: FormulaVersion = {
      version: currentVersion,
      timestamp: new Date().toISOString(),
      ingredients: [...(data.ingredients || [])],
      batchSize: data.batchSize || 100,
      yieldFactor: data.yieldFactor || 0.95,
      notes: data.versionNotes || '',
      totals
    };

    // Update version options for comparison
    const versionOptions = [
      ...versionHistory.map((v: FormulaVersion) => ({ 
        value: v.version, 
        label: `Version ${v.version} (${new Date(v.timestamp).toLocaleDateString()})` 
      })),
      { value: currentVersion, label: `Version ${currentVersion} (Current)` }
    ];

    return {
      ...data,
      version: newVersion,
      versionHistory: [...versionHistory, newVersionEntry],
      versionNotes: '',
      lastVersionSaved: new Date().toISOString(),
      compareWithVersion: '', // Reset comparison selection
      comparisonResults: [], // Clear previous comparisons
      _versionOptions: versionOptions
    };
  }, [calculateTotals]);

  // Compare formula versions
  const compareVersions = useCallback((data: CaseData): CaseData => {
    const compareWithVersion = data.compareWithVersion;
    if (!compareWithVersion) return data;

    const versionHistory = data.versionHistory || [];
    const selectedVersion = versionHistory.find((v: FormulaVersion) => v.version === compareWithVersion);
    
    if (!selectedVersion) return data;

    const currentIngredients = data.ingredients || [];
    const previousIngredients = selectedVersion.ingredients || [];
    
    // Create ingredient maps for comparison
    const currentMap = new Map(currentIngredients.map((ing: any) => [ing.ingredientCode, ing]));
    const previousMap = new Map(previousIngredients.map(ing => [ing.ingredientCode, ing]));
    
    const comparisons: VersionComparison[] = [];
    
    // Check all ingredients from both versions
    const allIngredientCodes = new Set([...currentMap.keys(), ...previousMap.keys()]);
    
    allIngredientCodes.forEach(code => {
      const current = currentMap.get(code);
      const previous = previousMap.get(code);
      
      if (!previous && current) {
        // New ingredient
        comparisons.push({
          ingredient: current.ingredientName,
          previousValue: 'Not present',
          currentValue: `${current.percentage}%`,
          change: `+${current.percentage}%`,
          changeType: 'added'
        });
      } else if (previous && !current) {
        // Removed ingredient
        comparisons.push({
          ingredient: previous.ingredientName,
          previousValue: `${previous.percentage}%`,
          currentValue: 'Removed',
          change: `-${previous.percentage}%`,
          changeType: 'removed'
        });
      } else if (previous && current) {
        // Modified or same ingredient
        const previousPerc = previous.percentage;
        const currentPerc = current.percentage;
        const change = currentPerc - previousPerc;
        
        comparisons.push({
          ingredient: current.ingredientName,
          previousValue: `${previousPerc}%`,
          currentValue: `${currentPerc}%`,
          change: change === 0 ? 'No change' : `${change > 0 ? '+' : ''}${change.toFixed(3)}%`,
          changeType: change === 0 ? 'same' : 'modified'
        });
      }
    });

    return {
      ...data,
      comparisonResults: comparisons,
      lastComparison: new Date().toISOString(),
      comparedVersion: compareWithVersion
    };
  }, []);

  // Generate formula summary for review stage
  const generateFormulaSummary = useCallback((data: CaseData): CaseData => {
    const ingredients = data.ingredients || [];
    const totals = data._computedTotals || calculateTotals(ingredients);
    
    const formulaSummary = [
      { metric: 'Formula Name', value: data.name || 'Unnamed Formula', notes: 'Working title' },
      { metric: 'Formula Type', value: data.formulaType || 'Unknown', notes: 'Category classification' },
      { metric: 'Batch Size', value: `${data.batchSize || 100} ml`, notes: 'Current batch size' },
      { metric: 'Total Ingredients', value: ingredients.length.toString(), notes: 'Number of components' },
      { metric: 'Total Percentage', value: `${totals.totalPercentage}%`, notes: totals.totalPercentage === 100 ? 'Normalized' : 'Needs normalization' },
      { metric: 'Yield Factor', value: `${((data.yieldFactor || 0.95) * 100).toFixed(1)}%`, notes: 'Expected manufacturing yield' },
      { metric: 'Version', value: data.version || '1.0.0', notes: 'Current version number' }
    ];

    // Cost analysis by function
    const costByFunction = ingredients.reduce((acc: any, ing: any) => {
      const func = ing.function || 'unknown';
      const cost = (ing.weight || 0) * (ing.costPerMl || 0);
      acc[func] = (acc[func] || 0) + cost;
      return acc;
    }, {});

    const costAnalysis = Object.entries(costByFunction).map(([func, cost]: [string, any]) => ({
      component: func.replace('_', ' ').toUpperCase(),
      cost: `$${(cost as number).toFixed(2)}`,
      percentage: `${((cost as number) / totals.totalCost * 100).toFixed(1)}%`
    }));

    return {
      ...data,
      formulaSummary,
      costAnalysis
    };
  }, [calculateTotals]);

  // Enhanced onAction to handle all formula tools and compliance run
  const onAction = useCallback(
    async (action: Action) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        let updatedData = state.data;

        // Handle client-side formula calculation actions
        switch (action.id) {
          case 'recalculate_batch':
            updatedData = recalculateBatch(state.data);
            break;
          case 'normalize_to_100':
            updatedData = normalizeFormula(state.data);
            break;
          case 'apply_yield':
            updatedData = applyYieldToFormula(state.data);
            break;
          case 'save_version':
            updatedData = saveFormulaVersion(state.data);
            break;
          case 'compare_versions':
            updatedData = compareVersions(state.data);
            break;
          case 'start_analysis':
            updatedData = await executeComplianceRun(state.data);
            break;
          case 'print_report':
            window.print();
            setState((prev) => ({ ...prev, isLoading: false }));
            return;
          default:
            // Handle other actions (DX API calls)
            break;
        }

        // If it was a calculation or compliance action, update state and return early
        if (['recalculate_batch', 'normalize_to_100', 'apply_yield', 'save_version', 'compare_versions', 'start_analysis'].includes(action.id)) {
          // Also generate summary if we're in review stage
          if (state.currentStageIndex === 3) { // Review stage
            updatedData = generateFormulaSummary(updatedData);
          }

          setState((prev) => ({
            ...prev,
            data: updatedData,
            isDirty: true,
            isLoading: false
          }));

          onSave?.(updatedData);
          return;
        }

        // Handle DX API actions
        const payload = mapActionPayload(action, updatedData);

        if (state.caseId) {
          try {
            await dx.cases.submitAction(state.caseId, action.id, payload);

            // Refresh case data after the action
            const updatedCase = await dx.cases.get(state.caseId);
            setState((prev) => ({
              ...prev,
              data: { ...prev.data, ...updatedCase.data },
              isDirty: false,
              lastSaved: new Date(),
            }));

            onSave?.(updatedCase.data);
            updatedData = updatedCase.data;
          } catch (dxError) {
            console.warn(
              'DX API action failed, proceeding with local state:',
              dxError
            );
            setState((prev) => ({ ...prev, isDirty: true }));
            onSave?.(updatedData);
          }
        } else {
          setState((prev) => ({ ...prev, data: updatedData, isDirty: true }));
          onSave?.(updatedData);
        }

        // Perform the transition defined by the action result
        const transition = parseTransitionTarget(action.resultTransition);
        switch (transition.type) {
          case 'advance':
            advanceStep();
            break;
          case 'goto':
            if (transition.target) {
              const location = findStepById(transition.target);
              if (location) {
                navigateToStep(location.stageIndex, location.stepIndex);
              } else {
                console.warn(
                  `Step not found for goto transition: ${transition.target}`
                );
              }
            }
            break;
          case 'stay':
          default:
            break;
        }

        setState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Action execution failed';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
        onError?.(errorMessage);
      }
    },
    [
      state.data,
      state.caseId,
      state.currentStageIndex,
      recalculateBatch,
      normalizeFormula,
      applyYieldToFormula,
      saveFormulaVersion,
      compareVersions,
      executeComplianceRun,
      generateFormulaSummary,
      onSave,
      onError,
    ]
  );

  // FIXED: Completely remove the problematic auto-update useEffect
  // The infinite loop was caused by this useEffect constantly triggering updates
  // We'll handle totals updates manually in the updateField function instead

  // Load template and case data - FIXED: Simplified dependencies
  useEffect(() => {
    const loadData = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const { getTemplate } = await import('@/lib/caseflow/registry');
        const template = getTemplate(templateId);

        if (!template) {
          throw new Error(`Template not found: ${templateId}`);
        }

        const processed = processTemplate(template);
        setProcessedTemplate(processed);

        let caseData = initialData;
        let currentCaseId = caseId;

        if (caseId) {
          try {
            const caseResponse = await dx.cases.get(caseId);
            caseData = { ...initialData, ...caseResponse.data };
            currentCaseId = caseResponse.id;
          } catch (error) {
            console.warn('Failed to load case data, using initial data:', error);
          }
        }

        // Initialize calculated totals for formula templates - SAFE
        if (templateId === 'Formula' && caseData.ingredients) {
          preventInfiniteLoop.current = true;
          caseData = updateCalculatedTotals(caseData);
          // Reset the flag after a brief delay
          setTimeout(() => {
            preventInfiniteLoop.current = false;
          }, 100);
        }

        setState((prev) => ({
          ...prev,
          caseId: currentCaseId,
          template: processed,
          data: caseData,
          isLoading: false,
          isDirty: false,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load case data';
        setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
        onError?.(errorMessage);
      }
    };

    if (templateId) {
      loadData();
    }
  }, [caseId, templateId, onError]); // Removed problematic dependencies

  // Update a field in the case data - FIXED: Safer totals calculation
  const updateField = useCallback((fieldId: string, value: any) => {
    setState((prev) => {
      let newData = { ...prev.data, [fieldId]: value };
      
      // Auto-recalculate for formula fields - SAFER approach
      if (templateId === 'Formula' && !preventInfiniteLoop.current) {
        if (fieldId === 'ingredients') {
          preventInfiniteLoop.current = true;
          newData = updateCalculatedTotals(newData);
          // Reset flag after processing
          setTimeout(() => {
            preventInfiniteLoop.current = false;
          }, 50);
        }
        if (fieldId === 'batchSize' || fieldId === 'newBatchSize') {
          // Auto-recalculate weights when batch size changes
          const batchSize = fieldId === 'newBatchSize' ? value : newData.batchSize;
          if (newData.ingredients && batchSize && !preventInfiniteLoop.current) {
            preventInfiniteLoop.current = true;
            const updatedIngredients = calculateIngredientWeights(newData.ingredients, batchSize);
            newData = { ...newData, ingredients: updatedIngredients };
            newData = updateCalculatedTotals(newData);
            setTimeout(() => {
              preventInfiniteLoop.current = false;
            }, 50);
          }
        }
      }

      // Auto-update compliance configuration summary
      if (templateId === 'Compliance' && fieldId === 'targetMarkets') {
        const configSummary = [
          { parameter: 'Run Name', value: newData.runName || 'Not specified' },
          { parameter: 'Target Formula', value: newData.formulaId || 'Not selected' },
          { parameter: 'Assessment Type', value: newData.assessmentType || 'Not specified' },
          { parameter: 'Target Markets', value: Array.isArray(value) ? value.join(', ') : 'None selected' },
          { parameter: 'Priority', value: newData.priority || 'Not set' }
        ];
        newData = { ...newData, configSummary };
      }

      return {
        ...prev,
        data: newData,
        isDirty: true,
      };
    });
  }, [templateId, calculateIngredientWeights, updateCalculatedTotals]);

  // Navigate to a specific stage / step
  const navigateToStep = useCallback(
    (stageIndex: number, stepIndex: number = 0) => {
      const stages = processedTemplate.stages ?? [];
      if (stageIndex >= 0 && stageIndex < stages.length) {
        const stage = stages[stageIndex];
        const validStepIndex = Math.max(
          0,
          Math.min(stepIndex, (stage.steps?.length ?? 1) - 1)
        );

        setState((prev) => ({
          ...prev,
          currentStageIndex: stageIndex,
          currentStepIndex: validStepIndex,
        }));
      }
    },
    [processedTemplate.stages]
  );

  // Find a step across all stages by its id
  const findStepById = useCallback(
    (
      stepId: string
    ): { stageIndex: number; stepIndex: number } | null => {
      const stages = processedTemplate.stages ?? [];
      for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
        const stage = stages[stageIndex];
        const stepIndex = (stage.steps ?? []).findIndex(
          (step) => step.id === stepId
        );
        if (stepIndex !== -1) {
          return { stageIndex, stepIndex };
        }
      }
      return null;
    },
    [processedTemplate.stages]
  );

  // Advance one step (or to the next stage)
  const advanceStep = useCallback(() => {
    const stages = processedTemplate.stages ?? [];
    const currentStage = stages[state.currentStageIndex];
    if (!currentStage) return;

    const steps = currentStage.steps ?? [];

    if (state.currentStepIndex < steps.length - 1) {
      setState((prev) => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex + 1,
      }));
    } else if (state.currentStageIndex < stages.length - 1) {
      setState((prev) => ({
        ...prev,
        currentStageIndex: prev.currentStageIndex + 1,
        currentStepIndex: 0,
      }));
    }
  }, [processedTemplate.stages, state.currentStageIndex, state.currentStepIndex]);

  const goBack = useCallback(() => {
    const stages = processedTemplate.stages ?? [];
    
    if (state.currentStepIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex - 1,
      }));
    } else if (state.currentStageIndex > 0) {
      const previousStage = stages[state.currentStageIndex - 1];
      const lastStepIndex = Math.max(0, (previousStage?.steps?.length ?? 1) - 1);
      
      setState((prev) => ({
        ...prev,
        currentStageIndex: prev.currentStageIndex - 1,
        currentStepIndex: lastStepIndex,
      }));
    }
  }, [processedTemplate.stages, state.currentStageIndex, state.currentStepIndex]);

  // Persist case data (create or update)
  const save = useCallback(async () => {
    if (!state.isDirty) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      if (state.caseId) {
        await dx.cases.update(state.caseId, state.data);
      } else {
        const newCase = await dx.cases.create({
          templateId,
          data: state.data,
        });
        setState((prev) => ({ ...prev, caseId: newCase.id }));
      }

      setState((prev) => ({
        ...prev,
        isDirty: false,
        lastSaved: new Date(),
        isLoading: false,
      }));

      onSave?.(state.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save case';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      onError?.(errorMessage);
    }
  }, [state.isDirty, state.caseId, state.data, templateId, onSave, onError]);

  // Helper to get the current step object
  const getCurrentStep = useCallback((): Step | null => {
    const stages = processedTemplate.stages ?? [];
    const currentStage = stages[state.currentStageIndex];
    return currentStage?.steps?.[state.currentStepIndex] ?? null;
  }, [processedTemplate.stages, state.currentStageIndex, state.currentStepIndex]);

  // Helper to get the current stage object
  const getCurrentStage = useCallback((): Stage | null => {
    const stages = processedTemplate.stages ?? [];
    return stages[state.currentStageIndex] ?? null;
  }, [processedTemplate.stages, state.currentStageIndex]);

  // Visibility logic for actions
  const isActionVisible = useCallback(
    (action: Action): boolean => {
      if (action.visibilityCondition && !action.visibilityCondition(state.data)) {
        return false;
      }
      return true;
    },
    [state.data]
  );

  // Compute list of visible actions for the active step
  const getVisibleActions = useCallback((): Action[] => {
    const currentStep = getCurrentStep();
    if (!currentStep) return [];
    return currentStep.actions.filter(isActionVisible);
  }, [getCurrentStep, isActionVisible]);

  // Navigation capability flags
  const canAdvance = (() => {
    const stages = processedTemplate.stages ?? [];
    const currentStage = stages[state.currentStageIndex];
    const stepsCount = currentStage?.steps?.length ?? 0;

    return (
      state.currentStageIndex < stages.length - 1 ||
      state.currentStepIndex < stepsCount - 1
    );
  })();

  const canGoBack = state.currentStageIndex > 0 || state.currentStepIndex > 0;

  return {
    ...state,
    template: processedTemplate,

    // Computed values
    currentStep: getCurrentStep(),
    currentStage: getCurrentStage(),
    visibleActions: getVisibleActions(),

    // Public actions
    updateField,
    onAction,
    save,
    navigateToStep,
    advanceStep,
    goBack,
    findStepById,

    // Navigation helpers
    canAdvance,
    canGoBack,

    // Formula-specific helpers
    calculateTotals,
    recalculateBatch,
    normalizeFormula,
    applyYieldToFormula,
    saveFormulaVersion,
    compareVersions,

    // Compliance-specific helpers
    executeComplianceRun,
  };
}

// Static controller methods for case creation
export const CaseController = {
  async createCase({ caseTypeId, content }: { caseTypeId: string; content: Record<string, any> }) {
    try {
      const response = await dx.cases.create({
        templateId: caseTypeId,
        data: content,
      });
      return response;
    } catch (error) {
      console.error('Failed to create case:', error);
      throw error;
    }
  }
};

// Export types for consumers of the hook
export type { CaseState, CaseControllerOptions, FormulaIngredient, FormulaVersion, VersionComparison, ComplianceRunResult };
