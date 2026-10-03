import { Activity } from 'lucide-react';

export const LoadingState = ({ message = 'Synchronizing forensic evidence graph...' }) => {
  return (
    <div
      style={{
        padding: '64px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        backgroundColor: 'var(--tl-canvas)',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--tl-radius-md)',
          backgroundColor: 'rgba(204, 120, 92, 0.12)',
          color: 'var(--tl-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Activity size={20} className="animate-spin" />
      </div>
      <p
        style={{
          fontFamily: 'var(--tl-font-mono)',
          fontSize: '0.8125rem',
          color: 'var(--tl-muted)',
          letterSpacing: '0.04em',
        }}
      >
        {message}
      </p>
    </div>
  );
};
