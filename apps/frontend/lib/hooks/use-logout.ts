import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';

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
