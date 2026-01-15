import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext/AuthContext.context';
import { useToast } from '@/context/ToastContext/ToastContext.context';

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Sesión cerrada exitosamente', 'success');
    router.push('/login');
  };

  return handleLogout;
}
