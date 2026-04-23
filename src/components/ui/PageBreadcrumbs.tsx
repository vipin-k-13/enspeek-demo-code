import * as React from "react";
import { Link } from "react-router";
import { cn } from "../../utils";

type BreadcrumbItem = {
  label: string;
  to?: string;
  state?: unknown;
  active?: boolean;
};

interface PageBreadcrumbsProps {
  prefix?: React.ReactNode;
  items: BreadcrumbItem[];
  className?: string;
}

const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({
  prefix,
  items,
  className,
}) => {
  return (
    <div className={cn("text-sm", className)}>
      {prefix && <span className="crosstab-title font-semibold">{prefix}</span>}
      {prefix && <span> </span>}
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {item.to ? (
            <Link
              to={item.to}
              state={item.state}
              className={cn(
                item.active
                  ? "questionnaire-label font-semibold"
                  : "crosstab-muted hover:text-login-primary"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                item.active
                  ? "questionnaire-label font-semibold"
                  : "crosstab-muted"
              )}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <span> / </span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PageBreadcrumbs;
