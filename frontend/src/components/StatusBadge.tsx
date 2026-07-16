import type { TicketStatus } from '../types';
import { formatLabel } from '../utils/format';

interface StatusBadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {formatLabel(status)}
    </span>
  );
}
