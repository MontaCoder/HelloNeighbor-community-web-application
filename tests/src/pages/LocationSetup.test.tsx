import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationSetup from '@/pages/LocationSetup';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLocation } from '@/hooks/useLocation';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

jest.mock('@/components/auth/AuthProvider');
jest.mock('@/hooks/useLocation');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('@/integrations/supabase/client');
jest.mock('@/hooks/use-toast');

describe('LocationSetup', () => {
  const mockUser = { id: 'user-id' };
  const mockDetectLocation = jest.fn();
  const mockNavigate = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useLocation as jest.Mock).mockReturnValue({
      detectLocation: mockDetectLocation,
      loading: false,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('should render location setup page', () => {
    render(<LocationSetup />);
    expect(screen.getByText('Location Verification')).toBeInTheDocument();
  });

  it('should call detectLocation on mount', async () => {
    mockDetectLocation.mockResolvedValue(true);
    render(<LocationSetup />);
    await waitFor(() => {
      expect(mockDetectLocation).toHaveBeenCalled();
    });
  });

  it('should show access denied message if location verification fails', async () => {
    mockDetectLocation.mockResolvedValue(false);
    render(<LocationSetup />);
    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  it('should retry location detection on button click', async () => {
    mockDetectLocation.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<LocationSetup />);
    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Retry Location Detection'));
    await waitFor(() => {
      expect(mockDetectLocation).toHaveBeenCalledTimes(2);
    });
  });

  it('should redirect to admin panel if user is admin', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: true });
    render(<LocationSetup />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });
});
