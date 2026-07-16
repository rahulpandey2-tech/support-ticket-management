interface ErrorBannerProps {
  message: string;
  details?: { field: string; message: string }[];
  onDismiss?: () => void;
}

export function ErrorBanner({ message, details, onDismiss }: ErrorBannerProps) {
  return (
    <div className="alert alert--error" role="alert">
      <div>
        <strong>{message}</strong>
        {details && details.length > 0 && (
          <ul className="alert__details">
            {details.map((detail) => (
              <li key={`${detail.field}-${detail.message}`}>
                {detail.field}: {detail.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      {onDismiss && (
        <button type="button" className="alert__dismiss" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );
}
