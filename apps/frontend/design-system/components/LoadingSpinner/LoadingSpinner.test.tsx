import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner.component';

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders small size spinner', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-6');
    expect(spinner).toHaveClass('h-6');
  });

  it('renders medium size spinner by default', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-12');
    expect(spinner).toHaveClass('h-12');
  });

  it('renders large size spinner', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-16');
    expect(spinner).toHaveClass('h-16');
  });

  it('renders fullScreen layout', () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  it('has spinning animation', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders svg element', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });
});
