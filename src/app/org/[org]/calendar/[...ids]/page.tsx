import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

import Header from '@/app/_components/Header';
import CoursesV2 from '@/app/_services/CoursesV2';
import GetCategoriesDataV2 from '@/app/_services/GetCategoriesDataV2';
import { getLocationBySubdomain } from '@/app/_services/LocationsService';
import { Course } from '@/types/CoursesV2Response';

const Grid = dynamic(() => import('@/app/_components/Grid').then((module) => module.Grid));

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

export default async function Page({
  params,
}: {
  params: Promise<{ org: string; ids: string[] }>;
}) {
  const { org, ids } = await params;

  const courses: Course[] = [];

  const executeInBatches = async function <T>(
    ids: T[],
    callback: (id: T) => Promise<Course[]>,
  ): Promise<Course[]> {
    const allResults: Course[] = [];
    for (let i = 0; i < ids.length; i += CONCURRENCY_LIMIT) {
      const batch = ids.slice(i, i + CONCURRENCY_LIMIT);
      const results = await Promise.allSettled(batch.map(callback));
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value);
        } else {
          console.error('Failed to fetch courses:', result.reason);
        }
      });
    }
    return allResults;
  };

  const fetchedCourses = await executeInBatches(ids, async (id) => {
    const data = await CoursesV2(org, id);
    return data.courses;
  });
  
  courses.push(...fetchedCourses);

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
        <Grid org={org} courses={courses} />
      </div>
    </>
  );
}

