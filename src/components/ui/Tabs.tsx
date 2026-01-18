import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps {
	defaultValue: string;
	children: React.ReactNode;
	className?: string;
	onChange?: (value: string) => void;
}

export function Tabs({
	defaultValue,
	children,
	className,
	onChange,
}: TabsProps) {
	const [activeTab, setActiveTab] = React.useState(defaultValue);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		onChange?.(tab);
	};

	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
			<div className={cn("", className)}>{children}</div>
		</TabsContext.Provider>
	);
}

interface TabsListProps {
	children: React.ReactNode;
	className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1 p-1 rounded-lg bg-space-nebula border border-border",
				className,
			)}
		>
			{children}
		</div>
	);
}

interface TabsTriggerProps {
	value: string;
	children: React.ReactNode;
	className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
	const context = React.useContext(TabsContext);
	if (!context) throw new Error("TabsTrigger must be used within Tabs");

	const isActive = context.activeTab === value;

	return (
		<button
			onClick={() => context.setActiveTab(value)}
			className={cn(
				"px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
				isActive
					? "bg-linear-to-r from-cosmic-cyan to-cosmic-blue text-space-void shadow-sm"
					: "text-star-dim hover:text-star-white hover:bg-space-dust",
				className,
			)}
		>
			{children}
		</button>
	);
}

interface TabsContentProps {
	value: string;
	children: React.ReactNode;
	className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
	const context = React.useContext(TabsContext);
	if (!context) throw new Error("TabsContent must be used within Tabs");

	if (context.activeTab !== value) return null;

	return (
		<div className={cn("mt-4 animate-fade-in", className)}>{children}</div>
	);
}
