"use client";

import { useState, useEffect } from "react";
import { FieldRenderer, DxView, DxField } from "./DynamicFieldRenderer";

interface DynamicFormProps {
  caseTypeId: string;
  view?: string;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onSaveDraft?: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  initialData?: Record<string, any>;
}

export function DynamicForm({
  caseTypeId,
  view = "Create",
  onSubmit,
  onSaveDraft,
  onCancel,
  initialData = {},
}: DynamicFormProps) {
  const [viewMetadata, setViewMetadata] = useState<DxView | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Fetch view metadata on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/cases/${caseTypeId}/new?view=${encodeURIComponent(view)}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch view metadata: ${response.statusText}`
          );
        }

        const data = await response.json();
        setViewMetadata(data.view);
      } catch (error) {
        console.error("Error fetching view metadata:", error);
        setErrors({ _form: "Failed to load form. Please try again." });
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [caseTypeId, view]);

  // Update form data when field changes
  const handleFieldChange = async (fieldId: string, value: any) => {
    const newFormData = { ...formData, [fieldId]: value };
    setFormData(newFormData);

    // Clear field-specific error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }

    // Check if we need to refresh view for dependent fields
    await checkForViewRefresh(fieldId, value, newFormData);
  };

  // Check if field change requires view refresh (for dependent visibility/options)
  const checkForViewRefresh = async (
    fieldId: string,
    value: any,
    newFormData: Record<string, any>
  ) => {
    // Only refresh for key fields that affect visibility/options
    const keyFields = ["IngredientType"]; // Add other key fields as needed

    if (keyFields.includes(fieldId)) {
      try {
        const response = await fetch(
          `/api/cases/${caseTypeId}/views/${encodeURIComponent(view)}/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newFormData }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.view) {
            setViewMetadata(data.view);
          }
        }
      } catch (error) {
        console.error("Error refreshing view:", error);
        // Continue without refresh if it fails
      }
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!viewMetadata) return false;

    // Check all fields for validation
    const allFields = viewMetadata.groups.flatMap((group) => group.fields);

    allFields.forEach((field) => {
      const value = formData[field.id];

      // Check required fields
      if (field.required && (!value || value === "")) {
        newErrors[field.id] = `${field.label} is required`;
      }

      // Check pattern validation
      if (value && field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          newErrors[field.id] =
            field.validation.message || `Invalid ${field.label} format`;
        }
      }

      // Check min/max for numeric fields
      if (field.type === "Decimal" && value !== undefined && value !== "") {
        const numValue = parseFloat(value);
        if (field.min !== undefined && numValue < field.min) {
          newErrors[field.id] = `${field.label} must be at least ${field.min}`;
        }
        if (field.max !== undefined && numValue > field.max) {
          newErrors[field.id] = `${field.label} must be at most ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      // Handle server validation errors
      if (error.errors) {
        const serverErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ _form: "Failed to submit form. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;

    setSavingDraft(true);
    try {
      await onSaveDraft(formData);
    } catch (error) {
      console.error("Error saving draft:", error);
      setErrors({ _form: "Failed to save draft. Please try again." });
    } finally {
      setSavingDraft(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!viewMetadata) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-red-500"></i>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Error Loading Form
          </h2>
          <p className="mt-1 text-gray-600">Failed to load form metadata</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {viewMetadata.name}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors._form && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <i className="ri-error-warning-line text-red-400 mr-2"></i>
              <p className="text-red-800">{errors._form}</p>
            </div>
          </div>
        )}

        {viewMetadata.groups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white shadow-sm rounded-lg p-6">
            {group.caption && (
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                {group.caption}
              </h2>
            )}

            <div
              className={`grid gap-6 ${
                group.layout === "2col" ? "md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {group.fields.map((field) => (
                <div
                  key={field.id}
                  className={field.type === "Grid" ? "md:col-span-2" : ""}
                >
                  <FieldRenderer
                    field={field}
                    value={formData[field.id]}
                    onChange={handleFieldChange}
                    formData={formData}
                    errors={errors}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Action buttons */}
        <div className="flex justify-between bg-white shadow-sm rounded-lg p-6">
          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}
            {onSaveDraft && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {savingDraft ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 inline-block mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
