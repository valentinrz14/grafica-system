import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PriceCalculator } from '../price-calculator';
import { OrderOptions, PriceBreakdown } from '@/lib/api-client';

describe('PriceCalculator', () => {
  const mockOnOptionsChange = jest.fn();
  const defaultOptions: OrderOptions = {
    size: 'A4',
    isColor: false,
    isDuplex: false,
    quantity: 1,
  };

  const mockPriceBreakdown: PriceBreakdown = {
    basePrice: 100,
    pages: 10,
    quantity: 1,
    colorMultiplier: 1,
    duplexMultiplier: 1,
    subtotal: 100,
    total: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders size selector with correct value', () => {
    render(
      <PriceCalculator
        options={defaultOptions}
        onOptionsChange={mockOnOptionsChange}
        priceBreakdown={null}
        isCalculating={false}
      />,
    );

    // The Select component from Radix UI shows "A4 (21 x 29.7 cm)" as the current value
    expect(screen.getByText(/A4 \(21 x 29\.7 cm\)/i)).toBeInTheDocument();
  });

  it('renders color and duplex radio buttons', () => {
    render(
      <PriceCalculator
        options={defaultOptions}
        onOptionsChange={mockOnOptionsChange}
        priceBreakdown={null}
        isCalculating={false}
      />,
    );

    expect(screen.getByText('Blanco y Negro')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Simple faz')).toBeInTheDocument();
    expect(screen.getByText('Doble faz')).toBeInTheDocument();
  });

  it('calls onOptionsChange when color radio is clicked', async () => {
    render(
      <PriceCalculator
        options={defaultOptions}
        onOptionsChange={mockOnOptionsChange}
        priceBreakdown={null}
        isCalculating={false}
      />,
    );

    const colorRadio = screen
      .getByText('Color')
      .closest('label')
      ?.querySelector('input');
    if (colorRadio) {
      await userEvent.click(colorRadio);
      expect(mockOnOptionsChange).toHaveBeenCalledWith({
        ...defaultOptions,
        isColor: true,
      });
    }
  });

  it('displays price breakdown when provided', () => {
    render(
      <PriceCalculator
        options={defaultOptions}
        onOptionsChange={mockOnOptionsChange}
        priceBreakdown={mockPriceBreakdown}
        isCalculating={false}
      />,
    );

    expect(screen.getByText(/Precio base/i)).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('shows loading state when calculating', () => {
    render(
      <PriceCalculator
        options={defaultOptions}
        onOptionsChange={mockOnOptionsChange}
        priceBreakdown={null}
        isCalculating={true}
      />,
    );

    expect(screen.getByText(/Calculando.../i)).toBeInTheDocument();
  });

  it('allows changing quantity via input', async () => {
    render(
      <PriceCalculator
        options={defaultOptions}
        onOptionsChange={mockOnOptionsChange}
        priceBreakdown={null}
        isCalculating={false}
      />,
    );

    const quantityInput = screen.getByDisplayValue('1') as HTMLInputElement;

    // Triple-click to select all text, then type to replace it
    await userEvent.tripleClick(quantityInput);
    await userEvent.keyboard('5');

    expect(mockOnOptionsChange).toHaveBeenCalledWith({
      ...defaultOptions,
      quantity: 5,
    });
  });

  it('prevents invalid quantity values', async () => {
    render(
      <PriceCalculator
        options={defaultOptions}
        onOptionsChange={mockOnOptionsChange}
        priceBreakdown={null}
        isCalculating={false}
      />,
    );

    const quantityInput = screen.getByDisplayValue('1') as HTMLInputElement;

    // Try to enter 0 (should be rejected)
    await userEvent.tripleClick(quantityInput);
    await userEvent.keyboard('0');

    // Should not have been called with 0
    const callsWithZero = mockOnOptionsChange.mock.calls.filter(
      (call) => call[0].quantity === 0,
    );
    expect(callsWithZero).toHaveLength(0);
  });
});
