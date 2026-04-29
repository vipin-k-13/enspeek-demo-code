import React from "react";
import { cn } from "../../utils";
interface DropdownData {
  Title: string;
  Icon?: React.ElementType;
  checked?: boolean;
  onClick?: () => void;
}
interface DropDownProps {
  className?: string;
  Data: DropdownData[];
  showCheckbox?: boolean;
}
const DropDown: React.FC<DropDownProps> = ({ className, Data, showCheckbox = false }) => {
  return (
    <div
      className={cn(
        "home-dropdown absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border p-1.5 shadow-xl",
        className
      )}
      role="menu"
    >
      <ul className="text-sm text-gray-700">
        {Data.map(({ Title, Icon, checked, onClick }, i) => (
          <li
            key={i}
            data-test-id={Title}
            className={cn(
              "home-dropdown-item flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors",
              Title === "Delete" && "text-rose-500 hover:bg-rose-50",
              (Title === "Add New Filters" || Title === "Share Study") &&
                "pointer-events-none opacity-35"
            )}
            onClick={onClick}
            tabIndex={0}
          >
            {showCheckbox && (
              <input
                type="checkbox"
                data-test-id={`${Title}_BOX`}
                checked={checked}
                onChange={onClick}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {Icon && <Icon className="shrink-0" />}
            <span>{Title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DropDown;
