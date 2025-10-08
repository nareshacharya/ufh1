import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        // Mock case data fetch - replace with actual Pega DX API call
        const caseData = await fetchCaseData(id);

        return NextResponse.json(caseData);
    } catch (error) {
        console.error('Error fetching case:', error);
        return NextResponse.json(
            { error: 'Failed to fetch case' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const updates = await request.json();

        // Mock case update - replace with actual Pega DX API call
        const updatedCase = await updateCaseData(id, updates);

        return NextResponse.json(updatedCase);
    } catch (error) {
        console.error('Error updating case:', error);
        return NextResponse.json(
            { error: 'Failed to update case' },
            { status: 500 }
        );
    }
}

// Mock function - replace with actual Pega DX API call
async function fetchCaseData(caseId: string) {
    // This would be your actual Pega DX API call:
    // const response = await fetch(`${process.env.PEGA_DX_API_BASE_URL}/cases/${caseId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${await getPegaToken()}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // return response.json();

    // Mock case data
    return {
        ID: caseId,
        caseTypeID: "CreateIngredient",
        status: "OPEN",
        content: {
            IngredientName: "Lemon Oil",
            IngredientType: "Natural",
            CASNumber: "8008-56-8",
            Supplier: "Givaudan",
            CostPerKg: 12.75,
            OlfactiveFamily: "Citrus",
            Origin: "Italy",
            SafetyNotes: "Handle with care. May cause skin irritation."
        },
        assignments: [
            {
                ID: "ASSIGN-123",
                name: "Review and Release",
                actions: ["Approve", "RequestChanges", "SaveDraft"]
            }
        ]
    };
}

// Mock function - replace with actual Pega DX API call
async function updateCaseData(caseId: string, updates: any) {
    // This would be your actual Pega DX API call:
    // const response = await fetch(`${process.env.PEGA_DX_API_BASE_URL}/cases/${caseId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${await getPegaToken()}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(updates),
    // });
    // return response.json();

    // Mock update - merge with existing data
    const existingCase = await fetchCaseData(caseId);

    return {
        ...existingCase,
        content: {
            ...existingCase.content,
            ...updates.content
        },
        status: updates.status || existingCase.status,
        lastModified: new Date().toISOString()
    };
}