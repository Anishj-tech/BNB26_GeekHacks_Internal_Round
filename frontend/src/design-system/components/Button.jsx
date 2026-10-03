import { useState } from 'react';

/**
 * TrustLayer Button Component
 * 
 * Variants:
 * - primary: Brand blue (#5B8DEF) with subtle hover glow
 * - secondary: Elevated surface with fine border
 * - outline: Subtle border with transparent background
 * - ghost: Minimal transparent button
 * - match: Semantic agreement action (#4FB3A5)
 * - conflict: Semantic suspicious/conflict action (#E06C75)
 * - uncertainty: Semantic warning/uncertainty action (#D6A85F)
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
    border: '1px solid transparent',
    borderRadius: 'var(--tl-radius-md)',
    transition: 'all var(--tl-transition-fast)',
    textDecoration: 'none',
    userSelect: 'none',
    outline: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '-0.01em',
  };

  const sizeStyles = {
    sm: {
      fontSize: '0.75rem',
      padding: '5px 10px',
      height: '28px',
    },
    md: {
      fontSize: '0.875rem',
      padding: '7px 14px',
      height: '36px',
    },
    lg: {
      fontSize: '0.9375rem',
      padding: '10px 18px',
      height: '42px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--tl-brand)',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    },
    secondary: {
      backgroundColor: 'var(--tl-surface-elevated)',
      color: 'var(--tl-text-primary)',
      borderColor: 'var(--tl-border)',
      boxShadow: 'var(--tl-shadow-sm)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--tl-text-primary)',
      borderColor: 'var(--tl-border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--tl-text-secondary)',
      borderColor: 'transparent',
    },
    match: {
      backgroundColor: 'var(--tl-match-subtle)',
      color: 'var(--tl-match)',
      borderColor: 'var(--tl-match-border)',
    },
    conflict: {
      backgroundColor: 'var(--tl-conflict-subtle)',
      color: 'var(--tl-conflict)',
      borderColor: 'var(--tl-conflict-border)',
    },
    uncertainty: {
      backgroundColor: 'var(--tl-uncertainty-subtle)',
      color: 'var(--tl-uncertainty)',
      borderColor: 'var(--tl-uncertainty-border)',
    },
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getDynamicStyles = () => {
    if (disabled || isLoading) return {};

    if (isActive) {
      return { transform: 'scale(0.98)' };
    }

    if (isHovered) {
      if (variant === 'primary') {
        return {
          backgroundColor: '#4D7EDD',
          boxShadow: '0 2px 10px rgba(91, 141, 239, 0.28)',
          transform: 'translateY(-1px)',
        };
      }
      if (variant === 'secondary') {
        return {
          backgroundColor: '#1E2C3A',
          borderColor: 'var(--tl-border-highlight)',
          color: 'var(--tl-text-primary)',
          transform: 'translateY(-1px)',
        };
      }
      if (variant === 'outline') {
        return {
          borderColor: 'var(--tl-border-highlight)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          transform: 'translateY(-1px)',
        };
      }
      if (variant === 'ghost') {
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          color: 'var(--tl-text-primary)',
        };
      }
      if (variant === 'match') {
        return {
          backgroundColor: 'rgba(79, 179, 165, 0.16)',
          borderColor: 'var(--tl-match)',
          transform: 'translateY(-1px)',
        };
      }
      if (variant === 'conflict') {
        return {
          backgroundColor: 'rgba(224, 108, 117, 0.16)',
          borderColor: 'var(--tl-conflict)',
          transform: 'translateY(-1px)',
        };
      }
      if (variant === 'uncertainty') {
        return {
          backgroundColor: 'rgba(214, 168, 95, 0.16)',
          borderColor: 'var(--tl-uncertainty)',
          transform: 'translateY(-1px)',
        };
      }
    }
    return {};
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...getDynamicStyles(),
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
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 13 : size === 'lg' ? 18 : 15} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 13 : size === 'lg' ? 18 : 15} />}
        </>
      )}
    </button>
  );
};
