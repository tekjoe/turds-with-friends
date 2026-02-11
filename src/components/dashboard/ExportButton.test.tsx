import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportButton } from '../dashboard/ExportButton';

// Mock fetch
global.fetch = jest.fn();

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'blob:test-url'),
    revokeObjectURL: jest.fn(),
  },
});

describe('US-003: ExportButton - Remove premium gating', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('always shows the export dropdown button', () => {
    render(<ExportButton />);

    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('shows export dropdown when clicked', () => {
    render(<ExportButton />);

    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);

    expect(screen.getByText('Download CSV')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  it('does not show PremiumBadge', () => {
    render(<ExportButton />);

    // PremiumBadge typically contains "Pro" text
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('calls API with CSV format when Download CSV is clicked', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(['test'], { type: 'text/csv' })),
    });

    render(<ExportButton />);

    // Open dropdown
    fireEvent.click(screen.getByText('Export'));

    // Click CSV option
    fireEvent.click(screen.getByText('Download CSV'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/export?format=csv');
    });
  });

  it('calls API with PDF format when Download PDF is clicked', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(['test'], { type: 'application/pdf' })),
    });

    render(<ExportButton />);

    // Open dropdown
    fireEvent.click(screen.getByText('Export'));

    // Click PDF option
    fireEvent.click(screen.getByText('Download PDF'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/export?format=pdf');
    });
  });

  it('closes dropdown after selecting an option', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(['test'])),
    });

    render(<ExportButton />);

    // Open dropdown
    fireEvent.click(screen.getByText('Export'));
    expect(screen.getByText('Download CSV')).toBeInTheDocument();

    // Click CSV option
    fireEvent.click(screen.getByText('Download CSV'));

    // Dropdown should close
    await waitFor(() => {
      expect(screen.queryByText('Download CSV')).not.toBeInTheDocument();
    });
  });
});
