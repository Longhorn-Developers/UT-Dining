import { useState, useEffect } from 'react';

import { useDatabase } from './useDatabase';

import { getLocationDetails } from '~/db/database';
import * as schema from '~/db/schema';

export function useLocationDetails(locationName: string) {
  const db = useDatabase();
  const [locationData, setLocationData] = useState<schema.Location | null>(null);
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
