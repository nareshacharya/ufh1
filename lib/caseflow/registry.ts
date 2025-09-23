import { CaseTemplate } from './schema';

export async function getTemplate(caseTypeId: string): Promise<CaseTemplate | undefined> {
  if (caseTypeId === 'Ingredient') {
    return {
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
              id: 'primary_identification',
              name: 'Primary Identification',
              description: 'Core ingredient identification and naming conventions',
              fields: []
            },
            {
              id: 'regulatory_standards',
              name: 'Regulatory Standards',
              description: 'Compliance with international standards and regulations',
              fields: []
            },
            {
              id: 'physical_properties',
              name: 'Physical Properties',
              description: 'Basic physical characteristics and appearance',
              fields: []
            },
            {
              id: 'detailed_description',
              name: 'Detailed Description',
              description: 'Comprehensive description and classification details',
              fields: []
            }
          ]
        },
        {
          id: 'chemical',
          name: 'Chemical Composition',
          description: 'Detailed chemical analysis and composition data',
          icon: 'ri-test-tube-line',
          steps: [
            {
              id: 'chemical_data',
              name: 'Chemical Data',
              description: 'Molecular structure and chemical properties',
              fields: []
            },
            {
              id: 'thermal_properties',
              name: 'Thermal Properties',
              description: 'Temperature-related properties and stability',
              fields: []
            },
            {
              id: 'quality_specifications',
              name: 'Quality Specifications',
              description: 'Quality parameters and acceptance criteria',
              fields: []
            }
          ]
        },
        {
          id: 'supply',
          name: 'Supplier & Sourcing',
          description: 'Supplier information and procurement details',
          icon: 'ri-truck-line',
          steps: [
            {
              id: 'primary_supplier',
              name: 'Primary Supplier',
              description: 'Main supplier information and contact details',
              fields: []
            },
            {
              id: 'alternative_suppliers',
              name: 'Alternative Suppliers',
              description: 'Backup suppliers and sourcing options',
              fields: []
            }
          ]
        },
        {
          id: 'compliance',
          name: 'Regulatory & Compliance',
          description: 'Safety data and regulatory compliance information',
          icon: 'ri-shield-check-line',
          steps: [
            {
              id: 'regulatory_compliance',
              name: 'Regulatory Compliance',
              description: 'Compliance with international regulations and standards',
              fields: []
            },
            {
              id: 'safety_toxicology',
              name: 'Safety & Toxicology',
              description: 'Safety data and toxicological information',
              fields: []
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
              id: 'comprehensive_review',
              name: 'Comprehensive Review',
              description: 'Final quality review and approval workflow',
              fields: []
            }
          ]
        }
      ]
    };
  }

  // Return a simple template for other case types
  const basicTemplate: CaseTemplate = {
    id: `${caseTypeId.toLowerCase()}_template_v1`,
    name: `${caseTypeId} Management`,
    description: `Complete workflow for ${caseTypeId.toLowerCase()} management`,
    caseTypeId: caseTypeId,
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
        description: `Essential ${caseTypeId.toLowerCase()} information`,
        icon: 'ri-flask-line',
        steps: [
          {
            id: 'identification',
            name: 'Identification',
            description: `Basic ${caseTypeId.toLowerCase()} identification`,
            fields: [
              {
                id: 'name',
                name: `${caseTypeId} Name`,
                type: 'text',
                required: true,
                placeholder: `Enter ${caseTypeId.toLowerCase()} name`
              },
              {
                id: 'description',
                name: 'Description',
                type: 'textarea',
                required: false,
                placeholder: 'Enter description'
              }
            ]
          }
        ]
      }
    ]
  };

  return basicTemplate;
}

export async function getAllTemplates(): Promise<CaseTemplate[]> {
  return [];
}

export async function getTemplatesByCategory(category: string): Promise<CaseTemplate[]> {
  return [];
}

export function validateTemplate(template: CaseTemplate): { isValid: boolean; errors: string[] } {
  return { isValid: true, errors: [] };
}