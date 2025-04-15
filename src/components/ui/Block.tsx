import clsx from "clsx";
import React from "react";

type Tab = {
  id: string;
  labelMobile: string;
  labelDesktop: string;
};

interface BlockProps {
  title: string;
  tabs?: Tab[];
  value?: string;
  onChange?: (nextTab: string) => void;
  children: React.ReactNode;
}

interface TabChildProps {
  id: string;
}

export const Block: React.FC<BlockProps> = ({
  title,
  tabs,
  value,
  onChange,
  children,
}) => {
  return (
    <div className="flex flex-1 flex-col shrink-0 mb-10">
      <div className="flex flex-row justify-between -mb-[1px] relative items-center gap-2">
        <div className="flex uppercase py-1 text-current/70">{title}</div>
        <div className="flex flex-1 h-[1px] bg-foreground/8" />
        {/* Render tab buttons if tabs are provided */}
        {tabs && tabs.length > 0 && (
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onChange?.(tab.id)}
                className={clsx(
                  "ml-4 py-1 cursor-pointer transition-colors",
                  tab.id === value
                    ? "text-foreground"
                    : "text-foreground/40 hover:text-foreground/70",
                  tabs.indexOf(tab) !== tabs.length - 1 && "mr-[-1px]"
                )}
              >
                <span className="sm:hidden">{tab.labelMobile}</span>
                <span className="hidden sm:inline">{tab.labelDesktop}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        className={`flex flex-1 flex-col pt-3 ${
          tabs && tabs.length > 0 ? "rounded-bl-md rounded-br-md" : "rounded-md"
        }`}
      >
        {/* If tabs are provided, render only the child matching the selected id.
            Otherwise, render all children. */}
        {tabs && tabs.length > 0
          ? React.Children.map(children, (child) => {
              if (
                React.isValidElement<TabChildProps>(child) &&
                child.props.id === value
              ) {
                return child;
              }
              return null;
            })
          : children}
      </div>
    </div>
  );
};
