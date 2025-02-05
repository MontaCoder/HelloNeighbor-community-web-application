import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ActiveUsersSidebar } from '@/components/messages/ActiveUsersSidebar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

jest.mock('@/integrations/supabase/client');
jest.mock('@/components/auth/AuthProvider');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('ActiveUsersSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sidebar with users', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user1' },
      profile: { id: 'user1', neighborhood_id: 'neighborhood1' },
      loading: false,
    });

    const mockProfiles = [
      { id: 'user2', full_name: 'User Two', avatar_url: null, neighborhood_id: 'neighborhood1' },
      { id: 'user3', full_name: 'User Three', avatar_url: null, neighborhood_id: 'neighborhood1' },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          not: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockProfiles, error: null }),
          }),
        }),
      }),
    });

    render(<ActiveUsersSidebar />);

    await waitFor(() => {
      expect(screen.getByText('User Two')).toBeInTheDocument();
      expect(screen.getByText('User Three')).toBeInTheDocument();
    });
  });

  it('filters users based on search query', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user1' },
      profile: { id: 'user1', neighborhood_id: 'neighborhood1' },
      loading: false,
    });

    const mockProfiles = [
      { id: 'user2', full_name: 'User Two', avatar_url: null, neighborhood_id: 'neighborhood1' },
      { id: 'user3', full_name: 'User Three', avatar_url: null, neighborhood_id: 'neighborhood1' },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          not: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockProfiles, error: null }),
          }),
        }),
      }),
    });

    render(<ActiveUsersSidebar />);

    await waitFor(() => {
      expect(screen.getByText('User Two')).toBeInTheDocument();
      expect(screen.getByText('User Three')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search users...'), { target: { value: 'Two' } });

    await waitFor(() => {
      expect(screen.getByText('User Two')).toBeInTheDocument();
      expect(screen.queryByText('User Three')).not.toBeInTheDocument();
    });
  });
});
