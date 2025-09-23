
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CaseTemplate, Action, isActionVisible } from '@/lib/caseflow/schema';
import { CaseFlowRenderer } from '@/lib/caseflow/renderer';
import { AccessibleStageProgress } from '@/components/StageProgress';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useToastHelpers } from '@/components/ToastProvider';
import { logEvent, EventTypes, trackUserAction } from '@/lib/observability/eventLogger';
import { appConfig } from '@/lib/config/appConfig';

export function CaseChrome({
  template,
  mode,
  data,
  metadata,
  config,
  currentStage,
  currentStep,
  userRoles,
  onChange,
  onAction,
  onContextualAction,
  onStageStepChange,
  breadcrumbs = []
}: CaseChromeProps) {
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  
  // Feature flags
  const showAdvancedActions = useFeatureFlag('advancedActions');
  const enableFormulaNormalization = useFeatureFlag('formulaNormalization');
  const enableYielding = useFeatureFlag('yielding');
  const enableBatchCalculation = useFeatureFlag('batchCalculation');
  
  // Toast notifications
  const toast = useToastHelpers();

  // Get current stage and step objects
  const stage = template.stages?.[currentStage];
  const step = stage?.steps?.[currentStep];

  // Convert indices to IDs for the renderer
  const currentStageId = stage?.id || '';
  const currentStepId = step?.id || '';

  // Log page view on mount
  useEffect(() => {
    if (appConfig.features.eventLogging) {
      logEvent(EventTypes.PAGE_VIEW, {
        templateId: template.id,
        mode,
        stageId: currentStageId,
        stepId: currentStepId,
      });
    }
  }, [template.id, mode, currentStageId, currentStepId]);

  // Handle stage/step changes from renderer
  const handleStageStepChange = (stageId: string, stepId: string) => {
    if (!template.stages || !onStageStepChange) return;

    // Find indices from IDs
    const stageIndex = template.stages.findIndex(s => s.id === stageId);
    const stage = template.stages[stageIndex];
    const stepIndex = stage?.steps.findIndex(s => s.id === stepId) || 0;

    if (stageIndex !== -1) {
      onStageStepChange(stageIndex, stepIndex);
      
      // Log navigation event
      trackUserAction('stage_navigation', {
        fromStage: currentStageId,
        toStage: stageId,
        fromStep: currentStepId,
        toStep: stepId,
      });
    }
  };

  // Filter actions based on feature flags
  const getVisibleActions = (): Action[] => {
    if (!step?.actions) return [];
    
    return step.actions.filter(action => {
      // First check role-based visibility
      if (!isActionVisible(action, data, userRoles)) {
        return false;
      }

      // Then check feature flags
      switch (action.id) {
        case 'normalize_to_100':
          return enableFormulaNormalization;
        case 'apply_yield':
          return enableYielding;
        case 'recalculate_batch':
          return enableBatchCalculation;
        case 'save_version':
        case 'compare_versions':
          return useFeatureFlag('versionComparison');
        case 'run_compliance':
          return useFeatureFlag('complianceRun');
        case 'link_formula':
          return useFeatureFlag('formulaLinking');
        default:
          return showAdvancedActions || ['save_draft', 'submit_for_review'].includes(action.id);
      }
    });
  };

  const handleActionClick = (action: Action) => {
    // Log action attempt
    trackUserAction('case_action_attempted', {
      actionId: action.id,
      templateId: template.id,
      stageId: currentStageId,
      stepId: currentStepId,
    });

    // Show confirmation for critical actions
    if (['submit_for_review', 'submit_for_approval', 'delete'].includes(action.id)) {
      setShowConfirmation(action.id);
      return;
    }

    // Execute action
    try {
      onAction(action, data);
      
      // Show success toast
      toast.success('Action completed successfully', `${action.label} was executed.`);
      
      // Log successful action
      trackUserAction('case_action_completed', {
        actionId: action.id,
        templateId: template.id,
        success: true,
      });
      
    } catch (error) {
      // Show error toast
      toast.error('Action failed', `Failed to execute ${action.label}.`);
      
      // Log failed action
      logEvent('case_action_failed', {
        actionId: action.id,
        templateId: template.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'error');
    }
  };

  const handleConfirmAction = (actionId: string) => {
    const action = step?.actions?.find(a => a.id === actionId);
    if (action) {
      try {
        onAction(action, data);
        toast.success('Action completed', `${action.label} was executed successfully.`);
        
        trackUserAction('case_action_confirmed', {
          actionId: action.id,
          templateId: template.id,
        });
        
      } catch (error) {
        toast.error('Action failed', `Failed to execute ${action.label}.`);
        
        logEvent('case_action_failed', {
          actionId: action.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        }, 'error');
      }
    }
    setShowConfirmation(null);
  };

  // Formatting functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-100';
      case 'at_risk': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="py-3 border-b border-gray-100">
              <nav 
                className="flex" 
                aria-label="Breadcrumb"
                role="navigation"
              >
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <i 
                          className="ri-arrow-right-s-line text-gray-400 mx-1"
                          aria-hidden="true"
                        ></i>
                      )}
                      {crumb.href ? (
                        <Link 
                          href={crumb.href}
                          className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-900 font-medium">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          )}

          {/* Main Header */}
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <h1 
                    className="text-2xl font-bold text-gray-900 truncate"
                    id="case-title"
                  >
                    {template.title} #{metadata.id}
                  </h1>
                  <span 
                    className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      metadata.status === 'completed' ? 'bg-green-100 text-green-800' :
                      metadata.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                    aria-label={`Case status: ${metadata.status.replace('_', ' ')}`}
                  >
                    {metadata.status.replace('_', ' ')}
                  </span>
                </div>
                
                {/* Case Info */}
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <i 
                      className="ri-user-line mr-1.5 h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    ></i>
                    <span>
                      <span className="sr-only">Case owner: </span>
                      {metadata.owner}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <i 
                      className="ri-calendar-line mr-1.5 h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    ></i>
                    <span>
                      <span className="sr-only">Last updated: </span>
                      {formatDate(metadata.lastModifiedAt)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <i 
                      className="ri-git-branch-line mr-1.5 h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    ></i>
                    <span>
                      <span className="sr-only">Version: </span>
                      {metadata.version}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {/* Contextual Actions */}
                {config.contextualActions?.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onContextualAction?.(action.id)}
                    className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      action.variant === 'primary' 
                        ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        : action.variant === 'danger'
                        ? 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
                    }`}
                    aria-describedby={action.icon ? undefined : `action-${action.id}-description`}
                  >
                    {action.icon && (
                      <i 
                        className={`${action.icon} mr-2 h-4 w-4`}
                        aria-hidden="true"
                      ></i>
                    )}
                    {action.label}
                    {!action.icon && (
                      <span id={`action-${action.id}-description`} className="sr-only">
                        {action.label} action button
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${config.layout === 'split' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {/* Main Content */}
          <div className={`${config.layout === 'split' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            {/* Progress Indicator */}
            {config.showProgress !== false && template.stages && (
              <div className="mb-8">
                <AccessibleStageProgress
                  template={template}
                  currentStage={currentStageId}
                  currentStep={currentStepId}
                  onStageClick={appConfig.accessibility.enableKeyboardNavigation ? 
                    (stageId) => handleStageStepChange(stageId, template.stages.find(s => s.id === stageId)?.steps[0]?.id || '') 
                    : undefined
                  }
                />
              </div>
            )}

            {/* Case Form */}
            <div className="bg-white shadow rounded-lg">
              <CaseFlowRenderer
                template={template}
                mode={mode}
                data={data}
                onChange={onChange}
                onAction={(actionId, data) => {
                  const action = step?.actions?.find(a => a.id === actionId);
                  if (action) handleActionClick(action);
                }}
                currentStage={currentStageId}
                currentStep={currentStepId}
                onStageStepChange={handleStageStepChange}
              />
            </div>

            {/* Step Actions */}
            {config.showActions !== false && (
              <div className="mt-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 
                    className="text-lg font-medium text-gray-900 mb-4"
                    id="case-actions"
                  >
                    Available Actions
                  </h3>
                  <div className="flex flex-wrap gap-3" role="group" aria-labelledby="case-actions">
                    {getVisibleActions().map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          ['submit_for_review', 'submit_for_approval'].includes(action.id)
                            ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            : action.id === 'save_draft'
                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
                            : 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        }`}
                        aria-describedby={`action-${action.id}-description`}
                      >
                        {action.label}
                        <span id={`action-${action.id}-description`} className="sr-only">
                          {action.label} - {action.type === 'submit' ? 'Submit action' : 'Processing action'}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {getVisibleActions().length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No actions available at this step.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - existing code remains the same */}
          <div className="lg:col-span-1">
            {/* Case Metadata */}
            {config.showMetadata !== false && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Case Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created By</dt>
                    <dd className="text-sm text-gray-900">{metadata.createdBy}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900">{formatDate(metadata.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Modified By</dt>
                    <dd className="text-sm text-gray-900">{metadata.lastModifiedBy}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                    <dd className="text-sm text-gray-900">{formatDate(metadata.lastModifiedAt)}</dd>
                  </div>

                  {/* SLA Information */}
                  {metadata.sla && (
                    <>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                        <dd className="text-sm text-gray-900">{formatDate(metadata.sla.dueDate)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Priority</dt>
                        <dd>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(metadata.sla.priority)}`}>
                            {metadata.sla.priority}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">SLA Status</dt>
                        <dd>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(metadata.sla.status)}`}>
                            {metadata.sla.status.replace('_', ' ')}
                          </span>
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            )}

            {/* Debug: User Roles */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">User Roles (Debug)</h4>
              <div className="flex flex-wrap gap-1">
                {userRoles.map(role => (
                  <span key={role} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-title"
          aria-describedby="confirmation-description"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <i 
                  className="ri-alert-line text-yellow-600 text-xl"
                  aria-hidden="true"
                ></i>
              </div>
              <h3 
                id="confirmation-title"
                className="text-lg font-medium text-gray-900 mt-4"
              >
                Confirm Action
              </h3>
              <div className="mt-2 px-7 py-3">
                <p 
                  id="confirmation-description"
                  className="text-sm text-gray-500"
                >
                  Are you sure you want to proceed with this action? This cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleConfirmAction(showConfirmation)}
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="mt-3 px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
