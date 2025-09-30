
import { CaseTemplate } from './schema';
import { CATALOG_FIELD_SETS } from './catalog';
import { validateTemplate } from './validator';

// Chrome configuration interface
export interface CaseChromeConfig {
  showRightRail?: boolean;
  showBreadcrumb?: boolean;
  showStatusChip?: boolean;
  showStageProgress?: boolean;
  layout?: 'default' | 'split';
  showProgress?: boolean;
  showActions?: boolean;
  showMetadata?: boolean;
  contextualActions?: {
    id: string;
    label: string;
    icon?: string;
    variant: 'primary' | 'secondary' | 'danger';
  }[];
  metadata?: {
    showCreatedBy?: boolean;
    showOwner?: boolean;
    showSLA?: boolean;
    showLastModified?: boolean;
    showVersion?: boolean;
  };
}

// Chrome configurations for different case types
export const CASE_CHROME_CONFIGS: Record<string, CaseChromeConfig> = {
  Ingredient: {
    showRightRail: true,
    showBreadcrumb: true,
    showStatusChip: true,
    showStageProgress: true,
    contextualActions: [
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: 'ri-file-copy-line',
        variant: 'secondary'
      },
      {
        id: 'export',
        label: 'Export',
        icon: 'ri-download-line',
        variant: 'secondary'
      },
      {
        id: 'edit',
        label: 'Edit',
        icon: 'ri-edit-line',
        variant: 'primary'
      }
    ],
    metadata: {
      showCreatedBy: true,
      showOwner: true,
      showSLA: true,
      showLastModified: true,
      showVersion: true
    }
  },
  Project: {
    showRightRail: true,
    showBreadcrumb: true,
    showStatusChip: true,
    showStageProgress: true,
    contextualActions: [
      {
        id: 'assign_team',
        label: 'Assign Team',
        icon: 'ri-team-line',
        variant: 'secondary'
      },
      {
        id: 'create_milestone',
        label: 'Add Milestone',
        icon: 'ri-flag-line',
        variant: 'secondary'
      },
      {
        id: 'edit',
        label: 'Edit',
        icon: 'ri-edit-line',
        variant: 'primary'
      }
    ],
    metadata: {
      showCreatedBy: true,
      showOwner: true,
      showSLA: true,
      showLastModified: true,
      showVersion: true
    }
  },
  Compliance: {
    showRightRail: true,
    showBreadcrumb: true,
    showStatusChip: true,
    showStageProgress: true,
    contextualActions: [
      {
        id: 'download_report',
        label: 'Download Report',
        icon: 'ri-download-line',
        variant: 'secondary'
      },
      {
        id: 'print_report',
        label: 'Print Report',
        icon: 'ri-printer-line',
        variant: 'secondary'
      },
      {
        id: 'export_pdf',
        label: 'Export PDF',
        icon: 'ri-file-pdf-line',
        variant: 'primary'
      }
    ],
    metadata: {
      showCreatedBy: true,
      showOwner: true,
      showSLA: true,
      showLastModified: true,
      showVersion: true
    }
  },
  Formula: {
    showRightRail: true,
    showBreadcrumb: true,
    showStatusChip: true,
    showStageProgress: true,
    contextualActions: [
      {
        id: 'calculate_cost',
        label: 'Calculate Cost',
        icon: 'ri-calculator-line',
        variant: 'secondary'
      },
      {
        id: 'validate_compliance',
        label: 'Check Compliance',
        icon: 'ri-shield-check-line',
        variant: 'secondary'
      },
      {
        id: 'export_formula',
        label: 'Export Formula',
        icon: 'ri-download-line',
        variant: 'primary'
      }
    ],
    metadata: {
      showCreatedBy: true,
      showOwner: true,
      showSLA: true,
      showLastModified: true,
      showVersion: true
    }
  }
};

