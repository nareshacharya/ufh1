
'use client';

import { useState, useEffect } from 'react';
import { appConfig, AppConfig, isFeatureEnabled } from '../lib/config/appConfig';

export function useFeatureFlag(feature: keyof AppConfig['features']): boolean {
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(feature));

  useEffect(() => {
    // Log feature flag usage - safe logging
    if (appConfig.features.eventLogging && typeof console !== 'undefined') {
      console.log('Feature flag checked:', {
        feature,
        enabled: isEnabled,
        timestamp: new Date().toISOString(),
      });
    }
  }, [feature, isEnabled]);

  return isEnabled;
}

export function useFeatureFlags(): AppConfig['features'] {
  const [flags, setFlags] = useState(() => appConfig.features);

  useEffect(() => {
    if (appConfig.features.eventLogging && typeof console !== 'undefined') {
      console.log('Feature flags loaded:', {
        flags,
        timestamp: new Date().toISOString(),
      });
    }
  }, [flags]);

  return flags;
}

// Utility hook for conditional rendering based on feature flags
export function useConditionalFeature<T>(
  feature: keyof AppConfig['features'],
  enabledComponent: T,
  disabledComponent?: T
): T | null {
  const isEnabled = useFeatureFlag(feature);
  
  if (isEnabled) {
    return enabledComponent;
  }
  
  return disabledComponent ?? null;
}

// Hook for feature flag experiments (A/B testing ready)
export function useFeatureExperiment(
  feature: keyof AppConfig['features'],
  experimentId?: string
): {
  isEnabled: boolean;
  variant: 'control' | 'treatment';
  track: (eventName: string, data?: Record<string, any>) => void;
} {
  const isEnabled = useFeatureFlag(feature);
  const [variant] = useState<'control' | 'treatment'>(() => {
    return Math.random() > 0.5 ? 'treatment' : 'control';
  });

  const track = (eventName: string, data: Record<string, any> = {}) => {
    if (appConfig.features.eventLogging && typeof console !== 'undefined') {
      console.log('Experiment event:', {
        feature,
        experimentId,
        variant,
        eventName,
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return { isEnabled, variant, track };
}

// Performance-aware feature flag hook
export function usePerformanceAwareFeature(
  feature: keyof AppConfig['features'],
  performanceThreshold: number = 100
): boolean {
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(feature));
  const [performanceMetric, setPerformanceMetric] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const startTime = performance.now();
    
    const measurePerformance = () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setPerformanceMetric(duration);

      if (duration > performanceThreshold && isEnabled) {
        setIsEnabled(false);
        
        if (appConfig.features.eventLogging && typeof console !== 'undefined') {
          console.warn('Feature disabled due to performance:', {
            feature,
            duration,
            threshold: performanceThreshold,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };

    const timeoutId = setTimeout(measurePerformance, 100);
    return () => clearTimeout(timeoutId);
  }, [feature, isEnabled, performanceThreshold]);

  return isEnabled;
}
