import { GetCategoriesDataV2Response } from '@/types/GetCategoriesDataV2Response';

const GetCategoriesDataV2 = async (subdomain: string): Promise<GetCategoriesDataV2Response> => {
  const response = await fetch(`https://${subdomain}.perfectmind.com/Clients/BookMe4V2/GetCategoriesDataV2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  return response.json();
};

export default GetCategoriesDataV2;
