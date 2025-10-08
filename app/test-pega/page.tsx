import Link from "next/link";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Pega DX API Integration Test
          </h1>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🧪 Create New Ingredient
              </h2>
              <p className="text-gray-600 mb-4">
                Test the complete Create Ingredient workflow with comprehensive
                form fields, validation, visibility conditions, and data source
                integration.
              </p>
              <Link
                href="/case/UFH-Work-Ingredient/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create New Ingredient
              </Link>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📝 Edit Existing Ingredient
              </h2>
              <p className="text-gray-600 mb-4">
                Test editing an existing ingredient with pre-populated form
                data.
              </p>
              <Link
                href="/case/UFH-Work-Ingredient/ING-12345"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Edit Sample Ingredient
              </Link>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🔧 Features Being Tested
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Dynamic Field Rendering:</strong> Text, Decimal,
                  Picklist, Autocomplete, TextArea, Grid
                </li>
                <li>
                  <strong>Conditional Visibility:</strong> Fields show/hide
                  based on other field values
                </li>
                <li>
                  <strong>Data Source Integration:</strong> Autocomplete fields
                  fetch data from mock APIs
                </li>
                <li>
                  <strong>Form Validation:</strong> Required fields, pattern
                  matching, range validation
                </li>
                <li>
                  <strong>Grid Components:</strong> Repeating sections with row
                  validation
                </li>
                <li>
                  <strong>Permissions Bypass:</strong> All actions enabled for
                  testing
                </li>
                <li>
                  <strong>Mock Data:</strong> Comprehensive supplier,
                  ingredient, and family data
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-6 bg-yellow-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ⚠️ Testing Notes
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All API calls are currently using mock data</li>
                <li>Permissions are bypassed - all features are visible</li>
                <li>
                  Form validation is active and will prevent invalid submissions
                </li>
                <li>
                  Autocomplete fields have debounced search with mock data
                </li>
                <li>
                  Grid validation ensures percentages total 100% for Base
                  ingredients
                </li>
                <li>Success/error messages are displayed via browser alerts</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6 bg-blue-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🚀 Next Steps for Production
              </h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>
                  Replace mock API calls with actual Pega DX API endpoints
                </li>
                <li>Implement proper OAuth2 authentication</li>
                <li>Configure environment variables for Pega instance</li>
                <li>Add error handling and retry logic</li>
                <li>Implement proper permissions and role-based access</li>
                <li>Add comprehensive logging and monitoring</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
