
import { appConfig } from '@/lib/config/appConfig';

export interface EventData {
  [key: string]: any;
}

export interface LogEvent {
  type: string;
  data: EventData;
  timestamp: string;
  sessionId: string;
  userId?: string;
  userRoles?: string[];
  level: 'debug' | 'info' | 'warn' | 'error';
}

class EventLogger {
  private sessionId: string;
  private events: LogEvent[] = [];
  private maxEvents = 1000;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public logEvent(
    type: string, 
    data: EventData = {}, 
    level: 'debug' | 'info' | 'warn' | 'error' = 'info',
    userId?: string,
    userRoles?: string[]
  ): void {
    if (!appConfig.features.eventLogging) {
      return;
    }

    // Check log level
    const logLevels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = logLevels.indexOf(appConfig.observability.logLevel);
    const eventLevelIndex = logLevels.indexOf(level);
    
    if (eventLevelIndex < currentLevelIndex) {
      return;
    }

    const event: LogEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId,
      userRoles,
      level,
    };

    // Add to in-memory storage
    this.events.push(event);
    
    // Maintain max events limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'error' ? console.error : 
                      level === 'warn' ? console.warn : 
                      level === 'debug' ? console.debug : console.log;
      
      logMethod(`[${level.toUpperCase()}] ${type}:`, data);
    }

    // Send to monitoring service (mock implementation)
    if (appConfig.observability.enableUserEvents) {
      this.sendToMonitoringService(event);
    }
  }

  private async sendToMonitoringService(event: LogEvent): Promise<void> {
    try {
      // Mock implementation - in production, this would send to your monitoring service
      // Examples: DataDog, New Relic, Sentry, custom analytics endpoint
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics event:', event);
      }

      // Example: Send to analytics endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
      
    } catch (error) {
      console.error('Failed to send event to monitoring service:', error);
    }
  }

  public getEvents(type?: string, level?: string): LogEvent[] {
    let filteredEvents = this.events;

    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }

    if (level) {
      filteredEvents = filteredEvents.filter(event => event.level === level);
    }

    return filteredEvents;
  }

  public clearEvents(): void {
    this.events = [];
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getEventStats(): {
    total: number;
    byType: Record<string, number>;
    byLevel: Record<string, number>;
  } {
    const byType: Record<string, number> = {};
    const byLevel: Record<string, number> = {};

    this.events.forEach(event => {
      byType[event.type] = (byType[event.type] || 0) + 1;
      byLevel[event.level] = (byLevel[event.level] || 0) + 1;
    });

    return {
      total: this.events.length,
      byType,
      byLevel,
    };
  }
}

// Global instance
const eventLogger = new EventLogger();

// Exported functions
export const logEvent = (
  type: string, 
  data?: EventData, 
  level?: 'debug' | 'info' | 'warn' | 'error',
  userId?: string,
  userRoles?: string[]
) => {
  eventLogger.logEvent(type, data, level, userId, userRoles);
};

export const getEvents = (type?: string, level?: string) => {
  return eventLogger.getEvents(type, level);
};

export const clearEvents = () => {
  eventLogger.clearEvents();
};

export const getSessionId = () => {
  return eventLogger.getSessionId();
};

export const getEventStats = () => {
  return eventLogger.getEventStats();
};

// Common event types for consistency
export const EventTypes = {
  // User actions
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_ACTION: 'user_action',
  
  // Case operations
  CASE_CREATED: 'case_created',
  CASE_UPDATED: 'case_updated',
  CASE_SUBMITTED: 'case_submitted',
  CASE_APPROVED: 'case_approved',
  CASE_REJECTED: 'case_rejected',
  
  // Formula operations
  FORMULA_CALCULATED: 'formula_calculated',
  FORMULA_NORMALIZED: 'formula_normalized',
  FORMULA_BATCH_CHANGED: 'formula_batch_changed',
  FORMULA_YIELD_APPLIED: 'formula_yield_applied',
  FORMULA_VERSION_SAVED: 'formula_version_saved',
  
  // Compliance operations
  COMPLIANCE_RUN_STARTED: 'compliance_run_started',
  COMPLIANCE_RUN_COMPLETED: 'compliance_run_completed',
  COMPLIANCE_REPORT_GENERATED: 'compliance_report_generated',
  
  // Project operations
  PROJECT_CREATED: 'project_created',
  PROJECT_MILESTONE_UPDATED: 'project_milestone_updated',
  PROJECT_FORMULA_LINKED: 'project_formula_linked',
  
  // System events
  ERROR_BOUNDARY_TRIGGERED: 'error_boundary_triggered',
  ERROR_BOUNDARY_RETRY: 'error_boundary_retry',
  TOAST_SHOWN: 'toast_shown',
  PERFORMANCE_METRIC: 'performance_metric',
  
  // Navigation
  PAGE_VIEW: 'page_view',
  STAGE_CHANGED: 'stage_changed',
  STEP_CHANGED: 'step_changed',
} as const;

// Performance monitoring helper
export const trackPerformance = (name: string, startTime: number) => {
  const duration = performance.now() - startTime;
  
  logEvent(EventTypes.PERFORMANCE_METRIC, {
    name,
    duration,
    timestamp: new Date().toISOString(),
  });
};

// User action tracking helper
export const trackUserAction = (action: string, context?: EventData, userId?: string, userRoles?: string[]) => {
  logEvent(EventTypes.USER_ACTION, {
    action,
    ...context,
  }, 'info', userId, userRoles);
};
