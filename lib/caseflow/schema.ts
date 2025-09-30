
import { z } from 'zod';

export type ViewMode = 'create' | 'view' | 'edit';

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'multiselect' 
  | 'richtext' 
  | 'attachment' 
  | 'table'
  | 'date'
  | 'boolean'
  | 'textarea'
  | 'checkbox';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  disabled?: boolean;
  value?: string; // For default values in table columns
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  pattern?: string; // Top-level pattern support
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: SelectOption[];
  columns?: TableColumn[];
  defaultValue?: any;
  disabled?: boolean;
  conditional?: {
    field: string;
    value: any;
    operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  };
}

export interface FieldOverride {
  fieldId: string;
  label?: string;
  helpText?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: Field['validation'];
  options?: SelectOption[];
  defaultValue?: any;
}

export interface FieldSet {
  id: string;
  name: string;
  description?: string;
  fields: Field[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface Action {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  icon?: string;
  disabled?: boolean;
  roles?: string[];
  visibilityCondition?: (caseData: CaseData) => boolean;
  payloadMap?: Record<string, string>; // template fieldId → DX fieldId
  resultTransition?: 'advance' | 'stay' | `goto:${string}`;
  confirmation?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
}

export interface StepInclude {
  catalogId: string;
  fieldOverrides?: FieldOverride[];
}

export interface Step {
  id: string;
  name: string;
  description?: string;
  // Either define fieldSets directly OR use includes
  fieldSets?: FieldSet[];
  include?: StepInclude[];
  actions: Action[];
  validation?: {
    required: string[];
    custom?: (data: any) => string | null;
  };
  conditional?: {
    field: string;
    value: any;
    operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  };
}

export interface Stage {
  id: string;
  name: string;
  description?: string;
  steps: Step[];
  icon?: string;
  optional?: boolean;
}

export interface CaseTemplate {
  id: string;
  name: string;
  description?: string;
  caseTypeId: string;
  version: string;
  stages: Stage[];
  metadata?: {
    category?: string;
    tags?: string[];
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
  };
  settings?: {
    allowSaveAsDraft?: boolean;
    requireAllStages?: boolean;
    enableAutosave?: boolean;
    autosaveInterval?: number;
  };
}

export interface CaseData {
  [fieldId: string]: any;
}

export interface CaseFlowState {
  currentStageIndex: number;
  currentStepIndex: number;
  data: CaseData;
  errors: Record<string, string>;
  isDirty: boolean;
  isValid: boolean;
  completedSteps: Set<string>;
}

export interface CaseFlowProps {
  template: CaseTemplate;
  mode: ViewMode;
  data?: CaseData;
  onChange?: (data: CaseData) => void;
  onAction?: (actionId: string, data: CaseData) => void;
  onStageChange?: (stageIndex: number) => void;
  onStepChange?: (stepIndex: number) => void;
}

// Zod schemas for validation
export const SelectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional()
});

export const TableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'select', 'multiselect', 'richtext', 'attachment', 'table', 'date', 'boolean', 'textarea', 'checkbox']),
  required: z.boolean().optional(),
  options: z.array(SelectOptionSchema).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional()
  }).optional(),
  disabled: z.boolean().optional(),
  value: z.string().optional()
});

export const FieldSchema = z.object({
  id: z.string().min(1, 'Field ID is required'),
  label: z.string().min(1, 'Field label is required'),
  type: z.enum(['text', 'number', 'select', 'multiselect', 'richtext', 'attachment', 'table', 'date', 'boolean', 'textarea', 'checkbox']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  pattern: z.string().optional(),
  helpText: z.string().optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional()
  }).optional(),
  options: z.array(SelectOptionSchema).optional(),
  columns: z.array(TableColumnSchema).optional(),
  defaultValue: z.any().optional(),
  disabled: z.boolean().optional(),
  conditional: z.object({
    field: z.string(),
    value: z.any(),
    operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']).optional()
  }).optional()
});

export const FieldOverrideSchema = z.object({
  fieldId: z.string().min(1, 'Field ID is required for override'),
  label: z.string().optional(),
  helpText: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional()
  }).optional(),
  options: z.array(SelectOptionSchema).optional(),
  defaultValue: z.any().optional()
});

export const FieldSetSchema = z.object({
  id: z.string().min(1, 'FieldSet ID is required'),
  name: z.string().min(1, 'FieldSet name is required'),
  description: z.string().optional(),
  fields: z.array(FieldSchema).min(1, 'FieldSet must have at least one field'),
  collapsible: z.boolean().optional(),
  defaultExpanded: z.boolean().optional()
});

