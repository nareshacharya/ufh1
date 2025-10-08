"use client";

import { useState, useEffect, useCallback } from "react";

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

// Types based on Pega DX API specification
export interface DxField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  visibleWhen?: string;
  requiredWhen?: string;
  disabledWhen?: string;
  dataSource?: string;
  options?: { key: string; value: string }[];
  helper?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
  min?: number;
  max?: number;
  maxLength?: number;
  columns?: DxField[];
  params?: Record<string, any>;
}

export interface DxFieldGroup {
  caption?: string;
  layout?: string;
  fields: DxField[];
}

export interface DxView {
  name: string;
  groups: DxFieldGroup[];
}

interface FieldRendererProps {
  field: DxField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  formData: Record<string, any>;
  errors?: Record<string, string>;
}

export function FieldRenderer({
  field,
  value,
  onChange,
  formData,
  errors,
}: FieldRendererProps) {
  const [options, setOptions] = useState<{ key: string; value: string }[]>(
    field.options || []
  );
  const [loading, setLoading] = useState(false);

  // Check visibility
  const isVisible = useCallback(() => {
    if (!field.visibleWhen) return true;
    return evaluateCondition(field.visibleWhen, formData);
  }, [field.visibleWhen, formData]);

  // Check if required
  const isRequired = useCallback(() => {
    if (field.required) return true;
    if (!field.requiredWhen) return false;
    return evaluateCondition(field.requiredWhen, formData);
  }, [field.required, field.requiredWhen, formData]);

  // Check if disabled
  const isDisabled = useCallback(() => {
    if (!field.disabledWhen) return false;
    return evaluateCondition(field.disabledWhen, formData);
  }, [field.disabledWhen, formData]);

  // Debounced autocomplete search
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!field.dataSource) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/dx/datasources/${field.dataSource}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, params: field.params }),
          }
        );
        const data = await response.json();
        setOptions(
          data.items.map((item: any) => ({ key: item.id, value: item.name }))
        );
      } catch (error) {
        console.error("Error fetching autocomplete options:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [field.dataSource, field.params]
  );

  // Load initial options for picklists with data sources
  useEffect(() => {
    if (field.type === "Picklist" && field.dataSource && !field.options) {
      debouncedSearch("");
    }
  }, [field.type, field.dataSource, field.options, debouncedSearch]);

  if (!isVisible()) return null;

  const fieldId = field.id;
  const error = errors?.[fieldId];
  const required = isRequired();
  const disabled = isDisabled();

  const commonProps = {
    id: fieldId,
    disabled,
    className: `modern-input ${error ? "border-red-500" : ""}`,
  };

  const renderField = () => {
    switch (field.type) {
      case "Text":
        return (
          <input
            {...commonProps}
            type="text"
            value={value || ""}
            onChange={(e) => onChange(fieldId, e.target.value)}
            pattern={field.validation?.pattern}
            maxLength={field.maxLength}
          />
        );

      case "Decimal":
        return (
          <input
            {...commonProps}
            type="number"
            step="0.01"
            value={value || ""}
            onChange={(e) => onChange(fieldId, parseFloat(e.target.value) || 0)}
            min={field.min}
            max={field.max}
          />
        );

      case "TextArea":
        return (
          <textarea
            {...commonProps}
            value={value || ""}
            onChange={(e) => onChange(fieldId, e.target.value)}
            maxLength={field.maxLength}
            rows={4}
          />
        );

      case "Picklist":
        return (
          <select
            {...commonProps}
            value={value || ""}
            onChange={(e) => onChange(fieldId, e.target.value)}
          >
            <option value="">Select {field.label}</option>
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            ))}
          </select>
        );

      case "Autocomplete":
        return (
          <div className="relative">
            <input
              {...commonProps}
              type="text"
              value={value || ""}
              onChange={(e) => {
                onChange(fieldId, e.target.value);
                debouncedSearch(e.target.value);
              }}
              placeholder={`Search ${field.label}...`}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
            {options.length > 0 && value && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                    onClick={() => {
                      onChange(fieldId, option.value);
                      setOptions([]);
                    }}
                  >
                    {option.value}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case "Grid":
        return (
          <EditableGrid
            field={field}
            value={value || []}
            onChange={(gridValue) => onChange(fieldId, gridValue)}
            formData={formData}
            errors={errors}
          />
        );

      default:
        return (
          <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {field.label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {field.helper && (
        <p className="mt-1 text-sm text-gray-500">{field.helper}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Grid component for handling repeating sections
function EditableGrid({
  field,
  value,
  onChange,
  formData,
  errors,
}: {
  field: DxField;
  value: any[];
  onChange: (value: any[]) => void;
  formData: Record<string, any>;
  errors?: Record<string, string>;
}) {
  const addRow = () => {
    const newRow =
      field.columns?.reduce((acc, col) => {
        acc[col.id] = "";
        return acc;
      }, {} as Record<string, any>) || {};
    onChange([...value, newRow]);
  };

  const removeRow = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const updateRow = (index: number, columnId: string, cellValue: any) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [columnId]: cellValue };
    onChange(newValue);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <span className="font-medium">{field.label}</span>
          <button
            type="button"
            onClick={addRow}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Add Row
          </button>
        </div>
      </div>

      {value.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No items added yet. Click "Add Row" to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {field.columns?.map((column) => (
                  <th
                    key={column.id}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {column.label}
                    {column.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-2 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {value.map((row, index) => (
                <tr key={index} className="border-t border-gray-200">
                  {field.columns?.map((column) => (
                    <td key={column.id} className="px-4 py-2">
                      <FieldRenderer
                        field={column}
                        value={row[column.id]}
                        onChange={(_, cellValue) =>
                          updateRow(index, column.id, cellValue)
                        }
                        formData={formData}
                        errors={errors}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove row"
                    >
                      <i className="ri-delete-bin-line w-4 h-4"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Simple condition evaluator for visibility/required logic
function evaluateCondition(
  condition: string,
  formData: Record<string, any>
): boolean {
  try {
    // Simple condition parser for basic comparisons
    // In production, you might want a more robust expression evaluator

    // Handle conditions like ".IngredientType = 'Natural'"
    if (condition.includes("=")) {
      const [left, right] = condition.split("=").map((s) => s.trim());
      const fieldPath = left.startsWith(".") ? left.substring(1) : left;
      const expectedValue = right.replace(/['"]/g, "");
      return formData[fieldPath] === expectedValue;
    }

    // Handle conditions like ".IngredientType != 'Base'"
    if (condition.includes("!=")) {
      const [left, right] = condition.split("!=").map((s) => s.trim());
      const fieldPath = left.startsWith(".") ? left.substring(1) : left;
      const expectedValue = right.replace(/['"]/g, "");
      return formData[fieldPath] !== expectedValue;
    }

    return true;
  } catch (error) {
    console.error("Error evaluating condition:", condition, error);
    return true;
  }
}
