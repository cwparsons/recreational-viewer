import React from 'react';

import CoursesV2 from '@/app/_services/CoursesV2';
import { Grid } from '@/app/_components/Grid';
import Header from '@/app/_components/Header';
import GetCategoriesDataV2 from '@/app/_services/GetCategoriesDataV2';
import { Locations } from '@/locations';
import { Course } from '@/types/CoursesV2Response';

const CONCURRENCY_LIMIT = 8;

export default async function Page({ params }: { params: Promise<{ city: string; ids: string[] }> }) {
  const { city, ids } = await params;

  const courses: Course[] = [];

  const executeInBatches = async () => {
    for (let i = 0; i < ids.length; i += CONCURRENCY_LIMIT) {
      const batch = ids.slice(i, i + CONCURRENCY_LIMIT);

      await Promise.all(
        batch.map(async (id) => {
          const data = await CoursesV2(city, id);
          courses.push(...data.courses);
        })
      );
    }
  };

  await executeInBatches();

  const cityName = Locations.flatMap((location) => location.sites).find((site) => site.subdomain === city)?.name;

  const categories = await GetCategoriesDataV2(city);
  const currentCategory = categories.find((c) => c.Calendars.some((cal) => cal.Id === ids[0]));
  const currentCalendar = currentCategory?.Calendars.find((c) => c.Id === ids[0]);
  const title = ids.length > 1 ? currentCategory?.Name : `${currentCalendar?.Name} - ${currentCategory?.Name}`;

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-8rem)]">
      <Header
        title={title}
        breadcrumbs={[
          { label: 'Directory', href: '/' },
          { label: cityName ?? '', href: `/city/${city}` },
        ]}
      />

      <div className="flex-grow">
        <Grid city={city} courses={courses} />
      </div>
    </div>
  );
}
