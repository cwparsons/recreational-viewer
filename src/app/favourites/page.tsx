'use client';

import Link from 'next/link';
import { useFavourites } from '@/app/_hooks/use-favourites';
import { formatOccurrenceDescription } from '@/app/_lib/format-occurrence-description';
import { formatCourseData } from '@/app/_lib/format-course-data';
import Header from '@/app/_components/Header';
import { HeartIcon } from '@/app/_components/HeartIcon';

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
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No favourites yet
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            Start favouriting courses to see them here
          </p>
          <Link
            href="/"
            className="px-4 py-2"
          >
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
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <HeartIcon
                      filled={isFavourite(course.EventId)}
                      onClick={() => toggleFavourite(course, org)}
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{course.EventName}</h3>
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
                    className="whitespace-nowrap text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    {formattedCourse.spots}
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Organization:</span> {course.OrgName}
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span> {formattedCourse.FacilityLocation}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> {course.EventTimeDescription}
                  </div>
                  <div>
                    <span className="font-semibold">Start:</span> {formattedCourse.OccurrenceMinStartDate.toLocaleDateString()}
                  </div>
                  {formattedCourse.OccurrenceMaxStartDate && (
                    <div>
                      <span className="font-semibold">End:</span> {formattedCourse.OccurrenceMaxStartDate.toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Price:</span> {course.PriceRange}
                  </div>
                </div>

                {course.Details && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
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
