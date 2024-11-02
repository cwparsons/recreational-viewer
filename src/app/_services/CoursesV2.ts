import { CoursesV2Response } from '../../types/CoursesV2Response';

const CoursesV2 = async (subdomain: string, calendarId: string): Promise<CoursesV2Response> => {
  const response = await fetch(`https://${subdomain}.perfectmind.com/Clients/BookMe4BookingPagesV2/CoursesV2`, {
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
  });

  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  return response.json();
};

export default CoursesV2;
