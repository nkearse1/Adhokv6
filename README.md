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

### Neon User Switcher

When developing locally, a `NeonUserSwitcher` is displayed in the bottom right. It stores the selected ID in `localStorage.adhok_active_user` and reloads the page so the app hydrates with that user session. The chosen ID is sent to `/api/session` so the server resolves the matching user without relying on environment variables.


### Preview Mock Mode

Preview deployments (e.g. StackBlitz) can still use a mock authentication flow
by setting `NEXT_PUBLIC_USE_MOCK=true` in the environment. This bypasses Clerk
and loads a test user via the `/api/test-user` route so you can interact with
authentic data while the login flow itself is mocked.

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