// Case templates registry
const CASE_TEMPLATES: Record<string, CaseTemplate> = {
  Ingredient: {
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
            id: 'ingredient_identity',
            name: 'Primary Identification',
            description: 'Core ingredient identification data and naming conventions',
            fieldSets: [
              {
                id: 'primary_identification',
                name: 'Primary Identification',
                description: 'Core ingredient identification and naming',
                fields: [
                  {
                    id: 'name',
                    label: 'Ingredient Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter ingredient name',
                    helpText: 'Primary commercial name of the ingredient'
                  },
                  {
                    id: 'code',
                    label: 'Internal Code',
                    type: 'text',
                    required: true,
                    placeholder: 'ING-001',
                    validation: {
                      pattern: '^ING-[0-9]{3,6}$',
                      message: 'Code must follow format: ING-000'
                    }
                  },
                  {
                    id: 'alternativeName',
                    label: 'Alternative Name',
                    type: 'text',
                    placeholder: 'Alternative or trade name'
                  },
                  {
                    id: 'iupacName',
                    label: 'IUPAC Name',
                    type: 'text',
                    placeholder: 'International Union of Pure and Applied Chemistry name'
                  },
                  {
                    id: 'tradeName',
                    label: 'Trade Name',
                    type: 'text',
                    placeholder: 'Commercial trade name'
                  },
                  {
                    id: 'synonyms',
                    label: 'Synonyms',
                    type: 'textarea',
                    placeholder: 'List all known synonyms (one per line)',
                    helpText: 'All known alternative names and synonyms'
                  }
                ]
              },
              {
                id: 'classification_category',
                name: 'Classification & Category',
                description: 'Ingredient classification and categorization',
                fields: [
                  {
                    id: 'primaryCategory',
                    label: 'Primary Category',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'essential_oil', label: 'Essential Oil' },
                      { value: 'synthetic_molecule', label: 'Synthetic Molecule' },
                      { value: 'natural_extract', label: 'Natural Extract' },
                      { value: 'natural_isolate', label: 'Natural Isolate' },
                      { value: 'accord_blend', label: 'Accord/Blend' },
                      { value: 'carrier_oil', label: 'Carrier Oil' },
                      { value: 'solvent', label: 'Solvent' },
                      { value: 'modifier', label: 'Modifier' }
                    ]
                  },
                  {
                    id: 'subCategory',
                    label: 'Sub-Category',
                    type: 'select',
                    options: [
                      { value: 'citrus', label: 'Citrus' },
                      { value: 'floral', label: 'Floral' },
                      { value: 'woody', label: 'Woody' },
                      { value: 'spicy', label: 'Spicy' },
                      { value: 'herbal', label: 'Herbal' },
                      { value: 'fruity', label: 'Fruity' },
                      { value: 'marine', label: 'Marine' },
                      { value: 'aldehydic', label: 'Aldehydic' },
                      { value: 'musk', label: 'Musk' },
                      { value: 'amber', label: 'Amber' }
                    ]
                  },
                  {
                    id: 'functionalGroup',
                    label: 'Functional Group',
                    type: 'select',
                    options: [
                      { value: 'top_note', label: 'Top Note' },
                      { value: 'middle_note', label: 'Middle Note' },
                      { value: 'base_note', label: 'Base Note' },
                      { value: 'modifier', label: 'Modifier' },
                      { value: 'fixative', label: 'Fixative' },
                      { value: 'diluent', label: 'Diluent' }
                    ]
                  },
                  {
                    id: 'originType',
                    label: 'Origin Type',
                    type: 'select',
                    options: [
                      { value: 'natural', label: 'Natural' },
                      { value: 'nature_identical', label: 'Nature Identical' },
                      { value: 'synthetic', label: 'Synthetic' },
                      { value: 'biotechnology', label: 'Biotechnology' }
                    ]
                  },
                  {
                    id: 'applicationArea',
                    label: 'Application Area',
                    type: 'multiselect',
                    options: [
                      { value: 'fine_fragrance', label: 'Fine Fragrance' },
                      { value: 'personal_care', label: 'Personal Care' },
                      { value: 'home_care', label: 'Home Care' },
                      { value: 'air_care', label: 'Air Care' },
                      { value: 'cosmetics', label: 'Cosmetics' }
                    ]
                  },
                  {
                    id: 'olfactoryFamily',
                    label: 'Olfactory Family',
                    type: 'select',
                    options: [
                      { value: 'fresh', label: 'Fresh' },
                      { value: 'floral', label: 'Floral' },
                      { value: 'oriental', label: 'Oriental' },
                      { value: 'woody', label: 'Woody' },
                      { value: 'fougere', label: 'Fougère' },
                      { value: 'chypre', label: 'Chypre' }
                    ]
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'next_step',
                label: 'Next: Regulatory Data',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['name', 'code', 'primaryCategory']
            }
          },
          {
            id: 'regulatory_standards',
            name: 'Regulatory & Standards',
            description: 'Regulatory identification numbers and compliance data',
            fieldSets: [
              {
                id: 'regulatory_identifiers',
                name: 'Regulatory Identifiers',
                description: 'Official regulatory and chemical identification numbers',
                fields: [
                  {
                    id: 'casNumber',
                    label: 'CAS Number',
                    type: 'text',
                    pattern: '^[0-9]{2,7}-[0-9]{2}-[0-9]$',
                    placeholder: '000000-00-0',
                    helpText: 'Chemical Abstracts Service registry number'
                  },
                  {
                    id: 'einecs',
                    label: 'EINECS Number',
                    type: 'text',
                    placeholder: '000-000-0',
                    helpText: 'European Inventory of Existing Commercial Chemical Substances'
                  },
                  {
                    id: 'femaNumber',
                    label: 'FEMA Number',
                    type: 'text',
                    placeholder: '0000',
                    helpText: 'Flavor and Extract Manufacturers Association number'
                  },
                  {
                    id: 'ceNumber',
                    label: 'CE Number',
                    type: 'text',
                    placeholder: '000-000-0',
                    helpText: 'European Community number'
                  },
                  {
                    id: 'reachStatus',
                    label: 'REACH Registration Status',
                    type: 'select',
                    options: [
                      { value: 'registered', label: 'Registered' },
                      { value: 'pre_registered', label: 'Pre-registered' },
                      { value: 'exempt', label: 'Exempt' },
                      { value: 'not_required', label: 'Not Required' },
                      { value: 'pending', label: 'Pending' }
                    ]
                  },
                  {
                    id: 'ifraStatus',
                    label: 'IFRA Status',
                    type: 'select',
                    options: [
                      { value: 'no_restrictions', label: 'No Known Restrictions' },
                      { value: 'restricted', label: 'Restricted Use' },
                      { value: 'prohibited', label: 'Prohibited' },
                      { value: 'specification', label: 'Under Specification' },
                      { value: 'not_assessed', label: 'Not Assessed' }
                    ]
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:ingredient_identity'
              },
              {
                id: 'next_step',
                label: 'Next: Physical Properties',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ]
          },
          {
            id: 'physical_properties',
            name: 'Physical Properties',
            description: 'Physical and organoleptic characteristics',
            fieldSets: [
              {
                id: 'basic_physical_properties',
                name: 'Basic Physical Properties',
                description: 'Fundamental physical characteristics',
                fields: [
                  {
                    id: 'physicalState',
                    label: 'Physical State',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'liquid', label: 'Liquid' },
                      { value: 'solid', label: 'Solid' },
                      { value: 'crystal', label: 'Crystalline' },
                      { value: 'powder', label: 'Powder' },
                      { value: 'paste', label: 'Paste' },
                      { value: 'wax', label: 'Waxy' }
                    ]
                  },
                  {
                    id: 'color',
                    label: 'Color',
                    type: 'text',
                    placeholder: 'Colorless, pale yellow, amber, etc.',
                    helpText: 'Visual color description'
                  },
                  {
                    id: 'odorDescription',
                    label: 'Odor Description',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Detailed olfactory description including intensity, character, and notes',
                    helpText: 'Comprehensive scent profile'
                  },
                  {
                    id: 'density',
                    label: 'Density (g/mL at 20°C)',
                    type: 'number',
                    validation: {
                      min: 0.1,
                      max: 10,
                      message: 'Density must be between 0.1 and 10 g/mL'
                    }
                  },
                  {
                    id: 'viscosity',
                    label: 'Viscosity (cP at 20°C)',
                    type: 'number',
                    helpText: 'Dynamic viscosity in centipoise'
                  },
                  {
                    id: 'refractiveIndex',
                    label: 'Refractive Index (nD20)',
                    type: 'number',
                    validation: {
                      min: 1.0,
                      max: 2.0,
                      message: 'Refractive index typically between 1.0 and 2.0'
                    }
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:regulatory_standards'
              },
              {
                id: 'next_step',
                label: 'Next: Description',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['physicalState', 'odorDescription']
            }
          },
          {
            id: 'detailed_description',
            name: 'Detailed Description',
            description: 'Comprehensive ingredient documentation and notes',
            fieldSets: [
              {
                id: 'description_details',
                name: 'Description & Documentation',
                description: 'Detailed descriptions and usage notes',
                fields: [
                  {
                    id: 'description',
                    label: 'General Description',
                    type: 'richtext',
                    required: true,
                    placeholder: 'Comprehensive description of the ingredient, its characteristics, and typical applications',
                    helpText: 'Complete ingredient overview'
                  },
                  {
                    id: 'olfactoryNotes',
                    label: 'Olfactory Notes',
                    type: 'richtext',
                    placeholder: 'Detailed breakdown of top, middle, and base notes with intensity and character descriptions',
                    helpText: 'Professional olfactory evaluation'
                  },
                  {
                    id: 'usageNotes',
                    label: 'Usage Notes',
                    type: 'richtext',
                    placeholder: 'Recommended usage levels, blending characteristics, and application guidelines',
                    helpText: 'Technical usage guidance'
                  },
                  {
                    id: 'stability',
                    label: 'Stability Information',
                    type: 'richtext',
                    placeholder: 'Storage conditions, shelf life, and stability considerations',
                    helpText: 'Stability and storage requirements'
                  },
                  {
                    id: 'handlingSafety',
                    label: 'Handling & Safety',
                    type: 'richtext',
                    placeholder: 'Safety precautions, handling requirements, and protective measures',
                    helpText: 'Safety and handling instructions'
                  },
                  {
                    id: 'technicalNotes',
                    label: 'Technical Notes',
                    type: 'richtext',
                    placeholder: 'Additional technical information, formulation tips, and compatibility notes',
                    helpText: 'Additional technical details'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:physical_properties'
              },
              {
                id: 'next_step',
                label: 'Next: Chemical Composition',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['description']
            }
          }
        ]
      },
      {
        id: 'composition',
        name: 'Chemical Composition',
        description: 'Detailed chemical and molecular data',
        icon: 'ri-test-tube-line',
        steps: [
          {
            id: 'chemical_data',
            name: 'Chemical Composition',
            description: 'Molecular structure and chemical composition data',
            fieldSets: [
              {
                id: 'molecular_data',
                name: 'Molecular Data',
                description: 'Chemical structure and molecular information',
                fields: [
                  {
                    id: 'molecularFormula',
                    label: 'Molecular Formula',
                    type: 'text',
                    placeholder: 'C10H16O',
                    helpText: 'Chemical molecular formula'
                  },
                  {
                    id: 'molecularWeight',
                    label: 'Molecular Weight (g/mol)',
                    type: 'number',
                    validation: {
                      min: 0,
                      message: 'Molecular weight must be positive'
                    }
                  },
                  {
                    id: 'smiles',
                    label: 'SMILES Notation',
                    type: 'text',
                    placeholder: 'Simplified molecular-input line-entry system',
                    helpText: 'Chemical structure representation'
                  },
                  {
                    id: 'inchi',
                    label: 'InChI',
                    type: 'text',
                    placeholder: 'International Chemical Identifier',
                    helpText: 'Standard chemical identifier'
                  },
                  {
                    id: 'inchiKey',
                    label: 'InChI Key',
                    type: 'text',
                    placeholder: 'Hashed InChI identifier',
                    helpText: 'Condensed InChI representation'
                  }
                ]
              },
              {
                id: 'purity_composition',
                name: 'Purity & Composition',
                description: 'Purity specifications and compositional analysis',
                fields: [
                  {
                    id: 'purity',
                    label: 'Purity (%)',
                    type: 'number',
                    required: true,
                    validation: {
                      min: 50,
                      max: 100,
                      message: 'Purity must be between 50% and 100%'
                    }
                  },
                  {
                    id: 'purityMethod',
                    label: 'Purity Analysis Method',
                    type: 'select',
                    options: [
                      { value: 'gc', label: 'Gas Chromatography (GC)' },
                      { value: 'gc_ms', label: 'GC-MS' },
                      { value: 'hplc', label: 'High Performance Liquid Chromatography (HPLC)' },
                      { value: 'nmr', label: 'Nuclear Magnetic Resonance (NMR)' },
                      { value: 'titration', label: 'Titration' },
                      { value: 'other', label: 'Other Method' }
                    ]
                  },
                  {
                    id: 'majorComponents',
                    label: 'Major Components',
                    type: 'table',
                    columns: [
                      { key: 'componentName', label: 'Component Name', type: 'text', required: true },
                      { key: 'casNumber', label: 'CAS Number', type: 'text' },
                      { key: 'percentage', label: 'Percentage (%)', type: 'number', required: true },
                      { key: 'function', label: 'Function', type: 'text' }
                    ],
                    helpText: 'Components comprising >1% of the ingredient'
                  },
                  {
                    id: 'impurities',
                    label: 'Known Impurities',
                    type: 'table',
                    columns: [
                      { key: 'impurityName', label: 'Impurity', type: 'text', required: true },
                      { key: 'casNumber', label: 'CAS Number', type: 'text' },
                      { key: 'maxPercentage', label: 'Max %', type: 'number', required: true },
                      { key: 'source', label: 'Source/Origin', type: 'text' }
                    ],
                    helpText: 'Identified impurities and their maximum levels'
                  }
                ]
              },
              {
                id: 'analytical_data',
                name: 'Analytical Data',
                description: 'Analytical test results and specifications',
                fields: [
                  {
                    id: 'acidValue',
                    label: 'Acid Value (mg KOH/g)',
                    type: 'number',
                    helpText: 'Measure of free acids present'
                  },
                  {
                    id: 'esterValue',
                    label: 'Ester Value (mg KOH/g)',
                    type: 'number',
                    helpText: 'Measure of ester content'
                  },
                  {
                    id: 'saponificationValue',
                    label: 'Saponification Value (mg KOH/g)',
                    type: 'number',
                    helpText: 'Measure of total esters and free acids'
                  },
                  {
                    id: 'peroxideValue',
                    label: 'Peroxide Value (meq O2/kg)',
                    type: 'number',
                    helpText: 'Measure of primary oxidation'
                  },
                  {
                    id: 'waterContent',
                    label: 'Water Content (%)',
                    type: 'number',
                    helpText: 'Moisture content by Karl Fischer or other method'
                  },
                  {
                    id: 'opticalRotation',
                    label: 'Optical Rotation ([α]D20)',
                    type: 'text',
                    placeholder: '+15.2° to +18.5°',
                    helpText: 'Specific optical rotation range'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:detailed_description'
              },
              {
                id: 'next_step',
                label: 'Next: Thermal Properties',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['purity']
            }
          },
          {
            id: 'thermal_properties',
            name: 'Thermal & Physical Properties',
            description: 'Temperature-dependent and advanced physical properties',
            fieldSets: [
              {
                id: 'thermal_data',
                name: 'Thermal Properties',
                description: 'Temperature-related characteristics',
                fields: [
                  {
                    id: 'meltingPoint',
                    label: 'Melting Point (°C)',
                    type: 'text',
                    placeholder: '25-28°C or single value',
                    helpText: 'Melting point or range'
                  },
                  {
                    id: 'boilingPoint',
                    label: 'Boiling Point (°C)',
                    type: 'text',
                    placeholder: '180°C at 760 mmHg',
                    helpText: 'Boiling point and pressure conditions'
                  },
                  {
                    id: 'flashPoint',
                    label: 'Flash Point (°C)',
                    type: 'number',
                    helpText: 'Temperature at which vapors ignite'
                  },
                  {
                    id: 'autoIgnitionTemp',
                    label: 'Auto-ignition Temperature (°C)',
                    type: 'number',
                    helpText: 'Temperature of spontaneous ignition'
                  },
                  {
                    id: 'vaporPressure',
                    label: 'Vapor Pressure (Pa at 20°C)',
                    type: 'number',
                    helpText: 'Vapor pressure at standard temperature'
                  },
                  {
                    id: 'thermalStability',
                    label: 'Thermal Stability',
                    type: 'textarea',
                    placeholder: 'Stability under heat, decomposition temperature, thermal behavior',
                    helpText: 'Behavior under thermal stress'
                  }
                ]
              },
              {
                id: 'solubility_data',
                name: 'Solubility & Compatibility',
                description: 'Solubility parameters and compatibility information',
                fields: [
                  {
                    id: 'waterSolubility',
                    label: 'Water Solubility (g/L at 20°C)',
                    type: 'text',
                    placeholder: 'Insoluble, slightly soluble, 0.5 g/L, etc.',
                    helpText: 'Solubility in water'
                  },
                  {
                    id: 'ethanolSolubility',
                    label: 'Ethanol Solubility',
                    type: 'select',
                    options: [
                      { value: 'freely_soluble', label: 'Freely Soluble' },
                      { value: 'soluble', label: 'Soluble' },
                      { value: 'slightly_soluble', label: 'Slightly Soluble' },
                      { value: 'practically_insoluble', label: 'Practically Insoluble' },
                      { value: 'insoluble', label: 'Insoluble' }
                    ]
                  },
                  {
                    id: 'oilSolubility',
                    label: 'Oil Solubility',
                    type: 'select',
                    options: [
                      { value: 'freely_soluble', label: 'Freely Soluble' },
                      { value: 'soluble', label: 'Soluble' },
                      { value: 'slightly_soluble', label: 'Slightly Soluble' },
                      { value: 'practically_insoluble', label: 'Practically Insoluble' },
                      { value: 'insoluble', label: 'Insoluble' }
                    ]
                  },
                  {
                    id: 'logP',
                    label: 'Log P (Octanol/Water)',
                    type: 'number',
                    helpText: 'Partition coefficient - lipophilicity measure'
                  },
                  {
                    id: 'compatibility',
                    label: 'Material Compatibility',
                    type: 'multiselect',
                    options: [
                      { value: 'plastic', label: 'Plastic Compatible' },
                      { value: 'metal', label: 'Metal Compatible' },
                      { value: 'rubber', label: 'Rubber Compatible' },
                      { value: 'glass', label: 'Glass Compatible' },
                      { value: 'ceramics', label: 'Ceramics Compatible' }
                    ],
                    helpText: 'Compatible storage and handling materials'
                  },
                  {
                    id: 'incompatibleMaterials',
                    label: 'Incompatible Materials',
                    type: 'textarea',
                    placeholder: 'Materials to avoid contact with',
                    helpText: 'Materials that react or degrade the ingredient'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:chemical_data'
              },
              {
                id: 'next_step',
                label: 'Next: Quality Specifications',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ]
          },
          {
            id: 'quality_specifications',
            name: 'Quality Specifications',
            description: 'Quality control parameters and testing requirements',
            fieldSets: [
              {
                id: 'quality_parameters',
                name: 'Quality Control Parameters',
                description: 'Standard quality control tests and limits',
                fields: [
                  {
                    id: 'appearanceSpec',
                    label: 'Appearance Specification',
                    type: 'text',
                    placeholder: 'Clear, colorless to pale yellow liquid',
                    helpText: 'Visual appearance requirements'
                  },
                  {
                    id: 'odorSpec',
                    label: 'Odor Specification',
                    type: 'textarea',
                    placeholder: 'Characteristic odor description and acceptance criteria',
                    helpText: 'Olfactory quality standards'
                  },
                  {
                    id: 'densitySpec',
                    label: 'Density Specification (g/mL)',
                    type: 'text',
                    placeholder: '0.850 - 0.870',
                    helpText: 'Acceptable density range'
                  },
                  {
                    id: 'refractiveIndexSpec',
                    label: 'Refractive Index Specification',
                    type: 'text',
                    placeholder: '1.4500 - 1.4600',
                    helpText: 'Acceptable refractive index range'
                  },
                  {
                    id: 'puritySpec',
                    label: 'Purity Specification (%)',
                    type: 'text',
                    placeholder: 'Min 95.0%',
                    helpText: 'Minimum purity requirement'
                  },
                  {
                    id: 'acidValueSpec',
                    label: 'Acid Value Specification',
                    type: 'text',
                    placeholder: 'Max 1.0 mg KOH/g',
                    helpText: 'Maximum acid value limit'
                  }
                ]
              },
              {
                id: 'testing_requirements',
                name: 'Testing Requirements',
                description: 'Required analytical tests and frequencies',
                fields: [
                  {
                    id: 'incomingTests',
                    label: 'Incoming Material Tests',
                    type: 'multiselect',
                    options: [
                      { value: 'visual_inspection', label: 'Visual Inspection' },
                      { value: 'odor_evaluation', label: 'Odor Evaluation' },
                      { value: 'gc_analysis', label: 'GC Analysis' },
                      { value: 'gc_ms', label: 'GC-MS Identification' },
                      { value: 'density', label: 'Density Measurement' },
                      { value: 'refractive_index', label: 'Refractive Index' },
                      { value: 'optical_rotation', label: 'Optical Rotation' },
                      { value: 'water_content', label: 'Water Content' },
                      { value: 'acid_value', label: 'Acid Value' },
                      { value: 'peroxide_value', label: 'Peroxide Value' }
                    ],
                    helpText: 'Tests required for incoming material approval'
                  },
                  {
                    id: 'releaseTests',
                    label: 'Release Tests',
                    type: 'multiselect',
                    options: [
                      { value: 'identity_confirmation', label: 'Identity Confirmation' },
                      { value: 'purity_assay', label: 'Purity Assay' },
                      { value: 'impurity_profile', label: 'Impurity Profile' },
                      { value: 'physical_properties', label: 'Physical Properties' },
                      { value: 'microbiological', label: 'Microbiological Testing' },
                      { value: 'heavy_metals', label: 'Heavy Metals' },
                      { value: 'residual_solvents', label: 'Residual Solvents' }
                    ],
                    helpText: 'Tests required before material release'
                  },
                  {
                    id: 'stabilityTests',
                    label: 'Stability Testing',
                    type: 'multiselect',
                    options: [
                      { value: 'accelerated', label: 'Accelerated Stability' },
                      { value: 'real_time', label: 'Real-time Stability' },
                      { value: 'freeze_thaw', label: 'Freeze-Thaw Cycling' },
                      { value: 'light_exposure', label: 'Light Exposure' },
                      { value: 'oxidation', label: 'Oxidation Stability' },
                      { value: 'thermal_stress', label: 'Thermal Stress' }
                    ],
                    helpText: 'Stability studies to be conducted'
                  },
                  {
                    id: 'testingFrequency',
                    label: 'Testing Frequency',
                    type: 'select',
                    options: [
                      { value: 'every_lot', label: 'Every Lot' },
                      { value: 'skip_lot', label: 'Skip Lot Testing' },
                      { value: 'quarterly', label: 'Quarterly' },
                      { value: 'annually', label: 'Annually' },
                      { value: 'on_complaint', label: 'On Complaint Only' }
                    ]
                  }
                ]
              },
              {
                id: 'shelf_life_storage',
                name: 'Shelf Life & Storage',
                description: 'Storage conditions and shelf life parameters',
                fields: [
                  {
                    id: 'shelfLife',
                    label: 'Shelf Life (months)',
                    type: 'number',
                    helpText: 'Expected shelf life under proper storage'
                  },
                  {
                    id: 'storageTemperature',
                    label: 'Storage Temperature',
                    type: 'select',
                    options: [
                      { value: 'room_temp', label: 'Room Temperature (15-25°C)' },
                      { value: 'cool', label: 'Cool (2-8°C)' },
                      { value: 'frozen', label: 'Frozen (-18°C or below)' },
                      { value: 'controlled', label: 'Controlled Room Temperature (20-25°C)' }
                    ]
                  },
                  {
                    id: 'storageConditions',
                    label: 'Storage Conditions',
                    type: 'multiselect',
                    options: [
                      { value: 'dark', label: 'Protect from Light' },
                      { value: 'dry', label: 'Keep Dry' },
                      { value: 'inert_atmosphere', label: 'Inert Atmosphere' },
                      { value: 'sealed_container', label: 'Sealed Container' },
                      { value: 'avoid_heat', label: 'Avoid Heat' },
                      { value: 'avoid_air', label: 'Minimize Air Exposure' }
                    ],
                    helpText: 'Special storage considerations'
                  },
                  {
                    id: 'packagingMaterial',
                    label: 'Recommended Packaging',
                    type: 'multiselect',
                    options: [
                      { value: 'amber_glass', label: 'Amber Glass' },
                      { value: 'clear_glass', label: 'Clear Glass' },
                      { value: 'hdpe', label: 'HDPE Plastic' },
                      { value: 'aluminum', label: 'Aluminum Container' },
                      { value: 'stainless_steel', label: 'Stainless Steel' },
                      { value: 'lined_steel', label: 'Lined Steel Drum' }
                    ]
                  },
                  {
                    id: 'storageNotes',
                    label: 'Storage Notes',
                    type: 'textarea',
                    placeholder: 'Additional storage requirements and precautions',
                    helpText: 'Special storage considerations'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:thermal_properties'
              },
              {
                id: 'next_step',
                label: 'Next: Supplier Information',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ]
          }
        ]
      },
      {
        id: 'suppliers',
        name: 'Supplier & Sourcing',
        description: 'Comprehensive supplier and sourcing information',
        icon: 'ri-truck-line',
        steps: [
          {
            id: 'primary_supplier',
            name: 'Primary Supplier',
            description: 'Main supplier information and contact details',
            fieldSets: [
              {
                id: 'supplier_details',
                name: 'Supplier Details',
                description: 'Primary supplier identification and contact information',
                fields: [
                  {
                    id: 'supplierName',
                    label: 'Supplier Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Company name'
                  },
                  {
                    id: 'supplierCode',
                    label: 'Supplier Code',
                    type: 'text',
                    required: true,
                    placeholder: 'SUP-001'
                  },
                  {
                    id: 'supplierAddress',
                    label: 'Supplier Address',
                    type: 'textarea',
                    placeholder: 'Complete address including country'
                  },
                  {
                    id: 'contactPerson',
                    label: 'Primary Contact',
                    type: 'text',
                    placeholder: 'Contact person name'
                  },
                  {
                    id: 'contactTitle',
                    label: 'Contact Title',
                    type: 'text',
                    placeholder: 'Sales Manager, Technical Director, etc.'
                  },
                  {
                    id: 'contactEmail',
                    label: 'Contact Email',
                    type: 'text',
                    placeholder: 'contact@supplier.com'
                  },
                  {
                    id: 'contactPhone',
                    label: 'Contact Phone',
                    type: 'text',
                    placeholder: '+1 (555) 123-4567'
                  },
                  {
                    id: 'website',
                    label: 'Company Website',
                    type: 'text',
                    placeholder: 'https://www.supplier.com'
                  }
                ]
              },
              {
                id: 'business_terms',
                name: 'Business Terms',
                description: 'Commercial terms and conditions',
                fields: [
                  {
                    id: 'leadTime',
                    label: 'Lead Time (days)',
                    type: 'number',
                    required: true,
                    helpText: 'Standard delivery time'
                  },
                  {
                    id: 'minOrderQty',
                    label: 'Minimum Order Quantity',
                    type: 'number',
                    required: true,
                    helpText: 'Minimum order quantity in kg'
                  },
                  {
                    id: 'maxOrderQty',
                    label: 'Maximum Order Quantity',
                    type: 'number',
                    helpText: 'Maximum single order quantity if applicable'
                  },
                  {
                    id: 'pricePerKg',
                    label: 'Price per Kg (USD)',
                    type: 'number',
                    helpText: 'Current price per kilogram'
                  },
                  {
                    id: 'currency',
                    label: 'Pricing Currency',
                    type: 'select',
                    options: [
                      { value: 'USD', label: 'US Dollar (USD)' },
                      { value: 'EUR', label: 'Euro (EUR)' },
                      { value: 'GBP', label: 'British Pound (GBP)' },
                      { value: 'CHF', label: 'Swiss Franc (CHF)' },
                      { value: 'JPY', label: 'Japanese Yen (JPY)' }
                    ]
                  },
                  {
                    id: 'paymentTerms',
                    label: 'Payment Terms',
                    type: 'select',
                    options: [
                      { value: 'net_30', label: 'Net 30 Days' },
                      { value: 'net_60', label: 'Net 60 Days' },
                      { value: 'payment_on_delivery', label: 'Payment on Delivery' },
                      { value: 'advance_payment', label: 'Advance Payment' },
                      { value: 'letter_of_credit', label: 'Letter of Credit' }
                    ]
                  },
                  {
                    id: 'shippingTerms',
                    label: 'Shipping Terms',
                    type: 'select',
                    options: [
                      { value: 'fob', label: 'FOB (Free on Board)' },
                      { value: 'cif', label: 'CIF (Cost, Insurance, Freight)' },
                      { value: 'dap', label: 'DAP (Delivered at Place)' },
                      { value: 'ddp', label: 'DDP (Delivered Duty Paid)' },
                      { value: 'exw', label: 'EXW (Ex Works)' }
                    ]
                  }
                ]
              },
              {
                id: 'quality_certifications',
                name: 'Quality & Certifications',
                description: 'Supplier quality standards and certifications',
                fields: [
                  {
                    id: 'qualityStandards',
                    label: 'Quality Standards',
                    type: 'multiselect',
                    options: [
                      { value: 'iso_9001', label: 'ISO 9001' },
                      { value: 'iso_14001', label: 'ISO 14001' },
                      { value: 'iso_45001', label: 'ISO 45001' },
                      { value: 'gmp', label: 'Good Manufacturing Practice (GMP)' },
                      { value: 'haccp', label: 'HACCP' },
                      { value: 'fda_registered', label: 'FDA Registered' }
                    ]
                  },
                  {
                    id: 'productCertifications',
                    label: 'Product Certifications',
                    type: 'multiselect',
                    options: [
                      { value: 'organic', label: 'Organic Certified' },
                      { value: 'natural', label: 'Natural Certified' },
                      { value: 'kosher', label: 'Kosher' },
                      { value: 'halal', label: 'Halal' },
                      { value: 'fair_trade', label: 'Fair Trade' },
                      { value: 'rainforest_alliance', label: 'Rainforest Alliance' },
                      { value: 'ecocert', label: 'Ecocert' }
                    ]
                  },
                  {
                    id: 'regulatoryCompliance',
                    label: 'Regulatory Compliance',
                    type: 'multiselect',
                    options: [
                      { value: 'reach', label: 'REACH Compliant' },
                      { value: 'rohs', label: 'RoHS Compliant' },
                      { value: 'ca_prop65', label: 'California Prop 65 Compliant' },
                      { value: 'ifra', label: 'IFRA Compliant' },
                      { value: 'fda', label: 'FDA Compliant' },
                      { value: 'eu_cosmetics', label: 'EU Cosmetics Regulation' }
                    ]
                  },
                  {
                    id: 'auditStatus',
                    label: 'Audit Status',
                    type: 'select',
                    options: [
                      { value: 'approved', label: 'Approved Supplier' },
                      { value: 'conditional', label: 'Conditionally Approved' },
                      { value: 'pending', label: 'Audit Pending' },
                      { value: 'not_audited', label: 'Not Audited' },
                      { value: 'failed', label: 'Failed Audit' }
                    ]
                  },
                  {
                    id: 'lastAuditDate',
                    label: 'Last Audit Date',
                    type: 'date',
                    helpText: 'Date of most recent supplier audit'
                  },
                  {
                    id: 'nextAuditDate',
                    label: 'Next Audit Date',
                    type: 'date',
                    helpText: 'Scheduled date for next audit'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:quality_specifications'
              },
              {
                id: 'next_step',
                label: 'Next: Alternative Suppliers',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['supplierName', 'supplierCode', 'leadTime', 'minOrderQty']
            }
          },
          {
            id: 'alternative_suppliers',
            name: 'Alternative Suppliers',
            description: 'Backup and alternative sourcing options',
            fieldSets: [
              {
                id: 'alternative_sourcing',
                name: 'Alternative Sourcing',
                description: 'Backup suppliers and sourcing strategies',
                fields: [
                  {
                    id: 'alternativeSuppliers',
                    label: 'Alternative Suppliers',
                    type: 'table',
                    columns: [
                      { key: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
                      { key: 'supplierCode', label: 'Supplier Code', type: 'text' },
                      { key: 'contactPerson', label: 'Contact', type: 'text' },
                      { key: 'contactEmail', label: 'Email', type: 'text' },
                      { key: 'country', label: 'Country', type: 'text' },
                      { key: 'leadTime', label: 'Lead Time (days)', type: 'number' },
                      { key: 'minOrderQty', label: 'Min Order Qty (kg)', type: 'number' },
                      { key: 'pricePerKg', label: 'Price/kg (USD)', type: 'number' },
                      { key: 'status', label: 'Status', type: 'select', options: [
                        { value: 'active', label: 'Active' },
                        { value: 'backup', label: 'Backup' },
                        { value: 'discontinued', label: 'Discontinued' },
                        { value: 'under_evaluation', label: 'Under Evaluation' }
                      ]},
                      { key: 'notes', label: 'Notes', type: 'text' }
                    ],
                    helpText: 'List of alternative suppliers for supply chain redundancy'
                  },
                  {
                    id: 'sourcingStrategy',
                    label: 'Sourcing Strategy',
                    type: 'select',
                    options: [
                      { value: 'single_source', label: 'Single Source' },
                      { value: 'dual_source', label: 'Dual Source' },
                      { value: 'multi_source', label: 'Multi-Source' },
                      { value: 'preferred_plus_backup', label: 'Preferred + Backup' }
                    ],
                    helpText: 'Overall sourcing approach for this ingredient'
                  },
                  {
                    id: 'sourcingRisks',
                    label: 'Sourcing Risks',
                    type: 'multiselect',
                    options: [
                      { value: 'single_supplier', label: 'Single Supplier Dependency' },
                      { value: 'geographic', label: 'Geographic Concentration' },
                      { value: 'seasonal', label: 'Seasonal Availability' },
                      { value: 'regulatory', label: 'Regulatory Changes' },
                      { value: 'price_volatility', label: 'Price Volatility' },
                      { value: 'quality_variability', label: 'Quality Variability' },
                      { value: 'supply_disruption', label: 'Supply Disruption Risk' }
                    ]
                  },
                  {
                    id: 'mitigationStrategies',
                    label: 'Risk Mitigation Strategies',
                    type: 'textarea',
                    placeholder: 'Strategies to mitigate identified sourcing risks',
                    helpText: 'Plans to address supply chain risks'
                  }
                ]
              },
              {
                id: 'supply_chain_management',
                name: 'Supply Chain Management',
                description: 'Supply chain planning and management parameters',
                fields: [
                  {
                    id: 'forecastAccuracy',
                    label: 'Forecast Accuracy (%)',
                    type: 'number',
                    helpText: 'Historical forecast accuracy for demand planning'
                  },
                  {
                    id: 'safetyStock',
                    label: 'Safety Stock (kg)',
                    type: 'number',
                    helpText: 'Recommended safety stock level'
                  },
                  {
                    id: 'reorderPoint',
                    label: 'Reorder Point (kg)',
                    type: 'number',
                    helpText: 'Inventory level that triggers reordering'
                  },
                  {
                    id: 'averageConsumption',
                    label: 'Average Monthly Consumption (kg)',
                    type: 'number',
                    helpText: 'Historical average monthly usage'
                  },
                  {
                    id: 'seasonalPattern',
                    label: 'Seasonal Pattern',
                    type: 'select',
                    options: [
                      { value: 'none', label: 'No Seasonal Pattern' },
                      { value: 'spring_peak', label: 'Spring Peak' },
                      { value: 'summer_peak', label: 'Summer Peak' },
                      { value: 'fall_peak', label: 'Fall Peak' },
                      { value: 'winter_peak', label: 'Winter Peak' },
                      { value: 'holiday_peak', label: 'Holiday Peak' }
                    ]
                  },
                  {
                    id: 'supplierPerformance',
                    label: 'Supplier Performance Metrics',
                    type: 'table',
                    columns: [
                      { key: 'metric', label: 'Metric', type: 'text' },
                      { key: 'target', label: 'Target', type: 'text' },
                      { key: 'actual', label: 'Actual', type: 'text' },
                      { key: 'trend', label: 'Trend', type: 'select', options: [
                        { value: 'improving', label: 'Improving' },
                        { value: 'stable', label: 'Stable' },
                        { value: 'declining', label: 'Declining' }
                      ]},
                      { key: 'notes', label: 'Notes', type: 'text' }
                    ],
                    defaultValue: [
                      { metric: 'On-Time Delivery', target: '95%', actual: '', trend: '', notes: '' },
                      { metric: 'Quality Acceptance', target: '98%', actual: '', trend: '', notes: '' },
                      { metric: 'Lead Time Adherence', target: '100%', actual: '', trend: '', notes: '' },
                      { metric: 'Price Stability', target: '±5%', actual: '', trend: '', notes: '' }
                    ]
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:primary_supplier'
              },
              {
                id: 'next_step',
                label: 'Next: Regulatory Compliance',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ]
          }
        ]
      },
      {
        id: 'regulatory',
        name: 'Regulatory & Compliance',
        description: 'Comprehensive regulatory and safety compliance data',
        icon: 'ri-shield-check-line',
        steps: [
          {
            id: 'regulatory_compliance',
            name: 'Regulatory Compliance',
            description: 'Regulatory status and compliance requirements',
            fieldSets: [
              {
                id: 'ifra_compliance',
                name: 'IFRA Compliance',
                description: 'International Fragrance Association standards and restrictions',
                fields: [
                  {
                    id: 'ifraStandards',
                    label: 'IFRA Standards Version',
                    type: 'select',
                    options: [
                      { value: '49th', label: '49th Amendment (Current)' },
                      { value: '48th', label: '48th Amendment' },
                      { value: '47th', label: '47th Amendment' },
                      { value: 'not_applicable', label: 'Not Applicable' }
                    ]
                  },
                  {
                    id: 'ifraRestrictions',
                    label: 'IFRA Restrictions',
                    type: 'table',
                    columns: [
                      { key: 'category', label: 'IFRA Category', type: 'select', options: [
                        { value: 'cat1', label: 'Category 1' },
                        { value: 'cat2', label: 'Category 2' },
                        { value: 'cat3', label: 'Category 3' },
                        { value: 'cat4', label: 'Category 4' },
                        { value: 'cat5', label: 'Category 5' },
                        { value: 'cat6', label: 'Category 6' },
                        { value: 'cat7', label: 'Category 7' },
                        { value: 'cat8', label: 'Category 8' },
                        { value: 'cat9', label: 'Category 9' },
                        { value: 'cat10', label: 'Category 10' },
                        { value: 'cat11', label: 'Category 11' }
                      ]},
                      { key: 'maxLevel', label: 'Max Level (%)', type: 'number' },
                      { key: 'restrictionType', label: 'Restriction Type', type: 'select', options: [
                        { value: 'specification', label: 'Specification' },
                        { value: 'restricted', label: 'Restricted' },
                        { value: 'prohibited', label: 'Prohibited' },
                        { value: 'no_restriction', label: 'No Restriction' }
                      ]},
                      { key: 'notes', label: 'Notes', type: 'text' }
                    ]
                  },
                  {
                    id: 'ifraQra',
                    label: 'IFRA QRA Number',
                    type: 'text',
                    placeholder: 'QRA number if applicable',
                    helpText: 'Quantitative Risk Assessment reference number'
                  }
                ]
              },
              {
                id: 'regional_compliance',
                name: 'Regional Compliance',
                description: 'Compliance status by geographical region',
                fields: [
                  {
                    id: 'euCompliance',
                    label: 'EU Compliance Status',
                    type: 'select',
                    options: [
                      { value: 'compliant', label: 'Fully Compliant' },
                      { value: 'restricted', label: 'Restricted Use' },
                      { value: 'prohibited', label: 'Prohibited' },
                      { value: 'under_review', label: 'Under Review' },
                      { value: 'not_assessed', label: 'Not Assessed' }
                    ]
                  },
                  {
                    id: 'usCompliance',
                    label: 'US Compliance Status',
                    type: 'select',
                    options: [
                      { value: 'compliant', label: 'Fully Compliant' },
                      { value: 'restricted', label: 'Restricted Use' },
                      { value: 'prohibited', label: 'Prohibited' },
                      { value: 'under_review', label: 'Under Review' },
                      { value: 'not_assessed', label: 'Not Assessed' }
                    ]
                  },
                  {
                    id: 'canadaCompliance',
                    label: 'Canada Compliance Status',
                    type: 'select',
                    options: [
                      { value: 'compliant', label: 'Fully Compliant' },
                      { value: 'restricted', label: 'Restricted Use' },
                      { value: 'prohibited', label: 'Prohibited' },
                      { value: 'under_review', label: 'Under Review' },
                      { value: 'not_assessed', label: 'Not Assessed' }
                    ]
                  },
                  {
                    id: 'asiaCompliance',
                    label: 'Asia-Pacific Compliance',
                    type: 'multiselect',
                    options: [
                      { value: 'japan_compliant', label: 'Japan - Compliant' },
                      { value: 'china_compliant', label: 'China - Compliant' },
                      { value: 'australia_compliant', label: 'Australia - Compliant' },
                      { value: 'korea_compliant', label: 'South Korea - Compliant' },
                      { value: 'india_compliant', label: 'India - Compliant' }
                    ]
                  },
                  {
                    id: 'restrictedCountries',
                    label: 'Restricted Countries',
                    type: 'multiselect',
                    options: [
                      { value: 'DE', label: 'Germany' },
                      { value: 'FR', label: 'France' },
                      { value: 'IT', label: 'Italy' },
                      { value: 'ES', label: 'Spain' },
                      { value: 'UK', label: 'United Kingdom' },
                      { value: 'US', label: 'United States' },
                      { value: 'CA', label: 'Canada' },
                      { value: 'JP', label: 'Japan' },
                      { value: 'CN', label: 'China' },
                      { value: 'AU', label: 'Australia' }
                    ]
                  }
                ]
              },
              {
                id: 'allergen_information',
                name: 'Allergen Information',
                description: 'Allergen content and declaration requirements',
                fields: [
                  {
                    id: 'containsAllergens',
                    label: 'Contains EU Allergens',
                    type: 'checkbox',
                    helpText: 'Check if ingredient contains any of the 26 EU declarable allergens'
                  },
                  {
                    id: 'allergenList',
                    label: 'Contained Allergens',
                    type: 'multiselect',
                    options: [
                      { value: 'amyl_cinnamal', label: 'Amyl Cinnamal' },
                      { value: 'benzyl_alcohol', label: 'Benzyl Alcohol' },
                      { value: 'benzyl_benzoate', label: 'Benzyl Benzoate' },
                      { value: 'benzyl_cinnamate', label: 'Benzyl Cinnamate' },
                      { value: 'benzyl_salicylate', label: 'Benzyl Salicylate' },
                      { value: 'cinnamyl_alcohol', label: 'Cinnamyl Alcohol' },
                      { value: 'citral', label: 'Citral' },
                      { value: 'citronellol', label: 'Citronellol' },
                      { value: 'coumarin', label: 'Coumarin' },
                      { value: 'eugenol', label: 'Eugenol' },
                      { value: 'farnesol', label: 'Farnesol' },
                      { value: 'geraniol', label: 'Geraniol' },
                      { value: 'hexyl_cinnamal', label: 'Hexyl Cinnamal' },
                      { value: 'hydroxycitronellal', label: 'Hydroxycitronellal' },
                      { value: 'isoeugenol', label: 'Isoeugenol' },
                      { value: 'limonene', label: 'Limonene' },
                      { value: 'linalool', label: 'Linalool' },
                      { value: 'methyl_2_octynoate', label: 'Methyl 2-Octynoate' }
                    ],
                    helpText: 'Select all allergens naturally present or added'
                  },
                  {
                    id: 'allergenConcentrations',
                    label: 'Allergen Concentrations',
                    type: 'table',
                    columns: [
                      { key: 'allergen', label: 'Allergen', type: 'text' },
                      { key: 'concentration', label: 'Concentration (%)', type: 'number' },
                      { key: 'method', label: 'Analysis Method', type: 'select', options: [
                        { value: 'gc_ms', label: 'GC-MS' },
                        { value: 'hplc', label: 'HPLC' },
                        { value: 'calculation', label: 'Calculation' },
                        { value: 'literature', label: 'Literature Value' }
                      ]},
                      { key: 'declarationRequired', label: 'Declaration Required', type: 'select', options: [
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' },
                        { value: 'conditional', label: 'Conditional' }
                      ]}
                    ]
                  },
                  {
                    id: 'allergenNotes',
                    label: 'Allergen Notes',
                    type: 'textarea',
                    placeholder: 'Additional information about allergen content and declaration requirements',
                    helpText: 'Special considerations for allergen management'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:alternative_suppliers'
              },
              {
                id: 'next_step',
                label: 'Next: Safety Data',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ]
          },
          {
            id: 'safety_data',
            name: 'Safety & Toxicology',
            description: 'Safety data and toxicological information',
            fieldSets: [
              {
                id: 'safety_classification',
                name: 'Safety Classification',
                description: 'Hazard classification and safety measures',
                fields: [
                  {
                    id: 'ghsClassification',
                    label: 'GHS Classification',
                    type: 'multiselect',
                    options: [
                      { value: 'flammable_liquid', label: 'Flammable Liquid' },
                      { value: 'skin_irritant', label: 'Skin Irritant' },
                      { value: 'eye_irritant', label: 'Eye Irritant' },
                      { value: 'skin_sensitizer', label: 'Skin Sensitizer' },
                      { value: 'respiratory_sensitizer', label: 'Respiratory Sensitizer' },
                      { value: 'aquatic_chronic', label: 'Aquatic Chronic Toxicity' },
                      { value: 'acute_toxicity', label: 'Acute Toxicity' },
                      { value: 'carcinogen', label: 'Carcinogen' }
                    ],
                    helpText: 'Globally Harmonized System hazard classifications'
                  },
                  {
                    id: 'hazardStatements',
                    label: 'Hazard Statements (H-codes)',
                    type: 'multiselect',
                    options: [
                      { value: 'H226', label: 'H226 - Flammable liquid and vapour' },
                      { value: 'H315', label: 'H315 - Causes skin irritation' },
                      { value: 'H317', label: 'H317 - May cause allergic skin reaction' },
                      { value: 'H319', label: 'H319 - Causes serious eye irritation' },
                      { value: 'H334', label: 'H334 - May cause allergy or asthma symptoms' },
                      { value: 'H411', label: 'H411 - Toxic to aquatic life with long lasting effects' },
                      { value: 'H412', label: 'H412 - Harmful to aquatic life with long lasting effects' }
                    ]
                  },
                  {
                    id: 'precautionaryStatements',
                    label: 'Precautionary Statements (P-codes)',
                    type: 'multiselect',
                    options: [
                      { value: 'P210', label: 'P210 - Keep away from heat/sparks/open flames/hot surfaces' },
                      { value: 'P261', label: 'P261 - Avoid breathing dust/fume/gas/mist/vapours/spray' },
                      { value: 'P272', label: 'P272 - Contaminated work clothing should not be allowed out of workplace' },
                      { value: 'P280', label: 'P280 - Wear protective gloves/protective clothing/eye protection/face protection' },
                      { value: 'P302_352', label: 'P302+P352 - IF ON SKIN: Wash with plenty of soap and water' },
                      { value: 'P333_313', label: 'P333+P313 - If skin irritation or rash occurs: Get medical advice/attention' }
                    ]
                  },
                  {
                    id: 'signalWord',
                    label: 'Signal Word',
                    type: 'select',
                    options: [
                      { value: 'danger', label: 'Danger' },
                      { value: 'warning', label: 'Warning' },
                      { value: 'none', label: 'None Required' }
                    ]
                  }
                ]
              },
              {
                id: 'toxicological_data',
                name: 'Toxicological Data',
                description: 'Toxicology study results and endpoints',
                fields: [
                  {
                    id: 'oralLD50',
                    label: 'Acute Oral LD50 (mg/kg)',
                    type: 'text',
                    placeholder: '> 2000 mg/kg (rat)',
                    helpText: 'Acute oral toxicity - lethal dose 50%'
                  },
                  {
                    id: 'dermalLD50',
                    label: 'Acute Dermal LD50 (mg/kg)',
                    type: 'text',
                    placeholder: '> 2000 mg/kg (rabbit)',
                    helpText: 'Acute dermal toxicity - lethal dose 50%'
                  },
                  {
                    id: 'inhalationLC50',
                    label: 'Acute Inhalation LC50',
                    type: 'text',
                    placeholder: '> 20 mg/L (rat, 4h)',
                    helpText: 'Acute inhalation toxicity - lethal concentration 50%'
                  },
                  {
                    id: 'skinIrritation',
                    label: 'Skin Irritation',
                    type: 'select',
                    options: [
                      { value: 'not_irritating', label: 'Not Irritating' },
                      { value: 'slightly_irritating', label: 'Slightly Irritating' },
                      { value: 'moderately_irritating', label: 'Moderately Irritating' },
                      { value: 'severely_irritating', label: 'Severely Irritating' },
                      { value: 'not_tested', label: 'Not Tested' }
                    ]
                  },
                  {
                    id: 'eyeIrritation',
                    label: 'Eye Irritation',
                    type: 'select',
                    options: [
                      { value: 'not_irritating', label: 'Not Irritating' },
                      { value: 'slightly_irritating', label: 'Slightly Irritating' },
                      { value: 'moderately_irritating', label: 'Moderately Irritating' },
                      { value: 'severely_irritating', label: 'Severely Irritating' },
                      { value: 'not_tested', label: 'Not Tested' }
                    ]
                  },
                  {
                    id: 'skinSensitization',
                    label: 'Skin Sensitization',
                    type: 'select',
                    options: [
                      { value: 'not_sensitizing', label: 'Not Sensitizing' },
                      { value: 'sensitizing', label: 'Sensitizing' },
                      { value: 'not_tested', label: 'Not Tested' },
                      { value: 'inconclusive', label: 'Inconclusive' }
                    ]
                  },
                  {
                    id: 'respiratorySensitization',
                    label: 'Respiratory Sensitization',
                    type: 'select',
                    options: [
                      { value: 'not_sensitizing', label: 'Not Sensitizing' },
                      { value: 'sensitizing', label: 'Sensitizing' },
                      { value: 'not_tested', label: 'Not Tested' },
                      { value: 'inconclusive', label: 'Inconclusive' }
                    ]
                  }
                ]
              },
              {
                id: 'environmental_data',
                name: 'Environmental Data',
                description: 'Environmental fate and ecotoxicity information',
                fields: [
                  {
                    id: 'biodegradability',
                    label: 'Biodegradability',
                    type: 'select',
                    options: [
                      { value: 'readily_biodegradable', label: 'Readily Biodegradable' },
                      { value: 'inherently_biodegradable', label: 'Inherently Biodegradable' },
                      { value: 'not_readily_biodegradable', label: 'Not Readily Biodegradable' },
                      { value: 'persistent', label: 'Persistent' },
                      { value: 'not_tested', label: 'Not Tested' }
                    ]
                  },
                  {
                    id: 'bioaccumulation',
                    label: 'Bioaccumulation Potential',
                    type: 'select',
                    options: [
                      { value: 'low', label: 'Low Potential' },
                      { value: 'moderate', label: 'Moderate Potential' },
                      { value: 'high', label: 'High Potential' },
                      { value: 'not_determined', label: 'Not Determined' }
                    ]
                  },
                  {
                    id: 'aquaticToxicity',
                    label: 'Aquatic Toxicity',
                    type: 'table',
                    columns: [
                      { key: 'species', label: 'Species', type: 'select', options: [
                        { value: 'daphnia', label: 'Daphnia magna' },
                        { value: 'fish', label: 'Fish (various species)' },
                        { value: 'algae', label: 'Algae' },
                        { value: 'bacteria', label: 'Bacteria' }
                      ]},
                      { key: 'endpoint', label: 'Endpoint', type: 'select', options: [
                        { value: 'lc50', label: 'LC50' },
                        { value: 'ec50', label: 'EC50' },
                        { value: 'noec', label: 'NOEC' },
                        { value: 'loec', label: 'LOEC' }
                      ]},
                      { key: 'value', label: 'Value (mg/L)', type: 'text' },
                      { key: 'duration', label: 'Duration', type: 'text' },
                      { key: 'notes', label: 'Notes', type: 'text' }
                    ]
                  },
                  {
                    id: 'pbcTAssessment',
                    label: 'PBT Assessment',
                    type: 'select',
                    options: [
                      { value: 'not_pbt', label: 'Not PBT' },
                      { value: 'potential_pbt', label: 'Potential PBT' },
                      { value: 'pbt', label: 'PBT Substance' },
                      { value: 'vpvb', label: 'vPvB Substance' },
                      { value: 'not_assessed', label: 'Not Assessed' }
                    ],
                    helpText: 'Persistent, Bioaccumulative, and Toxic assessment'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:regulatory_compliance'
              },
              {
                id: 'next_step',
                label: 'Next: Final Review',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ]
          }
        ]
      },
      {
        id: 'review',
        name: 'Review & Approval',
        description: 'Final review and approval process',
        icon: 'ri-check-double-line',
        steps: [
          {
            id: 'comprehensive_review',
            name: 'Comprehensive Review',
            description: 'Complete ingredient data review and validation',
            fieldSets: [
              {
                id: 'data_completeness',
                name: 'Data Completeness Review',
                description: 'Verification of data completeness and quality',
                fields: [
                  {
                    id: 'dataCompletenessCheck',
                    label: 'Data Completeness Status',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'section', label: 'Data Section', type: 'text' },
                      { key: 'completeness', label: 'Completeness %', type: 'text' },
                      { key: 'status', label: 'Status', type: 'text' },
                      { key: 'missingFields', label: 'Missing Fields', type: 'text' }
                    ],
                    helpText: 'Automated assessment of data completeness'
                  },
                  {
                    id: 'criticalDataGaps',
                    label: 'Critical Data Gaps',
                    type: 'textarea',
                    placeholder: 'List any critical missing information that must be addressed',
                    helpText: 'Identify essential missing data'
                  },
                  {
                    id: 'dataQualityScore',
                    label: 'Overall Data Quality Score',
                    type: 'text',
                    disabled: true,
                    helpText: 'Calculated based on completeness and accuracy'
                  }
                ]
              },
              {
                id: 'regulatory_review',
                name: 'Regulatory Review',
                description: 'Regulatory compliance verification',
                fields: [
                  {
                    id: 'regulatoryStatus',
                    label: 'Regulatory Status Summary',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'region', label: 'Region/Market', type: 'text' },
                      { key: 'status', label: 'Compliance Status', type: 'text' },
                      { key: 'restrictions', label: 'Restrictions', type: 'text' },
                      { key: 'notes', label: 'Notes', type: 'text' }
                    ],
                    helpText: 'Summary of regulatory compliance by region'
                  },
                  {
                    id: 'ifraCompliance',
                    label: 'IFRA Compliance Verification',
                    type: 'select',
                    options: [
                      { value: 'verified_compliant', label: 'Verified Compliant' },
                      { value: 'compliant_with_restrictions', label: 'Compliant with Restrictions' },
                      { value: 'non_compliant', label: 'Non-Compliant' },
                      { value: 'requires_assessment', label: 'Requires Assessment' }
                    ]
                  },
                  {
                    id: 'allergenDeclaration',
                    label: 'Allergen Declaration Status',
                    type: 'select',
                    options: [
                      { value: 'no_allergens', label: 'No Declarable Allergens' },
                      { value: 'allergens_identified', label: 'Allergens Identified and Documented' },
                      { value: 'allergens_pending', label: 'Allergen Assessment Pending' },
                      { value: 'unknown', label: 'Unknown - Requires Testing' }
                    ]
                  },
                  {
                    id: 'regulatoryNotes',
                    label: 'Regulatory Review Notes',
                    type: 'richtext',
                    placeholder: 'Regulatory specialist notes and recommendations',
                    helpText: 'Detailed regulatory assessment notes'
                  }
                ]
              },
              {
                id: 'approval_workflow',
                name: 'Approval Workflow',
                description: 'Approval process and final status',
                fields: [
                  {
                    id: 'reviewerName',
                    label: 'Primary Reviewer',
                    type: 'select',
                    options: [
                      { value: 'sarah_johnson', label: 'Sarah Johnson - Senior Regulatory Specialist' },
                      { value: 'michael_chen', label: 'Michael Chen - Quality Manager' },
                      { value: 'elena_rodriguez', label: 'Elena Rodriguez - Toxicologist' },
                      { value: 'david_thompson', label: 'David Thompson - Regulatory Affairs Manager' }
                    ]
                  },
                  {
                    id: 'secondaryReviewer',
                    label: 'Secondary Reviewer',
                    type: 'select',
                    options: [
                      { value: 'none', label: 'None Required' },
                      { value: 'sarah_johnson', label: 'Sarah Johnson - Senior Regulatory Specialist' },
                      { value: 'michael_chen', label: 'Michael Chen - Quality Manager' },
                      { value: 'elena_rodriguez', label: 'Elena Rodriguez - Toxicologist' },
                      { value: 'david_thompson', label: 'David Thompson - Regulatory Affairs Manager' }
                    ]
                  },
                  {
                    id: 'approvalStatus',
                    label: 'Approval Status',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'pending_review', label: 'Pending Review' },
                      { value: 'under_review', label: 'Under Review' },
                      { value: 'approved', label: 'Approved for Use' },
                      { value: 'approved_with_conditions', label: 'Approved with Conditions' },
                      { value: 'rejected', label: 'Rejected' },
                      { value: 'requires_revision', label: 'Requires Revision' }
                    ]
                  },
                  {
                    id: 'approvalConditions',
                    label: 'Approval Conditions',
                    type: 'textarea',
                    placeholder: 'Any conditions or restrictions for approval',
                    helpText: 'Specify any conditions that must be met'
                  },
                  {
                    id: 'reviewComments',
                    label: 'Review Comments',
                    type: 'richtext',
                    placeholder: 'Detailed review comments and recommendations',
                    helpText: 'Comprehensive review feedback'
                  },
                  {
                    id: 'effectiveDate',
                    label: 'Effective Date',
                    type: 'date',
                    helpText: 'Date when approval becomes effective'
                  },
                  {
                    id: 'reviewDate',
                    label: 'Next Review Date',
                    type: 'date',
                    helpText: 'Date for periodic review of this ingredient'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'generate_summary',
                label: 'Generate Summary Report',
                type: 'secondary',
                icon: 'ri-file-list-line',
                resultTransition: 'stay'
              },
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:safety_data'
              },
              {
                id: 'submit_for_approval',
                label: 'Submit for Final Approval',
                type: 'primary',
                icon: 'ri-send-plane-line',
                roles: ['ingredient_specialist', 'regulatory_manager', 'quality_manager', 'admin'],
                confirmation: {
                  title: 'Submit Ingredient for Final Approval',
                  message: 'Are you sure you want to submit this ingredient for final approval? This will lock the ingredient data and initiate the formal approval process.',
                  confirmText: 'Submit for Approval',
                  cancelText: 'Cancel'
                },
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['approvalStatus']
            }
          }
        ]
      }
    ],
    metadata: {
      category: 'ingredient_management',
      tags: ['ingredient', 'regulatory', 'compliance', 'comprehensive'],
      createdBy: 'system',
      createdAt: '2024-01-01T00:00:00Z',
      updatedBy: 'system',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  },

  Compliance: {
    id: 'compliance_template_v1',
    name: 'Compliance Assessment',
    description: 'Regulatory compliance checking and report generation for formulations',
    caseTypeId: 'Compliance',
    version: '1.0.0',
    settings: {
      allowSaveAsDraft: true,
      requireAllStages: false,
      enableAutosave: true,
      autosaveInterval: 30000
    },
    stages: [
      {
        id: 'config',
        name: 'Configuration',
        description: 'Configure compliance run parameters and target markets',
        icon: 'ri-settings-3-line',
        steps: [
          {
            id: 'compliance_config',
            name: 'Compliance Configuration',
            description: 'Set up compliance check parameters and target regulations',
            fieldSets: [
              {
                id: 'run_configuration',
                name: 'Run Configuration',
                description: 'Basic compliance run setup and identification',
                fields: [
                  {
                    id: 'runName',
                    label: 'Compliance Run Name',
                    type: 'text',
                    required: true,
                    placeholder: 'e.g., Summer Collection 2024 - EU Compliance',
                    helpText: 'Descriptive name for this compliance assessment'
                  },
                  {
                    id: 'formulaId',
                    label: 'Target Formula',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'FORM-001', label: 'Summer Breeze EDP (FORM-001)' },
                      { value: 'FORM-002', label: 'Midnight Rose EDT (FORM-002)' },
                      { value: 'FORM-003', label: 'Citrus Fresh Cologne (FORM-003)' },
                      { value: 'FORM-004', label: 'Woody Amber Parfum (FORM-004)' }
                    ],
                    helpText: 'Select the formula to assess for compliance'
                  },
                  {
                    id: 'assessmentType',
                    label: 'Assessment Type',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'full_compliance', label: 'Full Compliance Check' },
                      { value: 'ifra_only', label: 'IFRA Guidelines Only' },
                      { value: 'allergen_only', label: 'Allergen Assessment Only' },
                      { value: 'custom', label: 'Custom Assessment' }
                    ],
                    defaultValue: 'full_compliance'
                  },
                  {
                    id: 'priority',
                    label: 'Priority Level',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'low', label: 'Low - Standard Review' },
                      { value: 'medium', label: 'Medium - Priority Review' },
                      { value: 'high', label: 'High - Urgent Review' },
                      { value: 'critical', label: 'Critical - Emergency Review' }
                    ],
                    defaultValue: 'medium'
                  }
                ]
              },
              {
                id: 'target_markets',
                name: 'Target Markets & Regulations',
                description: 'Specify target markets and applicable regulations',
                fields: [
                  {
                    id: 'targetMarkets',
                    label: 'Target Markets',
                    type: 'multiselect',
                    required: true,
                    options: [
                      { value: 'eu', label: 'European Union (EU)' },
                      { value: 'usa', label: 'United States (USA)' },
                      { value: 'canada', label: 'Canada' },
                      { value: 'uk', label: 'United Kingdom' },
                      { value: 'australia', label: 'Australia' },
                      { value: 'japan', label: 'Japan' },
                      { value: 'china', label: 'China' },
                      { value: 'brazil', label: 'Brazil' }
                    ],
                    helpText: 'Select all target markets for regulatory compliance'
                  },
                  {
                    id: 'regulatoryFrameworks',
                    label: 'Regulatory Frameworks',
                    type: 'multiselect',
                    required: true,
                    options: [
                      { value: 'ifra_standards', label: 'IFRA Standards (Latest)' },
                      { value: 'eu_cosmetics_regulation', label: 'EU Cosmetics Regulation 1223/2009' },
                      { value: 'fda_regulations', label: 'FDA Cosmetic Regulations' },
                      { value: 'health_canada', label: 'Health Canada Cosmetic Regulations' },
                      { value: 'reach_regulation', label: 'REACH Regulation (EU)' },
                      { value: 'cpnp_requirements', label: 'CPNP Notification Requirements' }
                    ],
                    defaultValue: ['ifra_standards', 'eu_cosmetics_regulation']
                  },
                  {
                    id: 'productCategories',
                    label: 'Product Categories (IFRA)',
                    type: 'multiselect',
                    required: true,
                    options: [
                      { value: 'category_1', label: 'Category 1 - Lip products' },
                      { value: 'category_2', label: 'Category 2 - Deodorants/antiperspirants' },
                      { value: 'category_3', label: 'Category 3 - Eye area products' },
                      { value: 'category_4', label: 'Category 4 - Fine fragrance' },
                      { value: 'category_5', label: 'Category 5 - Face/body products (except hands)' },
                      { value: 'category_6', label: 'Category 6 - Hand products' },
                      { value: 'category_7', label: 'Category 7 - Baby products' },
                      { value: 'category_8', label: 'Category 8 - Hair styling products' },
                      { value: 'category_9', label: 'Category 9 - Shampoos/conditioners' },
                      { value: 'category_10', label: 'Category 10 - Household cleaners' },
                      { value: 'category_11', label: 'Category 11 - Air care products' }
                    ],
                    helpText: 'Select applicable IFRA product categories'
                  }
                ]
              },
              {
                id: 'assessment_options',
                name: 'Assessment Options',
                description: 'Configure specific assessment parameters and thresholds',
                fields: [
                  {
                    id: 'includeAllergenAnalysis',
                    label: 'Include Allergen Analysis',
                    type: 'checkbox',
                    defaultValue: true,
                    helpText: 'Analyze for the 26 EU allergens requiring declaration'
                  },
                  {
                    id: 'includeToxicologyReview',
                    label: 'Include Toxicology Review',
                    type: 'checkbox',
                    defaultValue: true,
                    helpText: 'Review toxicological data and safety assessments'
                  },
                  {
                    id: 'includeUsageLimits',
                    label: 'Check Usage Limits',
                    type: 'checkbox',
                    defaultValue: true,
                    helpText: 'Verify compliance with maximum usage concentrations'
                  },
                  {
                    id: 'generateLabeling',
                    label: 'Generate Labeling Requirements',
                    type: 'checkbox',
                    defaultValue: true,
                    helpText: 'Generate required labeling and declaration text'
                  },
                  {
                    id: 'customThresholds',
                    label: 'Custom Safety Thresholds',
                    type: 'table',
                    columns: [
                      { key: 'parameter', label: 'Parameter', type: 'text' },
                      { key: 'standardValue', label: 'Standard Limit', type: 'text' },
                      { key: 'customValue', label: 'Custom Limit', type: 'number' },
                      { key: 'justification', label: 'Justification', type: 'text' }
                    ],
                    helpText: 'Override standard limits with custom thresholds (requires justification)'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_config',
                label: 'Save Configuration',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'runName': 'compliance_run_name',
                  'formulaId': 'target_formula_id',
                  'targetMarkets': 'target_markets',
                  'regulatoryFrameworks': 'regulatory_frameworks',
                  'productCategories': 'ifra_categories'
                },
                resultTransition: 'stay'
              },
              {
                id: 'next_step',
                label: 'Next: Run Analysis',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['runName', 'formulaId', 'assessmentType', 'targetMarkets', 'regulatoryFrameworks', 'productCategories']
            }
          }
        ]
      },
      {
        id: 'run',
        name: 'Analysis Run',
        description: 'Execute compliance analysis and generate findings',
        icon: 'ri-play-circle-line',
        steps: [
          {
            id: 'execute_analysis',
            name: 'Execute Compliance Analysis',
            description: 'Run automated compliance checks and analysis',
            fieldSets: [
              {
                id: 'run_status',
                name: 'Analysis Status',
                description: 'Current status of the compliance analysis run',
                fields: [
                  {
                    id: 'runStatus',
                    label: 'Run Status',
                    type: 'text',
                    disabled: true,
                    defaultValue: 'Ready to Execute',
                    helpText: 'Current status of the compliance analysis'
                  },
                  {
                    id: 'estimatedDuration',
                    label: 'Estimated Duration',
                    type: 'text',
                    disabled: true,
                    defaultValue: '3-5 minutes',
                    helpText: 'Expected time to complete analysis'
                  },
                  {
                    id: 'analysisProgress',
                    label: 'Analysis Progress',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'step', label: 'Analysis Step', type: 'text' },
                      { key: 'status', label: 'Status', type: 'text' },
                      { key: 'completion', label: 'Progress', type: 'text' }
                    ],
                    defaultValue: [
                      { step: 'Formula Validation', status: 'Pending', completion: '0%' },
                      { step: 'IFRA Standards Check', status: 'Pending', completion: '0%' },
                      { step: 'Allergen Analysis', status: 'Pending', completion: '0%' },
                      { step: 'Usage Limit Verification', status: 'Pending', completion: '0%' },
                      { step: 'Toxicology Review', status: 'Pending', completion: '0%' },
                      { step: 'Labeling Generation', status: 'Pending', completion: '0%' },
                      { step: 'Report Compilation', status: 'Pending', completion: '0%' }
                    ]
                  }
                ]
              },
              {
                id: 'run_parameters',
                name: 'Run Parameters Summary',
                description: 'Summary of configured analysis parameters',
                fields: [
                  {
                    id: 'configSummary',
                    label: 'Configuration Summary',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'parameter', label: 'Parameter', type: 'text' },
                      { key: 'value', label: 'Value', type: 'text' }
                    ]
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'start_analysis',
                label: 'Start Compliance Analysis',
                type: 'primary',
                icon: 'ri-play-line',
                payloadMap: {
                  'runName': 'compliance_run_name',
                  'formulaId': 'target_formula_id',
                  'targetMarkets': 'target_markets',
                  'regulatoryFrameworks': 'regulatory_frameworks',
                  'productCategories': 'ifra_categories',
                  'includeAllergenAnalysis': 'analyze_allergens',
                  'includeToxicologyReview': 'review_toxicology',
                  'includeUsageLimits': 'check_usage_limits',
                  'generateLabeling': 'generate_labeling'
                },
                resultTransition: 'advance',
                confirmation: {
                  title: 'Start Compliance Analysis',
                  message: 'This will execute a comprehensive compliance analysis based on your configuration. The process typically takes 3-5 minutes.',
                  confirmText: 'Start Analysis',
                  cancelText: 'Cancel'
                }
              },
              {
                id: 'previous',
                label: 'Previous: Configuration',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:compliance_config'
              }
            ]
          }
        ]
      },
      {
        id: 'report',
        name: 'Compliance Report',
        description: 'View and export comprehensive compliance report',
        icon: 'ri-file-text-line',
        steps: [
          {
            id: 'compliance_report',
            name: 'Compliance Report',
            description: 'Comprehensive compliance analysis results and recommendations',
            fieldSets: [
              {
                id: 'report_header',
                name: 'Report Summary',
                description: 'Executive summary of compliance analysis results',
                fields: [
                  {
                    id: 'reportSummary',
                    label: 'Compliance Summary',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'metric', label: 'Metric', type: 'text' },
                      { key: 'value', label: 'Value', type: 'text' },
                      { key: 'status', label: 'Status', type: 'text' }
                    ]
                  },
                  {
                    id: 'overallCompliance',
                    label: 'Overall Compliance Status',
                    type: 'text',
                    disabled: true,
                    helpText: 'Overall compliance assessment result'
                  }
                ]
              },
              {
                id: 'ifra_analysis',
                name: 'IFRA Standards Analysis',
                description: 'Detailed IFRA compliance assessment by category',
                fields: [
                  {
                    id: 'ifraResults',
                    label: 'IFRA Compliance Results',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'ingredient', label: 'Ingredient', type: 'text' },
                      { key: 'category', label: 'IFRA Category', type: 'text' },
                      { key: 'currentUsage', label: 'Current Usage %', type: 'text' },
                      { key: 'maxAllowed', label: 'Max Allowed %', type: 'text' },
                      { key: 'complianceStatus', label: 'Status', type: 'text' },
                      { key: 'recommendation', label: 'Recommendation', type: 'text' }
                    ]
                  }
                ]
              },
              {
                id: 'allergen_analysis',
                name: 'Allergen Analysis',
                description: 'EU allergen declaration requirements and analysis',
                fields: [
                  {
                    id: 'allergenResults',
                    label: 'Allergen Declaration Requirements',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'allergen', label: 'Allergen', type: 'text' },
                      { key: 'source', label: 'Source Ingredient', type: 'text' },
                      { key: 'concentration', label: 'Concentration %', type: 'text' },
                      { key: 'threshold', label: 'Declaration Threshold', type: 'text' },
                      { key: 'declarationRequired', label: 'Declaration Required', type: 'text' }
                    ]
                  },
                  {
                    id: 'allergenDeclarationText',
                    label: 'Required Allergen Declaration Text',
                    type: 'richtext',
                    disabled: true,
                    helpText: 'Generated allergen declaration text for product labeling'
                  }
                ]
              },
              {
                id: 'labeling_requirements',
                name: 'Labeling Requirements',
                description: 'Generated labeling text and regulatory requirements',
                fields: [
                  {
                    id: 'labelingRequirements',
                    label: 'Market-Specific Labeling Requirements',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'market', label: 'Market', type: 'text' },
                      { key: 'requirement', label: 'Requirement', type: 'text' },
                      { key: 'labelingText', label: 'Required Text', type: 'text' },
                      { key: 'placement', label: 'Placement', type: 'text' }
                    ]
                  },
                  {
                    id: 'inci',
                    label: 'INCI Declaration',
                    type: 'richtext',
                    disabled: true,
                    helpText: 'Complete INCI (International Nomenclature of Cosmetic Ingredients) listing'
                  }
                ]
              },
              {
                id: 'recommendations',
                name: 'Recommendations & Actions',
                description: 'Compliance recommendations and required actions',
                fields: [
                  {
                    id: 'complianceIssues',
                    label: 'Compliance Issues',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'severity', label: 'Severity', type: 'text' },
                      { key: 'issue', label: 'Issue Description', type: 'text' },
                      { key: 'regulation', label: 'Affected Regulation', type: 'text' },
                      { key: 'recommendation', label: 'Recommended Action', type: 'text' },
                      { key: 'deadline', label: 'Action Deadline', type: 'text' }
                    ]
                  },
                  {
                    id: 'nextSteps',
                    label: 'Next Steps',
                    type: 'richtext',
                    disabled: true,
                    helpText: 'Recommended next steps for achieving full compliance'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_report',
                label: 'Save Report',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'reportSummary': 'compliance_summary',
                  'ifraResults': 'ifra_analysis_results',
                  'allergenResults': 'allergen_analysis_results',
                  'labelingRequirements': 'labeling_requirements',
                  'complianceIssues': 'compliance_issues'
                },
                resultTransition: 'stay'
              },
              {
                id: 'print_report',
                label: 'Print Report',
                type: 'secondary',
                icon: 'ri-printer-line',
                resultTransition: 'stay'
              },
              {
                id: 'export_pdf',
                label: 'Export as PDF',
                type: 'secondary',
                icon: 'ri-file-pdf-line',
                resultTransition: 'stay'
              },
              {
                id: 'create_action_items',
                label: 'Create Action Items',
                type: 'primary',
                icon: 'ri-task-line',
                roles: ['compliance_manager', 'quality_manager', 'admin'],
                payloadMap: {
                  'complianceIssues': 'identified_issues',
                  'recommendations': 'action_recommendations'
                },
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous: Analysis',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:execute_analysis'
              }
            ]
          }
        ]
      }
    ],
    metadata: {
      category: 'regulatory_compliance',
      tags: ['compliance', 'regulatory', 'ifra', 'allergens'],
      createdBy: 'system',
      createdAt: '2024-01-01T00:00:00Z',
      updatedBy: 'system',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  },

  Formula: {
    id: 'formula_template_v1',
    name: 'Formula Development',
    description: 'Complete workflow for fragrance formula creation and optimization with mathematical tools',
    caseTypeId: 'Formula',
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
        name: 'Formula Basics',
        description: 'Define formula basic information and objectives',
        icon: 'ri-flask-line',
        steps: [
          {
            id: 'formula_identity',
            name: 'Formula Identity',
            description: 'Define formula basic information and batch specifications',
            fieldSets: [
              {
                ...CATALOG_FIELD_SETS.Identity,
                fields: [
                  ...CATALOG_FIELD_SETS.Identity.fields,
                  {
                    id: 'formulaType',
                    label: 'Formula Type',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'edt', label: 'Eau de Toilette (EDT)' },
                      { value: 'edp', label: 'Eau de Parfum (EDP)' },
                      { value: 'parfum', label: 'Parfum' },
                      { value: 'cologne', label: 'Cologne' },
                      { value: 'compound', label: 'Fragrance Compound' }
                    ]
                  },
                  {
                    id: 'concentration',
                    label: 'Target Concentration (%)',
                    type: 'number',
                    required: true,
                    validation: {
                      min: 0.1,
                      max: 40,
                      message: 'Concentration must be between 0.1% and 40%'
                    }
                  },
                  {
                    id: 'batchSize',
                    label: 'Batch Size (ml)',
                    type: 'number',
                    required: true,
                    defaultValue: 100,
                    validation: {
                      min: 1,
                      max: 10000,
                      message: 'Batch size must be between 1ml and 10000ml'
                    }
                  },
                  {
                    id: 'yieldFactor',
                    label: 'Expected Yield Factor',
                    type: 'number',
                    defaultValue: 0.95,
                    validation: {
                      min: 0.5,
                      max: 1.0,
                      message: 'Yield factor must be between 0.5 and 1.0'
                    },
                    helpText: 'Expected manufacturing yield (e.g., 0.95 = 95% yield)'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'name': 'formulaName',
                  'code': 'formulaCode',
                  'formulaType': 'formula_type',
                  'concentration': 'target_concentration',
                  'batchSize': 'batch_size_ml',
                  'yieldFactor': 'yield_factor'
                },
                resultTransition: 'stay'
              },
              {
                id: 'next_step',
                label: 'Next: Composition',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['name', 'code', 'formulaType', 'concentration', 'batchSize']
            }
          }
        ]
      },
      {
        id: 'composition',
        name: 'Composition',
        description: 'Define ingredient composition and ratios',
        icon: 'ri-pie-chart-line',
        steps: [
          {
            id: 'ingredient_composition',
            name: 'Ingredient Composition',
            description: 'Add ingredients and define their proportions with real-time calculations',
            fieldSets: [
              {
                id: 'composition_table',
                name: 'Formula Composition',
                description: 'Detailed ingredient breakdown with percentages and weights',
                fields: [
                  {
                    id: 'ingredients',
                    label: 'Formula Ingredients',
                    type: 'table',
                    columns: [
                      { key: 'ingredientCode', label: 'Code', type: 'text', required: true },
                      { key: 'ingredientName', label: 'Ingredient Name', type: 'text', required: true },
                      { key: 'percentage', label: 'Percentage (%)', type: 'number', required: true },
                      { key: 'weight', label: 'Weight (ml)', type: 'number' },
                      { key: 'adjustedWeight', label: 'Adjusted Weight (ml)', type: 'number' },
                      { key: 'function', label: 'Function', type: 'select', required: true, options: [
                        { value: 'top_note', label: 'Top Note' },
                        { value: 'middle_note', label: 'Middle Note' },
                        { value: 'base_note', label: 'Base Note' },
                        { value: 'modifier', label: 'Modifier' },
                        { value: 'fixative', label: 'Fixative' }
                      ]},
                      { key: 'supplier', label: 'Supplier', type: 'text' },
                      { key: 'costPerMl', label: 'Cost/ml', type: 'number' }
                    ]
                  },
                  {
                    id: 'calculatedTotals',
                    label: 'Calculated Totals',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'metric', label: 'Metric', type: 'text' },
                      { key: 'value', label: 'Value', type: 'text' },
                      { key: 'unit', label: 'Unit', type: 'text' }
                    ],
                    helpText: 'Automatically calculated totals and percentages'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'ingredients': 'formula_composition',
                  'calculatedTotals': 'composition_totals'
                },
                resultTransition: 'stay'
              },
              {
                id: 'prev_step',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:formula_identity'
              },
              {
                id: 'next_step',
                label: 'Next: Tools',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['ingredients'],
              custom: (data) => {
                const ingredients = data.ingredients || [];
                if (ingredients.length === 0) {
                  return 'At least one ingredient is required';
                }
                return null;
              }
            }
          }
        ]
      },
      {
        id: 'tools',
        name: 'Formula Tools',
        description: 'Mathematical tools and calculations for formula optimization',
        icon: 'ri-calculator-line',
        steps: [
          {
            id: 'formula_tools',
            name: 'Mathematical Tools',
            description: 'Use mathematical tools to optimize and adjust your formula',
            fieldSets: [
              {
                id: 'batch_calculator',
                name: 'Batch Calculator',
                description: 'Adjust batch size while preserving ingredient ratios',
                fields: [
                  {
                    id: 'newBatchSize',
                    label: 'New Batch Size (ml)',
                    type: 'number',
                    placeholder: '100',
                    validation: {
                      min: 1,
                      max: 10000,
                      message: 'Batch size must be between 1ml and 10000ml'
                    },
                    helpText: 'Enter new batch size to recalculate all ingredient weights'
                  }
                ]
              },
              {
                id: 'normalization_tools',
                name: 'Normalization & Yield Tools',
                description: 'Tools for percentage normalization and yield calculations',
                fields: [
                  {
                    id: 'normalizeInfo',
                    label: 'Normalize to 100%',
                    type: 'text',
                    disabled: true,
                    defaultValue: 'Adjusts all percentages proportionally to total 100%',
                    helpText: 'Click Normalize button to adjust percentages while preserving ratios'
                  },
                  {
                    id: 'yieldAdjustment',
                    label: 'Yield Adjustment Factor',
                    type: 'number',
                    defaultValue: 0.95,
                    validation: {
                      min: 0.5,
                      max: 1.0,
                      message: 'Yield factor must be between 0.5 and 1.0'
                    },
                    helpText: 'Factor to account for manufacturing losses (e.g., 0.95 = 5% loss)'
                  }
                ]
              },
              {
                id: 'version_management',
                name: 'Version Management',
                description: 'Save and compare formula versions',
                fields: [
                  {
                    id: 'versionNotes',
                    label: 'Version Notes',
                    type: 'richtext',
                    placeholder: 'Describe changes made in this version...',
                    helpText: 'Document what changes were made and why'
                  },
                  {
                    id: 'currentVersion',
                    label: 'Current Version',
                    type: 'text',
                    disabled: true,
                    defaultValue: '1.0.0',
                    helpText: 'Current formula version number'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'recalculate_batch',
                label: 'Recalculate Batch',
                type: 'secondary',
                icon: 'ri-refresh-line',
                resultTransition: 'stay'
              },
              {
                id: 'normalize_to_100',
                label: 'Normalize to 100%',
                type: 'secondary',
                icon: 'ri-percent-line',
                resultTransition: 'stay'
              },
              {
                id: 'apply_yield',
                label: 'Apply Yield Factor',
                type: 'secondary',
                icon: 'ri-calculator-line',
                resultTransition: 'stay'
              },
              {
                id: 'save_version',
                label: 'Save Version',
                type: 'secondary',
                icon: 'ri-save-3-line',
                resultTransition: 'stay'
              },
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'ingredients': 'formula_composition',
                  'batchSize': 'batch_size_ml',
                  'yieldFactor': 'yield_factor',
                  'versionNotes': 'version_notes'
                },
                resultTransition: 'stay'
              },
              {
                id: 'prev_step',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:ingredient_composition'
              },
              {
                id: 'next_step',
                label: 'Next: Review',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ]
          }
        ]
      },
      {
        id: 'review',
        name: 'Formula Review',
        description: 'Review formula and compare versions',
        icon: 'ri-check-double-line',
        steps: [
          {
            id: 'formula_review',
            name: 'Final Review & Comparison',
            description: 'Review complete formula and compare with previous versions',
            include: [
              {
                catalogId: 'Audit'
              }
            ],
            fieldSets: [
              {
                id: 'formula_summary',
                name: 'Formula Summary',
                description: 'Complete formula overview and calculations',
                fields: [
                  {
                    id: 'formulaSummary',
                    label: 'Formula Summary',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'metric', label: 'Metric', type: 'text' },
                      { key: 'value', label: 'Value', type: 'text' },
                      { key: 'notes', label: 'Notes', type: 'text' }
                    ]
                  },
                  {
                    id: 'costAnalysis',
                    label: 'Cost Analysis',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'component', label: 'Component', type: 'text' },
                      { key: 'cost', label: 'Cost (USD)', type: 'text' },
                      { key: 'percentage', label: '% of Total', type: 'text' }
                    ]
                  }
                ]
              },
              {
                id: 'version_comparison',
                name: 'Version Comparison',
                description: 'Compare current formula with previous versions',
                fields: [
                  {
                    id: 'compareWithVersion',
                    label: 'Compare With Version',
                    type: 'select',
                    options: [],
                    helpText: 'Select a previous version to compare with current formula'
                  },
                  {
                    id: 'comparisonResults',
                    label: 'Version Differences',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'ingredient', label: 'Ingredient', type: 'text' },
                      { key: 'previousValue', label: 'Previous', type: 'text' },
                      { key: 'currentValue', label: 'Current', type: 'text' },
                      { key: 'change', label: 'Change', type: 'text' },
                      { key: 'changeType', label: 'Type', type: 'text' }
                    ]
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'compare_versions',
                label: 'Compare Versions',
                type: 'secondary',
                icon: 'ri-git-compare-line',
                resultTransition: 'stay'
              },
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'status': 'formula_status'
                },
                resultTransition: 'stay'
              },
              {
                id: 'prev_step',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:formula_tools'
              },
              {
                id: 'submit_for_approval',
                label: 'Submit for Approval',
                type: 'primary',
                icon: 'ri-send-plane-line',
                roles: ['formula_developer', 'senior_perfumer', 'admin'],
                payloadMap: {
                  'status': 'formula_status',
                  'name': 'formulaName',
                  'code': 'formulaCode',
                  'ingredients': 'formula_composition',
                  'formulaSummary': 'formula_summary',
                  'costAnalysis': 'cost_breakdown'
                },
                resultTransition: 'advance',
                confirmation: {
                  title: 'Submit Formula for Approval',
                  message: 'Are you sure you want to submit this formula for approval? This will lock the composition and send it for review.',
                  confirmText: 'Submit for Approval',
                  cancelText: 'Cancel'
                }
              }
            ],
            validation: {
              required: ['status']
            }
          }
        ]
      }
    ],
    metadata: {
      category: 'formula_development',
      tags: ['formula', 'fragrance', 'composition', 'mathematics'],
      createdBy: 'system',
      createdAt: '2024-01-01T00:00:00Z',
      updatedBy: 'system',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  },

  Palette: {
    id: 'palette_template_v1',
    name: 'Scent Palette',
    description: 'Curated collection of fragrance ingredients organized by theme or style',
    caseTypeId: 'Palette',
    version: '1.0.0',
    settings: {
      allowSaveAsDraft: true,
      requireAllStages: false,
      enableAutosave: true,
      autosaveInterval: 30000
    },
    stages: [
      {
        id: 'palette_setup',
        name: 'Palette Setup',
        description: 'Define palette theme and organization',
        icon: 'ri-palette-line',
        steps: [
          {
            id: 'palette_identity',
            name: 'Palette Identity',
            description: 'Define palette name, theme, and intended use',
            include: [
              {
                catalogId: 'Identity',
                fieldOverrides: [
                  {
                    fieldId: 'category',
                    label: 'Palette Theme',
                    options: [
                      { value: 'seasonal', label: 'Seasonal Collection' },
                      { value: 'mood', label: 'Mood-based' },
                      { value: 'geographic', label: 'Geographic Inspiration' },
                      { value: 'botanical', label: 'Botanical Family' },
                      { value: 'synthetic', label: 'Synthetic Molecules' },
                      { value: 'vintage', label: 'Vintage Classics' },
                      { value: 'modern', label: 'Modern Innovations' }
                    ]
                  },
                  {
                    fieldId: 'description',
                    label: 'Palette Description',
                    helpText: 'Describe the theme, inspiration, and intended use of this palette',
                    placeholder: 'Enter detailed palette description and curation notes...'
                  }
                ]
              }
            ],
            fieldSets: [
              {
                id: 'palette_details',
                name: 'Palette Configuration',
                description: 'Additional palette settings and classification',
                fields: [
                  {
                    id: 'intendedUse',
                    label: 'Intended Use',
                    type: 'multiselect',
                    required: true,
                    options: [
                      { value: 'education', label: 'Educational Training' },
                      { value: 'inspiration', label: 'Creative Inspiration' },
                      { value: 'client_presentation', label: 'Client Presentations' },
                      { value: 'formula_development', label: 'Formula Development' },
                      { value: 'trend_analysis', label: 'Trend Analysis' }
                    ]
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line'
              },
              {
                id: 'next_step',
                label: 'Next: Ingredient Selection',
                type: 'primary',
                icon: 'ri-arrow-right-line'
              }
            ],
            validation: {
              required: ['name', 'code', 'category', 'intendedUse']
            }
          }
        ]
      },
      {
        id: 'ingredient_curation',
        name: 'Ingredient Curation',
        description: 'Select and organize ingredients within the palette',
        icon: 'ri-list-check-3',
        steps: [
          {
            id: 'ingredient_selection',
            name: 'Ingredient Selection',
            description: 'Curate ingredients that fit the palette theme',
            fieldSets: [
              {
                id: 'palette_ingredients',
                name: 'Palette Ingredients',
                description: 'Curated ingredient collection with organization notes',
                fields: [
                  {
                    id: 'paletteIngredients',
                    label: 'Selected Ingredients',
                    type: 'table',
                    columns: [
                      { key: 'ingredientCode', label: 'Ingredient Code', type: 'text', required: true },
                      { key: 'ingredientName', label: 'Ingredient Name', type: 'text', required: true },
                      { key: 'category', label: 'Category', type: 'select', required: true, options: [
                        { value: 'top_note', label: 'Top Note' },
                        { value: 'middle_note', label: 'Middle Note' },
                        { value: 'base_note', label: 'Base Note' },
                        { value: 'modifier', label: 'Modifier' },
                        { value: 'accent', label: 'Accent' }
                      ]},
                      { key: 'paletteRole', label: 'Palette Role', type: 'text' },
                      { key: 'notes', label: 'Curator Notes', type: 'text' }
                    ]
                  },
                  {
                    id: 'paletteNotes',
                    label: 'Palette Curation Notes',
                    type: 'richtext',
                    placeholder: 'Document the curatorial decisions, harmony principles, and usage guidance for this palette',
                    helpText: 'Explain the relationships between ingredients and usage recommendations'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line'
              },
              {
                id: 'prev_step',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line'
              },
              {
                id: 'next_step',
                label: 'Next: Finalize',
                type: 'primary',
                icon: 'ri-arrow-right-line'
              }
            ],
            validation: {
              required: ['paletteIngredients'],
              custom: (data) => {
                const ingredients = data.paletteIngredients || [];
                if (ingredients.length < 3) {
                  return 'A palette must contain at least 3 ingredients';
                }
                return null;
              }
            }
          }
        ]
      },
      {
        id: 'palette_finalization',
        name: 'Palette Finalization',
        description: 'Complete and publish the scent palette',
        icon: 'ri-check-double-line',
        steps: [
          {
            id: 'palette_completion',
            name: 'Palette Completion',
            description: 'Finalize palette and make available for use',
            include: [
              {
                catalogId: 'Audit',
                fieldOverrides: [
                  {
                    fieldId: 'status',
                    label: 'Palette Status',
                    helpText: 'Select the current status of this palette'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line'
              },
              {
                id: 'prev_step',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line'
              },
              {
                id: 'publish_palette',
                label: 'Publish Palette',
                type: 'primary',
                icon: 'ri-share-line',
                confirmation: {
                  title: 'Publish Palette',
                  message: 'Are you sure you want to publish this palette? It will become available to all authorized users.',
                  confirmText: 'Publish',
                  cancelText: 'Cancel'
                }
              }
            ],
            validation: {
              required: ['status']
            }
          }
        ]
      }
    ],
    metadata: {
      category: 'palette_management',
      tags: ['palette', 'curation', 'ingredients'],
      createdBy: 'system',
      createdAt: '2024-01-01T00:00:00Z',
      updatedBy: 'system',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  },

  Project: {
    id: 'project_template_v1',
    name: 'Project Management',
    description: 'Comprehensive project organization with milestones and formula linking',
    caseTypeId: 'Project',
    version: '1.0.0',
    settings: {
      allowSaveAsDraft: true,
      requireAllStages: false,
      enableAutosave: true,
      autosaveInterval: 30000
    },
    stages: [
      {
        id: 'overview',
        name: 'Project Overview',
        description: 'Define project identity and objectives',
        icon: 'ri-dashboard-line',
        steps: [
          {
            id: 'project_identity',
            name: 'Project Identity',
            description: 'Define project basic information and scope',
            include: [
              {
                catalogId: 'Identity',
                fieldOverrides: [
                  {
                    fieldId: 'category',
                    label: 'Project Type',
                    options: [
                      { value: 'product_development', label: 'Product Development' },
                      { value: 'fragrance_collection', label: 'Fragrance Collection' },
                      { value: 'regulatory_compliance', label: 'Regulatory Compliance' },
                      { value: 'market_launch', label: 'Market Launch' },
                      { value: 'research_development', label: 'Research & Development' },
                      { value: 'client_project', label: 'Client Project' }
                    ]
                  },
                  {
                    fieldId: 'description',
                    label: 'Project Description',
                    helpText: 'Detailed description of project goals, scope, and deliverables',
                    placeholder: 'Describe the project objectives, key deliverables, target market, and success criteria...'
                  }
                ]
              }
            ],
            fieldSets: [
              {
                id: 'project_details',
                name: 'Project Configuration',
                description: 'Additional project settings and parameters',
                fields: [
                  {
                    id: 'projectManager',
                    label: 'Project Manager',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'sarah_johnson', label: 'Sarah Johnson - Senior PM' },
                      { value: 'michael_chen', label: 'Michael Chen - Lead PM' },
                      { value: 'elena_rodriguez', label: 'Elena Rodriguez - Creative PM' },
                      { value: 'david_thompson', label: 'David Thompson - Technical PM' }
                    ],
                    helpText: 'Assigned project manager responsible for coordination'
                  },
                  {
                    id: 'priority',
                    label: 'Project Priority',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'low', label: 'Low Priority' },
                      { value: 'medium', label: 'Medium Priority' },
                      { value: 'high', label: 'High Priority' },
                      { value: 'critical', label: 'Critical Priority' }
                    ],
                    defaultValue: 'medium'
                  },
                  {
                    id: 'startDate',
                    label: 'Project Start Date',
                    type: 'date',
                    required: true,
                    defaultValue: new Date().toISOString().split('T')[0]
                  },
                  {
                    id: 'targetEndDate',
                    label: 'Target End Date',
                    type: 'date',
                    required: true,
                    helpText: 'Expected project completion date'
                  },
                  {
                    id: 'budget',
                    label: 'Project Budget (USD)',
                    type: 'number',
                    validation: {
                      min: 0,
                      message: 'Budget must be a positive number'
                    },
                    helpText: 'Total allocated budget for the project'
                  },
                  {
                    id: 'teamMembers',
                    label: 'Team Members',
                    type: 'multiselect',
                    options: [
                      { value: 'alice_martin', label: 'Alice Martin - Senior Perfumer' },
                      { value: 'bob_wilson', label: 'Bob Wilson - Lab Technician' },
                      { value: 'carol_smith', label: 'Carol Smith - Regulatory Specialist' },
                      { value: 'daniel_brown', label: 'Daniel Brown - Quality Manager' },
                      { value: 'emma_davis', label: 'Emma Davis - Marketing Lead' },
                      { value: 'frank_miller', label: 'Frank Miller - Supply Chain' },
                      { value: 'grace_lee', label: 'Grace Lee - R&D Scientist' },
                      { value: 'henry_taylor', label: 'Henry Taylor - Compliance Officer' }
                    ],
                    helpText: 'Select all team members involved in this project'
                  },
                  {
                    id: 'stakeholders',
                    label: 'Key Stakeholders',
                    type: 'richtext',
                    placeholder: 'List key stakeholders, their roles, and involvement level in the project...',
                    helpText: 'Document key stakeholders and their involvement'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'name': 'project_name',
                  'code': 'project_code',
                  'category': 'project_type',
                  'projectManager': 'assigned_project_manager',
                  'priority': 'project_priority',
                  'startDate': 'project_start_date',
                  'targetEndDate': 'project_end_date',
                  'budget': 'allocated_budget'
                },
                resultTransition: 'stay'
              },
              {
                id: 'next_step',
                label: 'Next: Milestones',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['name', 'code', 'category', 'projectManager', 'priority', 'startDate', 'targetEndDate']
            }
          }
        ]
      },
      {
        id: 'milestones',
        name: 'Project Milestones',
        description: 'Define project timeline and key milestones',
        icon: 'ri-flag-line',
        steps: [
          {
            id: 'milestone_planning',
            name: 'Milestone Planning',
            description: 'Create and organize project milestones and timeline',
            fieldSets: [
              {
                id: 'project_timeline',
                name: 'Project Timeline',
                description: 'Define project phases and key milestones',
                fields: [
                  {
                    id: 'projectPhases',
                    label: 'Project Phases',
                    type: 'table',
                    columns: [
                      { key: 'phaseName', label: 'Phase Name', type: 'text', required: true },
                      { key: 'description', label: 'Description', type: 'text' },
                      { key: 'startDate', label: 'Start Date', type: 'date', required: true },
                      { key: 'endDate', label: 'End Date', type: 'date', required: true },
                      { key: 'owner', label: 'Phase Owner', type: 'select', required: true, options: [
                        { value: 'sarah_johnson', label: 'Sarah Johnson' },
                        { value: 'alice_martin', label: 'Alice Martin' },
                        { value: 'daniel_brown', label: 'Daniel Brown' },
                        { value: 'emma_davis', label: 'Emma Davis' }
                      ]},
                      { key: 'status', label: 'Status', type: 'select', required: true, options: [
                        { value: 'not_started', label: 'Not Started' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'on_hold', label: 'On Hold' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ]}
                    ],
                    helpText: 'Define the major phases of your project'
                  },
                  {
                    id: 'keyMilestones',
                    label: 'Key Milestones',
                    type: 'table',
                    columns: [
                      { key: 'milestoneName', label: 'Milestone Name', type: 'text', required: true },
                      { key: 'description', label: 'Description', type: 'text' },
                      { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
                      { key: 'priority', label: 'Priority', type: 'select', required: true, options: [
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' },
                        { value: 'critical', label: 'Critical' }
                      ]},
                      { key: 'assignee', label: 'Assignee', type: 'select', required: true, options: [
                        { value: 'sarah_johnson', label: 'Sarah Johnson' },
                        { value: 'alice_martin', label: 'Alice Martin' },
                        { value: 'bob_wilson', label: 'Bob Wilson' },
                        { value: 'carol_smith', label: 'Carol Smith' },
                        { value: 'daniel_brown', label: 'Daniel Brown' },
                        { value: 'emma_davis', label: 'Emma Davis' }
                      ]},
                      { key: 'status', label: 'Status', type: 'select', required: true, options: [
                        { value: 'pending', label: 'Pending' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'overdue', label: 'Overdue' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ]},
                      { key: 'completionPercentage', label: 'Progress (%)', type: 'number', validation: { min: 0, max: 100 } }
                    ],
                    helpText: 'Define specific milestones and deliverables'
                  }
                ]
              },
              {
                id: 'timeline_visualization',
                name: 'Timeline Overview',
                description: 'Visual representation of project timeline',
                fields: [
                  {
                    id: 'timelineView',
                    label: 'Project Timeline',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'item', label: 'Item', type: 'text' },
                      { key: 'type', label: 'Type', type: 'text' },
                      { key: 'startDate', label: 'Start Date', type: 'text' },
                      { key: 'endDate', label: 'End/Due Date', type: 'text' },
                      { key: 'status', label: 'Status', type: 'text' },
                      { key: 'progress', label: 'Progress', type: 'text' }
                    ],
                    helpText: 'Combined view of phases and milestones'
                  },
                  {
                    id: 'projectMetrics',
                    label: 'Project Metrics',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'metric', label: 'Metric', type: 'text' },
                      { key: 'value', label: 'Value', type: 'text' },
                      { key: 'status', label: 'Status', type: 'text' }
                    ],
                    helpText: 'Key project performance indicators'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'projectPhases': 'project_phases',
                  'keyMilestones': 'project_milestones'
                },
                resultTransition: 'stay'
              },
              {
                id: 'update_timeline',
                label: 'Update Timeline View',
                type: 'secondary',
                icon: 'ri-refresh-line',
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:project_identity'
              },
              {
                id: 'next_step',
                label: 'Next: Linked Formulas',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['projectPhases', 'keyMilestones'],
              custom: (data) => {
                const phases = data.projectPhases || [];
                const milestones = data.keyMilestones || [];
                if (phases.length === 0) {
                  return 'At least one project phase is required';
                }
                if (milestones.length === 0) {
                  return 'At least one milestone is required';
                }
                return null;
              }
            }
          }
        ]
      },
      {
        id: 'linked_formulas',
        name: 'Linked Formulas',
        description: 'Connect and manage project formulas',
        icon: 'ri-links-line',
        steps: [
          {
            id: 'formula_management',
            name: 'Formula Management',
            description: 'Link formulas to project and manage relationships',
            fieldSets: [
              {
                id: 'formula_linking',
                name: 'Formula Connections',
                description: 'Connect existing formulas to this project',
                fields: [
                  {
                    id: 'linkedFormulas',
                    label: 'Linked Formulas',
                    type: 'table',
                    columns: [
                      { key: 'formulaId', label: 'Formula ID', type: 'select', required: true, options: [
                        { value: 'FORM-001', label: 'FORM-001 - Summer Breeze EDP' },
                        { value: 'FORM-002', label: 'FORM-002 - Midnight Rose EDT' },
                        { value: 'FORM-003', label: 'FORM-003 - Citrus Fresh Cologne' },
                        { value: 'FORM-004', label: 'FORM-004 - Woody Amber Parfum' },
                        { value: 'FORM-005', label: 'FORM-005 - Ocean Mist EDT' },
                        { value: 'FORM-006', label: 'FORM-006 - Vanilla Dreams EDP' },
                        { value: 'FORM-007', label: 'FORM-007 - Spice Market Parfum' },
                        { value: 'FORM-008', label: 'FORM-008 - Garden Fresh Cologne' }
                      ]},
                      { key: 'formulaName', label: 'Formula Name', type: 'text', disabled: true },
                      { key: 'relationshipType', label: 'Relationship', type: 'select', required: true, options: [
                        { value: 'primary_formula', label: 'Primary Formula' },
                        { value: 'variant', label: 'Variant/Modification' },
                        { value: 'reference', label: 'Reference Formula' },
                        { value: 'inspiration', label: 'Inspiration Source' },
                        { value: 'component', label: 'Component Formula' }
                      ]},
                      { key: 'status', label: 'Status', type: 'select', required: true, options: [
                        { value: 'active', label: 'Active' },
                        { value: 'development', label: 'In Development' },
                        { value: 'testing', label: 'Testing Phase' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'archived', label: 'Archived' }
                      ]},
                      { key: 'priority', label: 'Priority', type: 'select', required: true, options: [
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' },
                        { value: 'critical', label: 'Critical' }
                      ]},
                      { key: 'assignedTo', label: 'Assigned To', type: 'select', options: [
                        { value: 'alice_martin', label: 'Alice Martin' },
                        { value: 'bob_wilson', label: 'Bob Wilson' },
                        { value: 'grace_lee', label: 'Grace Lee' },
                        { value: 'daniel_brown', label: 'Daniel Brown' }
                      ]},
                      { key: 'notes', label: 'Notes', type: 'text' }
                    ],
                    helpText: 'Link existing formulas to this project'
                  },
                  {
                    id: 'formulaHierarchy',
                    label: 'Formula Hierarchy',
                    type: 'richtext',
                    placeholder: 'Describe the relationships between linked formulas, dependencies, and development sequence...',
                    helpText: 'Document formula relationships and development hierarchy'
                  }
                ]
              },
              {
                id: 'formula_overview',
                name: 'Formula Overview',
                description: 'Summary of all linked formulas and their status',
                fields: [
                  {
                    id: 'formulaSummary',
                    label: 'Formula Summary',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'metric', label: 'Metric', type: 'text' },
                      { key: 'count', label: 'Count', type: 'text' },
                      { key: 'percentage', label: 'Percentage', type: 'text' }
                    ],
                    helpText: 'Statistical overview of linked formulas'
                  },
                  {
                    id: 'formulaStatusBreakdown',
                    label: 'Status Breakdown',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'status', label: 'Status', type: 'text' },
                      { key: 'count', label: 'Count', type: 'text' },
                      { key: 'formulas', label: 'Formulas', type: 'text' }
                    ],
                    helpText: 'Breakdown of formulas by status'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'refresh_formulas',
                label: 'Refresh Formula List',
                type: 'secondary',
                icon: 'ri-refresh-line',
                resultTransition: 'stay'
              },
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'linkedFormulas': 'project_formulas',
                  'formulaHierarchy': 'formula_relationships'
                },
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:milestone_planning'
              },
              {
                id: 'next_step',
                label: 'Next: Review',
                type: 'primary',
                icon: 'ri-arrow-right-line',
                resultTransition: 'advance'
              }
            ],
            validation: {
              required: ['linkedFormulas'],
              custom: (data) => {
                const formulas = data.linkedFormulas || [];
                if (formulas.length === 0) {
                  return 'At least one formula must be linked to the project';
                }
                return null;
              }
            }
          }
        ]
      },
      {
        id: 'review',
        name: 'Project Review',
        description: 'Review and finalize project setup',
        icon: 'ri-check-double-line',
        steps: [
          {
            id: 'project_review',
            name: 'Project Review & Approval',
            description: 'Complete project overview and approval process',
            include: [
              {
                catalogId: 'Audit',
                fieldOverrides: [
                  {
                    fieldId: 'status',
                    label: 'Project Status',
                    options: [
                      { value: 'draft', label: 'Draft' },
                      { value: 'planning', label: 'Planning' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'active', label: 'Active' },
                      { value: 'on_hold', label: 'On Hold' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'cancelled', label: 'Cancelled' }
                    ],
                    helpText: 'Current project status'
                  }
                ]
              }
            ],
            fieldSets: [
              {
                id: 'project_summary',
                name: 'Project Summary',
                description: 'Complete project overview for review',
                fields: [
                  {
                    id: 'projectOverview',
                    label: 'Project Overview',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'attribute', label: 'Attribute', type: 'text' },
                      { key: 'value', label: 'Value', type: 'text' },
                      { key: 'status', label: 'Status', type: 'text' }
                    ],
                    helpText: 'Complete project summary for approval'
                  },
                  {
                    id: 'milestoneProgress',
                    label: 'Milestone Progress',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'milestone', label: 'Milestone', type: 'text' },
                      { key: 'dueDate', label: 'Due Date', type: 'text' },
                      { key: 'status', label: 'Status', type: 'text' },
                      { key: 'progress', label: 'Progress', type: 'text' }
                    ],
                    helpText: 'Current milestone status and progress'
                  },
                  {
                    id: 'formulaStatus',
                    label: 'Linked Formula Status',
                    type: 'table',
                    disabled: true,
                    columns: [
                      { key: 'formulaId', label: 'Formula ID', type: 'text' },
                      { key: 'formulaName', label: 'Name', type: 'text' },
                      { key: 'relationship', label: 'Relationship', type: 'text' },
                      { key: 'status', label: 'Status', type: 'text' },
                      { key: 'assignee', label: 'Assignee', type: 'text' }
                    ],
                    helpText: 'Status of all linked formulas'
                  }
                ]
              },
              {
                id: 'approval_workflow',
                name: 'Approval Workflow',
                description: 'Project approval and sign-off process',
                fields: [
                  {
                    id: 'approvalNotes',
                    label: 'Approval Notes',
                    type: 'richtext',
                    placeholder: 'Document any approval conditions, recommendations, or special requirements...',
                    helpText: 'Notes for the approval process'
                  },
                  {
                    id: 'riskAssessment',
                    label: 'Risk Assessment',
                    type: 'table',
                    columns: [
                      { key: 'riskCategory', label: 'Risk Category', type: 'select', required: true, options: [
                        { value: 'technical', label: 'Technical Risk' },
                        { value: 'timeline', label: 'Timeline Risk' },
                        { value: 'budget', label: 'Budget Risk' },
                        { value: 'regulatory', label: 'Regulatory Risk' },
                        { value: 'market', label: 'Market Risk' },
                        { value: 'resource', label: 'Resource Risk' }
                      ]},
                      { key: 'description', label: 'Risk Description', type: 'text', required: true },
                      { key: 'probability', label: 'Probability', type: 'select', required: true, options: [
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                      ]},
                      { key: 'impact', label: 'Impact', type: 'select', required: true, options: [
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                      ]},
                      { key: 'mitigation', label: 'Mitigation Strategy', type: 'text' }
                    ],
                    helpText: 'Identify and assess project risks'
                  }
                ]
              }
            ],
            actions: [
              {
                id: 'generate_summary',
                label: 'Generate Summary',
                type: 'secondary',
                icon: 'ri-file-list-line',
                resultTransition: 'stay'
              },
              {
                id: 'save_draft',
                label: 'Save Draft',
                type: 'secondary',
                icon: 'ri-save-line',
                payloadMap: {
                  'status': 'project_status',
                  'approvalNotes': 'approval_notes',
                  'riskAssessment': 'project_risks'
                },
                resultTransition: 'stay'
              },
              {
                id: 'previous',
                label: 'Previous',
                type: 'secondary',
                icon: 'ri-arrow-left-line',
                resultTransition: 'goto:formula_management'
              },
              {
                id: 'submit_for_approval',
                label: 'Submit for Approval',
                type: 'primary',
                icon: 'ri-send-plane-line',
                roles: ['project_manager', 'senior_manager', 'admin'],
                payloadMap: {
                  'status': 'project_status',
                  'name': 'project_name',
                  'projectManager': 'assigned_project_manager',
                  'keyMilestones': 'project_milestones',
                  'linkedFormulas': 'project_formulas',
                  'approvalNotes': 'approval_notes',
                  'riskAssessment': 'project_risks'
                },
                resultTransition: 'advance',
                confirmation: {
                  title: 'Submit Project for Approval',
                  message: 'Are you sure you want to submit this project for management approval? This will lock the project structure and notify the approval team.',
                  confirmText: 'Submit for Approval',
                  cancelText: 'Cancel'
                }
              }
            ],
            validation: {
              required: ['status']
            }
          }
        ]
      }
    ],
    metadata: {
      category: 'project_management',
      tags: ['project', 'milestones', 'formulas', 'timeline'],
      createdBy: 'system',
      createdAt: '2024-01-01T00:00:00Z',
      updatedBy: 'system',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  }
};

// Functions
export function getTemplate(caseTypeId: string): CaseTemplate | undefined {
  const template = CASE_TEMPLATES[caseTypeId];
  if (!template) return undefined;

  // Validate template before returning
  const validationResult = validateTemplate(template);
  if (!validationResult.isValid) {
    console.error(`Template validation failed for ${caseTypeId}:`, validationResult.errors);
    throw new Error(`Invalid template configuration for ${caseTypeId}`);
  }

  return template;
}

export function getAllTemplates(): CaseTemplate[] {
  return Object.values(CASE_TEMPLATES).filter(template => {
    const validationResult = validateTemplate(template);
    if (!validationResult.isValid) {
      console.warn(`Skipping invalid template ${template.id}:`, validationResult.errors);
      return false;
    }
    return true;
  });
}

export function getTemplatesByCategory(category: string): CaseTemplate[] {
  return getAllTemplates().filter(template => 
    template.metadata?.category === category ||
    template.metadata?.tags?.includes(category)
  );
}



export function getChromeConfig(caseTypeId: string): CaseChromeConfig {
  return CASE_CHROME_CONFIGS[caseTypeId] || {
    showRightRail: true,
    showBreadcrumb: true,
    showStatusChip: true,
    showStageProgress: true,
    contextualActions: [],
    metadata: {
      showCreatedBy: true,
      showOwner: true,
      showSLA: true,
      showLastModified: true,
      showVersion: true
    }
  };
}
