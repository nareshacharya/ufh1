"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DynamicForm } from "@/components/DynamicForm";

interface Assignment {
  ID: string;
  name: string;
  actions: string[];
}

interface CaseData {
  ID: string;
  caseTypeID: string;
  status: string;
  content: Record<string, any>;
  assignments: Assignment[];
}

interface CaseViewControllerProps {
  caseTypeId: string;
  caseId: string;
  initialData?: CaseData;
}

export default function CaseViewController({
  caseTypeId,
  caseId,
  initialData,
}: CaseViewControllerProps) {
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseData | null>(
    initialData || null
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const isNewCase = caseId === "new";

  // Fetch existing case data if not creating a new case
  useEffect(() => {
    if (!isNewCase && !initialData) {
      fetchCaseData();
    }
  }, [caseId, caseTypeId, initialData]);

  const fetchCaseData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cases/${caseId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch case data");
      }
      const data = await response.json();
      setCaseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load case");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const url = isNewCase ? "/api/cases" : `/api/cases/${caseId}`;
      const method = isNewCase ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseTypeID: caseTypeId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save case");
      }

      const savedCase = await response.json();

      if (isNewCase) {
        // Redirect to the newly created case view
        router.push(`/case/${caseTypeId}/${savedCase.ID}`);
      } else {
        // Update local state with saved data
        setCaseData(savedCase);
      }
    } catch (err) {
      console.error("Error saving case:", err);
      throw err; // Let the form handle the error display
    }
  };

  const handleCancel = () => {
    if (isNewCase) {
      router.back();
    } else {
      router.push(`/cases`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isNewCase ? "Loading form..." : "Loading case..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl text-red-500 mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Case
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/cases" className="text-gray-700 hover:text-gray-900">
                  Cases
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">
                    {isNewCase
                      ? `New ${caseTypeId}`
                      : `${caseTypeId} - ${caseId}`}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {isNewCase ? `Create New ${caseTypeId}` : `Edit ${caseTypeId}`}
          </h1>
          {caseData && !isNewCase && (
            <p className="mt-2 text-gray-600">
              Status: <span className="capitalize">{caseData.status}</span>
            </p>
          )}
        </div>

        <DynamicForm
          caseTypeId={caseTypeId}
          initialData={caseData?.content}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
