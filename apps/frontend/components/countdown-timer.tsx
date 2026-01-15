'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endDate: string;
  onExpire?: () => void;
  className?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function CountdownTimer({
  endDate,
  onExpire,
  className = '',
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = (): TimeRemaining => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference,
      };
    };

    // Initial calculation
    const initial = calculateTimeRemaining();
    setTimeRemaining(initial);

    if (initial.total <= 0 && !hasExpired) {
      setHasExpired(true);
      if (onExpire) {
        onExpire();
      }
      return;
    }

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.total <= 0 && !hasExpired) {
        setHasExpired(true);
        if (onExpire) {
          onExpire();
        }
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, hasExpired, onExpire]);

  if (hasExpired || timeRemaining.total <= 0) {
    return (
      <div className={`text-red-600 font-semibold ${className}`}>
        Promotion Expired
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 text-white rounded-lg px-3 py-2 min-w-[60px] text-center">
        <span className="text-2xl font-bold tabular-nums">
          {formatNumber(value)}
        </span>
      </div>
      <span className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {showDays && timeRemaining.days > 0 && (
        <>
          <TimeUnit value={timeRemaining.days} label="Days" />
          <span className="text-2xl font-bold text-gray-400">:</span>
        </>
      )}
      {showHours && (
        <>
          <TimeUnit value={timeRemaining.hours} label="Hours" />
          <span className="text-2xl font-bold text-gray-400">:</span>
        </>
      )}
      {showMinutes && (
        <>
          <TimeUnit value={timeRemaining.minutes} label="Mins" />
          {showSeconds && (
            <span className="text-2xl font-bold text-gray-400">:</span>
          )}
        </>
      )}
      {showSeconds && <TimeUnit value={timeRemaining.seconds} label="Secs" />}
    </div>
  );
}

// Compact version for smaller spaces
export function CompactCountdownTimer({
  endDate,
  onExpire,
  className = '',
}: {
  endDate: string;
  onExpire?: () => void;
  className?: string;
}) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = (): TimeRemaining => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference,
      };
    };

    const initial = calculateTimeRemaining();
    setTimeRemaining(initial);

    if (initial.total <= 0 && !hasExpired) {
      setHasExpired(true);
      if (onExpire) {
        onExpire();
      }
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.total <= 0 && !hasExpired) {
        setHasExpired(true);
        if (onExpire) {
          onExpire();
        }
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, hasExpired, onExpire]);

  if (hasExpired || timeRemaining.total <= 0) {
    return (
      <span className={`text-red-600 text-sm font-medium ${className}`}>
        Expired
      </span>
    );
  }

  const formatCompact = (): string => {
    const parts: string[] = [];

    if (timeRemaining.days > 0) {
      parts.push(`${timeRemaining.days}d`);
    }
    if (timeRemaining.hours > 0 || timeRemaining.days > 0) {
      parts.push(`${timeRemaining.hours}h`);
    }
    if (timeRemaining.days === 0) {
      parts.push(`${timeRemaining.minutes}m`);
      if (timeRemaining.hours === 0) {
        parts.push(`${timeRemaining.seconds}s`);
      }
    }

    return parts.join(' ');
  };

  return (
    <span
      className={`text-orange-600 text-sm font-mono font-semibold ${className}`}
    >
      {formatCompact()}
    </span>
  );
}
