import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
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

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [transitions, setTransitions] = useState<AllowedTransitionsResponse | null>(
    null
  );
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
  }

  async function handleSaveEdit(event: FormEvent) {
    event.preventDefault();
    if (!id) return;

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
      setError(
        err instanceof ApiError
          ? err.message
          : 'Failed to update ticket. Please try again.'
      );
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

    setCommentSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createComment(id, {
        message: commentMessage.trim(),
        createdById: commentAuthorId,
      });
      setCommentMessage('');
      const refreshed = await getTicket(id);
      setTicket(refreshed);
      setSuccess('Comment added.');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Failed to add comment. Please try again.'
      );
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
        />
        <Link to="/" className="button button--secondary">
          Back to list
        </Link>
      </section>
    );
  }

  if (!ticket) {
    return null;
  }

  const comments = ticket.comments ?? [];

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <Link to="/" className="breadcrumb">
            ← Back to tickets
          </Link>
          <h1>{ticket.title}</h1>
          <div className="ticket-meta">
            <StatusBadge status={ticket.status} />
            <span className={`priority priority--${ticket.priority}`}>
              {formatLabel(ticket.priority)} priority
            </span>
          </div>
        </div>
        {!editing && (
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
      </header>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {success && (
        <div className="success-banner" role="status">
          {success}
          <button type="button" onClick={() => setSuccess(null)}>
            Dismiss
          </button>
        </div>
      )}

      {editing ? (
        <form className="form card" onSubmit={handleSaveEdit}>
          <h2>Edit ticket</h2>
          <label className="field">
            <span className="field__label">Title</span>
            <input
              className="field__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
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
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => {
                resetEditForm(ticket);
                setEditing(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="card">
          <h2>Details</h2>
          <p className="ticket-description">{ticket.description}</p>
          <dl className="detail-list">
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
      )}

      <div className="card">
        <h2>Change status</h2>
        {transitions && transitions.allowedTransitions.length > 0 ? (
          <div className="status-actions">
            {transitions.allowedTransitions.map((status) => (
              <button
                key={status}
                type="button"
                className="button button--secondary"
                disabled={statusUpdating}
                onClick={() => handleStatusChange(status)}
              >
                Move to {formatLabel(status)}
              </button>
            ))}
          </div>
        ) : (
          <p className="muted">No further status changes are available.</p>
        )}
      </div>

      <div className="card">
        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 ? (
          <EmptyState title="No comments yet" message="Be the first to add a note." />
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment__header">
                  <strong>{comment.createdBy.name}</strong>
                  <time dateTime={comment.createdAt}>
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p>{comment.message}</p>
              </li>
            ))}
          </ul>
        )}

        <form className="form comment-form" onSubmit={handleAddComment}>
          <label className="field">
            <span className="field__label">Add comment</span>
            <textarea
              className="field__input field__textarea"
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              required
              rows={3}
              placeholder="Write an update or note..."
            />
          </label>
          <label className="field">
            <span className="field__label">Author</span>
            <select
              className="field__input"
              value={commentAuthorId}
              onChange={(e) => setCommentAuthorId(e.target.value)}
              required
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form__actions">
            <button
              type="submit"
              className="button button--primary"
              disabled={commentSubmitting}
            >
              {commentSubmitting ? 'Posting...' : 'Post comment'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
