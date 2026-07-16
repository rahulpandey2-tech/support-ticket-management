import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { useDebounce } from '../hooks/useDebounce';
import { ApiError, listTickets } from '../services/api';
import type { TicketResponse, TicketStatus } from '../types';
import { TICKET_STATUSES } from '../types';
import { formatDate, formatLabel } from '../utils/format';

const STATUS_FILTERS: Array<{ value: '' | TicketStatus; label: string }> = [
  { value: '', label: 'All' },
  ...TICKET_STATUSES.map((status) => ({
    value: status,
    label: formatLabel(status),
  })),
];

export function TicketListPage() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'' | TicketStatus>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await listTickets({
          status: statusFilter || undefined,
          q: debouncedSearch.trim() || undefined,
        });
        if (!cancelled) {
          setTickets(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'Unable to load tickets. Check your connection and try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, debouncedSearch]);

  const emptyMessage =
    debouncedSearch.trim() || statusFilter
      ? 'No tickets match your filters.'
      : 'Create your first ticket to get started.';

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <h1>Tickets</h1>
          <p className="page__subtitle">Browse, filter, and search support tickets.</p>
        </div>
        <Link to="/tickets/new" className="button button--primary">
          New Ticket
        </Link>
      </header>

      <div className="toolbar">
        <label className="field field--grow">
          <span className="field__label">Search</span>
          <input
            type="search"
            className="field__input"
            placeholder="Search title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Status</span>
          <select
            className="field__input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as '' | TicketStatus)}
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner label="Loading tickets..." />
      ) : tickets.length === 0 ? (
        <EmptyState title="No tickets found" message={emptyMessage} />
      ) : (
        <div className="table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <Link to={`/tickets/${ticket.id}`} className="ticket-table__link">
                      {ticket.title}
                    </Link>
                  </td>
                  <td>
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td>
                    <span className={`priority priority--${ticket.priority}`}>
                      {formatLabel(ticket.priority)}
                    </span>
                  </td>
                  <td>{ticket.assignedTo?.name ?? 'Unassigned'}</td>
                  <td>{formatDate(ticket.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
