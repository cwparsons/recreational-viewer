'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/_components/Header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Calendar page error:', error);
  }, [error]);

  return (
    <>
      <Header
        title={'Error loading courses'}
        breadcrumbs={[{ label: 'Directory', href: '/' }]}
      />
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-gray-600 dark:text-gray-400">
          We couldn&apos;t load the courses for this calendar.
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </>
  );
}
