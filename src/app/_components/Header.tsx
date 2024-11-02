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
      {breadcrumbs && (
        <nav>
          <ol className="list-reset flex">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                <Link href={crumb.href} className="hover:text-blue-500">
                  {crumb.label}
                </Link>

                {index < breadcrumbs.length - 1 && <span className="mx-2">&gt;</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {title && <h1 className="text-5xl font-bold mb-8">{title}</h1>}
    </header>
  );
};

export default Header;
