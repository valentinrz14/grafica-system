import { Toast as ToastType } from '@/context/ToastContext/ToastContext.interfaces';

export interface ToastProps extends ToastType {
  onClose: () => void;
}
