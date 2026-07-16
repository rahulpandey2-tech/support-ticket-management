import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { FormField } from '../components/FormField';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  ApiError,
  createComment,
  getAllowedTransitions,
  getTicket,
  listUsers,
  updateTicket,
  updateTicketStatus,
} from '../services/api';
import type {
  AllowedTransitionsResponse,
  Priority,
  TicketResponse,
  TicketStatus,
  UserSummary,
} from '../types';
import { TICKET_PRIORITIES } from '../types';
import { formatDate, formatLabel } from '../utils/format';
import {
  hasErrors,
  mergeApiFieldErrors,
  validateCommentForm,
  validateUpdateTicketForm,
  type FieldErrors,
} from '../validators/ticketValidators';

const TITLE_MAX = 200;

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [transitions, setTransitions] = useState<AllowedTransitionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignedToId, setAssignedToId] = useState('');

  const [commentMessage, setCommentMessage] = useState('');
  const [commentAuthorId, setCommentAuthorId] = useState('');

  const [editErrors, setEditErrors] = useState<FieldErrors>({});
  const [commentErrors, setCommentErrors] = useState<FieldErrors>({});
  const [editTouched, setEditTouched] = useState<Record<string, boolean>>({});
  const [commentTouched, setCommentTouched] = useState<Record<string, boolean>>({});

  const loadTicket = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const [ticketData, transitionData, userData] = await Promise.all([
        getTicket(id),
        getAllowedTransitions(id),
        listUsers(),
      ]);
      setTicket(ticketData);
      setTransitions(transitionData);
      setUsers(userData);
      setTitle(ticketData.title);
      setDescription(ticketData.description);
      setPriority(ticketData.priority);
      setAssignedToId(ticketData.assignedTo?.id ?? '');
      const defaultAuthor =
        userData.find((user) => user.email === 'jane@example.com') ?? userData[0];
      if (defaultAuthor) {
        setCommentAuthorId(defaultAuthor.id);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Unable to load ticket. Check your connection and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  function resetEditForm(current: TicketResponse) {
    setTitle(current.title);
    setDescription(current.description);
    setPriority(current.priority);
    setAssignedToId(current.assignedTo?.id ?? '');
    setEditErrors({});
    setEditTouched({});
  }

  async function handleSaveEdit(event: FormEvent) {
    event.preventDefault();
    if (!id) return;

    setEditTouched({ title: true, description: true });
    const clientErrors = validateUpdateTicketForm({ title, description, priority });
    setEditErrors(clientErrors);
    if (hasErrors(clientErrors)) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateTicket(id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        assignedToId: assignedToId || null,
      });
      setTicket(updated);
      setEditing(false);
      setSuccess('Ticket updated successfully.');
      const transitionData = await getAllowedTransitions(id);
      setTransitions(transitionData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setEditErrors(mergeApiFieldErrors(err.details));
      } else {
        setError('Failed to update ticket. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(nextStatus: TicketStatus) {
    if (!id) return;

    setStatusUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateTicketStatus(id, nextStatus);
      setTicket(updated);
      const transitionData = await getAllowedTransitions(id);
      setTransitions(transitionData);
      setSuccess(`Status changed to ${formatLabel(nextStatus)}.`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Failed to update status. Please try again.'
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleAddComment(event: FormEvent) {
    event.preventDefault();
    if (!id) return;

    setCommentTouched({ message: true, createdById: true });
    const clientErrors = validateCommentForm({
      message: commentMessage,
      createdById: commentAuthorId,
    });
    setCommentErrors(clientErrors);
    if (hasErrors(clientErrors)) return;

    setCommentSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createComment(id, {
        message: commentMessage.trim(),
        createdById: commentAuthorId,
      });
      setCommentMessage('');
      setCommentTouched({});
      setCommentErrors({});
      const refreshed = await getTicket(id);
      setTicket(refreshed);
      setSuccess('Comment added.');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setCommentErrors(mergeApiFieldErrors(err.details));
      } else {
        setError('Failed to add comment. Please try again.');
      }
    } finally {
      setCommentSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading ticket..." />;
  }

  if (notFound) {
    return (
      <section className="page">
        <EmptyState
          title="Ticket not found"
          message="The ticket may have been removed or the link is invalid."
          icon="🔍"
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/" className="btn btn--secondary">
            Back to list
          </Link>
        </div>
      </section>
    );
  }

  if (!ticket) {
    return null;
  }

  const comments = ticket.comments ?? [];
  const showEditError = (field: string) =>
    editTouched[field] ? editErrors[field] : undefined;
  const showCommentError = (field: string) =>
    commentTouched[field] ? commentErrors[field] : undefined;

  return (
    <section className="page">
      <header className="page-hero">
        <div className="page-hero__content">
          <Link to="/" className="breadcrumb">
            ← Back to tickets
          </Link>
          <h1>{ticket.title}</h1>
          <div className="ticket-meta">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="muted">#{ticket.id.slice(-8)}</span>
          </div>
        </div>
        {!editing && (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setEditing(true)}
          >
            Edit ticket
          </button>
        )}
      </header>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {success && (
        <div className="alert alert--success" role="status">
          <span>{success}</span>
          <button type="button" className="alert__dismiss" onClick={() => setSuccess(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="detail-grid">
        <div className="detail-main">
          {editing ? (
            <form className="card" onSubmit={handleSaveEdit} noValidate>
              <div className="card__header">
                <div>
                  <h2 className="card__title">Edit ticket</h2>
                  <p className="card__subtitle">Status cannot be changed here — use workflow below.</p>
                </div>
              </div>
              <div className="form">
                <FormField
                  id="edit-title"
                  label="Title"
                  required
                  error={showEditError('title')}
                >
                  <input
                    id="edit-title"
                    className="field__input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => {
                      setEditTouched((p) => ({ ...p, title: true }));
                      setEditErrors(validateUpdateTicketForm({ title, description, priority }));
                    }}
                    maxLength={TITLE_MAX}
                  />
                </FormField>
                <FormField
                  id="edit-description"
                  label="Description"
                  required
                  error={showEditError('description')}
                >
                  <textarea
                    id="edit-description"
                    className="field__textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => {
                      setEditTouched((p) => ({ ...p, description: true }));
                      setEditErrors(validateUpdateTicketForm({ title, description, priority }));
                    }}
                    rows={5}
                  />
                </FormField>
                <FormField id="edit-priority" label="Priority" required>
                  <select
                    id="edit-priority"
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
                <FormField id="edit-assignee" label="Assignee">
                  <select
                    id="edit-assignee"
                    className="field__select"
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <div className="form__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      resetEditForm(ticket);
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="card">
              <div className="card__header">
                <h2 className="card__title">Description</h2>
              </div>
              <p className="ticket-description">{ticket.description}</p>
            </div>
          )}

          <div className="card">
            <div className="card__header">
              <div>
                <h2 className="card__title">Comments</h2>
                <p className="card__subtitle">{comments.length} total</p>
              </div>
            </div>

            {comments.length === 0 ? (
              <EmptyState
                title="No comments yet"
                message="Add an update or note for the team."
                icon="💬"
              />
            ) : (
              <ul className="comment-list">
                {comments.map((comment) => (
                  <li key={comment.id} className="comment">
                    <div className="comment__header">
                      <span className="comment__author">{comment.createdBy.name}</span>
                      <time className="comment__time" dateTime={comment.createdAt}>
                        {formatDate(comment.createdAt)}
                      </time>
                    </div>
                    <p className="comment__body">{comment.message}</p>
                  </li>
                ))}
              </ul>
            )}

            <form className="form comment-form" onSubmit={handleAddComment} noValidate>
              <FormField
                id="comment-message"
                label="Add comment"
                required
                error={showCommentError('message')}
              >
                <textarea
                  id="comment-message"
                  className="field__textarea"
                  value={commentMessage}
                  onChange={(e) => setCommentMessage(e.target.value)}
                  onBlur={() => {
                    setCommentTouched((p) => ({ ...p, message: true }));
                    setCommentErrors(
                      validateCommentForm({ message: commentMessage, createdById: commentAuthorId })
                    );
                  }}
                  rows={3}
                  placeholder="Write an update or note..."
                />
              </FormField>
              <FormField
                id="comment-author"
                label="Author"
                required
                error={showCommentError('createdById')}
              >
                <select
                  id="comment-author"
                  className="field__select"
                  value={commentAuthorId}
                  onChange={(e) => setCommentAuthorId(e.target.value)}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <div className="form__actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={commentSubmitting}
                >
                  {commentSubmitting ? 'Posting...' : 'Post comment'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="meta-card">
            <h2 className="card__title" style={{ marginBottom: '1rem' }}>
              Details
            </h2>
            <dl className="meta-list">
              <div>
                <dt>Assignee</dt>
                <dd>{ticket.assignedTo?.name ?? 'Unassigned'}</dd>
              </div>
              <div>
                <dt>Created by</dt>
                <dd>{ticket.createdBy.name}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatDate(ticket.createdAt)}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{formatDate(ticket.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="meta-card">
            <h2 className="card__title" style={{ marginBottom: '0.35rem' }}>
              Workflow
            </h2>
            <p className="card__subtitle" style={{ marginBottom: '1rem' }}>
              Current: {formatLabel(ticket.status)}
            </p>
            {transitions && transitions.allowedTransitions.length > 0 ? (
              <div className="status-actions">
                {transitions.allowedTransitions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className="btn btn--status"
                    disabled={statusUpdating}
                    onClick={() => handleStatusChange(status)}
                  >
                    → {formatLabel(status)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="muted">No further status changes available.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
