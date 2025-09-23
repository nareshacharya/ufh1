
'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCaseController } from '@/app/features/cases/controller/caseController';
import { CaseChrome, CaseMetadata } from '@/app/features/cases/view/CaseChrome';
import { getChromeConfig } from '@/lib/caseflow/registry';
import { Action } from '@/lib/caseflow/schema';

interface CaseViewControllerProps {
  caseTypeId: string;
  caseId: string;
}

export default function CaseViewController({ caseTypeId, caseId }: CaseViewControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Mock user roles for RBAC testing - in real app this would come from auth context
  const userRoles = ['ingredient_manager', 'formula_developer', 'admin']; // Mock roles for testing

  const {
    template,
    data,
    currentStageIndex,
    currentStepIndex,
    currentStage,
    currentStep,
    isLoading,
    error,
    updateField,
    onAction,
    save,
    navigateToStep
  } = useCaseController({
    caseId,
    templateId: caseTypeId,
    onSave: (savedData) => {
      console.log('Case saved:', savedData);
    },
    onError: (error) => {
      console.error('Case error:', error);
    }
  });

  // Handle deep linking from URL parameters
  useEffect(() => {
    if (!template || !template.stages || isLoading) return;

    const urlStage = searchParams.get('stage');
    const urlStep = searchParams.get('step');

    if (urlStage || urlStep) {
      // Find the stage and step indices from URL parameters
      let targetStageIndex = currentStageIndex;
      let targetStepIndex = currentStepIndex;

      if (urlStage) {
        const stageIndex = template.stages.findIndex(s => s.id === urlStage);
        if (stageIndex !== -1) {
          targetStageIndex = stageIndex;
        }
      }

      if (urlStep && template.stages[targetStageIndex]) {
        const stepIndex = template.stages[targetStageIndex].steps.findIndex(s => s.id === urlStep);
        if (stepIndex !== -1) {
          targetStepIndex = stepIndex;
        }
      }

      // Navigate to the URL-specified step if different from current
      if (targetStageIndex !== currentStageIndex || targetStepIndex !== currentStepIndex) {
        navigateToStep(targetStageIndex, targetStepIndex);
      }
    }
  }, [template, searchParams, currentStageIndex, currentStepIndex, navigateToStep, isLoading]);

  // Update URL when stage/step changes
  const updateURL = (stageId: string, stepId: string) => {
    const params = new URLSearchParams();
    params.set('stage', stageId);
    params.set('step', stepId);
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newURL);
  };

  // Handle stage/step changes and update URL
  useEffect(() => {
    if (currentStage && currentStep && !isLoading) {
      updateURL(currentStage.id, currentStep.id);
    }
  }, [currentStage, currentStep, isLoading]);

  // Mock case metadata - in real app this would come from the case data
  const metadata: CaseMetadata = {
    id: caseId,
    createdBy: 'Alice Johnson',
    createdAt: '2024-01-15T08:30:00Z',
    owner: 'Bob Smith',
    lastModifiedBy: 'Alice Johnson',
    lastModifiedAt: '2024-01-16T14:22:00Z',
    version: '1.2.0',
    sla: {
      dueDate: '2024-01-25T17:00:00Z',
      priority: 'medium',
      status: 'on_track'
    },
    status: data.status || 'draft'
  };

  const handleAction = (action: Action, caseData: any) => {
    console.log('Executing action:', action.id, 'with data:', caseData);
    onAction(action);
  };

  const handleContextualAction = (actionId: string) => {
    console.log('Contextual action:', actionId);
    // Handle contextual actions like edit, duplicate, export, etc.
    switch (actionId) {
      case 'edit':
        console.log('Edit mode activated');
        break;
      case 'duplicate':
        console.log('Duplicating case');
        break;
      case 'export':
        console.log('Exporting case');
        break;
      case 'calculate_cost':
        console.log('Calculating formula cost');
        break;
      case 'validate_compliance':
        console.log('Validating compliance');
        break;
      default:
        console.log('Unknown contextual action:', actionId);
    }
  };

  const handleStageStepChange = (stageIndex: number, stepIndex: number) => {
    navigateToStep(stageIndex, stepIndex);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-red-500"></i>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">Error Loading Case</h2>
          <p className="mt-1 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <CaseChrome
      template={template}
      mode="edit"
      data={data}
      metadata={metadata}
      config={getChromeConfig(caseTypeId)}
      currentStage={currentStageIndex}
      currentStep={currentStepIndex}
      userRoles={userRoles}
      onChange={updateField}
      onAction={handleAction}
      onContextualAction={handleContextualAction}
      onStageStepChange={handleStageStepChange}
      breadcrumbs={[
        { label: 'Cases', href: '/cases' },
        { label: template.name, href: `/cases/${caseTypeId}` },
        { label: caseId }
      ]}
    />
  );
}
