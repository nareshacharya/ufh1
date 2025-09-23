
import { FieldSet } from './schema';

export const CATALOG_FIELD_SETS: Record<string, FieldSet> = {
  Identity: {
    id: 'identity',
    name: 'Identity',
    description: 'Basic identification information',
    fields: [
      {
        id: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
        helpText: 'A unique, descriptive name',
        validation: {
          min: 2,
          max: 100,
          message: 'Name must be between 2 and 100 characters'
        }
      },
      {
        id: 'code',
        label: 'Code',
        type: 'text',
        required: true,
        placeholder: 'Enter code (e.g., ING-001)',
        helpText: 'Unique identifier code',
        validation: {
          pattern: '^[A-Z]{2,4}-[0-9]{3,6}$',
          message: 'Code must follow format: XXX-000 (letters-numbers)'
        }
      },
      {
        id: 'description',
        label: 'Description',
        type: 'richtext',
        placeholder: 'Enter detailed description',
        helpText: 'Comprehensive description of the item'
      },
      {
        id: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          { value: 'essential_oil', label: 'Essential Oil' },
          { value: 'synthetic', label: 'Synthetic' },
          { value: 'natural_extract', label: 'Natural Extract' },
          { value: 'carrier', label: 'Carrier' },
          { value: 'modifier', label: 'Modifier' }
        ]
      }
    ],
    defaultExpanded: true
  },

  Audit: {
    id: 'audit',
    name: 'Audit Information',
    description: 'Tracking and audit details',
    fields: [
      {
        id: 'createdBy',
        label: 'Created By',
        type: 'text',
        disabled: true,
        defaultValue: 'Current User'
      },
      {
        id: 'createdAt',
        label: 'Created Date',
        type: 'date',
        disabled: true,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        id: 'lastModifiedBy',
        label: 'Last Modified By',
        type: 'text',
        disabled: true
      },
      {
        id: 'lastModifiedAt',
        label: 'Last Modified Date',
        type: 'date',
        disabled: true
      },
      {
        id: 'version',
        label: 'Version',
        type: 'text',
        disabled: true,
        defaultValue: '1.0'
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'under_review', label: 'Under Review' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'archived', label: 'Archived' }
        ],
        defaultValue: 'draft'
      }
    ],
    collapsible: true,
    defaultExpanded: false
  },

  SupplierBlock: {
    id: 'supplier',
    name: 'Supplier Information',
    description: 'Supplier and sourcing details',
    fields: [
      {
        id: 'supplierName',
        label: 'Supplier Name',
        type: 'text',
        required: true,
        placeholder: 'Enter supplier name'
      },
      {
        id: 'supplierCode',
        label: 'Supplier Code',
        type: 'text',
        required: true,
        placeholder: 'SUP-001',
        validation: {
          pattern: '^SUP-[0-9]{3,6}$',
          message: 'Supplier code must follow format: SUP-000'
        }
      },
      {
        id: 'contactPerson',
        label: 'Contact Person',
        type: 'text',
        placeholder: 'Primary contact name'
      },
      {
        id: 'contactEmail',
        label: 'Contact Email',
        type: 'text',
        placeholder: 'contact@supplier.com',
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          message: 'Please enter a valid email address'
        }
      },
      {
        id: 'contactPhone',
        label: 'Contact Phone',
        type: 'text',
        placeholder: '+1 (555) 123-4567'
      },
      {
        id: 'countryOfOrigin',
        label: 'Country of Origin',
        type: 'select',
        required: true,
        options: [
          { value: 'FR', label: 'France' },
          { value: 'IT', label: 'Italy' },
          { value: 'BG', label: 'Bulgaria' },
          { value: 'IN', label: 'India' },
          { value: 'US', label: 'United States' },
          { value: 'CN', label: 'China' },
          { value: 'BR', label: 'Brazil' },
          { value: 'EG', label: 'Egypt' }
        ]
      },
      {
        id: 'certifications',
        label: 'Certifications',
        type: 'multiselect',
        options: [
          { value: 'organic', label: 'Organic Certified' },
          { value: 'fair_trade', label: 'Fair Trade' },
          { value: 'iso_9001', label: 'ISO 9001' },
          { value: 'iso_14001', label: 'ISO 14001' },
          { value: 'reach', label: 'REACH Compliant' },
          { value: 'kosher', label: 'Kosher' },
          { value: 'halal', label: 'Halal' }
        ]
      }
    ],
    collapsible: true,
    defaultExpanded: true
  },

  ComplianceConfig: {
    id: 'compliance',
    name: 'Compliance Configuration',
    description: 'Regulatory and safety compliance settings',
    fields: [
      {
        id: 'ifraCategory',
        label: 'IFRA Category',
        type: 'select',
        required: true,
        helpText: 'International Fragrance Association category classification',
        options: [
          { value: 'cat1', label: 'Category 1 - Toys' },
          { value: 'cat2', label: 'Category 2 - Lip Products' },
          { value: 'cat3', label: 'Category 3 - Eye Products' },
          { value: 'cat4', label: 'Category 4 - Fragrances' },
          { value: 'cat5', label: 'Category 5 - Body Lotions' },
          { value: 'cat6', label: 'Category 6 - Face Products' },
          { value: 'cat7', label: 'Category 7 - Baby Products' },
          { value: 'cat8', label: 'Category 8 - Hair Products' },
          { value: 'cat9', label: 'Category 9 - Deodorants' },
          { value: 'cat10', label: 'Category 10 - Household' },
          { value: 'cat11', label: 'Category 11 - Oral Care' }
        ]
      },
      {
        id: 'maxUsageLevel',
        label: 'Maximum Usage Level (%)',
        type: 'number',
        required: true,
        helpText: 'Maximum allowed concentration percentage',
        validation: {
          min: 0,
          max: 100,
          message: 'Usage level must be between 0 and 100%'
        }
      },
      {
        id: 'allergens',
        label: 'Known Allergens',
        type: 'multiselect',
        helpText: 'Select all applicable allergens that must be declared',
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
        ]
      },
      {
        id: 'restrictedRegions',
        label: 'Restricted Regions',
        type: 'multiselect',
        helpText: 'Regions where this ingredient has usage restrictions',
        options: [
          { value: 'EU', label: 'European Union' },
          { value: 'US', label: 'United States' },
          { value: 'CA', label: 'Canada' },
          { value: 'JP', label: 'Japan' },
          { value: 'AU', label: 'Australia' },
          { value: 'CN', label: 'China' },
          { value: 'IN', label: 'India' },
          { value: 'BR', label: 'Brazil' }
        ]
      },
      {
        id: 'safetyDataSheet',
        label: 'Safety Data Sheet',
        type: 'attachment',
        helpText: 'Upload SDS document (PDF format preferred)'
      },
      {
        id: 'complianceNotes',
        label: 'Compliance Notes',
        type: 'richtext',
        placeholder: 'Additional compliance information, restrictions, or special handling requirements',
        helpText: 'Document any special compliance considerations'
      }
    ],
    collapsible: true,
    defaultExpanded: false
  },

  PhysicalProperties: {
    id: 'physical_properties',
    name: 'Physical Properties',
    description: 'Physical and chemical characteristics',
    fields: [
      {
        id: 'appearance',
        label: 'Appearance',
        type: 'text',
        placeholder: 'Clear liquid, pale yellow, crystalline powder, etc.'
      },
      {
        id: 'odorProfile',
        label: 'Odor Profile',
        type: 'richtext',
        placeholder: 'Describe the scent characteristics',
        helpText: 'Detailed olfactory description including top, middle, and base notes'
      },
      {
        id: 'odorStrength',
        label: 'Odor Strength',
        type: 'select',
        options: [
          { value: 'very_weak', label: 'Very Weak (1)' },
          { value: 'weak', label: 'Weak (2)' },
          { value: 'moderate', label: 'Moderate (3)' },
          { value: 'strong', label: 'Strong (4)' },
          { value: 'very_strong', label: 'Very Strong (5)' }
        ]
      },
      {
        id: 'solubility',
        label: 'Solubility',
        type: 'select',
        options: [
          { value: 'oil_soluble', label: 'Oil Soluble' },
          { value: 'water_soluble', label: 'Water Soluble' },
          { value: 'alcohol_soluble', label: 'Alcohol Soluble' },
          { value: 'poorly_soluble', label: 'Poorly Soluble' }
        ]
      },
      {
        id: 'density',
        label: 'Density (g/mL)',
        type: 'number',
        validation: {
          min: 0.1,
          max: 10,
          message: 'Density must be between 0.1 and 10 g/mL'
        }
      },
      {
        id: 'flashPoint',
        label: 'Flash Point (°C)',
        type: 'number',
        helpText: 'Temperature at which vapors ignite'
      },
      {
        id: 'boilingPoint',
        label: 'Boiling Point (°C)',
        type: 'number'
      }
    ],
    collapsible: true,
    defaultExpanded: false
  }
};

export function getFieldSet(id: string): FieldSet | undefined {
  return CATALOG_FIELD_SETS[id];
}

export function getAllFieldSets(): FieldSet[] {
  return Object.values(CATALOG_FIELD_SETS);
}

export function getFieldSetsByCategory(category: string): FieldSet[] {
  return Object.values(CATALOG_FIELD_SETS).filter(fs => 
    fs.name.toLowerCase().includes(category.toLowerCase()) ||
    fs.description?.toLowerCase().includes(category.toLowerCase())
  );
}
