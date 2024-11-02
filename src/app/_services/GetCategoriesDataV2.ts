import { GetCategoriesDataV2Response } from '@/types/GetCategoriesDataV2Response';

const GetCategoriesDataV2 = async (subdomain: string) => {
  const response = await fetch(`https://${subdomain}.perfectmind.com/Clients/BookMe4V2/GetCategoriesDataV2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'default',
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data as GetCategoriesDataV2Response;
};

export default GetCategoriesDataV2;
