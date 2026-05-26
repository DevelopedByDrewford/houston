import { useState } from 'react';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import locations from '../data/locations';
import generateLocationSlug from '../utils/slug';

const CHUNK_SIZE = 499;

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function sanitize(value) {
  if (Array.isArray(value)) {
    return value.filter(v => v !== undefined).map(sanitize);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, sanitize(v)])
    );
  }
  return value;
}

export default function SeedLocations() {
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [progress, setProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSeed() {
    setStatus('running');
    setProgress('Starting...');
    setErrorMsg('');

    try {
      const chunks = chunkArray(locations, CHUNK_SIZE);

      for (let i = 0; i < chunks.length; i++) {
        const batch = writeBatch(db);
        const chunk = chunks[i];

        chunk.forEach(location => {
          if (!location.name || !location.coordinates) return;
          const id = generateLocationSlug(location);
          const ref = doc(db, 'locations', id);
          batch.set(ref, sanitize(location));
        });

        await batch.commit();
        setProgress(`Committed batch ${i + 1} of ${chunks.length} (${(i + 1) * CHUNK_SIZE >= locations.length ? locations.length : (i + 1) * CHUNK_SIZE} / ${locations.length} locations)`);
      }

      setStatus('done');
      setProgress(`Done — ${locations.length} locations written to Firestore.`);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  return (
    <div style={{
      maxWidth: 600,
      margin: '4rem auto',
      padding: '2rem',
      fontFamily: 'Avenir Next Condensed, sans-serif',
    }}>
      <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#002147', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Seed Locations
      </h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        This will write all <strong>{locations.length}</strong> locations from <code>locations.js</code> into
        Firestore using the slug as the document ID. Safe to run multiple times — it overwrites duplicates.
      </p>

      <button
        onClick={handleSeed}
        disabled={status === 'running' || status === 'done'}
        style={{
          padding: '0.75rem 2rem',
          background: status === 'done' ? '#2ecc71' : '#E57200',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          fontSize: '1.1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          cursor: status === 'running' || status === 'done' ? 'not-allowed' : 'pointer',
          opacity: status === 'running' ? 0.7 : 1,
        }}
      >
        {status === 'idle' && 'Seed Firestore'}
        {status === 'running' && 'Seeding...'}
        {status === 'done' && 'Done!'}
        {status === 'error' && 'Retry'}
      </button>

      {progress && (
        <p style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#f0f4f8', borderLeft: '3px solid #002147', borderRadius: 4 }}>
          {progress}
        </p>
      )}

      {errorMsg && (
        <p style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#fdf0ee', borderLeft: '3px solid #e74c3c', borderRadius: 4, color: '#c0392b' }}>
          Error: {errorMsg}
        </p>
      )}
    </div>
  );
}
