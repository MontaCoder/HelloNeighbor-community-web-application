import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Messages from '@/pages/Messages';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/components/auth/AuthProvider');
jest.mock('@/integrations/supabase/client');

const queryClient = new QueryClient();

describe('Messages Page', () => {
  const mockUser = { id: 'user-id' };
  const mockProfile = { neighborhood_id: 'neighborhood-id' };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser, profile: mockProfile });
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Messages page', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Messages />
      </QueryClientProvider>
    );

    expect(screen.getByText('Community Chat')).toBeInTheDocument();
  });

  it('sends a message', async () => {
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Messages />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(supabase.from().insert).toHaveBeenCalledWith({
        content: 'Hello, world!',
        sender_id: mockUser.id,
        receiver_id: null,
        image_url: undefined,
        neighborhood_id: mockProfile.neighborhood_id,
      });
    });
  });

  it('fetches messages', async () => {
    const mockMessages = [
      {
        id: 'message-id',
        content: 'Hello, world!',
        sender: { full_name: 'John Doe', avatar_url: null, username: 'johndoe' },
        created_at: new Date().toISOString(),
      },
    ];

    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockMessages, error: null }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Messages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });
  });

  it('handles real-time message updates', async () => {
    const mockMessages = [
      {
        id: 'message-id',
        content: 'Hello, world!',
        sender: { full_name: 'John Doe', avatar_url: null, username: 'johndoe' },
        created_at: new Date().toISOString(),
      },
    ];

    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockMessages, error: null }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Messages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });

    const newMessage = {
      id: 'new-message-id',
      content: 'New message!',
      sender: { full_name: 'Jane Doe', avatar_url: null, username: 'janedoe' },
      created_at: new Date().toISOString(),
    };

    supabase.channel.mockImplementation(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockImplementation((callback) => {
        callback('SUBSCRIBED');
        return { unsubscribe: jest.fn() };
      }),
    }));

    supabase.channel().on.mockImplementation((event, filter, callback) => {
      if (event === 'postgres_changes') {
        callback(newMessage);
      }
      return supabase.channel();
    });

    await waitFor(() => {
      expect(screen.getByText('New message!')).toBeInTheDocument();
    });
  });
});
