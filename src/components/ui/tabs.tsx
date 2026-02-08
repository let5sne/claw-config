import React, { useState } from 'react';

export interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

export interface TabsListProps {
  children: React.ReactNode;
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const childrenArray = React.Children.toArray(children);

  return (
    <div>
      {childrenArray.map((child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            setActiveTab,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, activeTab, setActiveTab }: TabsListProps & { activeTab?: string; setActiveTab?: (tab: string) => void }) {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isActive: activeTab === (child.props as any).value,
            onClick: () => setActiveTab?.((child.props as any).value),
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ children, isActive, onClick }: TabsTriggerProps & { isActive?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-background/50'
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, activeTab }: TabsContentProps & { activeTab?: string }) {
  if (activeTab !== value) return null;

  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      {children}
    </div>
  );
}
