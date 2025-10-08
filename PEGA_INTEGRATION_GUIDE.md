# Pega DX API Integration Testing Guide

## Overview
This guide explains how to test the complete Pega DX API integration for the Create Ingredient workflow.

## Testing the Complete Flow

### 1. New Case Creation
Navigate to: `/case/CreateIngredient/new`

This will:
- Load the DynamicForm component
- Fetch case creation metadata from `/api/cases/CreateIngredient/new`
- Render fields dynamically based on the server response
- Handle form submission to create a new case

### 2. Existing Case Editing
Navigate to: `/case/CreateIngredient/CASE-123`

This will:
- Load the CaseViewController component
- Fetch existing case data from `/api/cases/CASE-123`
- Pre-populate the DynamicForm with existing data
- Handle form updates via PUT request

### 3. API Endpoints

#### Case Creation Metadata
- **Endpoint**: `GET /api/cases/{caseTypeId}/new`
- **Purpose**: Returns view metadata for creating new cases
- **Response**: Field definitions, validation rules, visibility conditions

#### Case Creation
- **Endpoint**: `POST /api/cases`
- **Purpose**: Creates a new case in Pega
- **Payload**: Case type and form data

#### Case Data Retrieval
- **Endpoint**: `GET /api/cases/{caseId}`
- **Purpose**: Retrieves existing case data
- **Response**: Complete case data including content and assignments

#### Case Updates
- **Endpoint**: `PUT /api/cases/{caseId}`
- **Purpose**: Updates existing case data
- **Payload**: Updated case content

#### Data Source Lookups
- **Endpoint**: `GET /api/dx/datasources/{dataSource}`
- **Purpose**: Provides autocomplete data for fields
- **Examples**: Suppliers, Olfactive Families, etc.

### 4. Field Types Supported

The dynamic field renderer supports:
- **Text**: Simple text inputs
- **Decimal**: Numeric inputs with decimal support
- **TextArea**: Multi-line text inputs
- **Picklist**: Dropdown selections
- **Autocomplete**: Searchable dropdowns with API data
- **Grid**: Repeating sections for complex data

### 5. Advanced Features

#### Visibility Conditions
Fields can be shown/hidden based on other field values:
```json
{
  "visibilityCondition": {
    "field": "IngredientType",
    "operator": "equals",
    "value": "Natural"
  }
}
```

#### Field Validation
Each field can have validation rules:
```json
{
  "validation": {
    "required": true,
    "pattern": "^[A-Z0-9-]+$",
    "minLength": 5
  }
}
```

#### Data Source Integration
Autocomplete fields can fetch data from external sources:
```json
{
  "type": "Autocomplete",
  "datasource": "Suppliers",
  "searchProperty": "name"
}
```

### 6. Production Setup

To connect to actual Pega DX API:

1. **Environment Variables**:
   ```env
   PEGA_DX_API_BASE_URL=https://your-pega-instance.com/prweb/api/v1
   PEGA_CLIENT_ID=your-client-id
   PEGA_CLIENT_SECRET=your-client-secret
   ```

2. **Replace Mock Functions**:
   - Update API route handlers to make real Pega API calls
   - Implement OAuth2 token management
   - Add proper error handling and logging

3. **Authentication**:
   - Implement Pega OAuth2 flow
   - Add token refresh logic
   - Include authentication headers in all API calls

### 7. Error Handling

The system includes comprehensive error handling:
- Form validation errors are displayed inline
- Network errors show user-friendly messages
- Loading states provide visual feedback
- Failed operations can be retried

### 8. Testing Checklist

- [ ] New case creation form loads correctly
- [ ] All field types render properly
- [ ] Visibility conditions work as expected
- [ ] Form validation prevents invalid submissions
- [ ] Autocomplete fields load data sources
- [ ] Case creation creates new cases
- [ ] Existing cases load with pre-populated data
- [ ] Case updates save changes correctly
- [ ] Error states display appropriate messages
- [ ] Loading states provide user feedback

## Next Steps

1. Replace mock API calls with actual Pega DX API integration
2. Add authentication and authorization
3. Implement audit logging and monitoring
4. Add comprehensive error tracking
5. Optimize performance for large forms
6. Add automated testing coverage