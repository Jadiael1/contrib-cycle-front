import type { TPaymentMethodPayload } from "@/types/TPaymentMethodPayload";
import type { TPaymentMethodType } from "@/types/TPaymentMethodType";

export interface ICollectiveProjectPaymentMethod {
  id: number;
  type: TPaymentMethodType;
  label: string | null;
  sort_order: number;
  is_active: boolean;
  payload?: TPaymentMethodPayload;
}