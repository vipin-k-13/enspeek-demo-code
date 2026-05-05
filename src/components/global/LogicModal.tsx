import React from "react";
import { cn } from "../../utils";
import { LuGitBranchPlus } from "react-icons/lu";
import ModalScaffold from "../ui/modal/ModalScaffold";

interface LogicModelProps {
  isOpen: boolean;
  onClose: () => void;
  Title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  disable?: boolean;
  className?: string;
  footerContent?: React.ReactNode;
}

const LogicModel: React.FC<LogicModelProps> = ({
  isOpen,
  onClose,
  Title,
  description,
  children,
  className = "",
  footerContent,
}) => {
  if (!isOpen) return null;

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className={cn("max-w-5xl", className)}
      title={Title}
      icon={<LuGitBranchPlus className="h-5 w-5" />}
      description={description}
      descriptionClassName="text-black"
      bodyClassName="h-[calc(100vh-300px)]"
      footerRight={footerContent}
    >
      <div tabIndex={-1} className="w-full">
        {children}
      </div>
    </ModalScaffold>
  );
};

export default LogicModel;
