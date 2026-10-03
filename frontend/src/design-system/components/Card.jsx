import { useState } from 'react';

/**
 * TrustLayer Card Component
 * 
 * Variants:
 * - surface: Standard background (#111820)
 * - elevated: Higher depth surface (#17212B)
 * - glass: Soft-glass with backdrop-blur
 * - technical: Forensic card with subtle corner hairline markers
 */
export const Card = ({
  children,
  variant = 'surface',
  interactive = false,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    position: 'relative',
    borderRadius: 'var(--tl-radius-md)',
    boxShadow: variant === 'elevated' ? 'var(--tl-shadow-md)' : 'var(--tl-shadow-sm)',
    transition: 'all var(--tl-transition-fast)',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const variantStyles = {
    surface: {
      backgroundColor: 'var(--tl-surface)',
      border: '1px solid var(--tl-border)',
    },
    elevated: {
      backgroundColor: 'var(--tl-surface-elevated)',
      border: '1px solid var(--tl-border-highlight)',
    },
    glass: {
      backgroundColor: 'rgba(17, 24, 32, 0.72)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid var(--tl-border)',
    },
    technical: {
      backgroundColor: 'var(--tl-surface)',
      border: '1px solid var(--tl-border)',
    },
  };

  const interactiveStyle = interactive
    ? {
        cursor: 'pointer',
        ...(isHovered && {
          transform: 'translateY(-2px)',
          borderColor: 'var(--tl-border-highlight)',
          boxShadow: 'var(--tl-shadow-md), 0 0 0 1px rgba(91, 141, 239, 0.1)',
        }),
      }
    : {};

  return (
    <div
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...interactiveStyle,
        ...style,
      }}
      className={`tl-card ${variant === 'technical' ? 'tl-technical-corner' : ''} ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {/* Subtle top inner glow line for soft-glass feel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};

export const CardHeader = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
  style = {},
}) => {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--tl-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        ...style,
      }}
      className={`tl-card-header ${className}`}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {title && (
            <h3
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--tl-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h3>
          )}
          {badge}
        </div>
        {subtitle && (
          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.8125rem',
              color: 'var(--tl-text-muted)',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', style = {} }) => {
  return (
    <div
      style={{
        padding: '20px',
        ...style,
      }}
      className={`tl-card-content ${className}`}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', style = {} }) => {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--tl-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        ...style,
      }}
      className={`tl-card-footer ${className}`}
    >
      {children}
    </div>
  );
};
