import { WorkOrderEntity } from '../entities/work-orders.entity';
import * as dayjs from 'dayjs';

export function transformWorkOrder(workOrder: WorkOrderEntity) {
  function computeSlaVariant(slaDate: Date | string | null | undefined) {
    if (!slaDate) return { sla_due_at: null, slaVariant: 'light' };

    const parsedDate =
      typeof slaDate === 'string' ? new Date(slaDate) : slaDate;
    const diff = (parsedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    let slaVariant = 'success';
    if (diff < 0)
      slaVariant = 'danger'; // Overdue
    else if (diff <= 1)
      slaVariant = 'warning'; // Due within 24 hours
    else if (diff <= 3) slaVariant = 'info'; // Due within 3 days

    return {
      sla_due_at: parsedDate.toISOString(),
      slaVariant,
    };
  }

  function getPriorityLabel(priority: number) {
    const labels = {
      1: 'Critical',
      2: 'High',
      3: 'Medium',
      4: 'Low',
      5: 'Routine',
    };
    return labels[priority] || 'Unknown';
  }

  function getPriorityVariant(priority: number) {
    const variants = {
      1: 'danger', // Critical
      2: 'warning', // High
      3: 'info', // Medium
      4: 'secondary', // Low
      5: 'light', // Routine
    };
    return variants[priority] || 'light';
  }

  function getStatusVariant(status: string) {
    const variants = {
      REQUESTED: 'info',
      DIAGNOSED: 'warning',
      IN_PROGRESS: 'primary',
      COMPLETED: 'success',
      CANCELLED: 'danger',
      REWORK: 'warning',
      WARRANTY: 'secondary',
    };
    return variants[status] || 'light';
  }

  function isOverdue(
    slaDate: Date | string | null | undefined,
    status: string,
  ) {
    if (!slaDate || ['COMPLETED', 'CANCELLED'].includes(status)) return false;
    const parsedDate =
      typeof slaDate === 'string' ? new Date(slaDate) : slaDate;
    return parsedDate.getTime() < Date.now();
  }

  const data = {
    ...workOrder.get(),

    // Enhanced SLA information
    ...computeSlaVariant(workOrder.sla_due_at),

    // Priority enhancements
    priority_label: getPriorityLabel(workOrder.priority),
    priority_variant: getPriorityVariant(workOrder.priority),

    // Status enhancements
    status_variant: getStatusVariant(workOrder.status),

    // Computed fields
    is_overdue: isOverdue(workOrder.sla_due_at, workOrder.status),

    // Duration calculations
    duration_since_request: workOrder.createdAt
      ? dayjs().diff(dayjs(workOrder.createdAt), 'hour')
      : null,

    duration_to_completion:
      workOrder.completed_at && workOrder.createdAt
        ? dayjs(workOrder.completed_at).diff(dayjs(workOrder.createdAt), 'hour')
        : null,

    // Formatted dates
    sla_due_at_formatted: workOrder.sla_due_at
      ? dayjs(workOrder.sla_due_at).format('YYYY-MM-DD HH:mm')
      : null,

    created_at_formatted: workOrder.createdAt
      ? dayjs(workOrder.createdAt).format('YYYY-MM-DD HH:mm')
      : null,

    completed_at_formatted: workOrder.completed_at
      ? dayjs(workOrder.completed_at).format('YYYY-MM-DD HH:mm')
      : null,

    diagnosis_timestamp_formatted: workOrder.diagnosis_timestamp
      ? dayjs(workOrder.diagnosis_timestamp).format('YYYY-MM-DD HH:mm')
      : null,

    // Request type label
    request_type_label: workOrder.request_type === 0 ? 'Open' : 'Service Task',

    // Feedback rating display
    feedback_rating_stars: workOrder.feedback_rating
      ? '★'.repeat(workOrder.feedback_rating) +
        '☆'.repeat(5 - workOrder.feedback_rating)
      : null,
  };

  return data;
}
