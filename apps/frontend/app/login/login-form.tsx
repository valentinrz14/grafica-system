'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext/AuthContext.context';
import { useToast } from '@/context/ToastContext/ToastContext.context';
import { PasswordInput } from '@/design-system/components/PasswordInput/PasswordInput.component';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Por favor ingresá tu email y contraseña', 'warning');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Por favor ingresá un email válido', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);

      // Esperar un momento para que el token se guarde en localStorage
      await new Promise((resolve) => setTimeout(resolve, 200));

      showToast('¡Inicio de sesión exitoso!', 'success');
      router.push(redirect);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Error al iniciar sesión. Verificá tus credenciales.',
        'error',
      );
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-full">
            <LogIn className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ingresá a tu cuenta para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="[email protected]"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-gray-400"
              disabled={isLoading}
            />
          </div>

          <PasswordInput
            id="password"
            label="Contraseña"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1 text-sm">
          <span className="text-gray-600">¿No tenés cuenta?</span>
          <button
            onClick={() => router.push('/register')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
          >
            Registrate
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
