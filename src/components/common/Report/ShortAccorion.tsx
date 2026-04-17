import { useState, type ReactNode } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "../../../utils";

export const SimpleAccordion = ({ children }: { children: ReactNode }) => {
  return <div className="w-full">{children}</div>;
};

export const SimpleAccordionItem = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState("");

  return (
    <div className="border border-gray-200 mb-2">
      <button
        className="w-full flex justify-between items-center px-2 py-2 font-medium text-left text-gray-900 hover:bg-gray-50"
        onClick={() => setExpanded((prev) => (prev === id ? "" : id))}
      >
        <span>{title || "Untitled"}</span>
        <IoIosArrowDown
          className={cn(
            "transition-transform duration-300",
            expanded === id ? "rotate-180" : ""
          )}
        />
      </button>
      {expanded === id && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};
