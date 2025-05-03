import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Card } from '@/app/_components/Card';
import Header from '@/app/_components/Header';
import { getLocationBySubdomain } from '@/app/_services/LocationsService';

import GetCategoriesDataV2 from '../../_services/GetCategoriesDataV2';

export default async function Page({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const categories = await GetCategoriesDataV2(org);
  const location = getLocationBySubdomain(org);
  const orgName = location?.name ?? org;

  if (categories.length === 0) {
    return notFound();
  }

  return (
    <>
      <Header
        title={orgName}
        breadcrumbs={[
          { label: 'Directory', href: '/' },
          { label: orgName, href: `/org/${org}` },
        ]}
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {categories
          .filter((c) => c.Calendars.length > 0)
          .filter((c) => c.Calendars.some((cal) => !!cal.BookingLink))
          .map((c, i) => {
            const calendars = c.Calendars.filter((calendar) => !!calendar.BookingLink);

            return (
              <Card key={i} title={c.Name}>
                <ul className="flex flex-col gap-2">
                  <li>
                    {calendars.length > 1 && (
                      <Link href={`/org/${org}/calendar/${c.Calendars.map((c) => c.Id).join('/')}`}>
                        All
                      </Link>
                    )}
                  </li>

                  {calendars.map((calendar, i) => {
                    return (
                      <li key={i}>
                        <Link href={`/org/${org}/calendar/${calendar.Id}`}>{calendar.Name}</Link>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            );
          })}
      </div>
    </>
  );
}

