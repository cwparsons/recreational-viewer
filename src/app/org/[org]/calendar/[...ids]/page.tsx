import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import Header from '@/app/_components/Header';
import CoursesV2 from '@/app/_services/CoursesV2';
import GetCategoriesDataV2 from '@/app/_services/GetCategoriesDataV2';
import { getLocationBySubdomain } from '@/app/_services/LocationsService';
import { Course } from '@/types/CoursesV2Response';

const Grid = dynamic(() => import('@/app/_components/Grid').then((module) => module.Grid), {
  loading: () => <GridLoadingPlaceholder />,
});

function GridLoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
    </div>
  );
}

const CONCURRENCY_LIMIT = 8;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ org: string; ids: string[] }>;
}): Promise<Metadata> {
  const { org, ids } = await params;
  const location = getLocationBySubdomain(org);
  const orgName = location?.name ?? org;
  const categories = await GetCategoriesDataV2(org);
  const currentCategory = categories.find((c) => c.Calendars.some((cal) => cal.Id === ids[0]));
  const currentCalendar = currentCategory?.Calendars.find((c) => c.Id === ids[0]);
  const title =
    ids.length > 1 ? currentCategory?.Name : `${currentCalendar?.Name} - ${currentCategory?.Name}`;

  return {
    title: `${title} - ${orgName}`,
    description: `Browse ${title} courses in ${orgName}`,
  };
}

// Run tasks with at most CONCURRENCY_LIMIT in flight at once, starting a new one
// as soon as any finishes (no per-batch barrier, so one slow calendar doesn't
// stall the rest). Returns each task's settled outcome, order-aligned to `items`.
async function runWithPool<T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results = new Array<PromiseSettledResult<R>>(items.length);
  let cursor = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = { status: 'fulfilled', value: await task(items[index]) };
      } catch (reason) {
        results[index] = { status: 'rejected', reason };
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));

  return results;
}

// Separate Server Component to handle streaming data fetch
async function CalendarCourses({ org, ids }: { org: string; ids: string[] }) {
  const settled = await runWithPool(ids, CONCURRENCY_LIMIT, (id) => CoursesV2(org, id));

  const fetchedCourses: Course[] = [];
  let failures = 0;
  settled.forEach((result) => {
    if (result.status === 'fulfilled') {
      fetchedCourses.push(...result.value.courses);
    } else {
      failures++;
      console.error('Failed to fetch courses:', result.reason);
    }
  });

  // Partial failures are tolerable (show what loaded); a total failure means the
  // upstream is down, so surface it to the error boundary instead of an empty grid.
  if (failures === ids.length && ids.length > 0) {
    throw new Error(`Failed to fetch courses for all ${ids.length} calendar(s) in ${org}`);
  }

  return <Grid org={org} courses={fetchedCourses} />;
}

export default async function Page({
  params,
}: {
  params: Promise<{ org: string; ids: string[] }>;
}) {
  const { org, ids } = await params;

  const location = getLocationBySubdomain(org);
  const orgName = location?.name ?? org;

  const categories = await GetCategoriesDataV2(org);
  const currentCategory = categories.find((c) => c.Calendars.some((cal) => cal.Id === ids[0]));
  const currentCalendar = currentCategory?.Calendars.find((c) => c.Id === ids[0]);
  const title =
    ids.length > 1 ? currentCategory?.Name : `${currentCalendar?.Name} - ${currentCategory?.Name}`;

  return (
    <>
      <Header
        title={title}
        breadcrumbs={[
          { label: 'Directory', href: '/' },
          { label: orgName, href: `/org/${org}` },
          { label: title, href: `/org/${org}/calendar/${ids.join('/')}` },
        ]}
      />

      <div className="grow">
        {/* Render Header and breadcrumbs immediately; stream the Grid once API requests finish */}
        <Suspense fallback={<GridLoadingPlaceholder />}>
          <CalendarCourses org={org} ids={ids} />
        </Suspense>
      </div>
    </>
  );
}
