/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import type { ErrorComponentProps } from '@tanstack/react-router';
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import appCss from '../styles/globals.css?url';
import { themeInitScript } from '~/lib/theme';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'Weather' },
      { name: 'theme-color', content: '#FBF7F2', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: '#1B1C2A', media: '(prefers-color-scheme: dark)' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Inter:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { queryClient } = Route.useRouteContext();
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="var(--color-warning-500)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-16 w-16"
      >
        <path d="M24 8 L42 40 L6 40 Z" />
        <path d="M24 20 L24 28" />
        <circle cx="24" cy="34" r="1.5" fill="var(--color-warning-500)" stroke="none" />
      </svg>
      <h1 className="font-display text-[24px] font-bold tracking-[-0.005em] text-[var(--ink)]">
        Something went wrong
      </h1>
      <p className="font-sans text-[14px] text-[var(--ink-soft)]">{message}</p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-primary-500)] px-6 font-display text-[16px] font-semibold text-white shadow-[var(--shadow-sm)]"
      >
        Try again
      </button>
    </main>
  );
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-16 w-16"
      >
        <circle cx="24" cy="24" r="20" />
        <path d="M14 14 L34 34 M34 14 L14 34" />
      </svg>
      <h1 className="font-display text-[24px] font-bold tracking-[-0.005em] text-[var(--ink)]">
        Page not found
      </h1>
    </main>
  );
}
