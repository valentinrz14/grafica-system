import { Loader2 } from 'lucide-react';
import { LoadingSpinnerProps } from './LoadingSpinner.interface';

export function LoadingSpinner({
  text = 'Cargando...',
  size = 'md',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const content = (
    <div className="text-center">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-blue-600 mx-auto`}
      />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
