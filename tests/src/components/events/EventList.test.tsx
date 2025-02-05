import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { EventList } from '@/components/events/EventList';
import { useToast } from '@/hooks/use-toast';

jest.mock('@/integrations/supabase/client');
jest.mock('@/components/auth/AuthProvider');
jest.mock('@/hooks/use-toast');

const queryClient = new QueryClient();

describe('EventList', () => {
  const mockToast = jest.fn();
  const mockUser = { id: 'user-id' };
  const mockProfile = { neighborhood_id: 'neighborhood-id' };

  beforeEach(() => {
    useToast.mockReturnValue({ toast: mockToast });
    useAuth.mockReturnValue({ user: mockUser, profile: mockProfile });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders events correctly', async () => {
    const mockEvents = [
      { id: 'event-1', title: 'Event 1', description: 'Description 1', location: 'Location 1', start_time: new Date().toISOString(), end_time: new Date().toISOString(), created_by: 'user-id' },
      { id: 'event-2', title: 'Event 2', description: 'Description 2', location: 'Location 2', start_time: new Date().toISOString(), end_time: new Date().toISOString(), created_by: 'user-id' },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: mockEvents, error: null }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <EventList />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Event 1')).toBeInTheDocument();
    expect(await screen.findByText('Event 2')).toBeInTheDocument();
  });

  test('handles event deletion', async () => {
    const mockEvents = [
      { id: 'event-1', title: 'Event 1', description: 'Description 1', location: 'Location 1', start_time: new Date().toISOString(), end_time: new Date().toISOString(), created_by: 'user-id' },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: mockEvents, error: null }),
    });

    supabase.from.mockReturnValue({
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <EventList />
      </QueryClientProvider>
    );

    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Event deleted',
      description: 'The event has been removed successfully.',
    });
  });
});
