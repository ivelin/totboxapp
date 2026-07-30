'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/jobs', label: 'Jobs', short: 'Jobs' },
  { href: '/workflow', label: 'Path', short: 'Path' },
  { href: '/dashboard', label: 'Providers', short: 'Ops' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--accent-fg)]"
            aria-hidden
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M4 7h16M4 12h10M4 17h14" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[var(--text-base)] font-semibold tracking-tight text-[var(--fg)]">
            Totbox
          </span>
        </Link>

        <nav className="flex min-w-0 items-center gap-0.5 sm:gap-1">
          {links.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-2.5 py-1.5 text-[var(--text-xs)] font-medium no-underline transition-colors duration-[var(--motion-quick)] sm:px-3 sm:text-[var(--text-sm)] ${
                  active
                    ? 'bg-[var(--bg-subtle)] text-[var(--fg)]'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                }`}
              >
                <span className="sm:hidden">{l.short}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
