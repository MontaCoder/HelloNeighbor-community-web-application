import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AuthPage from '../../../src/components/auth/AuthPage';

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

  test('redirects to dashboard on successful login', async () => {
    render(<AuthPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'valid@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'validpassword' } });
    fireEvent.click(screen.getByText('Sign In'));
    expect(await screen.findByText('Redirecting to dashboard...')).toBeInTheDocument();
  });
});
