import { useState } from 'react';

/**
 * TrustLayer Tooltip Component
 * 
 * Soft-glass technical tooltip for forensic inspectability.
 */
export const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 100,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-6px)',
      marginBottom: '4px',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(6px)',
      marginTop: '4px',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-6px)',
      marginRight: '4px',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(6px)',
      marginLeft: '4px',
    },
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className={`tl-tooltip-wrapper ${className}`}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 999,
            backgroundColor: 'rgba(23, 33, 43, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid var(--tl-border-highlight)',
            borderRadius: 'var(--tl-radius-sm)',
            padding: '5px 10px',
            color: 'var(--tl-text-primary)',
            fontSize: '0.75rem',
            fontFamily: 'var(--tl-font-sans)',
            whiteSpace: 'nowrap',
            boxShadow: 'var(--tl-shadow-md)',
            pointerEvents: 'none',
            animation: 'tl-fade-in 150ms var(--tl-transition-fast) forwards',
            ...positionStyles[position],
          }}
          className="tl-tooltip-content"
        >
          {content}
        </div>
      )}
    </div>
  );
};
