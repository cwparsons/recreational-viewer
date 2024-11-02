import got from 'got';

import { GetCategoriesDataV2Response } from '@/types/GetCategoriesDataV2Response';

const map = new Map();

const GetCategoriesDataV2 = async (subdomain: string) => {
  const response = await got.post(`https://${subdomain}.perfectmind.com/Clients/BookMe4V2/GetCategoriesDataV2`, {
    cache: map,
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  });

  return response.body as GetCategoriesDataV2Response;
};

export default GetCategoriesDataV2;
