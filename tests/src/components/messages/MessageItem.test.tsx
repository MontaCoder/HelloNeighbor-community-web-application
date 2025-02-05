import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MessageItem } from '@/components/messages/MessageItem';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

jest.mock('@/integrations/supabase/client');
jest.mock('@/hooks/use-toast');

const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

describe('MessageItem', () => {
  const mockMessage = {
    id: 'message1',
    content: 'Hello, world!',
    sender_id: 'user1',
    sender: {
      full_name: 'User One',
      avatar_url: null,
      username: 'userone'
    },
    created_at: new Date().toISOString(),
    image_url: null
  };

  const mockCurrentUserId = 'user1';
  const mockOnMessageUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the message content', () => {
    render(
      <MessageItem
        message={mockMessage}
        currentUserId={mockCurrentUserId}
        onMessageUpdate={mockOnMessageUpdate}
      />
    );

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('allows the user to edit their message', async () => {
    render(
      <MessageItem
        message={mockMessage}
        currentUserId={mockCurrentUserId}
        onMessageUpdate={mockOnMessageUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated message' } });

    fireEvent.click(screen.getByRole('button', { name: /update message/i }));

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(supabase.from('messages').update).toHaveBeenCalledWith({ content: 'Updated message' });
      expect(supabase.from('messages').update().eq).toHaveBeenCalledWith('id', 'message1');
    });

    expect(mockOnMessageUpdate).toHaveBeenCalled();
  });

  it('allows the user to delete their message', async () => {
    render(
      <MessageItem
        message={mockMessage}
        currentUserId={mockCurrentUserId}
        onMessageUpdate={mockOnMessageUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(supabase.from('messages').delete).toHaveBeenCalled();
      expect(supabase.from('messages').delete().eq).toHaveBeenCalledWith('id', 'message1');
    });

    expect(mockOnMessageUpdate).toHaveBeenCalled();
  });

  it('displays an error toast if message update fails', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockRejectedValue(new Error('Update failed'))
      })
    });

    render(
      <MessageItem
        message={mockMessage}
        currentUserId={mockCurrentUserId}
        onMessageUpdate={mockOnMessageUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated message' } });

    fireEvent.click(screen.getByRole('button', { name: /update message/i }));

    await waitFor(() => {
      expect(mockUseToast().toast).toHaveBeenCalledWith({
        title: 'Error updating message',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    });
  });

  it('displays an error toast if message deletion fails', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockRejectedValue(new Error('Delete failed'))
      })
    });

    render(
      <MessageItem
        message={mockMessage}
        currentUserId={mockCurrentUserId}
        onMessageUpdate={mockOnMessageUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockUseToast().toast).toHaveBeenCalledWith({
        title: 'Error deleting message',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    });
  });
});
