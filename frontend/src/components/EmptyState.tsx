interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string;
}

export function EmptyState({ title, message, icon = '📋' }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
