'use client';

import { useEffect } from 'react';

import Header from './_components/Header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <>
      <Header breadcrumbs={[]} title={'Something went wrong!'} />
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-gray-600 dark:text-gray-400">
          We encountered an error while loading this page.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </>
  );
}
