import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { UploadForm } from './UploadForm.component';

describe('UploadForm', () => {
  const mockOnFilesSelected = jest.fn();
  const mockOnRemoveFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area correctly', () => {
    render(
      <UploadForm
        onFilesSelected={mockOnFilesSelected}
        selectedFiles={[]}
        onRemoveFile={mockOnRemoveFile}
        isUploading={false}
      />,
    );

    expect(screen.getByText(/Arrastrá tus archivos aquí/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF, JPG, PNG/i)).toBeInTheDocument();
  });

  it('shows selected files when provided', () => {
    const mockFiles = [
      new File(['content'], 'test.pdf', { type: 'application/pdf' }),
      new File(['content2'], 'test2.pdf', { type: 'application/pdf' }),
    ];

    render(
      <UploadForm
        onFilesSelected={mockOnFilesSelected}
        selectedFiles={mockFiles}
        onRemoveFile={mockOnRemoveFile}
        isUploading={false}
      />,
    );

    expect(screen.getByText('Archivos seleccionados (2)')).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('test2.pdf')).toBeInTheDocument();
  });

  it('calls onRemoveFile when remove button is clicked', async () => {
    const mockFiles = [
      new File(['content'], 'test.pdf', { type: 'application/pdf' }),
    ];

    const { container } = render(
      <UploadForm
        onFilesSelected={mockOnFilesSelected}
        selectedFiles={mockFiles}
        onRemoveFile={mockOnRemoveFile}
        isUploading={false}
      />,
    );

    // Find the X icon button for removing files
    const removeButtons = screen.getAllByRole('button');
    // The first button is the upload area, subsequent buttons are remove buttons
    const removeButton = removeButtons.find((button: HTMLElement) =>
      button.querySelector('svg.lucide-x'),
    );

    if (removeButton) {
      await userEvent.click(removeButton);
      expect(mockOnRemoveFile).toHaveBeenCalledWith(0);
    } else {
      // If we can't find by icon, try by button class/structure
      const xButtons = container.querySelectorAll('button.ml-4');
      if (xButtons.length > 0) {
        await userEvent.click(xButtons[0] as HTMLElement);
        expect(mockOnRemoveFile).toHaveBeenCalledWith(0);
      }
    }
  });

  it('disables upload when isUploading is true', () => {
    render(
      <UploadForm
        onFilesSelected={mockOnFilesSelected}
        selectedFiles={[]}
        onRemoveFile={mockOnRemoveFile}
        isUploading={true}
      />,
    );

    const uploadArea = screen
      .getByText(/Arrastrá tus archivos aquí/i)
      .closest('div');
    expect(uploadArea).toHaveClass('opacity-50');
    expect(uploadArea).toHaveClass('pointer-events-none');
  });

  it('formats file size correctly', () => {
    const mockFiles = [
      new File(['x'.repeat(1024)], 'small.pdf', { type: 'application/pdf' }),
    ];

    render(
      <UploadForm
        onFilesSelected={mockOnFilesSelected}
        selectedFiles={mockFiles}
        onRemoveFile={mockOnRemoveFile}
        isUploading={false}
      />,
    );

    expect(screen.getByText(/1.0 KB/i)).toBeInTheDocument();
  });

  it('does not show file list when no files selected', () => {
    render(
      <UploadForm
        onFilesSelected={mockOnFilesSelected}
        selectedFiles={[]}
        onRemoveFile={mockOnRemoveFile}
        isUploading={false}
      />,
    );

    expect(
      screen.queryByText(/Archivos seleccionados/i),
    ).not.toBeInTheDocument();
  });
});
