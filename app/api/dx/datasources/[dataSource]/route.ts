import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { dataSource: string } }
) {
    const { dataSource } = params;
    const body = await request.json();
    const { query, params: dsParams } = body;

    try {
        const options = await fetchDataSourceOptions(dataSource, query, dsParams);
        return NextResponse.json({ items: options });
    } catch (error) {
        console.error('Error fetching data source options:', error);
        return NextResponse.json(
            { error: 'Failed to fetch options' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { dataSource: string } }
) {
    const { dataSource } = params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    try {
        const options = await fetchDataSourceOptions(dataSource, query);
        return NextResponse.json({ items: options });
    } catch (error) {
        console.error('Error fetching data source options:', error);
        return NextResponse.json(
            { error: 'Failed to fetch options' },
            { status: 500 }
        );
    }
}

// Mock function - replace with actual Pega data page lookup
async function fetchDataSourceOptions(dataSource: string, query: string = '', params?: any) {
    // This would be your actual Pega data page lookup:
    // const response = await fetch(`${process.env.PEGA_DX_API_BASE_URL}/data/${dataSource}`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${await getPegaToken()}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ query, ...params }),
    // });
    // return response.json();

    // Mock data based on data source - comprehensive ADS implementation
    const mockData: Record<string, any[]> = {
        'D_ActiveSuppliers': [
            { id: 'givaudan', name: 'Givaudan', country: 'Switzerland', status: 'Active' },
            { id: 'iff', name: 'IFF (International Flavors & Fragrances)', country: 'USA', status: 'Active' },
            { id: 'firmenich', name: 'Firmenich', country: 'Switzerland', status: 'Active' },
            { id: 'symrise', name: 'Symrise', country: 'Germany', status: 'Active' },
            { id: 'mane', name: 'Mane', country: 'France', status: 'Active' },
            { id: 'robertet', name: 'Robertet', country: 'France', status: 'Active' },
            { id: 'takasago', name: 'Takasago', country: 'Japan', status: 'Active' },
            { id: 'sensient', name: 'Sensient Technologies', country: 'USA', status: 'Active' },
            { id: 'kerry', name: 'Kerry Group', country: 'Ireland', status: 'Active' },
            { id: 'dsm', name: 'DSM', country: 'Netherlands', status: 'Active' },
            { id: 'archer-daniels', name: 'Archer Daniels Midland', country: 'USA', status: 'Active' },
            { id: 'bell-flavors', name: 'Bell Flavors & Fragrances', country: 'USA', status: 'Active' }
        ],
        'D_OlfactiveFamilies': [
            { id: 'citrus', name: 'Citrus', description: 'Fresh, zesty, bright notes' },
            { id: 'floral', name: 'Floral', description: 'Rose, jasmine, lily, and other flower notes' },
            { id: 'woody', name: 'Woody', description: 'Sandalwood, cedar, pine, and wood notes' },
            { id: 'oriental', name: 'Oriental', description: 'Warm, spicy, exotic notes' },
            { id: 'fresh', name: 'Fresh', description: 'Clean, aquatic, ozonic notes' },
            { id: 'fruity', name: 'Fruity', description: 'Apple, pear, peach, berry notes' },
            { id: 'green', name: 'Green', description: 'Leafy, herbal, grass-like notes' },
            { id: 'spicy', name: 'Spicy', description: 'Pepper, cinnamon, nutmeg notes' },
            { id: 'gourmand', name: 'Gourmand', description: 'Edible, dessert-like notes' },
            { id: 'marine', name: 'Marine', description: 'Sea breeze, oceanic notes' },
            { id: 'amber', name: 'Amber', description: 'Warm, resinous, honey-like notes' },
            { id: 'musk', name: 'Musk', description: 'Animal, skin-like, sensual notes' }
        ],
        'D_PaletteIngs': [
            { id: 'lemon-oil', name: 'Lemon Oil (Italy)', cas: '8008-56-8', type: 'Natural' },
            { id: 'bergamot', name: 'Bergamot Oil (Italy)', cas: '8007-75-8', type: 'Natural' },
            { id: 'lavender', name: 'Lavender Oil (France)', cas: '8000-28-0', type: 'Natural' },
            { id: 'rose-absolute', name: 'Rose Absolute (Bulgaria)', cas: '8007-01-0', type: 'Natural' },
            { id: 'sandalwood', name: 'Sandalwood Oil (Australia)', cas: '8006-87-9', type: 'Natural' },
            { id: 'vanilla', name: 'Vanilla Extract (Madagascar)', cas: '8024-06-4', type: 'Natural' },
            { id: 'linalool', name: 'Linalool', cas: '78-70-6', type: 'Synthetic' },
            { id: 'limonene', name: 'Limonene', cas: '5989-27-5', type: 'Synthetic' },
            { id: 'geraniol', name: 'Geraniol', cas: '106-24-1', type: 'Synthetic' },
            { id: 'citronellol', name: 'Citronellol', cas: '106-22-9', type: 'Synthetic' },
            { id: 'benzyl-acetate', name: 'Benzyl Acetate', cas: '140-11-4', type: 'Synthetic' },
            { id: 'phenylethyl-alcohol', name: 'Phenylethyl Alcohol', cas: '60-12-8', type: 'Synthetic' },
            { id: 'iso-e-super', name: 'Iso E Super', cas: '54464-57-2', type: 'Captive' },
            { id: 'hedione', name: 'Hedione (Methyl Dihydrojasmonate)', cas: '24851-98-7', type: 'Captive' },
            { id: 'ambroxan', name: 'Ambroxan', cas: '6790-58-5', type: 'Captive' },
            { id: 'cashmeran', name: 'Cashmeran', cas: '33704-61-9', type: 'Captive' },
            { id: 'calone', name: 'Calone 1951', cas: '28940-11-6', type: 'Captive' },
            { id: 'aldehyde-c12', name: 'Aldehyde C-12 MNA', cas: '110-41-8', type: 'Synthetic' },
            { id: 'coumarin', name: 'Coumarin', cas: '91-64-5', type: 'Synthetic' },
            { id: 'eugenol', name: 'Eugenol', cas: '97-53-0', type: 'Synthetic' }
        ]
    };

    const data = mockData[dataSource] || [];

    // Filter by query if provided
    if (query) {
        return data.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.id.toLowerCase().includes(query.toLowerCase())
        );
    }

    return data;
}