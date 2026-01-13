import { StatusBadgeProps } from './StatusBadge.interface';

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  PRINTING: {
    label: 'En impresión',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  DONE: {
    label: 'Listo',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
