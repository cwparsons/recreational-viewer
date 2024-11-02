import got from 'got';

import { CoursesV2Response } from '../../types/CoursesV2Response';

const map = new Map();

const CoursesV2 = async (subdomain: string, calendarId: string): Promise<CoursesV2Response> => {
  const response = await got.post(`https://${subdomain}.perfectmind.com/Clients/BookMe4BookingPagesV2/CoursesV2`, {
    cache: map,
    json: {
      calendarId,
      page: '0',
      bookingMode: '0'
    },
    responseType: 'json'
  });

  return response.body as CoursesV2Response;
};

export default CoursesV2;
