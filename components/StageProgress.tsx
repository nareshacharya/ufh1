
'use client';

import React from 'react';

interface StageProgressProps {
  stages: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  currentStageIndex: number;
  onStageClick?: (stageIndex: number) => void;
  className?: string;
}

export function StageProgress({
  stages,
  currentStageIndex,
  onStageClick,
  className = ''
}: StageProgressProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex;
          const isClickable = onStageClick && (isCompleted || isActive);

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Circle and Label */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && onStageClick(index)}
                  disabled={!isClickable}
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-white shadow-lg transform scale-110' 
                      : isCompleted 
                        ? 'text-white hover:transform hover:scale-105' 
                        : 'text-rgb(var(--fg-tertiary)) hover:text-rgb(var(--fg-secondary))'
                    }
                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  `}
                  style={{
                    background: isActive 
                      ? 'rgb(var(--primary))' 
                      : isCompleted 
                        ? 'rgb(var(--accent-1))' 
                        : 'rgb(var(--bg-tertiary))'
                  }}
                >
                  {isCompleted ? (
                    <i className="ri-check-line text-lg"></i>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                  
                  {/* Active pulse effect */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-25"
                      style={{ background: 'rgb(var(--primary))' }}
                    />
                  )}
                </button>
                
                {/* Stage Title */}
                <div className="mt-3 text-center">
                  <div 
                    className={`text-sm font-medium transition-colors ${
                      isActive ? 'font-semibold' : ''
                    }`}
                    style={{ 
                      color: isActive 
                        ? 'rgb(var(--primary))' 
                        : isCompleted 
                          ? 'rgb(var(--fg-primary))' 
                          : 'rgb(var(--fg-tertiary))'
                    }}
                  >
                    {stage.title}
                  </div>
                  {stage.description && (
                    <div 
                      className="text-xs mt-1 max-w-24 leading-tight"
                      style={{ color: 'rgb(var(--fg-tertiary))' }}
                    >
                      {stage.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className="flex-1 h-px mx-4 mt-5 relative">
                  <div 
                    className="absolute inset-0 transition-all duration-300"
                    style={{ 
                      background: index < currentStageIndex 
                        ? 'rgb(var(--accent-1))' 
                        : 'rgb(var(--border-secondary))'
                    }}
                  />
                  {/* Progress animation */}
                  {index === currentStageIndex - 1 && (
                    <div 
                      className="absolute inset-0 animate-pulse"
                      style={{ background: 'rgb(var(--accent-1))' }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Bar Alternative (Optional) */}
      <div className="mt-8 w-full">
        <div 
          className="h-1 rounded-full transition-all duration-500"
          style={{ background: 'rgb(var(--bg-tertiary))' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              background: 'linear-gradient(to right, rgb(var(--primary)), rgb(var(--accent-1)))',
              width: `${((currentStageIndex) / (stages.length - 1)) * 100}%`
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: 'rgb(var(--fg-tertiary))' }}>
          <span>Start</span>
          <span>{Math.round(((currentStageIndex) / (stages.length - 1)) * 100)}% Complete</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
}
