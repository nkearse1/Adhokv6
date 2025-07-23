# Adhok Project Auction Platform

A platform for connecting marketing professionals with high-value projects through an auction-style marketplace.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Ensure `NEXT_PUBLIC_SELECTED_USER_ID` is defined. This ID will be used on
     the server when no runtime override is present.
   - Provide your database credentials and Clerk keys if you intend to use the
     hosted authentication service.

4. Set up mock data (optional):

```bash
yarn setup-mock-data
```

5. Start the development server:

```bash
yarn dev
```

Before pushing changes, run the verification suite:

```bash
yarn verify
```

### Dev Role Switcher

During development a floating `DevRoleSwitcher` appears in the bottom left
corner of the app. It lets you simulate different roles without signing in by
updating `localStorage.dev_user_role`. The `useAuth` hook reads this value to
load real user records from the database and refreshes the page when a new role is selected.
### Neon User Switcher

When developing locally, a `NeonUserSwitcher` is displayed in the bottom right. It stores the selected ID in `localStorage.adhok_active_user` and reloads the page so the app hydrates with that user session. If no runtime value exists the server falls back to the `NEXT_PUBLIC_SELECTED_USER_ID` environment variable **only in development**.


### Preview Mock Mode

Preview deployments (e.g. StackBlitz) can still use a mock authentication flow
by setting `NEXT_PUBLIC_USE_MOCK=true` in the environment. This bypasses Clerk
and reads the `dev_user_role` value from `localStorage` so you can test the UI
without a full auth setup.
When active, the DevRoleSwitcher loads a real user record from the database via
the `/api/test-user` route so you can interact with authentic data while the
login flow itself is mocked.

### Favicon

The repository does not include `public/favicon.ico`. If you want to use a
custom icon, create or download one and place it in `public/favicon.ico`. This
file is ignored by Git so your personal icon won't be committed.

When working in cloud IDEs such as StackBlitz or Codesandbox, you may see a `.next/` folder created after running the dev server. This directory contains build artifacts and is already listed in `.gitignore`, so it can safely be removed or ignored.

## Test User Credentials

All test users have the password: `password123`

### Admin User
- **Email:** `admin@example.com`
- **Username:** `admin_user`

### Client Users
- **Email:** `client1@example.com`
- **Username:** `sarah_johnson`

- **Email:** `client2@example.com`
- **Username:** `michael_chen`

- **Email:** `client3@example.com`
- **Username:** `emily_rodriguez`

- **Email:** `client4@example.com`
- **Username:** `david_thompson`

### Talent Users
- **Email:** `talent1@example.com`
- **Username:** `alex_rivera`
- **Expertise:** SEO & Content Strategy
- **Badge:** Expert Talent

- **Email:** `talent2@example.com`
- **Username:** `jessica_park`
- **Expertise:** Social Media Marketing
- **Badge:** Pro Talent

- **Email:** `talent3@example.com`
- **Username:** `marcus_williams`
- **Expertise:** Content Writing & Strategy
- **Badge:** Pro Talent

- **Email:** `talent4@example.com`
- **Username:** `sophie_anderson`
- **Expertise:** Web Design & Development
- **Badge:** Specialist

## DevRoleSwitcher

The development layout includes a floating **DevRoleSwitcher** tool. It
appears only when `NODE_ENV` is `development` and lets you pick a temporary
user role for testing. The selected role is saved to `localStorage` under the
`dev_user_role` key. Removing or changing this key will refresh the page and
update the mock auth state.

For preview environments such as StackBlitz you can set
`NEXT_PUBLIC_USE_MOCK=true` in your `.env` file. This bypasses Clerk and tells
`useAuth.tsx` to read `dev_user_role` even when not in development, so choose a
role with the DevRoleSwitcher before testing.

If you encounter `401` errors or an infinite reload loop, ensure that a role is
stored in `dev_user_role` or clear the key and choose a role again.

## Project Structure

- `/app` - Next.js application routes and pages
- `/api` - Serverless API route handlers
- `/components` - Shared React components
- `/hooks` - Custom React hooks
- `/lib` - Database access and utility functions
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configuration
- `/scripts` - Setup and utility scripts

## Features

- User authentication with email/username and password
- Role-based access control (Admin, Client, Talent)
- Project auction marketplace
- Talent qualification system
- Project workspace with deliverables tracking
- Payment and escrow management
- Portfolio showcase for talents

## License

This project is licensed under the MIT License - see the LICENSE file for details.