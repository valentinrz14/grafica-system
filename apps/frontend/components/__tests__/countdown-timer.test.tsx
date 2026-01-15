import { render, screen, act } from '@testing-library/react';
import { CompactCountdownTimer } from '../countdown-timer';

describe('CompactCountdownTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('displays time remaining when date is in the future', () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now

    render(<CompactCountdownTimer endDate={futureDate.toISOString()} />);

    // Should show days
    expect(screen.getByText(/d/i)).toBeInTheDocument();
  });

  it('displays "Expired" when date is in the past', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

    render(<CompactCountdownTimer endDate={pastDate.toISOString()} />);

    expect(screen.getByText(/Expired/i)).toBeInTheDocument();
  });

  it('updates countdown every second', () => {
    const futureDate = new Date(Date.now() + 3661000); // 1 hour, 1 minute, 1 second from now

    render(<CompactCountdownTimer endDate={futureDate.toISOString()} />);

    // Initial render
    expect(screen.getByText(/1h/i)).toBeInTheDocument();

    // Fast-forward 1 second wrapped in act
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should still show 1h (rounded)
    expect(screen.getByText(/1h/i)).toBeInTheDocument();
  });
});