export const ActionSchema = z.object({
  id: z.string().min(1, 'Action ID is required'),
  label: z.string().min(1, 'Action label is required'),
  type: z.enum(['primary', 'secondary', 'danger']),
  icon: z.string().optional(),
  disabled: z.boolean().optional(),
  roles: z.array(z.string()).optional(),
  visibilityCondition: z.function().optional(),
  payloadMap: z.record(z.string(), z.string()).optional(),
  resultTransition: z.union([
    z.literal('advance'),
    z.literal('stay'),
    z.string().regex(/^goto:.+/, 'Result transition must be "advance", "stay", or "goto:<stepId>"')
  ]).optional(),
  confirmation: z.object({
    title: z.string(),
    message: z.string(),
    confirmText: z.string().optional(),
    cancelText: z.string().optional()
  }).optional()
});

export const StepIncludeSchema = z.object({
  catalogId: z.string().min(1, 'Catalog ID is required for include'),
  fieldOverrides: z.array(FieldOverrideSchema).optional()
});

export const StepSchema = z.object({
  id: z.string().min(1, 'Step ID is required'),
  name: z.string().min(1, 'Step name is required'),
  description: z.string().optional(),
  fieldSets: z.array(FieldSetSchema).optional(),
  include: z.array(StepIncludeSchema).optional(),
  actions: z.array(ActionSchema).min(1, 'Step must have at least one action'),
  validation: z.object({
    required: z.array(z.string()),
    custom: z.function().optional()
  }).optional(),
  conditional: z.object({
    field: z.string(),
    value: z.any(),
    operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']).optional()
  }).optional()
}).refine(
  (step) => (step.fieldSets && step.fieldSets.length > 0) || (step.include && step.include.length > 0),
  { message: 'Step must have either fieldSets or include declarations' }
);

export const StageSchema = z.object({
  id: z.string().min(1, 'Stage ID is required'),
  name: z.string().min(1, 'Stage name is required'),
  description: z.string().optional(),
  steps: z.array(StepSchema).min(1, 'Stage must have at least one step'),
  icon: z.string().optional(),
  optional: z.boolean().optional()
});

export const CaseTemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  caseTypeId: z.string().min(1, 'Case type ID is required'),
  version: z.string().min(1, 'Template version is required'),
  stages: z.array(StageSchema).min(1, 'Template must have at least one stage'),
  metadata: z.object({
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    createdBy: z.string().optional(),
    createdAt: z.string().optional(),
    updatedBy: z.string().optional(),
    updatedAt: z.string().optional()
  }).optional(),
  settings: z.object({
    allowSaveAsDraft: z.boolean().optional(),
    requireAllStages: z.boolean().optional(),
    enableAutosave: z.boolean().optional(),
    autosaveInterval: z.number().optional()
  }).optional()
});

// Template validation results
export interface TemplateValidationError {
  path: string;
  message: string;
  code: string;
}

export interface TemplateValidationResult {
  isValid: boolean;
  errors: TemplateValidationError[];
  warnings: string[];
}

// Utility functions
export function isFieldVisible(field: Field, data: CaseData): boolean {
  if (!field.conditional) return true;
  
  const { field: conditionField, value: conditionValue, operator = 'equals' } = field.conditional;
  const fieldValue = data[conditionField];
  
  switch (operator) {
    case 'equals':
      return fieldValue === conditionValue;
    case 'not_equals':
      return fieldValue !== conditionValue;
    case 'contains':
      return Array.isArray(fieldValue) ? fieldValue.includes(conditionValue) : false;
    case 'greater_than':
      return typeof fieldValue === 'number' && fieldValue > conditionValue;
    case 'less_than':
      return typeof fieldValue === 'number' && fieldValue < conditionValue;
    default:
      return true;
  }
}

export function isStepVisible(step: Step, data: CaseData): boolean {
  if (!step.conditional) return true;
  
  const { field: conditionField, value: conditionValue, operator = 'equals' } = step.conditional;
  const fieldValue = data[conditionField];
  
  switch (operator) {
    case 'equals':
      return fieldValue === conditionValue;
    case 'not_equals':
      return fieldValue !== conditionValue;
    case 'contains':
      return Array.isArray(fieldValue) ? fieldValue.includes(conditionValue) : false;
    case 'greater_than':
      return typeof fieldValue === 'number' && fieldValue > conditionValue;
    case 'less_than':
      return typeof fieldValue === 'number' && fieldValue < conditionValue;
    default:
      return true;
  }
}

