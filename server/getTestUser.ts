// Server-only utility to fetch test users from the database
import { selectUserByRole } from './selectUserByRole';

// Login is mocked, but these users are real records from the Neon database
// so downstream hooks should treat them as authenticated users

export type TestRole = 'admin' | 'client' | 'talent';

export async function getTestUser(role: TestRole) {
  try {
    return await selectUserByRole(role);
  } catch (err) {
    console.error('getTestUser error', err);
    return null;
  }
}
