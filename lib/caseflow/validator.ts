
import { z } from 'zod';
import { 
  CaseTemplate, 
  CaseTemplateSchema, 
  TemplateValidationError, 
  TemplateValidationResult,
  Step,
  Stage,
  Action,
  Field,
  FieldSet
} from './schema';
import { CATALOG_FIELD_SETS } from './catalog';

export class TemplateValidator {
  private errors: TemplateValidationError[] = [];
  private warnings: string[] = [];

  validate(template: CaseTemplate): TemplateValidationResult {
    this.errors = [];
    this.warnings = [];

    // First, validate basic schema structure
    try {
      CaseTemplateSchema.parse(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.errors.push(...error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
          code: e.code
        })));
      }
    }

    // Additional semantic validation
    this.validateUniqueIds(template);
    this.validateFieldReferences(template);
    this.validateIncludeReferences(template);
    this.validateActionIds(template);
    this.validateRequiredFieldsExist(template);
    this.validateConditionalReferences(template);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  private validateUniqueIds(template: CaseTemplate): void {
    const stageIds = new Set<string>();
    const stepIds = new Set<string>();
    const fieldSetIds = new Set<string>();
    const fieldIds = new Set<string>();

    template.stages.forEach((stage, stageIndex) => {
      // Check unique stage IDs
      if (stageIds.has(stage.id)) {
        this.errors.push({
          path: `stages[${stageIndex}].id`,
          message: `Duplicate stage ID: ${stage.id}`,
          code: 'duplicate_id'
        });
      }
      stageIds.add(stage.id);

      stage.steps.forEach((step, stepIndex) => {
        // Check unique step IDs within template
        if (stepIds.has(step.id)) {
          this.errors.push({
            path: `stages[${stageIndex}].steps[${stepIndex}].id`,
            message: `Duplicate step ID: ${step.id}`,
            code: 'duplicate_id'
          });
        }
        stepIds.add(step.id);

        // Check fieldSets if defined directly
        if (step.fieldSets) {
          step.fieldSets.forEach((fieldSet, fieldSetIndex) => {
            if (fieldSetIds.has(fieldSet.id)) {
              this.errors.push({
                path: `stages[${stageIndex}].steps[${stepIndex}].fieldSets[${fieldSetIndex}].id`,
                message: `Duplicate fieldSet ID: ${fieldSet.id}`,
                code: 'duplicate_id'
              });
            }
            fieldSetIds.add(fieldSet.id);

            fieldSet.fields.forEach((field, fieldIndex) => {
              if (fieldIds.has(field.id)) {
                this.errors.push({
                  path: `stages[${stageIndex}].steps[${stepIndex}].fieldSets[${fieldSetIndex}].fields[${fieldIndex}].id`,
                  message: `Duplicate field ID: ${field.id}`,
                  code: 'duplicate_id'
                });
              }
              fieldIds.add(field.id);
            });
          });
        }
      });
    });
  }

  private validateFieldReferences(template: CaseTemplate): void {
    const allFields = this.getAllFieldsFromTemplate(template);
    const fieldIds = new Set(allFields.map(f => f.id));

    template.stages.forEach((stage, stageIndex) => {
      stage.steps.forEach((step, stepIndex) => {
        // Check conditional field references
        if (step.conditional?.field && !fieldIds.has(step.conditional.field)) {
          this.errors.push({
            path: `stages[${stageIndex}].steps[${stepIndex}].conditional.field`,
            message: `Referenced field '${step.conditional.field}' does not exist`,
            code: 'invalid_field_reference'
          });
        }

        // Check field conditionals
        const stepFields = this.getFieldsFromStep(step);
        stepFields.forEach((field, fieldIndex) => {
          if (field.conditional?.field && !fieldIds.has(field.conditional.field)) {
            this.errors.push({
              path: `stages[${stageIndex}].steps[${stepIndex}].fields[${fieldIndex}].conditional.field`,
              message: `Field '${field.id}' references non-existent field '${field.conditional.field}'`,
              code: 'invalid_field_reference'
            });
          }
        });
      });
    });
  }

  private validateIncludeReferences(template: CaseTemplate): void {
    template.stages.forEach((stage, stageIndex) => {
      stage.steps.forEach((step, stepIndex) => {
        if (step.include) {
          step.include.forEach((include, includeIndex) => {
            // Check if catalog fieldSet exists
            if (!CATALOG_FIELD_SETS[include.catalogId]) {
              this.errors.push({
                path: `stages[${stageIndex}].steps[${stepIndex}].include[${includeIndex}].catalogId`,
                message: `Catalog fieldSet '${include.catalogId}' does not exist`,
                code: 'invalid_catalog_reference'
              });
            } else {
              // Validate field overrides reference existing fields
              const catalogFieldSet = CATALOG_FIELD_SETS[include.catalogId];
              const catalogFieldIds = new Set(catalogFieldSet.fields.map(f => f.id));

              if (include.fieldOverrides) {
                include.fieldOverrides.forEach((override, overrideIndex) => {
                  if (!catalogFieldIds.has(override.fieldId)) {
                    this.errors.push({
                      path: `stages[${stageIndex}].steps[${stepIndex}].include[${includeIndex}].fieldOverrides[${overrideIndex}].fieldId`,
                      message: `Field override references non-existent field '${override.fieldId}' in catalog '${include.catalogId}'`,
                      code: 'invalid_override_reference'
                    });
                  }
                });
              }
            }
          });
        }
      });
    });
  }

  private validateActionIds(template: CaseTemplate): void {
    const actionIds = new Set<string>();

    template.stages.forEach((stage, stageIndex) => {
      stage.steps.forEach((step, stepIndex) => {
        step.actions.forEach((action, actionIndex) => {
          const actionKey = `${stage.id}.${step.id}.${action.id}`;
          if (actionIds.has(actionKey)) {
            this.errors.push({
              path: `stages[${stageIndex}].steps[${stepIndex}].actions[${actionIndex}].id`,
              message: `Duplicate action ID '${action.id}' in step '${step.id}'`,
              code: 'duplicate_action_id'
            });
          }
          actionIds.add(actionKey);
        });
      });
    });
  }

  private validateRequiredFieldsExist(template: CaseTemplate): void {
    template.stages.forEach((stage, stageIndex) => {
      stage.steps.forEach((step, stepIndex) => {
        if (step.validation?.required) {
          const stepFields = this.getFieldsFromStep(step);
          const stepFieldIds = new Set(stepFields.map(f => f.id));

          step.validation.required.forEach((requiredFieldId, reqIndex) => {
            if (!stepFieldIds.has(requiredFieldId)) {
              this.errors.push({
                path: `stages[${stageIndex}].steps[${stepIndex}].validation.required[${reqIndex}]`,
                message: `Required field '${requiredFieldId}' does not exist in step '${step.id}'`,
                code: 'invalid_required_field'
              });
            }
          });
        }
      });
    });
  }

  private validateConditionalReferences(template: CaseTemplate): void {
    const allFields = this.getAllFieldsFromTemplate(template);
    const fieldIds = new Set(allFields.map(f => f.id));

    allFields.forEach((field) => {
      if (field.conditional?.field) {
        if (!fieldIds.has(field.conditional.field)) {
          this.errors.push({
            path: `field[${field.id}].conditional.field`,
            message: `Field '${field.id}' conditional references non-existent field '${field.conditional.field}'`,
            code: 'invalid_conditional_reference'
          });
        }

        // Warn about potential circular dependencies
        if (field.conditional.field === field.id) {
          this.warnings.push(`Field '${field.id}' has conditional reference to itself`);
        }
      }
    });
  }

  private getAllFieldsFromTemplate(template: CaseTemplate): Field[] {
    const fields: Field[] = [];
    
    template.stages.forEach(stage => {
      stage.steps.forEach(step => {
        fields.push(...this.getFieldsFromStep(step));
      });
    });
    
    return fields;
  }

  private getFieldsFromStep(step: Step): Field[] {
    const fields: Field[] = [];
    
    // Add fields from direct fieldSets
    if (step.fieldSets) {
      step.fieldSets.forEach(fieldSet => {
        fields.push(...fieldSet.fields);
      });
    }
    
    // Add fields from included catalog fieldSets
    if (step.include) {
      step.include.forEach(include => {
        const catalogFieldSet = CATALOG_FIELD_SETS[include.catalogId];
        if (catalogFieldSet) {
          // Apply overrides to catalog fields
          const resolvedFields = catalogFieldSet.fields.map(field => {
            if (include.fieldOverrides) {
              const override = include.fieldOverrides.find(o => o.fieldId === field.id);
              if (override) {
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
            }
            return field;
          });
          fields.push(...resolvedFields);
        }
      });
    }
    
    return fields;
  }
}

