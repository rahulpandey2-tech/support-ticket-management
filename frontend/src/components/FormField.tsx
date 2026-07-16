import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  error,
  hint,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && (
        <span className="field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
      {hint && !error && <span className="field__hint">{hint}</span>}
    </div>
  );
}
