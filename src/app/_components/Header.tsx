import Link from 'next/link';
import React from 'react';

type Breadcrumb = {
  href: string;
  label?: string;
};

type HeaderProps = {
  title?: string;
  breadcrumbs?: Breadcrumb[];
};

const Header = ({ title, breadcrumbs }: HeaderProps) => {
  return (
    <header>
      <nav className="min-h-[24px]">
        <ol className="list-reset flex">
          {breadcrumbs?.map((crumb, index) => (
            <li key={index} className="flex items-center">
              <Link href={crumb.href} className="hover:text-blue-500">
                {crumb.label}
              </Link>

              {index !== breadcrumbs.length - 1 && (
                <svg
                  className="mx-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="16"
                  height="16"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {title && <h1 className="text-3xl md:text-5xl font-bold mb-8">{title}</h1>}
    </header>
  );
};

export default Header;
