export const WORK_ORDER_STATUS = {
  REQUESTED: 'Requested',
  DIAGNOSED: 'Diagnosed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  REWORK: 'Rework',
  WARRANTY: 'Warranty',
} as const;

export const WORK_ORDER_PRIORITY = {
  CRITICAL: '1',
  HIGH: '2',
  MEDIUM: '3',
  LOW: '4',
  ROUTINE: '5',
} as const;

export const WORK_ORDER_PRIORITY_LABELS = {
  [WORK_ORDER_PRIORITY.CRITICAL]: 'Critical',
  [WORK_ORDER_PRIORITY.HIGH]: 'High',
  [WORK_ORDER_PRIORITY.MEDIUM]: 'Medium',
  [WORK_ORDER_PRIORITY.LOW]: 'Low',
  [WORK_ORDER_PRIORITY.ROUTINE]: 'Routine',
} as const;

export const REQUEST_TYPE = {
  DIAGNOSTIC: false,
  SERVICE_TASK: true,
} as const;

export const REQUEST_TYPE_LABELS = {
  false: 'Open (Diagnostic)',
  true: 'Service Task',
} as const;

export const WORK_ORDER_PERMISSIONS = {
  VIEW: 'V',
  CREATE: 'C',
  EDIT: 'E',
  DELETE: 'D',
} as const;

export const WORK_ORDER_MODULE = 'work_order';

// Default SLA hours by priority
export const DEFAULT_SLA_HOURS = {
  [WORK_ORDER_PRIORITY.CRITICAL]: 4,
  [WORK_ORDER_PRIORITY.HIGH]: 8,
  [WORK_ORDER_PRIORITY.MEDIUM]: 24,
  [WORK_ORDER_PRIORITY.LOW]: 48,
  [WORK_ORDER_PRIORITY.ROUTINE]: 72,
} as const;