import { renderHook, act } from '@testing-library/react-hooks';
import { useEvents } from '@/components/dashboard/events/useEvents';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

jest.mock('@/integrations/supabase/client');
jest.mock('@/hooks/use-toast');
jest.mock('@/components/auth/AuthProvider');

describe('useEvents', () => {
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

  test('fetches events correctly', async () => {
    const mockEvents = [
      { id: 'event-1', title: 'Event 1', start_time: new Date().toISOString() },
      { id: 'event-2', title: 'Event 2', start_time: new Date().toISOString() },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockEvents, error: null }),
    });

    const { result, waitForNextUpdate } = renderHook(() => useEvents());

    await waitForNextUpdate();

    expect(result.current.events).toEqual(mockEvents);
  });

  test('handles event creation', async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useEvents());

    await act(async () => {
      await result.current.handleCreate({
        title: 'New Event',
        description: 'Event Description',
        location: 'Event Location',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        image_url: 'http://example.com/image.jpg',
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Event created',
      description: 'Your event has been created successfully.',
    });
  });

  test('handles event deletion', async () => {
    supabase.from.mockReturnValue({
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useEvents());

    await act(async () => {
      await result.current.handleDelete('event-id');
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Event deleted',
      description: 'The event has been removed successfully.',
    });
  });

  test('handles event editing', async () => {
    supabase.from.mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useEvents());

    await act(async () => {
      await result.current.handleEdit('event-id', {
        title: 'Updated Event',
        description: 'Updated Description',
        location: 'Updated Location',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        image_url: 'http://example.com/updated-image.jpg',
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Event updated',
      description: 'Your event has been updated successfully.',
    });
  });
});
