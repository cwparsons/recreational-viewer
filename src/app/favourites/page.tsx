'use client';

import Link from 'next/link';

import Header from '@/app/_components/Header';
import { HeartIcon } from '@/app/_components/HeartIcon';
import { useFavourites } from '@/app/_hooks/use-favourites';
import { formatCourseData } from '@/app/_lib/format-course-data';
import { formatOccurrenceDescription } from '@/app/_lib/format-occurrence-description';

export default function FavouritesPage() {
  const { favourites, toggleFavourite, isFavourite } = useFavourites();

  return (
    <>
      <Header
        title="My favourites"
        breadcrumbs={[
          { label: 'Directory', href: '/' },
          { label: 'My favourites', href: '/favourites' },
        ]}
      />

      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <HeartIcon className="mb-4 text-gray-300" />
          <h2 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
            No favourites yet
          </h2>
          <p className="mb-4 text-gray-500 dark:text-gray-500">
            Start favouriting courses to see them here
          </p>
          <Link href="/" className="px-4 py-2">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {favourites.map((favourite) => {
            const { course, org } = favourite;
            const formattedCourse = formatCourseData(course);
            const href = `https://${org}.perfectmind.com/Clients/BookMe4LandingPages/CoursesLandingPage?courseId=${course.EventId}`;

            return (
              <div
                key={course.EventId}
                className="rounded-lg border bg-white px-4 py-3 shadow dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <HeartIcon
                      filled={isFavourite(course.EventId)}
                      onClick={() => toggleFavourite(course, org)}
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{course.EventName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatOccurrenceDescription(
                          '',
                          formattedCourse.OccurrenceMinStartDate,
                          course.OccurrenceDescription,
                        )}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-blue-600 px-3 py-1 whitespace-nowrap text-blue-600 underline transition-colors hover:bg-blue-50 hover:text-blue-800 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                  >
                    {formattedCourse.spots}
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <span className="font-semibold">Organization:</span> {course.OrgName}
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span>{' '}
                    {formattedCourse.FacilityLocation}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> {course.EventTimeDescription}
                  </div>
                  <div>
                    <span className="font-semibold">Start:</span>{' '}
                    {formattedCourse.OccurrenceMinStartDate.toLocaleDateString()}
                  </div>
                  {formattedCourse.OccurrenceMaxStartDate && (
                    <div>
                      <span className="font-semibold">End:</span>{' '}
                      {formattedCourse.OccurrenceMaxStartDate.toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Price:</span> {course.PriceRange}
                  </div>
                </div>

                {course.Details && (
                  <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{course.Details}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
