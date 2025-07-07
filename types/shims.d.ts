declare module 'react-dnd';
declare module 'react-dnd-html5-backend';
declare module 'react-day-picker';
declare module 'pdfjs-dist';

declare namespace React {
  type ReactNode = any;
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = any> {}
  type JSXElementConstructor<P> = any;
  interface FC<P = {}> {
    (props: P): ReactNode;
  }
  interface ComponentPropsWithoutRef<T> {}
  interface ComponentPropsWithRef<T> {}
  interface ComponentProps<T> {}
  interface ComponentType<P = {}> {}
  interface HTMLAttributes<T> { [key: string]: any; }
  interface SVGProps<T> extends HTMLAttributes<T> {}
  interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {}
  interface DOMAttributes<T> { [key: string]: any; }
  interface ClassAttributes<T> {}
  interface ForwardRefExoticComponent<P> {}
  interface RefAttributes<T> {}
  type KeyboardEvent<T = any> = any;
  type ChangeEvent<T = any> = any;
  type FormEvent<T = any> = any;
  type ElementRef<T = any> = any;
  type CSSProperties = any;
  function useState<T = any>(
    initial: T
  ): [T, Dispatch<SetStateAction<T>>];
  function useEffect(...args: any[]): void;
  const useContext: any;
  const useRef: any;
  const useCallback: any;
  const useMemo: any;
  const useReducer: any;
  const useLayoutEffect: any;
  const createContext: any;
  function forwardRef<T = any, P = any>(render: any): any;
  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prev: S) => S);
  const React: any;
}

declare module 'react' {
  export = React;
}

declare namespace JSX {
  interface Element {}
  interface IntrinsicAttributes { [key: string]: any; }
  interface IntrinsicElements { [elemName: string]: any; }
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
