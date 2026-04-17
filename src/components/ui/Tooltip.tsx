import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  position = 'top', 
  delay = 300,
  className = '',
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 8) left = 8;
      if (left + tooltipRect.width > viewportWidth - 8) {
        left = viewportWidth - tooltipRect.width - 8;
      }
      if (top < 8) top = 8;
      if (top + tooltipRect.height > viewportHeight - 8) {
        top = viewportHeight - tooltipRect.height - 8;
      }

      setTooltipStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 1000,
      });
    }
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
    switch (position) {
      case 'top':
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} -top-1 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${baseClasses} -right-1 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${baseClasses} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-block ${className}`}
        aria-describedby={isVisible ? 'tooltip' : undefined}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          style={tooltipStyle}
          className={`
            bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg
            transition-opacity duration-400 ease-in-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}
            max-w-xs break-words
            pointer-events-none
            relative
          `}
        >
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </>
  );
};