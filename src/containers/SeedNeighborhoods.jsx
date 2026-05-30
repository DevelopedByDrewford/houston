import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import slugify from 'slugify';
import neighborhoodBlurbs from '../data/neighborhoods';
import { NEIGHBORHOOD_META } from '../data/neighborhood-regions';

// Build a lookup from the region metadata file (name → { region, tag })
const metaByName = Object.fromEntries(
  NEIGHBORHOOD_META.map(m => [m.name, { region: m.region, tag: m.tag }])
);

// Merge both sources. Drop icon (React component, not serializable).
const SEED_DATA = neighborhoodBlurbs.map(({ name, blurb, nearby, img, innerLoop }) => {
  const meta = metaByName[name] || {};
  return {
    name,
    blurb,
    nearby: nearby || [],
    img,
    innerLoop: innerLoop || false,
    region: meta.region || '',
    tag: meta.tag || '',
  };
});

const CHUNK_SIZE = 499;

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

export default function SeedNeighborhoods() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Preview: show which names have no region/tag match
  const unmatched = SEED_DATA.filter(n => !n.region);

  async function handleSeed() {
    setStatus('running');
    setProgress('Starting…');
    setErrorMsg('');

    try {
      const chunks = chunkArray(SEED_DATA, CHUNK_SIZE);

      for (let i = 0; i < chunks.length; i++) {
        const batch = writeBatch(db);

        chunks[i].forEach(neighborhood => {
          const id = slugify(neighborhood.name, { lower: true, strict: true });
          batch.set(doc(db, 'neighborhoods', id), neighborhood);
        });

        await batch.commit();
        const done = Math.min((i + 1) * CHUNK_SIZE, SEED_DATA.length);
        setProgress(`Batch ${i + 1} of ${chunks.length} committed (${done} / ${SEED_DATA.length})`);
      }

      setStatus('done');
      setProgress(`Done — ${SEED_DATA.length} neighborhoods written to Firestore.`);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  return (
    <div style={{
      maxWidth: 640,
      margin: '4rem auto',
      padding: '2rem',
      fontFamily: 'Avenir Next Condensed, sans-serif',
    }}>
      <p style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => navigate('/manage')}
          style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', padding: 0, textDecoration: 'underline' }}
        >
          ← Manage Dashboard
        </button>
      </p>

      <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#002147', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Seed Neighborhoods
      </h1>
      <p style={{ color: '#555', marginBottom: '0.75rem' }}>
        Writes all <strong>{SEED_DATA.length}</strong> neighborhoods to Firestore by merging{' '}
        <code>neighborhoods.js</code> (blurb, nearby, innerLoop) with{' '}
        <code>neighborhood-regions.js</code> (region, tag). Safe to run multiple times — overwrites by name slug.
      </p>

      {unmatched.length > 0 && (
        <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#fff8e1', borderLeft: '3px solid #f0ad00', borderRadius: 4 }}>
          <strong>{unmatched.length} names have no region match</strong> and will be seeded with an empty region:{' '}
          {unmatched.map(n => n.name).join(', ')}
        </div>
      )}

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
          fontFamily: 'Oswald, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          cursor: status === 'running' || status === 'done' ? 'not-allowed' : 'pointer',
          opacity: status === 'running' ? 0.7 : 1,
        }}
      >
        {status === 'idle' && 'Seed Firestore'}
        {status === 'running' && 'Seeding…'}
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

      <details style={{ marginTop: '2rem' }}>
        <summary style={{ cursor: 'pointer', color: '#555', fontSize: '0.9rem' }}>
          Preview merged data ({SEED_DATA.length} records)
        </summary>
        <pre style={{
          marginTop: '0.75rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: 4,
          fontSize: '0.75rem',
          overflowX: 'auto',
          maxHeight: 400,
        }}>
          {JSON.stringify(SEED_DATA, null, 2)}
        </pre>
      </details>
    </div>
  );
}
