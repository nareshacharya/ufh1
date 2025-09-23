import { CaseTemplate } from '../schema';
import { CATALOG_FIELD_SETS } from '../catalog';

export const ingredientTemplate: CaseTemplate = {
  id: 'ingredient_template_v1',
  name: 'Ingredient Management',
  description: 'Complete workflow for ingredient registration, evaluation, and approval',
  caseTypeId: 'Ingredient',
  version: '1.0.0',
  settings: {
    allowSaveAsDraft: true,
    requireAllStages: false,
    enableAutosave: true,
    autosaveInterval: 30000
  },
  stages: [
    {
      id: 'basics',
      name: 'Basic Information',
      description: 'Essential ingredient identification and classification',
      icon: 'ri-flask-line',
      steps: [
        {
          id: 'identification',
          name: 'Identification',
          description: 'Basic ingredient identification and naming',
          fields: [
            {
              id: 'name',
              name: 'Ingredient Name',
              type: 'text',
              required: true,
              placeholder: 'Enter ingredient name',
              validation: {
                minLength: 2,
                maxLength: 100
              }
            },
            {
              id: 'cas_number',
              name: 'CAS Number',
              type: 'text',
              required: false,
              placeholder: 'Enter CAS number',
              validation: {
                pattern: '^[0-9]{2,7}-[0-9]{2}-[0-9]$'
              }
            },
            {
              id: 'inci_name',
              name: 'INCI Name',
              type: 'text',
              required: false,
              placeholder: 'Enter INCI name'
            },
            {
              id: 'category',
              name: 'Category',
              type: 'select',
              required: true,
              options: [
                { value: 'essential_oil', label: 'Essential Oil' },
                { value: 'absolute', label: 'Absolute' },
                { value: 'concrete', label: 'Concrete' },
                { value: 'resinoid', label: 'Resinoid' },
                { value: 'synthetic', label: 'Synthetic' },
                { value: 'natural_isolate', label: 'Natural Isolate' },
                { value: 'other', label: 'Other' }
              ]
            }
          ]
        },
        {
          id: 'classification',
          name: 'Classification',
          description: 'Detailed classification and properties',
          fields: [
            {
              id: 'molecular_weight',
              name: 'Molecular Weight',
              type: 'number',
              required: false,
              unit: 'g/mol',
              validation: {
                min: 0,
                max: 10000
              }
            },
            {
              id: 'boiling_point',
              name: 'Boiling Point',
              type: 'number',
              required: false,
              unit: '°C',
              validation: {
                min: -273,
                max: 1000
              }
            },
            {
              id: 'flash_point',
              name: 'Flash Point',
              type: 'number',
              required: false,
              unit: '°C',
              validation: {
                min: -273,
                max: 1000
              }
            },
            {
              id: 'solubility',
              name: 'Solubility',
              type: 'multiselect',
              required: false,
              options: [
                { value: 'water', label: 'Water' },
                { value: 'alcohol', label: 'Alcohol' },
                { value: 'oil', label: 'Oil' },
                { value: 'glycerin', label: 'Glycerin' },
                { value: 'propylene_glycol', label: 'Propylene Glycol' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'safety',
      name: 'Safety & Compliance',
      description: 'Safety data and regulatory compliance information',
      icon: 'ri-shield-check-line',
      steps: [
        {
          id: 'safety_data',
          name: 'Safety Data',
          description: 'Safety information and hazard classification',
          fields: [
            {
              id: 'hazard_classification',
              name: 'Hazard Classification',
              type: 'multiselect',
              required: false,
              options: [
                { value: 'flammable', label: 'Flammable' },
                { value: 'irritant', label: 'Irritant' },
                { value: 'sensitizer', label: 'Sensitizer' },
                { value: 'toxic', label: 'Toxic' },
                { value: 'environmental_hazard', label: 'Environmental Hazard' }
              ]
            },
            {
              id: 'precautionary_statements',
              name: 'Precautionary Statements',
              type: 'multiselect',
              required: false,
              options: [
                { value: 'keep_away_from_heat', label: 'Keep away from heat' },
                { value: 'avoid_contact_with_skin', label: 'Avoid contact with skin' },
                { value: 'use_in_well_ventilated_area', label: 'Use in well ventilated area' },
                { value: 'wear_protective_equipment', label: 'Wear protective equipment' }
              ]
            },
            {
              id: 'ifra_category',
              name: 'IFRA Category',
              type: 'select',
              required: false,
              options: [
                { value: '1', label: 'Category 1' },
                { value: '2', label: 'Category 2' },
                { value: '3', label: 'Category 3' },
                { value: '4', label: 'Category 4' },
                { value: '5', label: 'Category 5' },
                { value: '6', label: 'Category 6' },
                { value: '7', label: 'Category 7' },
                { value: '8', label: 'Category 8' },
                { value: '9', label: 'Category 9' },
                { value: '10', label: 'Category 10' },
                { value: '11', label: 'Category 11' }
              ]
            },
            {
              id: 'restriction_level',
              name: 'Restriction Level',
              type: 'select',
              required: false,
              options: [
                { value: 'unrestricted', label: 'Unrestricted' },
                { value: 'restricted', label: 'Restricted' },
                { value: 'prohibited', label: 'Prohibited' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'supply',
      name: 'Supply Chain',
      description: 'Supplier information and procurement details',
      icon: 'ri-truck-line',
      steps: [
        {
          id: 'supplier_info',
          name: 'Supplier Information',
          description: 'Primary supplier and procurement details',
          fields: [
            {
              id: 'primary_supplier',
              name: 'Primary Supplier',
              type: 'text',
              required: true,
              placeholder: 'Enter supplier name'
            },
            {
              id: 'supplier_contact',
              name: 'Supplier Contact',
              type: 'text',
              required: false,
              placeholder: 'Enter contact person'
            },
            {
              id: 'supplier_email',
              name: 'Supplier Email',
              type: 'email',
              required: false,
              placeholder: 'Enter email address'
            },
            {
              id: 'supplier_phone',
              name: 'Supplier Phone',
              type: 'tel',
              required: false,
              placeholder: 'Enter phone number'
            },
            {
              id: 'minimum_order_quantity',
              name: 'Minimum Order Quantity',
              type: 'number',
              required: false,
              unit: 'kg',
              validation: {
                min: 0
              }
            },
            {
              id: 'lead_time_days',
              name: 'Lead Time',
              type: 'number',
              required: false,
              unit: 'days',
              validation: {
                min: 0,
                max: 365
              }
            }
          ]
        }
      ]
    },
    {
      id: 'quality',
      name: 'Quality Control',
      description: 'Quality specifications and testing requirements',
      icon: 'ri-test-tube-line',
      steps: [
        {
          id: 'specifications',
          name: 'Quality Specifications',
          description: 'Quality parameters and acceptance criteria',
          fields: [
            {
              id: 'appearance',
              name: 'Appearance',
              type: 'text',
              required: false,
              placeholder: 'Describe appearance'
            },
            {
              id: 'color',
              name: 'Color',
              type: 'text',
              required: false,
              placeholder: 'Describe color'
            },
            {
              id: 'odor_description',
              name: 'Odor Description',
              type: 'textarea',
              required: false,
              placeholder: 'Describe odor characteristics',
              validation: {
                maxLength: 500
              }
            },
            {
              id: 'specific_gravity',
              name: 'Specific Gravity',
              type: 'number',
              required: false,
              validation: {
                min: 0,
                max: 10
              }
            },
            {
              id: 'refractive_index',
              name: 'Refractive Index',
              type: 'number',
              required: false,
              validation: {
                min: 1,
                max: 2
              }
            },
            {
              id: 'optical_rotation',
              name: 'Optical Rotation',
              type: 'number',
              required: false,
              unit: 'degrees',
              validation: {
                min: -180,
                max: 180
              }
            }
          ]
        }
      ]
    },
    {
      id: 'approval',
      name: 'Review & Approval',
      description: 'Final review and approval process',
      icon: 'ri-check-line',
      steps: [
        {
          id: 'review',
          name: 'Quality Review',
          description: 'Quality team review and approval',
          fields: [
            {
              id: 'quality_reviewer',
              name: 'Quality Reviewer',
              type: 'text',
              required: true,
              placeholder: 'Enter reviewer name'
            },
            {
              id: 'review_date',
              name: 'Review Date',
              type: 'date',
              required: true
            },
            {
              id: 'review_notes',
              name: 'Review Notes',
              type: 'textarea',
              required: false,
              placeholder: 'Enter review comments',
              validation: {
                maxLength: 1000
              }
            },
            {
              id: 'approval_status',
              name: 'Approval Status',
              type: 'select',
              required: true,
              options: [
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'pending', label: 'Pending' },
                { value: 'requires_changes', label: 'Requires Changes' }
              ]
            }
          ]
        }
      ]
    }
  ]
};
