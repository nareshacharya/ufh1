import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { caseTypeId: string } }
) {
    const { caseTypeId } = params;
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'Create';

    try {
        // For now, return mock data based on the Pega DX API specification
        // Replace this with actual Pega DX API call in production
        const caseMetadata = await fetchCaseCreateMetadata(caseTypeId, view);

        return NextResponse.json(caseMetadata);
    } catch (error) {
        console.error('Error fetching case metadata:', error);
        return NextResponse.json(
            { error: 'Failed to fetch case metadata' },
            { status: 500 }
        );
    }
}

// Mock function - replace with actual Pega DX API call
async function fetchCaseCreateMetadata(caseTypeId: string, view: string) {
    // This would be your actual Pega DX API call:
    // const response = await fetch(`${process.env.PEGA_DX_API_BASE_URL}/cases/${caseTypeId}/new?view=${encodeURIComponent(view)}`, {
    //   headers: {
    //     'Authorization': `Bearer ${await getPegaToken()}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // return response.json();

    // Mock data based on ADS implementation - bypassing permissions for testing
    if (caseTypeId === 'UFH-Work-Ingredient' || caseTypeId === 'CreateIngredient') {
        return {
            view: {
                name: "Create Ingredient",
                // Bypass permissions - show all actions for testing
                actions: [
                    {
                        id: "pyWorkPage",
                        caption: "Submit",
                        type: "primary",
                        enabled: true
                    },
                    {
                        id: "Save",
                        caption: "Save Draft",
                        type: "secondary",
                        enabled: true
                    },
                    {
                        id: "Cancel",
                        caption: "Cancel",
                        type: "secondary",
                        enabled: true
                    }
                ],
                groups: [
                    {
                        caption: "Basic Information",
                        layout: "2col",
                        fields: [
                            {
                                id: "IngredientName",
                                label: "Ingredient Name",
                                type: "Text",
                                required: true,
                                maxLength: 100,
                                helper: "Enter the common name of the ingredient"
                            },
                            {
                                id: "IngredientCode",
                                label: "Ingredient Code",
                                type: "Text",
                                required: false,
                                maxLength: 20,
                                helper: "Auto-generated if left blank"
                            },
                            {
                                id: "IngredientType",
                                label: "Ingredient Type",
                                type: "Picklist",
                                required: true,
                                options: [
                                    { key: "Natural", value: "Natural" },
                                    { key: "Synthetic", value: "Synthetic" },
                                    { key: "Base", value: "Base" },
                                    { key: "Captive", value: "Captive" }
                                ]
                            },
                            {
                                id: "Category",
                                label: "Category",
                                type: "Picklist",
                                required: true,
                                options: [
                                    { key: "Essential Oil", value: "Essential Oil" },
                                    { key: "Aromatic Chemical", value: "Aromatic Chemical" },
                                    { key: "Base Material", value: "Base Material" },
                                    { key: "Specialty Chemical", value: "Specialty Chemical" }
                                ]
                            }
                        ]
                    },
                    {
                        caption: "Chemical Information",
                        layout: "2col",
                        fields: [
                            {
                                id: "CASNumber",
                                label: "CAS Number",
                                type: "Text",
                                required: false,
                                helper: "Chemical Abstracts Service number (e.g., 8008-56-8)",
                                validation: {
                                    pattern: "^\\d{2,7}-\\d{2}-\\d$",
                                    message: "Invalid CAS format (e.g., 8008-56-8)"
                                }
                            },
                            {
                                id: "ECNumber",
                                label: "EC Number",
                                type: "Text",
                                required: false,
                                helper: "European Community number"
                            },
                            {
                                id: "FEMANumber",
                                label: "FEMA Number",
                                type: "Text",
                                required: false,
                                helper: "Flavor and Extract Manufacturers Association number"
                            },
                            {
                                id: "IUPACName",
                                label: "IUPAC Name",
                                type: "Text",
                                required: false,
                                maxLength: 200,
                                helper: "International Union of Pure and Applied Chemistry name"
                            }
                        ]
                    },
                    {
                        caption: "Supplier & Cost",
                        layout: "2col",
                        fields: [
                            {
                                id: "PrimarySupplier",
                                label: "Primary Supplier",
                                type: "Autocomplete",
                                required: true,
                                dataSource: "D_ActiveSuppliers",
                                params: { activeOnly: true }
                            },
                            {
                                id: "AlternateSuppliers",
                                label: "Alternate Suppliers",
                                type: "Autocomplete",
                                required: false,
                                dataSource: "D_ActiveSuppliers",
                                params: { activeOnly: true },
                                multiple: true
                            },
                            {
                                id: "CostPerKg",
                                label: "Cost per Kg (USD)",
                                type: "Decimal",
                                required: true,
                                visibleWhen: ".IngredientType != 'Base'",
                                min: 0,
                                precision: 2,
                                helper: "Current market price per kilogram"
                            },
                            {
                                id: "Currency",
                                label: "Currency",
                                type: "Picklist",
                                required: true,
                                visibleWhen: ".IngredientType != 'Base'",
                                options: [
                                    { key: "USD", value: "USD" },
                                    { key: "EUR", value: "EUR" },
                                    { key: "GBP", value: "GBP" },
                                    { key: "CHF", value: "CHF" }
                                ],
                                defaultValue: "USD"
                            }
                        ]
                    },
                    {
                        caption: "Olfactory Profile",
                        layout: "2col",
                        fields: [
                            {
                                id: "OlfactiveFamily",
                                label: "Primary Olfactive Family",
                                type: "Autocomplete",
                                required: true,
                                dataSource: "D_OlfactiveFamilies"
                            },
                            {
                                id: "SecondaryOlfactiveFamily",
                                label: "Secondary Olfactive Family",
                                type: "Autocomplete",
                                required: false,
                                dataSource: "D_OlfactiveFamilies"
                            },
                            {
                                id: "OdorDescription",
                                label: "Odor Description",
                                type: "TextArea",
                                required: false,
                                maxLength: 500,
                                helper: "Describe the characteristic odor profile"
                            },
                            {
                                id: "Strength",
                                label: "Odor Strength",
                                type: "Picklist",
                                required: false,
                                options: [
                                    { key: "Very Weak", value: "Very Weak" },
                                    { key: "Weak", value: "Weak" },
                                    { key: "Medium", value: "Medium" },
                                    { key: "Strong", value: "Strong" },
                                    { key: "Very Strong", value: "Very Strong" }
                                ]
                            }
                        ]
                    },
                    {
                        caption: "Origin & Processing",
                        layout: "2col",
                        fields: [
                            {
                                id: "Origin",
                                label: "Country of Origin",
                                type: "Picklist",
                                visibleWhen: ".IngredientType = 'Natural'",
                                required: false,
                                options: [
                                    { key: "Italy", value: "Italy" },
                                    { key: "France", value: "France" },
                                    { key: "India", value: "India" },
                                    { key: "Brazil", value: "Brazil" },
                                    { key: "Morocco", value: "Morocco" },
                                    { key: "Madagascar", value: "Madagascar" },
                                    { key: "Côte d'Ivoire", value: "Côte d'Ivoire" },
                                    { key: "China", value: "China" },
                                    { key: "Turkey", value: "Turkey" },
                                    { key: "Spain", value: "Spain" }
                                ]
                            },
                            {
                                id: "ExtractionMethod",
                                label: "Extraction Method",
                                type: "Picklist",
                                visibleWhen: ".IngredientType = 'Natural'",
                                required: false,
                                options: [
                                    { key: "Steam Distillation", value: "Steam Distillation" },
                                    { key: "Cold Press", value: "Cold Press" },
                                    { key: "Solvent Extraction", value: "Solvent Extraction" },
                                    { key: "CO2 Extraction", value: "CO2 Extraction" },
                                    { key: "Enfleurage", value: "Enfleurage" }
                                ]
                            },
                            {
                                id: "PlantPart",
                                label: "Plant Part Used",
                                type: "Picklist",
                                visibleWhen: ".IngredientType = 'Natural'",
                                required: false,
                                options: [
                                    { key: "Leaf", value: "Leaf" },
                                    { key: "Flower", value: "Flower" },
                                    { key: "Fruit", value: "Fruit" },
                                    { key: "Seed", value: "Seed" },
                                    { key: "Root", value: "Root" },
                                    { key: "Bark", value: "Bark" },
                                    { key: "Wood", value: "Wood" },
                                    { key: "Resin", value: "Resin" }
                                ]
                            },
                            {
                                id: "Purity",
                                label: "Purity (%)",
                                type: "Decimal",
                                visibleWhen: ".IngredientType = 'Synthetic'",
                                required: false,
                                min: 0,
                                max: 100,
                                precision: 2
                            }
                        ]
                    },
                    {
                        caption: "Base Composition",
                        visibleWhen: ".IngredientType = 'Base'",
                        fields: [
                            {
                                id: "BaseComposition",
                                label: "Component Ingredients",
                                type: "Grid",
                                required: true,
                                columns: [
                                    {
                                        id: "ComponentING",
                                        label: "Component Ingredient",
                                        type: "Autocomplete",
                                        dataSource: "D_PaletteIngs",
                                        required: true
                                    },
                                    {
                                        id: "Percentage",
                                        label: "Percentage (%)",
                                        type: "Decimal",
                                        required: true,
                                        min: 0,
                                        max: 100,
                                        precision: 2
                                    },
                                    {
                                        id: "Function",
                                        label: "Function",
                                        type: "Picklist",
                                        required: false,
                                        options: [
                                            { key: "Top Note", value: "Top Note" },
                                            { key: "Heart Note", value: "Heart Note" },
                                            { key: "Base Note", value: "Base Note" },
                                            { key: "Modifier", value: "Modifier" },
                                            { key: "Fixative", value: "Fixative" }
                                        ]
                                    }
                                ],
                                rowValidation: {
                                    sumOf: "Percentage",
                                    equals: 100,
                                    message: "Component percentages must total 100%"
                                }
                            }
                        ]
                    },
                    {
                        caption: "Regulatory & Safety",
                        layout: "1col",
                        fields: [
                            {
                                id: "IFRA",
                                label: "IFRA Restrictions",
                                type: "TextArea",
                                required: false,
                                maxLength: 1000,
                                helper: "International Fragrance Association restrictions and guidelines"
                            },
                            {
                                id: "SafetyNotes",
                                label: "Safety & Handling Notes",
                                type: "TextArea",
                                required: false,
                                maxLength: 2000,
                                helper: "Safety precautions, handling instructions, and warnings"
                            },
                            {
                                id: "AllergenInfo",
                                label: "Allergen Information",
                                type: "TextArea",
                                required: false,
                                maxLength: 500,
                                helper: "Known allergens and sensitivity information"
                            },
                            {
                                id: "StorageConditions",
                                label: "Storage Conditions",
                                type: "Text",
                                required: false,
                                maxLength: 200,
                                helper: "e.g., Cool, dry place away from light"
                            }
                        ]
                    },
                    {
                        caption: "Additional Information",
                        layout: "2col",
                        fields: [
                            {
                                id: "ShelfLife",
                                label: "Shelf Life (months)",
                                type: "Decimal",
                                required: false,
                                min: 0,
                                precision: 0
                            },
                            {
                                id: "MinOrderQuantity",
                                label: "Minimum Order Quantity (kg)",
                                type: "Decimal",
                                required: false,
                                min: 0,
                                precision: 2
                            },
                            {
                                id: "LeadTime",
                                label: "Lead Time (days)",
                                type: "Decimal",
                                required: false,
                                min: 0,
                                precision: 0
                            },
                            {
                                id: "InternalNotes",
                                label: "Internal Notes",
                                type: "TextArea",
                                required: false,
                                maxLength: 1000,
                                helper: "Internal notes and comments (not visible to suppliers)"
                            }
                        ]
                    }
                ]
            }
        };
    }

    throw new Error(`Unknown case type: ${caseTypeId}`);
}