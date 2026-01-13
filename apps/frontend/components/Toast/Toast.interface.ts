import { Toast as ToastType } from '@/context/toast-context';

export interface ToastProps extends ToastType {
  onClose: () => void;
}
