import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Admin from '@/pages/Admin';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

jest.mock('@/integrations/supabase/client');
jest.mock('@/components/auth/AuthProvider');

const queryClient = new QueryClient();

describe('Admin Page', () => {
  const mockUser = { id: 'user-id' };
  const mockIsAdmin = true;

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    supabase.rpc.mockResolvedValue({ data: mockIsAdmin });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders admin panel', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    });
  });

  test('renders neighborhood form and list', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Add New Neighborhood')).toBeInTheDocument();
      expect(screen.getByText('Neighborhoods')).toBeInTheDocument();
    });
  });

  test('handles logout', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
