'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/_components/Header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Organization page error:', error);
  }, [error]);

  return (
    <>
      <Header
        title={'Error loading organization'}
        breadcrumbs={[{ label: 'Directory', href: '/' }]}
      />
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-gray-600 dark:text-gray-400">
          We couldn&apos;t load courses for this organization.
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
          >
            Back to directory
          </Link>
        </div>
      </div>
    </>
  );
}
