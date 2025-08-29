import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from '../lib/client/useAuthContext';

function TestComponent({ onRefresh }: { onRefresh: () => void }) {
  const { userId, refreshSession } = useAuth();
  return (
    <div>
      <span data-testid="uid">{userId}</span>
      <button
        data-testid="refresh"
        onClick={() => {
          refreshSession();
          onRefresh();
        }}
      />
    </div>
  );
}

describe('AuthProvider', () => {
  it('updates context when refreshSession is called with an id', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: { userId: 'u1', userRole: 'client' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: { userId: 'u2', userRole: 'client' } }),
      });
    // @ts-ignore
    global.fetch = fetchMock;

    const refreshSpy = vi.fn();
    render(
      <AuthProvider>
        <TestComponent onRefresh={refreshSpy} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('uid').textContent).toBe('u1');
    });

    fireEvent.click(screen.getByTestId('refresh'));

    await waitFor(() => {
      expect(screen.getByTestId('uid').textContent).toBe('u2');
    });
    expect(refreshSpy).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenLastCalledWith('/api/session', { cache: 'no-store' });
  });

  it('keeps previous user if refresh resolves with null', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: { userId: 'u1', userRole: 'client' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: null }),
      });
    // @ts-ignore
    global.fetch = fetchMock;

    render(
      <AuthProvider>
        <TestComponent onRefresh={() => {}} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('uid').textContent).toBe('u1');
    });

    fireEvent.click(screen.getByTestId('refresh'));

    await waitFor(() => {
      expect(screen.getByTestId('uid').textContent).toBe('u1');
    });
  });
});
