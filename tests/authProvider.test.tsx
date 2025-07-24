import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from '../lib/client/useAuthContext';

function TestComponent({ onRefresh }: { onRefresh: () => void }) {
  const { userId, refreshSession } = useAuth();
  return (
    <div>
      <span data-testid="uid">{userId}</span>
      <button data-testid="refresh" onClick={() => { refreshSession('u2'); onRefresh(); }} />
    </div>
  );
}

describe('AuthProvider', () => {
  it('updates context when refreshSession is called with an id', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 'u1', username: 'u1', user_role: 'client' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 'u2', username: 'u2', user_role: 'client' } }),
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
    expect(fetchMock).toHaveBeenLastCalledWith('/api/session?id=u2');
  });
});
