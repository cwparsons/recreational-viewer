import { cache } from 'react';

import { ONE_HOUR_IN_SECONDS } from '@/app/_lib/cache-config';
import { GetCategoriesDataV2Response } from '@/types/GetCategoriesDataV2Response';

const GetCategoriesDataV2 = cache(
  async (subdomain: string): Promise<GetCategoriesDataV2Response> => {
    try {
      const response = await fetch(
        `https://${subdomain}.perfectmind.com/Clients/BookMe4V2/GetCategoriesDataV2`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: ONE_HOUR_IN_SECONDS },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Failed to fetch categories for ${subdomain}:`, error);

      return [];
    }
  },
);

export default GetCategoriesDataV2;
