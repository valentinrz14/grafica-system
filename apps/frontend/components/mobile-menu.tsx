'use client';

import { X, LogOut, User, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext/AuthContext.context';
import { useToast } from '@/context/ToastContext/ToastContext.context';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Sesión cerrada exitosamente', 'success');
    onClose();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isAuthenticated && user ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Usuario
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 truncate">{user.email}</p>
                  {user.role === 'ADMIN' && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                      ADMIN
                    </span>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      handleNavigation(user.role === 'ADMIN' ? '/admin' : '/')
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="text-gray-700 font-medium">
                      {user.role === 'ADMIN' ? 'Panel Admin' : 'Inicio'}
                    </span>
                  </button>

                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleNavigation('/my-orders')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">
                        Mis Pedidos
                      </span>
                    </button>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-left border border-red-200"
                >
                  <LogOut className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 font-medium">
                    Cerrar sesión
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigation('/')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-gray-700 font-medium">Inicio</span>
                </button>

                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-left"
                >
                  <span className="text-white font-medium">Iniciar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