export function isActionVisible(action: Action, data: CaseData, userRoles?: string[]): boolean {
  // Check role-based visibility first
  if (action.roles && action.roles.length > 0 && userRoles) {
    const hasRequiredRole = action.roles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      return false;
    }
  }

  // Check visibility condition
  if (action.visibilityCondition && !action.visibilityCondition(data)) {
    return false;
  }

  return true;
}

export function validateField(field: Field, value: any): string | null {
  if (field.required && (value === undefined || value === null || value === '')) {
    return `${field.label} is required`;
  }
  
  if (field.validation && value) {
    const { min, max, pattern, message } = field.validation;
    
    if (min !== undefined && typeof value === 'number' && value < min) {
      return message || `${field.label} must be at least ${min}`;
    }
    
    if (max !== undefined && typeof value === 'number' && value > max) {
      return message || `${field.label} must be at most ${max}`;
    }
    
    if (min !== undefined && typeof value === 'string' && value.length < min) {
      return message || `${field.label} must be at least ${min} characters`;
    }
    
    if (max !== undefined && typeof value === 'string' && value.length > max) {
      return message || `${field.label} must be at most ${max} characters`;
    }
    
    if (pattern && typeof value === 'string' && !new RegExp(pattern).test(value)) {
      return message || `${field.label} format is invalid`;
    }
  }
  
  return null;
}

export function validateStep(step: Step, data: CaseData): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (step.validation?.required) {
    for (const fieldId of step.validation.required) {
      if (!data[fieldId] || data[fieldId] === '') {
        // Find field in resolved fieldSets to get proper label
        const allFields = getStepFields(step);
        const field = allFields.find(f => f.id === fieldId);
        errors[fieldId] = `${field?.label || fieldId} is required`;
      }
    }
  }
  
  // Validate all visible fields in resolved fieldSets
  const allFields = getStepFields(step);
  for (const field of allFields) {
    if (isFieldVisible(field, data)) {
      const error = validateField(field, data[field.id]);
      if (error) {
        errors[field.id] = error;
      }
    }
  }
  
  if (step.validation?.custom) {
    const customError = step.validation.custom(data);
    if (customError) {
      errors._step = customError;
    }
  }
  
  return errors;
}

// Helper function to get all fields from a step (including resolved includes)
export function getStepFields(step: Step): Field[] {
  // This is a placeholder - actual implementation will be in the template processor
  // For now, return fields from direct fieldSets
  return step.fieldSets?.flatMap(fs => fs.fields) || [];
}

// Apply field overrides to a field
export function applyFieldOverrides(field: Field, overrides: FieldOverride[]): Field {
  const override = overrides.find(o => o.fieldId === field.id);
  if (!override) return field;
  
  return {
    ...field,
    ...(override.label && { label: override.label }),
    ...(override.helpText && { helpText: override.helpText }),
    ...(override.placeholder && { placeholder: override.placeholder }),
    ...(override.required !== undefined && { required: override.required }),
    ...(override.disabled !== undefined && { disabled: override.disabled }),
    ...(override.validation && { validation: { ...field.validation, ...override.validation } }),
    ...(override.options && { options: override.options }),
    ...(override.defaultValue !== undefined && { defaultValue: override.defaultValue })
  };
}

// Map template fields to DX payload using action's payloadMap
export function mapActionPayload(action: Action, caseData: CaseData): Record<string, any> {
  if (!action.payloadMap) {
    return caseData;
  }

  const payload: Record<string, any> = {};
  
  for (const [templateFieldId, dxFieldId] of Object.entries(action.payloadMap)) {
    if (caseData[templateFieldId] !== undefined) {
      payload[dxFieldId] = caseData[templateFieldId];
    }
  }

  return payload;
}

// Parse transition target from action
export function parseTransitionTarget(transition?: string): { type: 'advance' | 'stay' | 'goto'; target?: string } {
  if (!transition) {
    return { type: 'stay' };
  }

  if (transition === 'advance') {
    return { type: 'advance' };
  }

  if (transition === 'stay') {
    return { type: 'stay' };
  }

  if (transition.startsWith('goto:')) {
    return { type: 'goto', target: transition.substring(5) };
  }

  return { type: 'stay' };
}
