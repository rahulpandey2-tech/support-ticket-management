import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { FormField } from '../components/FormField';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PriorityBadge } from '../components/PriorityBadge';
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
      ? 'No tickets match your filters. Try adjusting search or status.'
      : 'Get started by creating your first support ticket.';

  const openCount = tickets.filter((t) => t.status === 'open').length;

  return (
    <section className="page">
      <header className="page-hero">
        <div className="page-hero__content">
          <h1>Support Tickets</h1>
          <p className="page-hero__subtitle">
            Track, search, and manage internal support requests across your team.
          </p>
        </div>
        <Link to="/tickets/new" className="btn btn--primary">
          + New Ticket
        </Link>
      </header>

      {!loading && tickets.length > 0 && (
        <div className="page-stats">
          <div className="stat-card">
            <div className="stat-card__label">Showing</div>
            <div className="stat-card__value">{tickets.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Open</div>
            <div className="stat-card__value">{openCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Filter</div>
            <div className="stat-card__value" style={{ fontSize: '1rem' }}>
              {statusFilter ? formatLabel(statusFilter) : 'All statuses'}
            </div>
          </div>
        </div>
      )}

      <div className="status-pills" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map((option) => (
          <button
            key={option.label}
            type="button"
            className={`status-pill${statusFilter === option.value ? ' status-pill--active' : ''}`}
            onClick={() => setStatusFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="filter-panel">
        <FormField id="search" label="Keyword search">
          <input
            id="search"
            type="search"
            className="field__input"
            placeholder="Search title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormField>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner label="Loading tickets..." />
      ) : tickets.length === 0 ? (
        <EmptyState title="No tickets found" message={emptyMessage} />
      ) : (
        <div className="table-card">
          <div className="table-wrap">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Ticket</th>
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
                      <div className="ticket-table__id">#{ticket.id.slice(-6)}</div>
                    </td>
                    <td>
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td>
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td>{ticket.assignedTo?.name ?? 'Unassigned'}</td>
                    <td>{formatDate(ticket.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
