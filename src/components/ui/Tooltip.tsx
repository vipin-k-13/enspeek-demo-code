import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

type Anchor =
  | {
      mode: "pointer";
      x: number;
      y: number;
    }
  | {
      mode: "element";
      rect: DOMRect;
    };

const VIEWPORT_GAP = 12;
const TOOLTIP_GAP = 10;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  delay = 300,
  className = "",
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [resolvedPosition, setResolvedPosition] = useState(position);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const latestPointerRef = useRef<{ x: number; y: number } | null>(null);
  const isHoveringRef = useRef(false);
  const tooltipId = useId();

  const clearScheduledWork = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const queueAnchorUpdate = (nextAnchor: Anchor) => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(() => {
      setAnchor(nextAnchor);
      frameRef.current = null;
    });
  };

  const showTooltip = () => {
    clearScheduledWork();
    timeoutRef.current = setTimeout(() => {
      if (latestPointerRef.current) {
        setAnchor({
          mode: "pointer",
          x: latestPointerRef.current.x,
          y: latestPointerRef.current.y,
        });
      } else if (triggerRef.current) {
        setAnchor({
          mode: "element",
          rect: triggerRef.current.getBoundingClientRect(),
        });
      }
      setIsPositioned(false);
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    isHoveringRef.current = false;
    clearScheduledWork();
    setIsVisible(false);
    setIsPositioned(false);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    isHoveringRef.current = true;
    latestPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
    queueAnchorUpdate({
      mode: "pointer",
      x: event.clientX,
      y: event.clientY,
    });
    showTooltip();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    latestPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
    if (!isVisible && !timeoutRef.current) return;
    queueAnchorUpdate({
      mode: "pointer",
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleFocus = () => {
    isHoveringRef.current = false;
    latestPointerRef.current = null;
    if (!triggerRef.current) return;
    queueAnchorUpdate({
      mode: "element",
      rect: triggerRef.current.getBoundingClientRect(),
    });
    showTooltip();
  };

  const clampToViewport = (
    left: number,
    top: number,
    width: number,
    height: number
  ) => {
    const maxLeft = window.innerWidth - width - VIEWPORT_GAP;
    const maxTop = window.innerHeight - height - VIEWPORT_GAP;

    return {
      left: Math.min(Math.max(left, VIEWPORT_GAP), Math.max(VIEWPORT_GAP, maxLeft)),
      top: Math.min(Math.max(top, VIEWPORT_GAP), Math.max(VIEWPORT_GAP, maxTop)),
    };
  };

  useLayoutEffect(() => {
    if (!isVisible || !tooltipRef.current || !anchor) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const { width, height } = tooltipRect;

    let nextPosition = position;

    if (anchor.mode === "pointer") {
      const spaceAbove = anchor.y - VIEWPORT_GAP;
      const spaceBelow = window.innerHeight - anchor.y - VIEWPORT_GAP;
      const spaceLeft = anchor.x - VIEWPORT_GAP;
      const spaceRight = window.innerWidth - anchor.x - VIEWPORT_GAP;

      if (position === "top" && spaceAbove < height + TOOLTIP_GAP && spaceBelow > height + TOOLTIP_GAP) {
        nextPosition = "bottom";
      } else if (position === "bottom" && spaceBelow < height + TOOLTIP_GAP && spaceAbove > height + TOOLTIP_GAP) {
        nextPosition = "top";
      } else if (position === "left" && spaceLeft < width + TOOLTIP_GAP && spaceRight > width + TOOLTIP_GAP) {
        nextPosition = "right";
      } else if (position === "right" && spaceRight < width + TOOLTIP_GAP && spaceLeft > width + TOOLTIP_GAP) {
        nextPosition = "left";
      }

      let left = 0;
      let top = 0;

      switch (nextPosition) {
        case "top":
          left = anchor.x - width / 2;
          top = anchor.y - height - TOOLTIP_GAP;
          break;
        case "bottom":
          left = anchor.x - width / 2;
          top = anchor.y + TOOLTIP_GAP;
          break;
        case "left":
          left = anchor.x - width - TOOLTIP_GAP;
          top = anchor.y - height / 2;
          break;
        case "right":
          left = anchor.x + TOOLTIP_GAP;
          top = anchor.y - height / 2;
          break;
      }

      const clamped = clampToViewport(left, top, width, height);
      setResolvedPosition(nextPosition);
      setTooltipStyle({
        position: "fixed",
        left: `${clamped.left}px`,
        top: `${clamped.top}px`,
        zIndex: 1000,
      });
      setIsPositioned(true);
      return;
    }

    const triggerRect = anchor.rect;
    const spaceAbove = triggerRect.top - VIEWPORT_GAP;
    const spaceBelow = window.innerHeight - triggerRect.bottom - VIEWPORT_GAP;
    const spaceLeft = triggerRect.left - VIEWPORT_GAP;
    const spaceRight = window.innerWidth - triggerRect.right - VIEWPORT_GAP;

    if (position === "top" && spaceAbove < height + TOOLTIP_GAP && spaceBelow > height + TOOLTIP_GAP) {
      nextPosition = "bottom";
    } else if (position === "bottom" && spaceBelow < height + TOOLTIP_GAP && spaceAbove > height + TOOLTIP_GAP) {
      nextPosition = "top";
    } else if (position === "left" && spaceLeft < width + TOOLTIP_GAP && spaceRight > width + TOOLTIP_GAP) {
      nextPosition = "right";
    } else if (position === "right" && spaceRight < width + TOOLTIP_GAP && spaceLeft > width + TOOLTIP_GAP) {
      nextPosition = "left";
    }

    let left = 0;
    let top = 0;

    switch (nextPosition) {
      case "top":
        left = triggerRect.left + (triggerRect.width - width) / 2;
        top = triggerRect.top - height - TOOLTIP_GAP;
        break;
      case "bottom":
        left = triggerRect.left + (triggerRect.width - width) / 2;
        top = triggerRect.bottom + TOOLTIP_GAP;
        break;
      case "left":
        left = triggerRect.left - width - TOOLTIP_GAP;
        top = triggerRect.top + (triggerRect.height - height) / 2;
        break;
      case "right":
        left = triggerRect.right + TOOLTIP_GAP;
        top = triggerRect.top + (triggerRect.height - height) / 2;
        break;
    }

    const clamped = clampToViewport(left, top, width, height);
    setResolvedPosition(nextPosition);
    setTooltipStyle({
      position: "fixed",
      left: `${clamped.left}px`,
      top: `${clamped.top}px`,
      zIndex: 1000,
    });
    setIsPositioned(true);
  }, [anchor, isVisible, position]);

  useEffect(() => {
    if (!isVisible) return;

    const updateElementAnchor = () => {
      if (!triggerRef.current) return;
      setAnchor({
        mode: "element",
        rect: triggerRef.current.getBoundingClientRect(),
      });
    };

    if (anchor?.mode === "element") {
      window.addEventListener("scroll", updateElementAnchor, true);
      window.addEventListener("resize", updateElementAnchor);
    }

    const updatePointerAnchor = (event: MouseEvent) => {
      if (!isHoveringRef.current) return;
      latestPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      setAnchor({
        mode: "pointer",
        x: event.clientX,
        y: event.clientY,
      });
    };

    if (anchor?.mode === "pointer") {
      window.addEventListener("mousemove", updatePointerAnchor);
    }

    return () => {
      window.removeEventListener("scroll", updateElementAnchor, true);
      window.removeEventListener("resize", updateElementAnchor);
      window.removeEventListener("mousemove", updatePointerAnchor);
    };
  }, [anchor, isVisible]);

  useEffect(() => {
    return () => {
      clearScheduledWork();
    };
  }, []);

  const getArrowClasses = () => {
    const baseClasses =
      "absolute h-2 w-2 rotate-45 bg-[var(--color-text-strong)]";
    switch (resolvedPosition) {
      case "top":
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`;
      case "bottom":
        return `${baseClasses} -top-1 left-1/2 -translate-x-1/2`;
      case "left":
        return `${baseClasses} -right-1 top-1/2 -translate-y-1/2`;
      case "right":
        return `${baseClasses} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={hideTooltip}
        onFocus={handleFocus}
        onBlur={hideTooltip}
        className={`inline-block ${className}`}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>

      {isVisible
        ? createPortal(
            <div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              style={{
                ...tooltipStyle,
                visibility: isPositioned ? "visible" : "hidden",
              }}
              className={`
                pointer-events-none relative max-w-xs break-words rounded-lg
                bg-[var(--color-text-strong)] px-3 py-2 text-sm
                text-[var(--color-core-text-inverse)] shadow-lg
                transition-opacity duration-150 ease-out
                ${isVisible && isPositioned ? "opacity-100" : "opacity-0"}
              `}
            >
              {content}
              <div className={getArrowClasses()} />
            </div>,
            document.body
          )
        : null}
    </>
  );
};
