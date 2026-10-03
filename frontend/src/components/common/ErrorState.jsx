import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from '../../design-system/components/Button';

export const ErrorState = ({
  title = 'Forensic Inspection Failed',
  message = 'An unexpected error occurred while parsing the evidence streams.',
  onRetry,
}) => {
  return (
    <div
      style={{
        padding: '48px 32px',
        textAlign: 'center',
        backgroundColor: 'var(--tl-surface-card)',
        border: '1px solid var(--tl-hairline)',
        borderRadius: 'var(--tl-radius-lg)',
        maxWidth: '560px',
        margin: '40px auto',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--tl-radius-md)',
          backgroundColor: 'rgba(198, 69, 69, 0.12)',
          color: 'var(--tl-error)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <AlertOctagon size={24} />
      </div>
      <h3
        style={{
          fontFamily: 'var(--tl-font-display)',
          fontSize: '1.5rem',
          fontWeight: 400,
          color: 'var(--tl-ink)',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--tl-font-sans)',
          fontSize: '0.875rem',
          color: 'var(--tl-muted)',
          lineHeight: 1.5,
          marginBottom: '24px',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="md" icon={RotateCw} onClick={onRetry}>
          Retry Operation
        </Button>
      )}
    </div>
  );
};
