import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right" | "top" | "bottom";
  className?: string;
}

const NewDropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = "bottom-left",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const getPositionClasses = () => {
    const baseClasses = "absolute z-50 w-56 ml-8 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 ring-opacity-5 transition-all duration-200 ease-out transform max-h-80 overflow-y-auto dropdown-scroll";
    
    switch (position) {
      case "top-left":
        return `${baseClasses} bottom-full mb-2 left-0`;
      case "top-right":
        return `${baseClasses} bottom-full mb-2 right-0`;
      case "bottom-left":
        return `${baseClasses} top-full mt-2 left-0`;
      case "bottom-right":
        return `${baseClasses} top-full mt-2 right-0`;
      case "left":
        return `${baseClasses} top-full mt-2 left-0`;
      case "right":
        return `${baseClasses} top-full mt-2 right-0`;
      case "top":
        return `${baseClasses} bottom-full mb-2 left-1/2 transform -translate-x-1/2`;
      case "bottom":
        return `${baseClasses} top-full mt-2 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-full mt-2 left-0`;
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className={getPositionClasses()}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                data-test-id={item.label}
                disabled={item.disabled}
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center gap-3 ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                }`}
                role="menuitem"
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDropdown;