'use client';

import { useCallback } from 'react';

import { Course } from '@/types/CoursesV2Response';

import { useLocalStorage } from './use-location-storage';

export interface FavouriteCourse {
  course: Course;
  org: string;
}

export function useFavourites() {
  const [favourites, setFavourites] = useLocalStorage<FavouriteCourse[]>('favouriteCourses', []);

  const isFavourite = useCallback(
    (courseId: string): boolean => {
      return favourites.some((fav) => fav.course.EventId === courseId);
    },
    [favourites],
  );

  const addFavourite = useCallback(
    (course: Course, org: string) => {
      setFavourites((prev) => {
        if (prev.some((fav) => fav.course.EventId === course.EventId)) {
          return prev; // Already favourited
        }
        return [...prev, { course, org }];
      });
    },
    [setFavourites],
  );

  const removeFavourite = useCallback(
    (courseId: string) => {
      setFavourites((prev) => prev.filter((fav) => fav.course.EventId !== courseId));
    },
    [setFavourites],
  );

  const toggleFavourite = useCallback(
    (course: Course, org: string) => {
      if (isFavourite(course.EventId)) {
        removeFavourite(course.EventId);
      } else {
        addFavourite(course, org);
      }
    },
    [isFavourite, addFavourite, removeFavourite],
  );

  return {
    favourites,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
  };
}
