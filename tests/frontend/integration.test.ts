import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Index from '@/pages/Index';
import Admin from '@/pages/Admin';
import Alerts from '@/pages/Alerts';
import Events from '@/pages/Events';
import Exchange from '@/pages/Exchange';
import Messages from '@/pages/Messages';
import LocationSetup from '@/pages/LocationSetup';
import { AuthProvider } from '@/components/auth/AuthProvider';

const queryClient = new QueryClient();

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{ui}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Integration Tests', () => {
  test('renders Index page and detects location', async () => {
    renderWithProviders(<Index />);

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Detecting location/i)).toBeInTheDocument();
    });
  });

  test('renders Admin page and manages neighborhoods', async () => {
    renderWithProviders(<Admin />);

    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Neighborhoods/i));

    await waitFor(() => {
      expect(screen.getByText(/Add New Neighborhood/i)).toBeInTheDocument();
    });
  });

  test('renders Alerts page and creates an alert', async () => {
    renderWithProviders(<Alerts />);

    expect(screen.getByText(/Community Alerts/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Alert title/i), {
      target: { value: 'Test Alert' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Alert message/i), {
      target: { value: 'This is a test alert' },
    });
    fireEvent.click(screen.getByText(/Create Alert/i));

    await waitFor(() => {
      expect(screen.getByText(/Your alert has been posted successfully/i)).toBeInTheDocument();
    });
  });

  test('renders Events page and creates an event', async () => {
    renderWithProviders(<Events />);

    expect(screen.getByText(/Community Events/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Create New Event/i));

    fireEvent.change(screen.getByPlaceholderText(/Event title/i), {
      target: { value: 'Test Event' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Event description/i), {
      target: { value: 'This is a test event' },
    });
    fireEvent.click(screen.getByText(/Create Event/i));

    await waitFor(() => {
      expect(screen.getByText(/Your event has been created successfully/i)).toBeInTheDocument();
    });
  });

  test('renders Exchange page and lists an item', async () => {
    renderWithProviders(<Exchange />);

    expect(screen.getByText(/Community Exchange/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/List Item/i));

    fireEvent.change(screen.getByPlaceholderText(/Item title/i), {
      target: { value: 'Test Item' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Item description/i), {
      target: { value: 'This is a test item' },
    });
    fireEvent.click(screen.getByText(/List Item/i));

    await waitFor(() => {
      expect(screen.getByText(/Your item has been added to the marketplace/i)).toBeInTheDocument();
    });
  });

  test('renders Messages page and sends a message', async () => {
    renderWithProviders(<Messages />);

    expect(screen.getByText(/Community Chat/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Type a message/i), {
      target: { value: 'Test Message' },
    });
    fireEvent.click(screen.getByText(/Send/i));

    await waitFor(() => {
      expect(screen.getByText(/Test Message/i)).toBeInTheDocument();
    });
  });

  test('renders LocationSetup page and verifies location', async () => {
    renderWithProviders(<LocationSetup />);

    expect(screen.getByText(/Location Verification/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Detecting your location/i)).toBeInTheDocument();
    });
  });
});
