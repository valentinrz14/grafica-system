'use client';

import { LogOut, Menu } from 'lucide-react';
import { useLogout } from '@/lib/hooks/use-logout';
import { PageHeaderProps } from './PageHeader.interface';

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  onMenuClick,
  showLogout = true,
}: PageHeaderProps) {
  const handleLogout = useLogout();

  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <Icon className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg md:text-3xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {actions}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-colors whitespace-nowrap font-medium"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
