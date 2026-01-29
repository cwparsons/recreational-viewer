import { cache } from 'react';
import { CoursesV2Response } from '../../types/CoursesV2Response';

const CoursesV2 = cache(async (subdomain: string, calendarId: string): Promise<CoursesV2Response> => {
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
        next: { revalidate: 60 * 60 },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Failed to fetch courses for ${subdomain} calendar ${calendarId}:`, error);

    return { courses: [], nextKey: '' };
  }
});

export default CoursesV2;

