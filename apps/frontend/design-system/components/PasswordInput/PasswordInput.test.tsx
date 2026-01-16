import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from './PasswordInput.component';

describe('PasswordInput', () => {
  it('renders password input with id', () => {
    const { container } = render(
      <PasswordInput id="password" value="" onChange={() => {}} />,
    );
    const input = container.querySelector('#password');
    expect(input).toBeInTheDocument();
  });

  it('starts with password hidden', () => {
    render(<PasswordInput id="password" value="test123" onChange={() => {}} />);
    const input = screen.getByDisplayValue('test123');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility on button click', () => {
    render(<PasswordInput id="password" value="test123" onChange={() => {}} />);
    const input = screen.getByDisplayValue('test123');
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <PasswordInput id="password" value="" onChange={handleChange} />,
    );
    const input = container.querySelector('#password');

    if (input) {
      fireEvent.change(input, { target: { value: 'newpassword' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    }
  });

  it('renders with label', () => {
    render(
      <PasswordInput
        id="password"
        value=""
        onChange={() => {}}
        label="Password"
      />,
    );
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(
      <PasswordInput
        id="password"
        value=""
        onChange={() => {}}
        helperText="Must be at least 8 characters"
      />,
    );
    expect(
      screen.getByText('Must be at least 8 characters'),
    ).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <PasswordInput
        id="password"
        value=""
        onChange={() => {}}
        placeholder="Enter your password"
      />,
    );
    expect(
      screen.getByPlaceholderText('Enter your password'),
    ).toBeInTheDocument();
  });

  it('can be disabled', () => {
    const { container } = render(
      <PasswordInput id="password" value="" onChange={() => {}} disabled />,
    );
    const input = container.querySelector('#password');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PasswordInput
        id="password"
        value=""
        onChange={() => {}}
        className="custom-class"
      />,
    );
    const input = container.querySelector('#password');
    expect(input).toHaveClass('custom-class');
  });

  it('has toggle visibility button', () => {
    render(<PasswordInput id="password" value="test" onChange={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
