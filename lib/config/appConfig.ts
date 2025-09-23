
export interface AppConfig {
  theme: {
    default: 'system' | 'light' | 'dark';
    enableToggle: boolean;
  };
  layout: {
    enableHeader: boolean;
    enableFooter: boolean;
    sidebarCollapsedByDefault: boolean;
  };
  app: {
    name: string;
    version: string;
  };
  features: {
    formulaNormalization: boolean;
    yielding: boolean;
    batchCalculation: boolean;
    versionComparison: boolean;
    complianceRun: boolean;
    projectMilestones: boolean;
    formulaLinking: boolean;
    advancedActions: boolean;
    errorBoundary: boolean;
    toastNotifications: boolean;
    eventLogging: boolean;
    accessibilityEnhancements: boolean;
  };
  observability: {
    enableErrorTracking: boolean;
    enablePerformanceMonitoring: boolean;
    enableUserEvents: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  accessibility: {
    enableSkipLinks: boolean;
    enableFocusTrapping: boolean;
    enableAriaLabels: boolean;
    enableKeyboardNavigation: boolean;
    announceStateChanges: boolean;
  };
}

export const appConfig: AppConfig = {
  theme: {
    default: 'system',
    enableToggle: true,
  },
  layout: {
    enableHeader: false,
    enableFooter: false,
    sidebarCollapsedByDefault: true,
  },
  app: {
    name: 'Perfumery Workbench',
    version: '1.0.0',
  },
  features: {
    formulaNormalization: true,
    yielding: true,
    batchCalculation: true,
    versionComparison: true,
    complianceRun: true,
    projectMilestones: true,
    formulaLinking: true,
    advancedActions: true,
    errorBoundary: true,
    toastNotifications: true,
    eventLogging: true,
    accessibilityEnhancements: true,
  },
  observability: {
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableUserEvents: true,
    logLevel: 'info',
  },
  accessibility: {
    enableSkipLinks: true,
    enableFocusTrapping: true,
    enableAriaLabels: true,
    enableKeyboardNavigation: true,
    announceStateChanges: true,
  },
};

// Feature flag utilities
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return appConfig.features[feature];
};

export const getFeatureFlags = () => {
  return appConfig.features;
};
