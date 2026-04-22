import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
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
  const [searchTerm, setSearchTerm] = useState("");
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

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionClasses = () => {
    const baseClasses = "absolute z-50 w-72 bg-white rounded-2xl shadow-[0_14px_45px_rgba(38,44,86,0.16)] ring-1 ring-gray-200 ring-opacity-70 transition-all duration-200 ease-out transform max-h-96 overflow-y-auto dropdown-scroll";
    
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
          {items.length > 5 && (
            <div className="sticky top-0 z-10 bg-white p-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search commands..."
                className="h-9 w-full rounded-xl border border-[#d4d8ef] bg-[#f8f9ff] px-3 text-sm text-gray-700 outline-none focus:border-[#8f97f4]"
              />
            </div>
          )}
          <div className="p-2" role="menu" aria-orientation="vertical">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                data-test-id={item.label}
                disabled={item.disabled}
                className={`w-full text-left rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 flex items-start gap-3 ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-[#f4f5ff] hover:text-gray-900 cursor-pointer"
                }`}
                role="menuitem"
              >
                {item.icon && (
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-[#5962eb]">
                    {item.icon}
                  </span>
                )}
                <span className="flex flex-col">
                  <span className="text-[15px] font-medium leading-tight">{item.label}</span>
                  {item.description && (
                    <span className="mt-1 text-xs text-gray-500">{item.description}</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDropdown;