
import { Suspense } from 'react';
import CaseViewController from './CaseViewController';

export async function generateStaticParams() {
  return [
    { caseTypeId: 'Ingredient', id: '1' },
    { caseTypeId: 'Formula', id: '1' },
    { caseTypeId: 'Project', id: '1' },
    { caseTypeId: 'Palette', id: '1' },
    { caseTypeId: 'Compliance', id: '1' },
  ];
}

interface CaseViewPageProps {
  params: {
    caseTypeId: string;
    id: string;
  };
}

export default function CaseViewPage({ params }: CaseViewPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<CaseViewSkeleton />}>
        <CaseViewController 
          caseTypeId={params.caseTypeId}
          caseId={params.id}
        />
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
