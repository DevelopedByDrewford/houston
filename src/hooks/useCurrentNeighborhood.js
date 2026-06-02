import { useState, useEffect } from 'react';

export function useCurrentNeighborhood() {
  const [state, setState] = useState({ coords: null, status: 'idle' });

  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) {
      setState({ coords: null, status: 'unavailable' });
      return;
    }

    const onSuccess = (pos) => {
      if (cancelled) return;
      const { latitude: lat, longitude: lng } = pos.coords;
      setState({ coords: { lat, lng }, status: 'found' });
    };

    const onError = (err) => {
      if (cancelled) return;
      setState({ coords: null, status: err.code === 1 ? 'denied' : 'unavailable' });
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
            setState({ coords: null, status: 'denied' });
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
