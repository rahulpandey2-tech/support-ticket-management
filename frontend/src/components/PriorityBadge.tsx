import type { Priority } from '../types';
import { formatLabel } from '../utils/format';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`priority-badge priority-badge--${priority}`}>
      {formatLabel(priority)}
    </span>
  );
}
