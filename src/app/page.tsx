import Link from 'next/link';
import Header from './_components/Header';

import { Locations } from '@/locations';

export default async function Home() {
  return (
    <>
      <Header breadcrumbs={[]} title={'Directory'} />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {Locations.map(({ name, sites }) => (
          <div key={name} className="rounded-lg border bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">{name}</h2>

            <nav>
              <ul className="space-y-2">
                {sites.map((l, i) => (
                  <li className="my-2" key={i}>
                    <Link className="text-blue-600 hover:underline dark:text-blue-400" href={`/city/${l.subdomain}`}>
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ))}
      </div>
    </>
  );
}
