'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext/AuthContext.context';
import { useToast } from '@/context/ToastContext/ToastContext.context';
import { PasswordInput } from '@/design-system/components/PasswordInput/PasswordInput.component';
import { UserPlus, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'La contraseña debe contener al menos un número';
    }
    return null;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Validate Argentine phone format
    const argPhoneRegex =
      /^(?:(?:\+54\s?)?(?:9\s?)?\d{2,4}\s?\d{3,4}[-\s]?\d{4}|\d{10})$/;
    return argPhoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      showToast('Por favor completá todos los campos', 'warning');
      return;
    }

    if (firstName.length > 50) {
      showToast('El nombre no puede tener más de 50 caracteres', 'warning');
      return;
    }

    if (lastName.length > 50) {
      showToast('El apellido no puede tener más de 50 caracteres', 'warning');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      showToast(
        'Formato de teléfono inválido. Ej: +54 9 11 1234-5678 o 1112345678',
        'warning',
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Por favor ingresá un email válido', 'warning');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      showToast(passwordError, 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.register({
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      });

      showToast(
        '¡Cuenta creada exitosamente! Ahora podés iniciar sesión.',
        'success',
      );

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Error al crear la cuenta. Por favor intentá de nuevo.',
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
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-full">
            <UserPlus className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Registrate para comenzar a hacer pedidos
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Juan"
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-gray-400"
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pérez"
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-gray-400"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Teléfono
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+54 9 11 1234-5678 o 1112345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-gray-400"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato argentino: con o sin código de área
            </p>
          </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-gray-400"
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
            helperText="Mínimo 8 caracteres, incluir mayúsculas, minúsculas y números"
            className="focus:ring-green-500"
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            disabled={isLoading}
            className="focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 hover:shadow-md transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-1 text-sm">
          <span className="text-gray-600">¿Ya tenés cuenta?</span>
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
          >
            Iniciá sesión
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
