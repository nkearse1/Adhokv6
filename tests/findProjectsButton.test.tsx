import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FindProjectsButton from '../components/FindProjectsButton';

let pushMock: ReturnType<typeof vi.fn>;
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

let toastMock: ReturnType<typeof vi.fn>;
vi.mock('sonner', () => ({
  toast: (...args: unknown[]) => toastMock(...args),
}));

const useAuthMock = vi.fn();
vi.mock('@/lib/client/useAuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

describe('FindProjectsButton', () => {
  beforeEach(() => {
    pushMock = vi.fn();
    toastMock = vi.fn();
    useAuthMock.mockReset();
  });

  it('routes unauthenticated users to signup', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, loading: false, userRole: null });
    const { getByRole } = render(<FindProjectsButton />);
    fireEvent.click(getByRole('button'));
    expect(pushMock).toHaveBeenCalledWith('/sign-up?as=talent');
    expect(toastMock).not.toHaveBeenCalled();
  });

  it('routes talent users to project list', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true, loading: false, userRole: 'talent' });
    const { getByRole } = render(<FindProjectsButton />);
    fireEvent.click(getByRole('button'));
    expect(pushMock).toHaveBeenCalledWith('/talent/projects');
  });

  it('blocks non-talent users', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true, loading: false, userRole: 'client' });
    const { getByRole } = render(<FindProjectsButton />);
    fireEvent.click(getByRole('button'));
    expect(pushMock).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith('You must be a talent user to browse projects.');
  });
});
