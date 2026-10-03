import { useState } from 'react';

/**
 * TrustLayer Card Component
 * Following DESIGN-claude.md surface hierarchy:
 * - surfaceCard: Light cream card (#efe9de)
 * - canvas: Tinted cream (#faf9f5) with hairline border
 * - dark: Dark navy product surface (#181715) for forensic chrome
 * - darkElevated: Elevated dark surface (#252320)
 * - coral: Signature coral callout card (#cc785c)
 */
export const Card = ({
  children,
  variant = 'surfaceCard',
  interactive = false,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    position: 'relative',
    borderRadius: 'var(--tl-radius-lg)',
    transition: 'border-color 160ms ease, background-color 160ms ease, transform 120ms cubic-bezier(0.16, 1, 0.3, 1)',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const variantStyles = {
    surfaceCard: {
      backgroundColor: 'var(--tl-surface-card)',
      border: '1px solid var(--tl-hairline)',
      color: 'var(--tl-ink)',
    },
    surface: {
      backgroundColor: 'var(--tl-surface-card)',
      border: '1px solid var(--tl-hairline)',
      color: 'var(--tl-ink)',
    },
    canvas: {
      backgroundColor: 'var(--tl-canvas)',
      border: '1px solid var(--tl-hairline)',
      color: 'var(--tl-ink)',
    },
    dark: {
      backgroundColor: 'var(--tl-surface-dark)',
      border: '1px solid var(--tl-surface-dark-elevated)',
      color: 'var(--tl-on-dark)',
    },
    darkElevated: {
      backgroundColor: 'var(--tl-surface-dark-elevated)',
      border: '1px solid rgba(250, 249, 245, 0.08)',
      color: 'var(--tl-on-dark)',
    },
    coral: {
      backgroundColor: 'var(--tl-primary)',
      border: '1px solid var(--tl-primary)',
      color: '#ffffff',
    },
  };

  const interactiveStyle = interactive
    ? {
        cursor: 'pointer',
        ...(isHovered && {
          transform: 'translateY(-2px)',
          borderColor: variant.startsWith('dark') ? 'rgba(250, 249, 245, 0.2)' : '#d5cbbe',
        }),
      }
    : {};

  const currentVariant = variantStyles[variant] || variantStyles.surfaceCard;

  return (
    <div
      style={{
        ...baseStyle,
        ...currentVariant,
        ...interactiveStyle,
        ...style,
      }}
      className={`tl-card ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
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
        padding: '20px 24px 16px',
        borderBottom: '1px solid var(--tl-hairline-soft)',
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
                fontSize: '1rem',
                fontWeight: 600,
                color: 'inherit',
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
              color: 'var(--tl-muted)',
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
        padding: '24px',
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
        padding: '14px 24px',
        borderTop: '1px solid var(--tl-hairline-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style,
      }}
      className={`tl-card-footer ${className}`}
    >
      {children}
    </div>
  );
};
