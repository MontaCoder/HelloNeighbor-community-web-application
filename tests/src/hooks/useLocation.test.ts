import { renderHook, act } from '@testing-library/react-hooks';
import { useLocation } from '@/hooks/useLocation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

jest.mock('@/hooks/use-toast');
jest.mock('@/integrations/supabase/client');
jest.mock('@/components/auth/AuthProvider');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('useLocation', () => {
  const mockToast = jest.fn();
  const mockNavigate = jest.fn();
  const mockUser = { id: 'user-id' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('should detect location and update user profile', async () => {
    const { result } = renderHook(() => useLocation());

    const mockPosition = {
      coords: {
        latitude: 10.0,
        longitude: 20.0,
      },
    };

    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) => success(mockPosition)),
    };

    // @ts-ignore
    global.navigator.geolocation = mockGeolocation;

    (supabase.rpc as jest.Mock).mockResolvedValue({ data: 'neighborhood-id' });
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          error: null,
        }),
      }),
    });

    await act(async () => {
      await result.current.detectLocation();
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(supabase.rpc).toHaveBeenCalledWith('find_neighborhood', {
      lat: 10.0,
      lon: 20.0,
    });
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Location verified',
      description: 'Welcome to your neighborhood!',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle geolocation errors', async () => {
    const { result } = renderHook(() => useLocation());

    const mockGeolocation = {
      getCurrentPosition: jest.fn((_, error) =>
        error({ code: 1, message: 'User denied Geolocation' })
      ),
    };

    // @ts-ignore
    global.navigator.geolocation = mockGeolocation;

    await act(async () => {
      await result.current.detectLocation();
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Location detection failed',
      description:
        'Location access denied. Please enable location services in your browser settings.',
      variant: 'destructive',
    });
  });

  it('should handle neighborhood verification failure', async () => {
    const { result } = renderHook(() => useLocation());

    const mockPosition = {
      coords: {
        latitude: 10.0,
        longitude: 20.0,
      },
    };

    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) => success(mockPosition)),
    };

    // @ts-ignore
    global.navigator.geolocation = mockGeolocation;

    (supabase.rpc as jest.Mock).mockResolvedValue({ data: null });

    await act(async () => {
      await result.current.detectLocation();
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(supabase.rpc).toHaveBeenCalledWith('find_neighborhood', {
      lat: 10.0,
      lon: 20.0,
    });
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Location not in service area',
      description: "Sorry, we don't currently serve your area.",
      variant: 'destructive',
    });
  });

  it('should handle profile update failure', async () => {
    const { result } = renderHook(() => useLocation());

    const mockPosition = {
      coords: {
        latitude: 10.0,
        longitude: 20.0,
      },
    };

    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) => success(mockPosition)),
    };

    // @ts-ignore
    global.navigator.geolocation = mockGeolocation;

    (supabase.rpc as jest.Mock).mockResolvedValue({ data: 'neighborhood-id' });
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          error: new Error('Update failed'),
        }),
      }),
    });

    await act(async () => {
      await result.current.detectLocation();
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(supabase.rpc).toHaveBeenCalledWith('find_neighborhood', {
      lat: 10.0,
      lon: 20.0,
    });
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error verifying location',
      description: 'Please try again later or contact support.',
      variant: 'destructive',
    });
  });
});
