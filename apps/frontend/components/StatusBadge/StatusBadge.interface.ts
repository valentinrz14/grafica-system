export type OrderStatus = 'PENDING' | 'PRINTING' | 'DONE';

export interface StatusBadgeProps {
  status: OrderStatus;
}
