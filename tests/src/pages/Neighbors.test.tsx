import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Neighbors from '@/pages/Neighbors';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { ToastProvider } from '@/components/ui/use-toast';

jest.mock('@/components/auth/AuthProvider');
jest.mock('@/integrations/supabase/client');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Neighbors Page', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-id' },
      profile: { neighborhood_id: 'neighborhood-id' },
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      rpc: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockReturnThis(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders neighbors list', async () => {
    mockSupabase.from().select().eq().neq().order.mockResolvedValue({
      data: [
        { id: 'neighbor-1', full_name: 'Neighbor One', avatar_url: null },
        { id: 'neighbor-2', full_name: 'Neighbor Two', avatar_url: null },
      ],
      error: null,
    });

    render(
      <ToastProvider>
        <Neighbors />
      </ToastProvider>
    );

    expect(screen.getByText('Loading neighbors...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Neighbor One')).toBeInTheDocument();
      expect(screen.getByText('Neighbor Two')).toBeInTheDocument();
    });
  });

  it('sends a private message', async () => {
    mockSupabase.from().select().eq().neq().order.mockResolvedValue({
      data: [
        { id: 'neighbor-1', full_name: 'Neighbor One', avatar_url: null },
      ],
      error: null,
    });

    mockSupabase.from().insert.mockResolvedValue({ error: null });

    render(
      <ToastProvider>
        <Neighbors />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Neighbor One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Send Message'));

    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello Neighbor!' },
    });

    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        content: 'Hello Neighbor!',
        sender_id: 'user-id',
        receiver_id: 'neighbor-1',
        neighborhood_id: 'neighborhood-id',
      });
    });
  });
});
