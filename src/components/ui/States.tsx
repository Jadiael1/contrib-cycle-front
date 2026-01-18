import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-star-muted">{icon}</div>}
      <h3 className="text-lg font-medium text-star-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-star-muted max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-medium text-star-white mb-2">Algo deu errado</h3>
      <p className="text-sm text-star-muted max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-space-dust" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-t-cosmic-cyan animate-spin" />
      </div>
      <p className="mt-4 text-sm text-star-muted">{message}</p>
    </div>
  );
}
