'use client';

import dynamic from 'next/dynamic';

import type { Course } from '@/types/CoursesV2Response';

const Grid = dynamic(() => import('@/app/_components/Grid').then((module) => module.Grid), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
    </div>
  ),
});

type CalendarGridProps = {
  org: string;
  courses: Course[];
};

export function CalendarGrid({ org, courses }: CalendarGridProps) {
  return <Grid org={org} courses={courses} />;
}

