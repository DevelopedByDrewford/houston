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
    let cancelled = false;

    if (!navigator.geolocation) {
      setState({ neighborhoodName: null, status: 'unavailable' });
      return;
    }

    const onSuccess = (pos) => {
      if (cancelled) return;
      const name = nearestNeighborhood(pos.coords.latitude, pos.coords.longitude);
      setState({ neighborhoodName: name, status: 'found' });
    };

    const onError = (err) => {
      if (cancelled) return;
      setState({ neighborhoodName: null, status: err.code === 1 ? 'denied' : 'unavailable' });
    };

    const requestPosition = () => {
      if (cancelled) return;
      setState(s => ({ ...s, status: 'loading' }));
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10 * 60 * 1000,
      });
    };

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (cancelled) return;
          if (result.state === 'denied') {
            setState({ neighborhoodName: null, status: 'denied' });
          } else {
            requestPosition();
          }
        })
        .catch(requestPosition);
    } else {
      requestPosition();
    }

    return () => { cancelled = true; };
  }, []);

  return state;
}
