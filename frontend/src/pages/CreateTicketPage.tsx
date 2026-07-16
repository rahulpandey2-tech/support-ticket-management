import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorBanner } from '../components/ErrorBanner';
import { FormField } from '../components/FormField';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ApiError, createTicket, listUsers } from '../services/api';
import type { Priority, UserSummary } from '../types';
import { TICKET_PRIORITIES } from '../types';
import { formatLabel } from '../utils/format';
import {
  hasErrors,
  mergeApiFieldErrors,
  validateCreateTicketForm,
  type FieldErrors,
} from '../validators/ticketValidators';

const TITLE_MAX = 200;

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  function validateForm(): FieldErrors {
    return validateCreateTicketForm({
      title,
      description,
      priority,
      createdById,
      assignedToId,
    });
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldErrors(validateForm());
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({ title: true, description: true, createdById: true });

    const clientErrors = validateForm();
    setFieldErrors(clientErrors);
    if (hasErrors(clientErrors)) {
      return;
    }

    setSubmitting(true);
    setError(null);

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
        setFieldErrors(mergeApiFieldErrors(err.details));
      } else {
        setError('Failed to create ticket. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const showError = (field: string) => (touched[field] ? fieldErrors[field] : undefined);

  const titleLength = title.length;

  if (loadingUsers) {
    return <LoadingSpinner label="Loading form..." />;
  }

  return (
    <section className="page page--narrow">
      <header className="page-hero">
        <div className="page-hero__content">
          <Link to="/" className="breadcrumb">
            ← Back to tickets
          </Link>
          <h1>Create Ticket</h1>
          <p className="page-hero__subtitle">
            Submit a new support request. Required fields are marked with *.
          </p>
        </div>
      </header>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form className="form form-card" onSubmit={handleSubmit} noValidate>
        <p className="form__section-title">Ticket details</p>

        <FormField
          id="title"
          label="Title"
          required
          error={showError('title')}
          hint="Brief summary of the issue (max 200 characters)"
        >
          <input
            id="title"
            className="field__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur('title')}
            maxLength={TITLE_MAX}
            placeholder="e.g. Cannot reset password"
            aria-invalid={!!showError('title')}
            aria-describedby={showError('title') ? 'title-error' : undefined}
          />
          <span
            className={`char-count${titleLength > TITLE_MAX * 0.9 ? ' char-count--warn' : ''}`}
          >
            {titleLength}/{TITLE_MAX}
          </span>
        </FormField>

        <FormField
          id="description"
          label="Description"
          required
          error={showError('description')}
        >
          <textarea
            id="description"
            className="field__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            rows={5}
            placeholder="Describe the issue in detail..."
            aria-invalid={!!showError('description')}
          />
        </FormField>

        <FormField id="priority" label="Priority" required error={showError('priority')}>
          <select
            id="priority"
            className="field__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {TICKET_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="assignee" label="Assignee" hint="Optional — leave unassigned if unknown">
          <select
            id="assignee"
            className="field__select"
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
        </FormField>

        <FormField
          id="createdBy"
          label="Created by"
          required
          error={showError('createdById')}
        >
          <select
            id="createdBy"
            className="field__select"
            value={createdById}
            onChange={(e) => setCreatedById(e.target.value)}
            onBlur={() => handleBlur('createdById')}
            aria-invalid={!!showError('createdById')}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </FormField>

        <div className="form__actions">
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </section>
  );
}
