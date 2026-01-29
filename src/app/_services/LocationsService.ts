import { Locations as LocationsData } from '@/locations';

export interface Location {
  name: string;
  subdomain: string;
}

export interface LocationGroup {
  name: string;
  sites: Location[];
}

export const getLocations = (): LocationGroup[] => {
  return LocationsData;
};

export const getLocationBySubdomain = (subdomain: string): Location | undefined => {
  return LocationsData.flatMap((location) => location.sites).find(
    (site) => site.subdomain === subdomain,
  );
};
