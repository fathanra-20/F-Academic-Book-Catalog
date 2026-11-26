import type { ReactNode } from 'react'

export type FeedbackVariant = 'loading' | 'error' | 'empty'

interface StatusFeedbackProps {
  variant: FeedbackVariant
  title: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  children?: ReactNode
}

const VARIANT_CLASS: Record<FeedbackVariant, string> = {
  loading: 'loading-state',
  error: 'error-state',
  empty: 'empty-state',
}

export function StatusFeedback({
  variant,
  title,
  message,
  onRetry,
  retryLabel = 'Coba Lagi',
  children,
}: StatusFeedbackProps) {
  return (
    <div
      className={VARIANT_CLASS[variant]}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {variant === 'loading' && <span className="spinner" aria-hidden="true" />}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {variant === 'error' && onRetry && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
      {children}
    </div>
  )
}
