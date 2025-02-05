import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthProvider, useAuth } from '../../../src/components/auth/AuthProvider';
import { supabase } from '../../../src/integrations/supabase/client';

jest.mock('../../../src/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockUser = {
  id: 'user-id',
  email: 'user@example.com',
};

const mockProfile = {
  id: 'user-id',
  full_name: 'Test User',
  neighborhood_id: 'neighborhood-id',
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches profile on mount', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: mockProfile }),
    });

    const TestComponent = () => {
      const { user, profile, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return (
        <div>
          <div data-testid="user-email">{user?.email}</div>
          <div data-testid="profile-name">{profile?.full_name}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email));
    await waitFor(() => expect(screen.getByTestId('profile-name')).toHaveTextContent(mockProfile.full_name));
  });

  test('retries fetching profile on failure', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockMaybeSingle = jest.fn()
      .mockRejectedValueOnce(new Error('Fetch error'))
      .mockResolvedValueOnce({ data: mockProfile });

    supabase.from.mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      maybeSingle: mockMaybeSingle,
    });

    const TestComponent = () => {
      const { user, profile, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return (
        <div>
          <div data-testid="user-email">{user?.email}</div>
          <div data-testid="profile-name">{profile?.full_name}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email));
    await waitFor(() => expect(screen.getByTestId('profile-name')).toHaveTextContent(mockProfile.full_name));
  });

  test('handles authentication state changes', async () => {
    const mockOnAuthStateChange = jest.fn((callback) => {
      callback('SIGNED_IN', { user: mockUser });
      return { unsubscribe: jest.fn() };
    });

    supabase.auth.onAuthStateChange.mockImplementation(mockOnAuthStateChange);
    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: mockProfile }),
    });

    const TestComponent = () => {
      const { user, profile, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return (
        <div>
          <div data-testid="user-email">{user?.email}</div>
          <div data-testid="profile-name">{profile?.full_name}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email));
    await waitFor(() => expect(screen.getByTestId('profile-name')).toHaveTextContent(mockProfile.full_name));
  });
});
