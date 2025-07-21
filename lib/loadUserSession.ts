export function loadUserSession(): string | undefined {
  if (typeof window !== 'undefined') {
    const active = localStorage.getItem('adhok_active_user');
    if (active) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (process.env as any).NEXT_PUBLIC_SELECTED_USER_ID = active;
      return active;
    }
  }
  return process.env.NEXT_PUBLIC_SELECTED_USER_ID;
}
