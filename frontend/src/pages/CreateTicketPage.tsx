import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ApiError, createTicket, listUsers } from '../services/api';
import type { Priority, UserSummary } from '../types';
import { TICKET_PRIORITIES } from '../types';
import { formatLabel } from '../utils/format';

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignedToId, setAssignedToId] = useState('');
  const [createdById, setCreatedById] = useState('');

  useEffect(() => {
    listUsers()
      .then((data) => {
        setUsers(data);
        const defaultCreator =
          data.find((user) => user.email === 'john@example.com') ?? data[0];
        if (defaultCreator) {
          setCreatedById(defaultCreator.id);
        }
      })
      .catch(() => {
        setError('Unable to load users. Is the backend running?');
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const ticket = await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        createdById,
        assignedToId: assignedToId || null,
      });
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) {
          const next: Record<string, string> = {};
          for (const detail of err.details) {
            next[detail.field] = detail.message;
          }
          setFieldErrors(next);
        }
      } else {
        setError('Failed to create ticket. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingUsers) {
    return <LoadingSpinner label="Loading form..." />;
  }

  return (
    <section className="page page--narrow">
      <header className="page__header">
        <div>
          <h1>Create Ticket</h1>
          <p className="page__subtitle">Submit a new support request.</p>
        </div>
      </header>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Title</span>
          <input
            className="field__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
          />
          {fieldErrors.title && (
            <span className="field__error">{fieldErrors.title}</span>
          )}
        </label>

        <label className="field">
          <span className="field__label">Description</span>
          <textarea
            className="field__input field__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
          />
          {fieldErrors.description && (
            <span className="field__error">{fieldErrors.description}</span>
          )}
        </label>

        <label className="field">
          <span className="field__label">Priority</span>
          <select
            className="field__input"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {TICKET_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Assignee</span>
          <select
            className="field__input"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Created by</span>
          <select
            className="field__input"
            value={createdById}
            onChange={(e) => setCreatedById(e.target.value)}
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </label>

        <div className="form__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button--primary"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </section>
  );
}
