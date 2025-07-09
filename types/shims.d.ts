declare module 'react-dnd';
declare module 'react-dnd-html5-backend';
declare module 'react-day-picker';
declare module 'pdfjs-dist';


declare module '@clerk/nextjs';
declare module '@clerk/nextjs/server';
declare module 'next/navigation';
declare module 'next/link';
declare module 'next/server' {
  export type NextRequest = any;
  export type NextResponse = any;
  export type NextFetchEvent = any;
  export type NextMiddleware = any;
  const NextResponse: any;
  export { NextResponse };
}
declare module 'next-auth';
declare module 'next-auth/react';
declare module 'next';
declare module 'lucide-react';
declare module 'sonner';
declare module 'lodash';
declare module 'date-fns';
declare module 'svix';
declare module 'drizzle-orm';
declare module '@neondatabase/serverless';
declare module '@radix-ui/*';

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

declare module 'cmdk';
declare module 'vaul';
declare module 'react-resizable-panels';
declare module 'drizzle-kit';
declare module 'dotenv';
declare module 'drizzle-orm/neon-http';
declare module 'drizzle-orm/pg-core';
declare module 'tailwind-merge' {
  export function twMerge(...inputs: any[]): string;
}

// Stubs for dialect packages not used in this project
declare module 'mysql2/promise';
declare module 'bun-types';
declare module 'pg-protocol/dist/messages';
declare module 'drizzle-orm/mysql-core';
declare module 'drizzle-orm/sqlite-core';
declare module 'drizzle-orm/mysql-core/*';
declare module 'drizzle-orm/sqlite-core/*';
