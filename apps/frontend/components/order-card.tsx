'use client';

import { Order } from '@/lib/api-client';
import { StatusBadge } from './status-badge';
import { formatOrderDate } from '@/lib/utils';
import { Calendar, Mail, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
  clickable?: boolean;
}

export function OrderCard({ order, clickable = true }: OrderCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Pedido #{order.id.slice(0, 8)}
            </h3>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{order.userEmail}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatOrderDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            ${order.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FileText className="h-4 w-4" />
        <span>
          {order.files.length}{' '}
          {order.files.length === 1 ? 'archivo' : 'archivos'}
        </span>
        <span className="text-gray-400">•</span>
        <span>
          {order.files.reduce((sum, f) => sum + f.pages, 0)} páginas totales
        </span>
        <span className="text-gray-400">•</span>
        <span>
          {order.options.quantity}{' '}
          {order.options.quantity === 1 ? 'copia' : 'copias'}
        </span>
      </div>

      <div className="mt-3 flex gap-2 text-xs">
        <span
          className={`px-2 py-1 rounded ${
            order.options.isColor
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {order.options.isColor ? 'Color' : 'B&N'}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
          {order.options.size}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
          {order.options.isDuplex ? 'Doble faz' : 'Simple faz'}
        </span>
      </div>

      {order.comment && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-900 mb-1">
                Comentario del cliente:
              </p>
              <p className="text-sm text-amber-800">{order.comment}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (clickable) {
    return (
      <Link
        href={`/admin/orders/${order.id}`}
        className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {content}
    </div>
  );
}
