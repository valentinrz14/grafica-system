import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  userEmail?: string;
  actions?: ReactNode;
  onMenuClick: () => void;
  showLogout?: boolean;
}