// Convenience function for validation
export function validateTemplate(template: CaseTemplate): TemplateValidationResult {
  const validator = new TemplateValidator();
  return validator.validate(template);
}

// Template processor to resolve includes and overrides
export function processTemplate(template: CaseTemplate): CaseTemplate {
  const processedTemplate: CaseTemplate = {
    ...template,
    stages: template.stages.map(stage => ({
      ...stage,
      steps: stage.steps.map(step => ({
        ...step,
        fieldSets: resolveStepFieldSets(step)
      }))
    }))
  };

  return processedTemplate;
}

function resolveStepFieldSets(step: Step): FieldSet[] {
  const fieldSets: FieldSet[] = [];
  
  // Add direct fieldSets
  if (step.fieldSets) {
    fieldSets.push(...step.fieldSets);
  }
  
  // Process includes
  if (step.include) {
    step.include.forEach(include => {
      const catalogFieldSet = CATALOG_FIELD_SETS[include.catalogId];
      if (catalogFieldSet) {
        // Apply field overrides
        const processedFields = catalogFieldSet.fields.map(field => {
          if (include.fieldOverrides) {
            const override = include.fieldOverrides.find(o => o.fieldId === field.id);
            if (override) {
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
          }
          return field;
        });

        fieldSets.push({
          ...catalogFieldSet,
          fields: processedFields
        });
      }
    });
  }
  
  return fieldSets;
}
