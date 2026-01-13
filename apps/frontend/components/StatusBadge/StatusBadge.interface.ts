export type OrderStatus = 'PENDING' | 'PRINTING' | 'DONE' | 'EXPIRED';

export interface StatusBadgeProps {
  status: OrderStatus;
}
