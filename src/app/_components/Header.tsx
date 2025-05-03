import React from 'react';

import Link from 'next/link';

type Breadcrumb = {
  href: string;
  label?: string;
};

type HeaderProps = {
  breadcrumbs?: Breadcrumb[];
  title?: string;
};

const Header = ({ breadcrumbs, title }: HeaderProps) => {
  return (
    <header className="flex flex-col gap-4">
      <nav aria-label="Breadcrumb" className="min-h-6">
        <ol className="list-reset flex gap-2">
          {breadcrumbs?.map((crumb, index) => (
            <li className="flex items-center gap-2" key={crumb.href}>
              <Link
                aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                href={crumb.href}
              >
                {crumb.label}
              </Link>

              {index !== breadcrumbs.length - 1 && (
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {title && <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>}
    </header>
  );
};

export default Header;

