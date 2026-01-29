import Link from 'next/link';

import { Card } from './_components/Card';
import Header from './_components/Header';
import { getLocations } from './_services/LocationsService';

export default async function Home() {
  const locations = getLocations();

  return (
    <>
      <Header breadcrumbs={[]} title={'Directory'} />

      <div className="mb-6">
        <Link
          href="/favourites"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-red-500"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          My favourites
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
        {locations.map(({ name, sites }) => (
          <Card key={name} title={name}>
            <nav aria-label={`${name} locations`}>
              <ul className="flex flex-col gap-2">
                {sites.map((location) => (
                  <li key={location.subdomain}>
                    <Link href={`/org/${location.subdomain}`}>{location.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Card>
        ))}
      </div>
    </>
  );
}

