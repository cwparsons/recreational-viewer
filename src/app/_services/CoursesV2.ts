import { cache } from 'react';

import { ONE_HOUR_IN_SECONDS } from '@/app/_lib/cache-config';
import { CoursesV2Response } from '../../types/CoursesV2Response';

const CoursesV2 = cache(
  async (subdomain: string, calendarId: string): Promise<CoursesV2Response> => {
    try {
      const response = await fetch(
        `https://${subdomain}.perfectmind.com/Clients/BookMe4BookingPagesV2/CoursesV2`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            calendarId,
            page: '0',
            bookingMode: '0',
          }),
          next: { revalidate: ONE_HOUR_IN_SECONDS },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      // Rethrow so the caller can distinguish a failed fetch from an empty
      // result set. Callers batching many calendars decide whether a partial
      // failure is tolerable or the whole page should error.
      console.error(`Failed to fetch courses for ${subdomain} calendar ${calendarId}:`, error);

      throw error;
    }
  },
);

export default CoursesV2;
