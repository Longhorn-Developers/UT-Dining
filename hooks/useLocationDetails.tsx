import { useEffect, useState } from 'react';
import { getLocationDetails } from '~/services/database/database';
import type * as schema from '~/services/database/schema';
import { useDatabase } from './useDatabase';

export function useLocationDetails(locationName: string) {
  const db = useDatabase();
  const [locationData, setLocationData] = useState<schema.LocationWithType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (!locationName) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const details = await getLocationDetails(db, locationName);
        setLocationData(details);
      } catch (err) {
        console.error('❌ Error fetching location details:', err);
        setError('Failed to fetch location details');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [db, locationName]);

  return { locationData, loading, error };
}
