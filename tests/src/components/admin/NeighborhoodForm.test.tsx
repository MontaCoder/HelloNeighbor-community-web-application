import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NeighborhoodForm from '@/components/admin/NeighborhoodForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

jest.mock('@/integrations/supabase/client');
jest.mock('@/hooks/use-toast');
jest.mock('@tanstack/react-query');

describe('NeighborhoodForm', () => {
  const mockToast = jest.fn();
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };

  beforeEach(() => {
    useToast.mockReturnValue({ toast: mockToast });
    useQueryClient.mockReturnValue(mockQueryClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<NeighborhoodForm />);
    expect(screen.getByPlaceholderText('Neighborhood name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByText('Add New Neighborhood')).toBeInTheDocument();
  });

  test('shows error toast if boundaries are not drawn', async () => {
    render(<NeighborhoodForm />);
    fireEvent.change(screen.getByPlaceholderText('Neighborhood name'), { target: { value: 'Test Neighborhood' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByText('Create Neighborhood'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Please draw the neighborhood boundaries on the map',
        variant: 'destructive',
      });
    });
  });

  test('submits form and shows success toast', async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    render(<NeighborhoodForm />);
    fireEvent.change(screen.getByPlaceholderText('Neighborhood name'), { target: { value: 'Test Neighborhood' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Description' } });

    // Simulate drawing boundaries
    fireEvent.click(screen.getByText('Create Neighborhood'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Neighborhood created successfully',
      });
    });

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['neighborhoods'] });
  });

  test('shows error toast on submission failure', async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: new Error('Submission failed') }),
    });

    render(<NeighborhoodForm />);
    fireEvent.change(screen.getByPlaceholderText('Neighborhood name'), { target: { value: 'Test Neighborhood' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Description' } });

    // Simulate drawing boundaries
    fireEvent.click(screen.getByText('Create Neighborhood'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Could not create neighborhood. Please try again.',
        variant: 'destructive',
      });
    });
  });
});
