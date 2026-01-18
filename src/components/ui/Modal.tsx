import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalContextValue {
  isOpen: boolean;
  close: () => void;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, close: onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-space-void/80 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
        {/* Content */}
        <div className="relative z-10 w-full max-w-lg mx-4 animate-scale-in">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  const context = React.useContext(ModalContext);

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 max-h-[90vh] overflow-y-auto",
        className
      )}
    >
      <button
        onClick={context?.close}
        className="absolute top-4 right-4 p-1 rounded-lg text-star-muted hover:text-star-white hover:bg-space-nebula transition-colors"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>
      {children}
    </div>
  );
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div className={cn("mb-4 pr-8", className)}>
      {children}
    </div>
  );
}

interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <h2 className={cn("text-xl font-bold text-star-white", className)}>
      {children}
    </h2>
  );
}

interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalDescription({ children, className }: ModalDescriptionProps) {
  return (
    <p className={cn("text-sm text-star-muted mt-1", className)}>
      {children}
    </p>
  );
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("mt-6 flex items-center justify-end gap-3", className)}>
      {children}
    </div>
  );
}
