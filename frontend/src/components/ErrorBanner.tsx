interface ErrorBannerProps {
  message: string;
  details?: { field: string; message: string }[];
  onDismiss?: () => void;
}

export function ErrorBanner({ message, details, onDismiss }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <div className="error-banner__content">
        <strong>{message}</strong>
        {details && details.length > 0 && (
          <ul className="error-banner__details">
            {details.map((detail) => (
              <li key={`${detail.field}-${detail.message}`}>
                {detail.field}: {detail.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      {onDismiss && (
        <button type="button" className="error-banner__dismiss" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );
}
