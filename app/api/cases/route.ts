import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { caseTypeID, content, returnView } = body;

        // Mock case creation - replace with actual Pega DX API call
        const result = await createPegaCase(caseTypeID, content, returnView);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error creating case:', error);
        return NextResponse.json(
            { error: 'Failed to create case' },
            { status: 500 }
        );
    }
}

// Mock function - replace with actual Pega DX API call
async function createPegaCase(caseTypeID: string, content: any, returnView?: boolean) {
    // This would be your actual Pega DX API call:
    // const response = await fetch(`${process.env.PEGA_DX_API_BASE_URL}/cases`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${await getPegaToken()}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ caseTypeID, content, returnView }),
    // });
    // return response.json();

    console.log('Creating case with content:', JSON.stringify(content, null, 2));

    // Mock successful case creation with comprehensive response
    const caseId = `ING-${Date.now().toString().slice(-5)}`;

    // Generate ingredient code if not provided
    if (!content.IngredientCode && content.IngredientName) {
        content.IngredientCode = content.IngredientName
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 10) +
            '-' + Date.now().toString().slice(-3);
    }

    return {
        ID: caseId,
        status: "NEW-WORK",
        caseTypeID,
        content: {
            ...content,
            // Add system-generated fields
            CreatedBy: "Current User",
            CreatedDateTime: new Date().toISOString(),
            LastModifiedBy: "Current User",
            LastModifiedDateTime: new Date().toISOString(),
            Status: "In Progress",
            WorkflowStage: "Initial Review"
        },
        nextAssignment: {
            ID: `ASSIGN-${Date.now().toString().slice(-6)}`,
            name: "ReviewAndRelease",
            instructions: "Review ingredient information and approve for addition to palette",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        },
        availableActions: [
            {
                id: "SaveDraft",
                caption: "Save Draft",
                type: "secondary",
                enabled: true
            },
            {
                id: "SubmitForApproval",
                caption: "Submit for Approval",
                type: "primary",
                enabled: true
            },
            {
                id: "RequestMoreInfo",
                caption: "Request More Information",
                type: "secondary",
                enabled: true
            }
        ],
        validationResults: {
            passed: true,
            warnings: [],
            errors: []
        },
        links: [
            { rel: "self", href: `/cases/${caseId}` },
            { rel: "assignment", href: `/assignments/${caseId}` },
            { rel: "attachments", href: `/cases/${caseId}/attachments` }
        ]
    };
}