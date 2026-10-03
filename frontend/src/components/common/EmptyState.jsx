import { FolderSearch, Plus } from 'lucide-react';
import { Button } from '../../design-system/components/Button';

export const EmptyState = ({
  icon: Icon = FolderSearch,
  title = 'No Investigations Found',
  description = 'No active forensic evidence cases match the current filter parameters.',
  actionLabel = 'Start New Investigation',
  onAction,
}) => {
  return (
    <div
      style={{
        padding: '56px 32px',
        textAlign: 'center',
        backgroundColor: 'var(--tl-surface-card)',
        border: '1px dashed var(--tl-hairline)',
        borderRadius: 'var(--tl-radius-lg)',
        maxWidth: '540px',
        margin: '32px auto',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--tl-radius-md)',
          backgroundColor: 'var(--tl-canvas)',
          border: '1px solid var(--tl-hairline)',
          color: 'var(--tl-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <Icon size={22} />
      </div>

      <h3
        style={{
          fontFamily: 'var(--tl-font-display)',
          fontSize: '1.375rem',
          fontWeight: 400,
          color: 'var(--tl-ink)',
          marginBottom: '6px',
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
          marginBottom: '20px',
        }}
      >
        {description}
      </p>

      {onAction && (
        <Button variant="primary" size="md" icon={Plus} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
