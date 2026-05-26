import { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const LocationsContext = createContext({ locations: [], loading: true, error: null });

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDocs(collection(db, 'locations'))
      .then(snap => {
        setLocations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <LocationsContext.Provider value={{ locations, loading, error }}>
      {children}
    </LocationsContext.Provider>
  );
}

export const useLocations = () => useContext(LocationsContext);
