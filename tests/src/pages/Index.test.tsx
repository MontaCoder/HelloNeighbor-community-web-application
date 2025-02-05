import { render, screen, waitFor } from '@testing-library/react';
import Index from '@/pages/Index';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ToastProvider } from '@/components/ui/toast';

jest.mock('@/integrations/supabase/client');

const queryClient = new QueryClient();

const mockUser = {
  id: 'user-id',
  email: 'user@example.com',
};

const mockProfile = {
  full_name: 'Test User',
  neighborhood_id: 'neighborhood-id',
};

const mockNeighborhood = {
  name: 'Test Neighborhood',
};

const mockEvents = [
  { id: 'event-1', title: 'Event 1', description: 'Description 1', latitude: 10, longitude: 20 },
  { id: 'event-2', title: 'Event 2', description: 'Description 2', latitude: 30, longitude: 40 },
];

const mockAlerts = [
  { id: 'alert-1', title: 'Alert 1', message: 'Message 1', latitude: 50, longitude: 60 },
  { id: 'alert-2', title: 'Alert 2', message: 'Message 2', latitude: 70, longitude: 80 },
];

const mockItems = [
  { id: 'item-1', title: 'Item 1', description: 'Description 1', price: 10, latitude: 90, longitude: 100 },
  { id: 'item-2', title: 'Item 2', description: 'Description 2', price: 20, latitude: 110, longitude: 120 },
];

beforeEach(() => {
  jest.clearAllMocks();
  supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });
  supabase.from.mockImplementation((table) => {
    switch (table) {
      case 'profiles':
        return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ maybeSingle: jest.fn().mockResolvedValue({ data: mockProfile }) }) }) };
      case 'neighborhoods':
        return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: mockNeighborhood }) }) }) };
      case 'events':
        return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ order: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ data: mockEvents }) }) }) }) };
      case 'alerts':
        return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ order: jest.fn().mockReturnValue({ data: mockAlerts }) }) }) };
      case 'marketplace_items':
        return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ order: jest.fn().mockReturnValue({ data: mockItems }) }) }) };
      default:
        return { select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ data: [] }) }) };
    }
  });
});

test('renders dashboard with user greeting and neighborhood', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ToastProvider>
            <Index />
          </ToastProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/Welcome back, Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Neighborhood/i)).toBeInTheDocument();
  });
});

test('fetches and displays events, alerts, and items', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ToastProvider>
            <Index />
          </ToastProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/Event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Event 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Alert 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Alert 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
  });
});
