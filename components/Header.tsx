'use client';

import HeaderMock from './HeaderMock';
import HeaderClerk from './HeaderClerk';

const IS_MOCK =
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export default function Header() {
  return IS_MOCK ? <HeaderMock /> : <HeaderClerk />;
}
