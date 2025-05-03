import Link from 'next/link';

import { Card } from './_components/Card';
import Header from './_components/Header';
import { getLocations } from './_services/LocationsService';

export default async function Home() {
  const locations = getLocations();

  return (
    <>
      <Header breadcrumbs={[]} title={'Directory'} />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
        {locations.map(({ name, sites }) => (
          <Card key={name} title={name}>
            <nav aria-label={`${name} locations`}>
              <ul className="flex flex-col gap-2">
                {sites.map((location, i) => (
                  <li key={i}>
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

