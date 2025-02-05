import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NeighborhoodForm from '../../src/components/admin/NeighborhoodForm';
import NeighborhoodList from '../../src/components/admin/NeighborhoodList';
import { AlertForm } from '../../src/components/alerts/AlertForm';
import { AlertList } from '../../src/components/alerts/AlertList';
import AuthPage from '../../src/components/auth/AuthPage';
import { AuthProvider } from '../../src/components/auth/AuthProvider';
import { useEvents } from '../../src/components/dashboard/events/useEvents';
import EventList from '../../src/components/events/EventList';
import { useExchange } from '../../src/components/exchange/useExchange';
import ActiveUsersSidebar from '../../src/components/messages/ActiveUsersSidebar';
import MessageItem from '../../src/components/messages/MessageItem';
import { useLocation } from '../../src/hooks/useLocation';

describe('NeighborhoodForm Component', () => {
  test('renders form inputs correctly', () => {
    render(<NeighborhoodForm />);
    expect(screen.getByPlaceholderText('Neighborhood name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });

  test('displays error when submitting without boundaries', async () => {
    render(<NeighborhoodForm />);
    fireEvent.click(screen.getByText('Create Neighborhood'));
    expect(await screen.findByText('Please draw the neighborhood boundaries on the map')).toBeInTheDocument();
  });
});

describe('NeighborhoodList Component', () => {
  test('renders loading state correctly', () => {
    render(<NeighborhoodList />);
    expect(screen.getByText('Loading neighborhoods...')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    render(<NeighborhoodList />);
    expect(screen.getByText('Error loading neighborhoods')).toBeInTheDocument();
  });
});

describe('AlertForm Component', () => {
  test('renders form inputs correctly', () => {
    render(<AlertForm onSuccess={() => {}} />);
    expect(screen.getByLabelText('Alert title')).toBeInTheDocument();
    expect(screen.getByLabelText('Alert message')).toBeInTheDocument();
  });

  test('displays error when submitting without title', async () => {
    render(<AlertForm onSuccess={() => {}} />);
    fireEvent.click(screen.getByText('Create Alert'));
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
  });
});

describe('AlertList Component', () => {
  test('renders loading state correctly', () => {
    render(<AlertList />);
    expect(screen.getByText('Loading alerts...')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    render(<AlertList />);
    expect(screen.getByText('Error loading alerts')).toBeInTheDocument();
  });
});

describe('AuthPage Component', () => {
  test('renders login form correctly', () => {
    render(<AuthPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('displays error on invalid credentials', async () => {
    render(<AuthPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'invalidpassword' } });
    fireEvent.click(screen.getByText('Sign In'));
    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });
});

describe('AuthProvider Component', () => {
  test('fetches profile correctly', async () => {
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );
    expect(await screen.findByText('Test')).toBeInTheDocument();
  });

  test('displays error on profile fetch failure', async () => {
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );
    expect(await screen.findByText('Unable to load profile data')).toBeInTheDocument();
  });
});

describe('useEvents Hook', () => {
  test('fetches events correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEvents());
    await waitForNextUpdate();
    expect(result.current.events).toBeDefined();
  });

  test('handles event creation correctly', async () => {
    const { result } = renderHook(() => useEvents());
    await act(async () => {
      await result.current.handleCreate({ title: 'Test Event' });
    });
    expect(result.current.events).toContainEqual(expect.objectContaining({ title: 'Test Event' }));
  });
});

describe('EventList Component', () => {
  test('renders loading state correctly', () => {
    render(<EventList />);
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    render(<EventList />);
    expect(screen.getByText('Error loading events')).toBeInTheDocument();
  });
});

describe('useExchange Hook', () => {
  test('fetches items correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useExchange());
    await waitForNextUpdate();
    expect(result.current.items).toBeDefined();
  });

  test('handles item creation correctly', async () => {
    const { result } = renderHook(() => useExchange());
    await act(async () => {
      await result.current.handleCreate({ title: 'Test Item' });
    });
    expect(result.current.items).toContainEqual(expect.objectContaining({ title: 'Test Item' }));
  });
});

describe('ActiveUsersSidebar Component', () => {
  test('renders loading state correctly', () => {
    render(<ActiveUsersSidebar />);
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    render(<ActiveUsersSidebar />);
    expect(screen.getByText('Error loading users')).toBeInTheDocument();
  });
});

describe('MessageItem Component', () => {
  test('renders message correctly', () => {
    render(<MessageItem message={{ content: 'Test Message' }} />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('handles message deletion correctly', async () => {
    render(<MessageItem message={{ content: 'Test Message' }} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(await screen.findByText('Message deleted')).toBeInTheDocument();
  });
});

describe('useLocation Hook', () => {
  test('detects location correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useLocation());
    await waitForNextUpdate();
    expect(result.current.location).toBeDefined();
  });

  test('handles location update correctly', async () => {
    const { result } = renderHook(() => useLocation());
    await act(async () => {
      await result.current.updateLocation({ latitude: 10, longitude: 20 });
    });
    expect(result.current.location).toEqual(expect.objectContaining({ latitude: 10, longitude: 20 }));
  });
});
