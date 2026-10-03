import { useState } from 'react';

/**
 * TrustLayer Button Component
 * Built according to DESIGN-claude.md (Warm Coral + Cream + Dark) & SKILL.md (Immediate press feedback)
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  isLoading = false,
  className = '',
  onClick,
  style = {},
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--tl-font-sans)',
    fontWeight: 500,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    borderRadius: 'var(--tl-radius-md)',
    transition: 'background-color 140ms cubic-bezier(0.16, 1, 0.3, 1), transform 90ms cubic-bezier(0.16, 1, 0.3, 1), border-color 140ms ease',
    textDecoration: 'none',
    userSelect: 'none',
    outline: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '-0.01em',
    lineHeight: 1,
  };

  const sizeStyles = {
    sm: {
      fontSize: '0.8125rem',
      padding: '7px 12px',
      height: '32px',
    },
    md: {
      fontSize: '0.875rem',
      padding: '10px 18px',
      height: '40px',
    },
    lg: {
      fontSize: '0.9375rem',
      padding: '12px 24px',
      height: '46px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--tl-primary)',
      color: '#ffffff',
      border: '1px solid var(--tl-primary)',
    },
    secondary: {
      backgroundColor: 'var(--tl-canvas)',
      color: 'var(--tl-ink)',
      border: '1px solid var(--tl-hairline)',
    },
    secondaryDark: {
      backgroundColor: 'var(--tl-surface-dark-elevated)',
      color: 'var(--tl-on-dark)',
      border: '1px solid rgba(250, 249, 245, 0.12)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--tl-ink)',
      border: '1px solid var(--tl-hairline)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--tl-body)',
      border: '1px solid transparent',
    },
    match: {
      backgroundColor: 'rgba(93, 184, 166, 0.12)',
      color: '#2a7566',
      border: '1px solid rgba(93, 184, 166, 0.32)',
    },
    conflict: {
      backgroundColor: 'rgba(198, 69, 69, 0.12)',
      color: '#a33333',
      border: '1px solid rgba(198, 69, 69, 0.32)',
    },
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getDynamicStyles = () => {
    if (disabled || isLoading) return {};

    if (isActive) {
      return { transform: 'scale(0.97)' };
    }

    if (isHovered) {
      if (variant === 'primary') {
        return {
          backgroundColor: 'var(--tl-primary-active)',
          borderColor: 'var(--tl-primary-active)',
        };
      }
      if (variant === 'secondary') {
        return {
          backgroundColor: 'var(--tl-surface-soft)',
          borderColor: '#d8cfc3',
        };
      }
      if (variant === 'secondaryDark') {
        return {
          backgroundColor: '#2e2b27',
          borderColor: 'rgba(250, 249, 245, 0.2)',
        };
      }
      if (variant === 'outline') {
        return {
          backgroundColor: 'var(--tl-surface-card)',
          borderColor: '#d1c7b8',
        };
      }
      if (variant === 'ghost') {
        return {
          backgroundColor: 'var(--tl-surface-soft)',
          color: 'var(--tl-ink)',
        };
      }
    }
    return {};
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...currentVariant,
        ...getDynamicStyles(),
        ...style,
      }}
      className={`tl-button ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'tl-spin 0.7s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
        </>
      )}
    </button>
  );
};
