import { useState, useEffect } from 'react';
import { NEIGHBORHOOD_GEO } from '../data/neighborhood-geo';

function nearestNeighborhood(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  for (const [name, [nlat, nlng]] of Object.entries(NEIGHBORHOOD_GEO)) {
    const dist = (lat - nlat) ** 2 + (lng - nlng) ** 2;
    if (dist < bestDist) { bestDist = dist; best = name; }
  }
  return best;
}

export function useCurrentNeighborhood() {
  const [state, setState] = useState({ neighborhoodName: null, status: 'idle' });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ neighborhoodName: null, status: 'unavailable' });
      return;
    }
    setState(s => ({ ...s, status: 'loading' }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const name = nearestNeighborhood(pos.coords.latitude, pos.coords.longitude);
        setState({ neighborhoodName: name, status: 'found' });
      },
      () => setState({ neighborhoodName: null, status: 'denied' }),
      { timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  return state;
}
