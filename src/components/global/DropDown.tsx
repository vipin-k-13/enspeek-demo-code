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
        "absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded z-50 shadow-md",
        className
      )}
      role="menu"
    >
      <ul className="text-sm text-gray-700">
        {Data.map(({ Title, Icon, checked, onClick }, i) => (
          <li
            key={i}
            data-test-id={Title}
            className={cn("px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2", (Title === "Add New Filters" || Title === "Share Study") && "pointer-events-none opacity-35")}
            onClick={!showCheckbox ? onClick : undefined}
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
            {Icon && <Icon />}
            <span>{Title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DropDown;