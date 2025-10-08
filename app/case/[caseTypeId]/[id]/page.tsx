import { Suspense } from "react";
import CaseViewController from "./CaseViewController";
import { DynamicForm } from "@/components/DynamicForm";

export async function generateStaticParams() {
  return [
    { caseTypeId: "UFH-Work-Ingredient", id: "1" },
    { caseTypeId: "UFH-Work-Formula", id: "1" },
    { caseTypeId: "UFH-Work-Project", id: "1" },
    { caseTypeId: "UFH-Work-Palette", id: "1" },
    { caseTypeId: "UFH-Work-Compliance", id: "1" },
  ];
}

interface CaseViewPageProps {
  params: {
    caseTypeId: string;
    id: string;
  };
}

// Component to handle case data fetching and rendering
async function CaseDataHandler({
  caseTypeId,
  caseId,
}: {
  caseTypeId: string;
  caseId: string;
}) {
  // If ID is 'new', show create form
  if (caseId === "new") {
    return (
      <DynamicForm
        caseTypeId={caseTypeId}
        view="Create Ingredient"
        onSubmit={async (data) => {
          console.log("Submitting form data:", data);

          const response = await fetch("/api/cases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              caseTypeID: caseTypeId,
              content: data,
              returnView: true,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating case:", errorData);
            throw new Error(errorData.error || "Failed to create case");
          }

          const result = await response.json();
          console.log("Case created successfully:", result);

          // Show success message
          alert(
            `Ingredient "${data.IngredientName}" created successfully with ID: ${result.ID}`
          );

          // Redirect to the created case
          window.location.href = `/case/${caseTypeId}/${result.ID}`;
        }}
        onSaveDraft={async (data) => {
          console.log("Saving draft:", data);
          // TODO: Implement draft saving endpoint
          alert("Draft saved successfully!");
        }}
        onCancel={() => {
          if (
            confirm(
              "Are you sure you want to cancel? Any unsaved changes will be lost."
            )
          ) {
            window.history.back();
          }
        }}
      />
    );
  }

  // For existing cases, fetch data and show in controller
  let caseData = null;
  try {
    const response = await fetch(`/api/cases/${caseId}`);
    if (response.ok) {
      caseData = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch case data:", error);
  }

  return (
    <CaseViewController
      caseTypeId={caseTypeId}
      caseId={caseId}
      initialData={caseData}
    />
  );
}

export default function CaseViewPage({ params }: CaseViewPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<CaseViewSkeleton />}>
        <CaseDataHandler caseTypeId={params.caseTypeId} caseId={params.id} />
      </Suspense>
    </div>
  );
}

function CaseViewSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
