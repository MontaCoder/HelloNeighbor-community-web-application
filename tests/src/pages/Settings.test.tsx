import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '@/pages/Settings';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { ToastProvider } from '@/components/ui/toast';

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signOut: jest.fn(),
    },
  },
}));

const mockProfile = {
  id: 'user-id',
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  neighborhood_id: 'neighborhood-id',
};

const mockUser = {
  id: 'user-id',
  email: 'john.doe@example.com',
};

const mockNeighborhood = {
  name: 'Test Neighborhood',
};

jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({
    profile: mockProfile,
    user: mockUser,
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockReturnValue({
    data: mockNeighborhood,
  }),
}));

describe('Settings Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile settings form', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <Settings />
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Neighborhood/i)).toBeInTheDocument();
  });

  it('updates profile information', async () => {
    supabase.from.mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          error: null,
        }),
      }),
    });

    render(
      <ToastProvider>
        <AuthProvider>
          <Settings />
        </AuthProvider>
      </ToastProvider>
    );

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Jane Doe' },
    });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from().update).toHaveBeenCalledWith({
        full_name: 'Jane Doe',
        avatar_url: 'https://example.com/avatar.jpg',
      });
      expect(supabase.from().update().eq).toHaveBeenCalledWith('id', 'user-id');
    });
  });

  it('logs out the user', async () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <Settings />
        </AuthProvider>
      </ToastProvider>
    );

    fireEvent.click(screen.getByText(/Sign Out/i));

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
