import { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const NeighborhoodsContext = createContext({ neighborhoods: [], loading: true, error: null, refresh: () => {} });

export function NeighborhoodsProvider({ children }) {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchNeighborhoods() {
    setLoading(true);
    getDocs(collection(db, 'neighborhoods'))
      .then(snap => {
        setNeighborhoods(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  return (
    <NeighborhoodsContext.Provider value={{ neighborhoods, loading, error, refresh: fetchNeighborhoods }}>
      {children}
    </NeighborhoodsContext.Provider>
  );
}

export const useNeighborhoods = () => useContext(NeighborhoodsContext);
