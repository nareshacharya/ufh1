
import React from 'react';
import { CaseTemplate, FieldSet, Field, Step, Stage } from './schema';

interface CaseFlowRendererProps {
  template: CaseTemplate;
  mode: 'create' | 'edit' | 'view';
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onAction?: (actionId: string, data: Record<string, any>) => void;
  currentStage: string;
  currentStep: string;
  onStageStepChange?: (stageId: string, stepId: string) => void;
  disabled?: boolean;
}

export function CaseFlowRenderer({
  template,
  mode,
  data,
  onChange,
  onAction,
  currentStage,
  currentStep,
  onStageStepChange,
  disabled = false
}: CaseFlowRendererProps) {
  // Find current stage and step objects
  const stage = template.stages?.find(s => s.id === currentStage);
  const step = stage?.steps?.find(s => s.id === currentStep);

  if (!stage || !step) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Invalid stage or step configuration</p>
      </div>
    );
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    if (disabled) return;
    onChange({ [fieldId]: value });
  };

  const handleActionClick = (actionId: string) => {
    if (disabled) return;
    onAction?.(actionId, data);
  };

  const handleStageClick = (stageId: string) => {
    if (disabled) return;
    const targetStage = template.stages?.find(s => s.id === stageId);
    const firstStep = targetStage?.steps?.[0];
    if (firstStep) {
      onStageStepChange?.(stageId, firstStep.id);
    }
  };

  const handleStepClick = (stepId: string) => {
    if (disabled) return;
    onStageStepChange?.(currentStage, stepId);
  };

  return (
    <div className="case-flow-renderer">
      {/* Stage Progress */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {template.stages?.map((stageItem, index) => (
            <div
              key={stageItem.id}
              className={`flex flex-col items-center cursor-pointer ${
                stageItem.id === currentStage
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              onClick={() => handleStageClick(stageItem.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  stageItem.id === currentStage
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-sm font-medium">{stageItem.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Navigation */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex space-x-6">
          {stage.steps?.map((stepItem) => (
            <button
              key={stepItem.id}
              onClick={() => handleStepClick(stepItem.id)}
              disabled={disabled}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                stepItem.id === currentStep
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {stepItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{step.label}</h2>
          {step.description && (
            <p className="mt-2 text-gray-600">{step.description}</p>
          )}
        </div>

        {/* Render field sets */}
        <div className="space-y-8">
          {step.fieldSets?.map((fieldSet, fieldSetIndex) => (
            <FieldSetRenderer
              key={fieldSetIndex}
              fieldSet={fieldSet}
              data={data}
              onChange={handleFieldChange}
              mode={mode}
              disabled={disabled}
            />
          ))}
        </div>

        {/* Actions */}
        {step.actions && step.actions.length > 0 && (
          <div className="mt-8 flex justify-end space-x-3">
            {step.actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                disabled={disabled}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  action.id === 'submit' || action.id === 'create'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FieldSetRenderer({
  fieldSet,
  data,
  onChange,
  mode,
  disabled
}: {
  fieldSet: FieldSet;
  data: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
  mode: 'create' | 'edit' | 'view';
  disabled: boolean;
}) {
  return (
    <div className="fieldset">
      {fieldSet.label && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{fieldSet.label}</h3>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {fieldSet.fields?.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={data[field.id]}
            onChange={(value) => onChange(field.id, value)}
            mode={mode}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  mode,
  disabled
}: {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  mode: 'create' | 'edit' | 'view';
  disabled: boolean;
}) {
  const isReadOnly = mode === 'view' || disabled;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (isReadOnly) return;
    
    const newValue = field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <input
            type={field.type}
            id={field.id}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isReadOnly ? 'bg-gray-50 text-gray-500' : ''
            }`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isReadOnly ? 'bg-gray-50 text-gray-500' : ''
            }`}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            rows={4}
            readOnly={isReadOnly}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isReadOnly ? 'bg-gray-50 text-gray-500' : ''
            }`}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value || ''}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isReadOnly ? 'bg-gray-50 text-gray-500' : ''
            }`}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={isReadOnly}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={field.id} className="ml-2 block text-sm text-gray-900">
              {field.label}
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isReadOnly ? 'bg-gray-50 text-gray-500' : ''
            }`}
          />
        );
    }
  };

  if (field.type === 'checkbox') {
    return (
      <div className="field-wrapper">
        {renderInput()}
        {field.helpText && (
          <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="field-wrapper">
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {field.helpText && (
        <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}
