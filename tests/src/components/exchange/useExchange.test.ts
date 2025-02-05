import { renderHook, act } from '@testing-library/react-hooks';
import { useExchange } from '@/components/exchange/useExchange';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

jest.mock('@/integrations/supabase/client');
jest.mock('@/hooks/use-toast');
jest.mock('@/components/auth/AuthProvider');

describe('useExchange', () => {
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

  test('fetches items correctly', async () => {
    const mockItems = [
      { id: 'item-1', title: 'Item 1', created_at: new Date().toISOString() },
      { id: 'item-2', title: 'Item 2', created_at: new Date().toISOString() },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockItems, error: null }),
    });

    const { result, waitForNextUpdate } = renderHook(() => useExchange());

    await waitForNextUpdate();

    expect(result.current.items).toEqual(mockItems);
  });

  test('handles item creation', async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useExchange());

    await act(async () => {
      await result.current.handleCreate({
        title: 'New Item',
        description: 'Item Description',
        price: '10.00',
        category: 'Category',
        image_urls: ['http://example.com/image.jpg'],
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Item listed successfully',
      description: 'Your item has been added to the marketplace.',
    });
  });

  test('handles item deletion', async () => {
    supabase.from.mockReturnValue({
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useExchange());

    await act(async () => {
      await result.current.handleDelete('item-id');
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Item deleted',
      description: 'The item has been removed successfully.',
    });
  });

  test('handles item editing', async () => {
    supabase.from.mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useExchange());

    await act(async () => {
      await result.current.handleEdit('item-id', {
        title: 'Updated Item',
        description: 'Updated Description',
        price: '20.00',
        category: 'Updated Category',
        image_urls: ['http://example.com/updated-image.jpg'],
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Item updated',
      description: 'Your item has been updated successfully.',
    });
  });
});
