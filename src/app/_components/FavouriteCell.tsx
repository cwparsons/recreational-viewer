'use client';

import { useFavourites } from '@/app/_hooks/use-favourites';
import { type Course } from '@/types/CoursesV2Response';

import { HeartIcon } from './HeartIcon';

interface FavouriteCellProps {
  course: Course;
  org: string;
}

/**
 * Self-contained favourite toggle for a grid cell. Subscribes to favourites state
 * internally so the enclosing `columnDefs` don't need `isFavourite`/`toggleFavourite`
 * in their deps — keeping the column definitions referentially stable across toggles
 * so ag-grid doesn't reset the active filter model.
 */
export const FavouriteCell = ({ course, org }: FavouriteCellProps) => {
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <div className="flex h-full items-center justify-center">
      <HeartIcon
        filled={isFavourite(course.EventId)}
        onClick={() => toggleFavourite(course, org)}
      />
    </div>
  );
};
