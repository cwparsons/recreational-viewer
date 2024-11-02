import Link from 'next/link';
import Header from './_components/Header';

import { Locations } from '@/locations';

export default async function Home() {
  return (
    <>
      <Header title={'Directory'} />

      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {Locations.map(({ name, sites }) => (
          <div key={name} className="border rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{name}</h2>

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
