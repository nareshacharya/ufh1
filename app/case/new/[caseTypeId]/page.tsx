
import { Suspense } from 'react';
import CaseCreationView from './CaseCreationView';

export async function generateStaticParams() {
  return [
    { caseTypeId: 'Ingredient' },
    { caseTypeId: 'Formula' },
    { caseTypeId: 'Project' },
    { caseTypeId: 'Palette' },
    { caseTypeId: 'Compliance' },
  ];
}

export default function NewCasePage({ params }: { params: { caseTypeId: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case template...</p>
        </div>
      </div>
    }>
      <CaseCreationView caseTypeId={params.caseTypeId} />
    </Suspense>
  );
}
