import Link from 'next/link';
import { notFound } from 'next/navigation';

import GetCategoriesDataV2 from '../../_services/GetCategoriesDataV2';
import Header from '@/app/_components/Header';
import { Locations } from '@/locations';

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const categories = await GetCategoriesDataV2(city);
  const cityName = Locations.flatMap((location) => location.sites).find((site) => site.subdomain === city)?.name;

  if (categories.length === 0) {
    return notFound();
  }

  return (
    <>
      <Header title={cityName} breadcrumbs={[{ label: 'Directory', href: '/' }]} />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {categories
          .filter((c) => c.Calendars.length > 0)
          .filter((c) => c.Calendars.some((cal) => !!cal.BookingLink))
          .map((c, i) => {
            const calendars = c.Calendars.filter((calendar) => !!calendar.BookingLink);

            return (
              <div className="rounded-lg border bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800" key={i}>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 md:text-2xl dark:text-gray-100">{c.Name}</h2>

                <ul className="space-y-2">
                  <li>
                    {calendars.length > 1 && (
                      <Link
                        className="text-blue-600 hover:underline dark:text-blue-400"
                        href={`/city/${city}/calendar/${c.Calendars.map((c) => c.Id).join('/')}`}
                      >
                        All
                      </Link>
                    )}
                  </li>

                  {calendars.map((calendar, i) => {
                    return (
                      <li key={i}>
                        <Link className="text-blue-600 hover:underline dark:text-blue-400" href={`/city/${city}/calendar/${calendar.Id}`}>
                          {calendar.Name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </div>
    </>
  );
}
