import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { buildNameToId, syncNearbyRelationships } from '../utils/syncNearby';
import '../styles/containers/add-location.css';
import '../styles/containers/manage-locations.css';

const REGIONS = [
  { value: 'inner_loop', label: 'Inner Loop' },
  { value: 'north',      label: 'Heights & North' },
  { value: 'south',      label: 'Museum District & South' },
  { value: 'east',       label: 'East End' },
  { value: 'west',       label: 'Galleria & West' },
  { value: 'outer',      label: 'Greater Houston' },
];


function neighborhoodToForm(n) {
  return {
    name: n.name || '',
    blurb: n.blurb || '',
    img: n.img || '',
    innerLoop: n.innerLoop || false,
    region: n.region || 'inner_loop',
    nearby: n.nearby || [],
    tag: n.tag || '',
    lat: n.lat ?? '',
    lng: n.lng ?? '',
  };
}

export default function ManageNeighborhoods() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [neighborhoods, setNeighborhoods] = useState([]);
  const [locsLoading, setLocsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteState, setDeleteState] = useState('idle');

  const [form, setForm] = useState(null);
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(null);

  const fetchNeighborhoods = useCallback(() => {
    setLocsLoading(true);
    getDocs(collection(db, 'neighborhoods'))
      .then(snap => setNeighborhoods(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .finally(() => setLocsLoading(false));
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) navigate('/manage');
    });
  }, [navigate]);

  useEffect(() => {
    fetchNeighborhoods();
  }, [fetchNeighborhoods]);

  function selectNeighborhood(n) {
    setSelectedNeighborhood(n);
    setForm(neighborhoodToForm(n));
    setSubmitState('idle');
    setSubmitError('');
  }

  function clearSelection() {
    setSelectedNeighborhood(null);
    setForm(null);
    setSubmitState('idle');
    setSubmitError('');
    setRedirectCountdown(null);
  }

  async function handleDelete(n) {
    setDeleteState('loading');
    try {
      await deleteDoc(doc(db, 'neighborhoods', n.id));
      setDeletedIds(prev => new Set([...prev, n.id]));
      setDeleteConfirmId(null);
    } finally {
      setDeleteState('idle');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSubmitState('loading');
    setSubmitError('');
    try {
      await updateDoc(doc(db, 'neighborhoods', selectedNeighborhood.id), {
        name: form.name,
        blurb: form.blurb,
        img: form.img,
        innerLoop: form.innerLoop,
        region: form.region,
        nearby: form.nearby,
        tag: form.tag,
        lat: form.lat !== '' ? parseFloat(form.lat) : null,
        lng: form.lng !== '' ? parseFloat(form.lng) : null,
      });
      await syncNearbyRelationships(
        form.name,
        selectedNeighborhood.nearby || [],
        form.nearby,
        buildNameToId(neighborhoods),
      );
      setSubmitState('success');
      fetchNeighborhoods();
      setRedirectCountdown(5);
      const interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) { clearInterval(interval); clearSelection(); return null; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitState('error');
    }
  }

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleNearby(name) {
    setForm(prev => ({
      ...prev,
      nearby: prev.nearby.includes(name)
        ? prev.nearby.filter(n => n !== name)
        : [...prev.nearby, name],
    }));
  }

  const filteredNeighborhoods = [...neighborhoods]
    .filter(n => !deletedIds.has(n.id))
    .filter(n => {
      const q = search.toLowerCase();
      return (
        n.name?.toLowerCase().includes(q) ||
        n.region?.toLowerCase().includes(q) ||
        n.tag?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const signOutBtn = (
    <button
      onClick={() => signOut(auth)}
      style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
    >
      Sign out
    </button>
  );

  const backToManageBtn = (
    <button
      onClick={() => navigate('/manage')}
      style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
    >
      ← Manage
    </button>
  );

  if (authLoading || !user) {
    return <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Avenir Next Condensed, sans-serif', fontSize: '1.2rem' }}>Loading...</p>;
  }

  if (selectedNeighborhood && form) {
    const canSubmit = form.name.trim() && form.blurb.trim() && form.img.trim();

    return (
      <div className="add-location">
        <div className="add-location__header">
          <h1>Edit Neighborhood</h1>
          <p>
            <button
              onClick={clearSelection}
              style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
            >
              ← Back to list
            </button>
            &nbsp;·&nbsp;Signed in as {user.email}&nbsp;·&nbsp;{signOutBtn}
          </p>
        </div>

        <form className="add-location__body" onSubmit={handleUpdate}>
          <div className="add-location__section">
            <h2>Basic Info</h2>

            <label className="add-location__label">
              Name
              <input className="add-location__input" type="text" value={form.name} onChange={e => setField('name', e.target.value)} required />
            </label>

            <label className="add-location__label">
              Tag <span className="add-location__hint">(short descriptor · e.g. "Late Night")</span>
              <input className="add-location__input" type="text" placeholder="e.g. Late Night" value={form.tag} onChange={e => setField('tag', e.target.value)} />
            </label>

            <label className="add-location__label">
              Region
              <select className="add-location__select" value={form.region} onChange={e => setField('region', e.target.value)}>
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </label>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <label className="add-location__label" style={{ flex: 1 }}>
                Latitude <span className="add-location__hint">(e.g. 29.77)</span>
                <input className="add-location__input" type="number" step="any" placeholder="29.77" value={form.lat} onChange={e => setField('lat', e.target.value)} />
              </label>
              <label className="add-location__label" style={{ flex: 1 }}>
                Longitude <span className="add-location__hint">(e.g. -95.38)</span>
                <input className="add-location__input" type="number" step="any" placeholder="-95.38" value={form.lng} onChange={e => setField('lng', e.target.value)} />
              </label>
            </div>

            <div className="add-location__toggle-row">
              <span className="add-location__toggle-label">Inner Loop</span>
              <button className={`add-location__toggle${form.innerLoop ? ' on' : ''}`} onClick={() => setField('innerLoop', !form.innerLoop)} type="button">
                <span className="add-location__toggle-thumb" />
              </button>
              <span className="add-location__toggle-state">{form.innerLoop ? 'Yes' : 'No'}</span>
            </div>
          </div>

          <div className="add-location__section">
            <h2>Media &amp; Description</h2>

            <label className="add-location__label">
              Image URL
              <input className="add-location__input" type="url" placeholder="https://i.imgur.com/..." value={form.img} onChange={e => setField('img', e.target.value)} required />
            </label>

            {form.img && (
              <div className="add-location__img-preview">
                <img src={form.img} alt="preview" onError={e => e.target.style.display = 'none'} />
              </div>
            )}

            <label className="add-location__label">
              Blurb <span className="add-location__hint">(2–3 sentences describing the neighborhood)</span>
              <textarea className="add-location__textarea" rows={4} value={form.blurb} onChange={e => setField('blurb', e.target.value)} required />
            </label>
          </div>

          <div className="add-location__section">
            <h2>Nearby Neighborhoods</h2>
            <p className="add-location__hint">Select the neighborhoods that border or are closest to this one.</p>
            <div className="add-location__checkbox-grid">
              {[...neighborhoods]
                .filter(n => n.name && n.name !== form.name)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(n => (
                  <label key={n.id} className="add-location__checkbox-item">
                    <input type="checkbox" checked={form.nearby.includes(n.name)} onChange={() => toggleNearby(n.name)} />
                    <span>{n.name}</span>
                  </label>
                ))}
            </div>
            {form.nearby.length > 0 && (
              <p className="add-location__selected-tags">Selected: {form.nearby.join(', ')}</p>
            )}
          </div>

          <div className="add-location__nav">
            <button className="add-location__nav-btn secondary" type="button" onClick={clearSelection}>Back to List</button>
            <button
              className={`add-location__nav-btn primary${submitState === 'success' ? ' done' : ''}`}
              type="submit"
              disabled={!canSubmit || submitState === 'loading' || submitState === 'success'}
            >
              {submitState === 'loading' && 'Saving…'}
              {submitState === 'success' && 'Updated!'}
              {submitState === 'error' && 'Try Again'}
              {submitState === 'idle' && 'Update in Firebase'}
            </button>
          </div>

          {submitState === 'error' && <p className="add-location__error" style={{ textAlign: 'center', marginTop: '1rem' }}>{submitError}</p>}
          {submitState === 'success' && (
            <div className="add-location__success" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p>Neighborhood updated in Firestore.</p>
              <p>
                Returning to list in {redirectCountdown}s&nbsp;·&nbsp;
                <button onClick={clearSelection} style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}>
                  Go now
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="manage-locations">
      <div className="add-location__header">
        <h1>Manage Neighborhoods</h1>
        <p>
          {backToManageBtn}
          &nbsp;·&nbsp;Signed in as {user.email}&nbsp;·&nbsp;{signOutBtn}
        </p>
      </div>

      <div className="manage-locations__toolbar">
        <input
          className="manage-locations__search"
          type="text"
          placeholder="Search by name, region, or tag…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="manage-locations__add-btn" onClick={() => navigate('/manage/neighborhoods/add')}>
          + Add Neighborhood
        </button>
      </div>

      <div className="manage-locations__list">
        {locsLoading ? (
          <p className="manage-locations__empty">Loading neighborhoods…</p>
        ) : filteredNeighborhoods.length === 0 ? (
          <p className="manage-locations__empty">No neighborhoods found.</p>
        ) : (
          filteredNeighborhoods.map(n => (
            <div key={n.id} className="manage-locations__row">
              <button className="manage-locations__row-edit" onClick={() => selectNeighborhood(n)}>
                <span className="manage-locations__row-name">{n.name}</span>
                <span className="manage-locations__row-meta">{n.region?.replace('_', ' ')}&nbsp;·&nbsp;{n.tag || '—'}</span>
              </button>
              {deleteConfirmId === n.id ? (
                <div className="manage-locations__row-confirm">
                  <span className="manage-locations__confirm-label">Delete?</span>
                  <button className="manage-locations__confirm-yes" onClick={() => handleDelete(n)} disabled={deleteState === 'loading'}>
                    {deleteState === 'loading' ? '…' : 'Yes'}
                  </button>
                  <button className="manage-locations__confirm-no" onClick={() => setDeleteConfirmId(null)}>No</button>
                </div>
              ) : (
                <button className="manage-locations__delete-btn" onClick={() => setDeleteConfirmId(n.id)} title="Delete neighborhood">
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
