declare module 'react-dnd';
declare module 'react-dnd-html5-backend';
declare module 'react-day-picker';
declare module 'pdfjs-dist';

declare module 'react' {
  export as namespace React;
  export type ReactNode = any;
  export interface HTMLAttributes<T> {
    [key: string]: any;
    className?: string;
  }
  export interface FC<P = {}> {
    (props: P): ReactNode;
  }
  export type ChangeEvent<T = any> = any;
  export type FormEvent<T = any> = any;
  export type ElementRef<T = any> = any;
  export function useState<T = any>(
    initial: T
  ): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(...args: any[]): void;
  export const useContext: any;
  export const useRef: any;
  export const useCallback: any;
  export const useMemo: any;
  export const useReducer: any;
  export const useLayoutEffect: any;
  export const createContext: any;
  export const forwardRef: any;
  const React: any;
  export default React;
  export = React;
}

declare var React: any;

declare namespace JSX {
  interface IntrinsicAttributes {
    key?: any;
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element {}
}

declare module '@clerk/nextjs';
declare module '@clerk/nextjs/server';
declare module 'next/navigation';
declare module 'next/link';
declare module 'next/server' {
  export type NextRequest = any;
  export type NextResponse = any;
  const NextResponse: any;
  export { NextResponse };
}
declare module 'next-auth';
declare module 'next-auth/react';
declare module 'next';
declare module 'lucide-react';
declare module 'sonner';
declare module 'date-fns';
declare module 'svix';
declare module 'clsx';
declare module 'drizzle-orm';
declare module '@neondatabase/serverless';
declare module '@radix-ui/*';

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

declare module 'embla-carousel-react';
declare module 'recharts';
declare module 'recharts/types/component/DefaultTooltipContent';
declare module 'cmdk';
declare module 'vaul';
declare module 'react-hook-form';
declare module 'input-otp';
declare module 'react-resizable-panels';
declare module 'drizzle-kit';
declare module 'dotenv';
declare module 'drizzle-orm/neon-http';
declare module 'drizzle-orm/pg-core';
declare module 'tailwind-merge' {
  export function twMerge(...inputs: any[]): string;
}
declare module 'clsx' {
  export type ClassValue = any;
  export default function clsx(...inputs: ClassValue[]): string;
}
