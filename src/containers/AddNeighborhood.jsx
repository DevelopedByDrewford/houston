import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { buildNameToId, syncNearbyRelationships } from '../utils/syncNearby';
import '../styles/containers/add-location.css';

const REGIONS = [
  { value: 'inner_loop', label: 'Inner Loop' },
  { value: 'north',      label: 'Heights & North' },
  { value: 'south',      label: 'Museum District & South' },
  { value: 'east',       label: 'East End' },
  { value: 'west',       label: 'Galleria & West' },
  { value: 'outer',      label: 'Greater Houston' },
];

const defaultForm = {
  name: '',
  blurb: '',
  img: '',
  innerLoop: false,
  region: 'inner_loop',
  nearby: [],
  tag: '',
  lat: '',
  lng: '',
};

export default function AddNeighborhood() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [nameToId, setNameToId]             = useState({});
  const [allNeighborhoods, setAllNeighborhoods] = useState([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) navigate('/manage');
    });
  }, [navigate]);

  useEffect(() => {
    getDocs(collection(db, 'neighborhoods')).then(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNameToId(buildNameToId(docs));
      setAllNeighborhoods(docs.sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    });
  }, []);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitState('loading');
    setSubmitError('');
    try {
      await addDoc(collection(db, 'neighborhoods'), {
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
      await syncNearbyRelationships(form.name, [], form.nearby, nameToId);
      setSubmitState('success');
      setTimeout(() => {
        setForm(defaultForm);
        setSubmitState('idle');
      }, 2000);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitState('error');
    }
  }

  const canSubmit = form.name.trim() && form.blurb.trim() && form.img.trim();

  if (authLoading) {
    return <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Avenir Next Condensed, sans-serif', fontSize: '1.2rem' }}>Loading...</p>;
  }

  if (!user) return null;

  return (
    <div className="add-location">
      <div className="add-location__header">
        <h1>Add Neighborhood</h1>
        <p>
          <button
            onClick={() => navigate('/manage')}
            style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
          >
            ← Back to Manage
          </button>
          &nbsp;·&nbsp;Signed in as {user.email}
        </p>
      </div>

      <form className="add-location__body" onSubmit={handleSubmit}>
        <div className="add-location__section">
          <h2>Basic Info</h2>

          <label className="add-location__label">
            Name
            <input
              className="add-location__input"
              type="text"
              placeholder="e.g. Midtown"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              required
            />
          </label>

          <label className="add-location__label">
            Tag <span className="add-location__hint">(short descriptor · e.g. "Late Night")</span>
            <input
              className="add-location__input"
              type="text"
              placeholder="e.g. Late Night"
              value={form.tag}
              onChange={e => setField('tag', e.target.value)}
            />
          </label>

          <label className="add-location__label">
            Region
            <select
              className="add-location__select"
              value={form.region}
              onChange={e => setField('region', e.target.value)}
            >
              {REGIONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
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
            <button
              className={`add-location__toggle${form.innerLoop ? ' on' : ''}`}
              onClick={() => setField('innerLoop', !form.innerLoop)}
              type="button"
            >
              <span className="add-location__toggle-thumb" />
            </button>
            <span className="add-location__toggle-state">{form.innerLoop ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="add-location__section">
          <h2>Media &amp; Description</h2>

          <label className="add-location__label">
            Image URL
            <input
              className="add-location__input"
              type="url"
              placeholder="https://i.imgur.com/..."
              value={form.img}
              onChange={e => setField('img', e.target.value)}
              required
            />
          </label>

          {form.img && (
            <div className="add-location__img-preview">
              <img src={form.img} alt="preview" onError={e => e.target.style.display = 'none'} />
            </div>
          )}

          <label className="add-location__label">
            Blurb <span className="add-location__hint">(2–3 sentences describing the neighborhood)</span>
            <textarea
              className="add-location__textarea"
              rows={4}
              placeholder="What defines this neighborhood? What will visitors find there?"
              value={form.blurb}
              onChange={e => setField('blurb', e.target.value)}
              required
            />
          </label>
        </div>

        <div className="add-location__section">
          <h2>Nearby Neighborhoods</h2>
          <p className="add-location__hint">Select the neighborhoods that border or are closest to this one.</p>
          <div className="add-location__checkbox-grid">
            {allNeighborhoods
              .filter(n => n.name && n.name !== form.name)
              .map(n => (
                <label key={n.id} className="add-location__checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.nearby.includes(n.name)}
                    onChange={() => toggleNearby(n.name)}
                  />
                  <span>{n.name}</span>
                </label>
              ))}
          </div>
          {form.nearby.length > 0 && (
            <p className="add-location__selected-tags">
              Selected: {form.nearby.join(', ')}
            </p>
          )}
        </div>

        <div className="add-location__nav">
          <button
            className="add-location__nav-btn secondary"
            type="button"
            onClick={() => navigate('/manage')}
          >
            Cancel
          </button>
          <button
            className={`add-location__nav-btn primary${submitState === 'success' ? ' done' : ''}`}
            type="submit"
            disabled={!canSubmit || submitState === 'loading' || submitState === 'success'}
          >
            {submitState === 'loading' && 'Saving…'}
            {submitState === 'success' && 'Saved!'}
            {submitState === 'error' && 'Try Again'}
            {submitState === 'idle' && 'Save to Firebase'}
          </button>
        </div>

        {submitState === 'error' && (
          <p className="add-location__error" style={{ textAlign: 'center', marginTop: '1rem' }}>{submitError}</p>
        )}
        {submitState === 'success' && (
          <p className="add-location__success" style={{ textAlign: 'center', marginTop: '1rem' }}>
            Neighborhood saved to Firestore under the <code>neighborhoods</code> collection.
          </p>
        )}
      </form>
    </div>
  );
}
