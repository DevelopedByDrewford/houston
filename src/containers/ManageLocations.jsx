import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useLocations } from '../contexts/LocationsContext';
import '../styles/containers/add-location.css';
import '../styles/containers/manage-locations.css';

const NEIGHBORHOODS = [
  'Acres Home','Airline','Astrodome Area','Atascocita','Bellaire','Blalock Market',
  'Central Northwest','Chinatown','Cinco Ranch','CityCentre','Cypress','Deerbrook',
  'Downtown','EaDo','East Aldine','Eastwood','Energy Corridor','Fourth Ward','Galleria',
  'Greater Fifth Ward','Greenspoint','Greenway','Gulfgate','Heights','Houston Gardens',
  'Humble','Hyde Park','Independence Heights','Jersey Village','Katy','Kemah',
  'Little York','Memorial Park','Mid West','Midtown','Montrose','Museum District',
  'Northside','Northwest Houston','Oak Forest','Rice Village','River Oaks','Rosenberg',
  'Second Ward','South Central','South Side','Southeast Houston','Spring','Stafford',
  'Sugar Land','Summerwood','The Woodlands','Todd Mission','Tomball','University Place',
  'Uptown','Washington','Webster','West University Place','Westside','Willowbrook',
];

const CATEGORIES = [
  { value: 'food', label: 'Food & Restaurants' },
  { value: 'bar', label: 'Bars & Lounges' },
  { value: 'attraction', label: 'Attraction' },
  { value: 'books', label: 'Books & Libraries' },
  { value: 'coffee', label: 'Coffee / Tea / Boba' },
  { value: 'daiquiris', label: 'Daiquiris' },
  { value: 'market', label: 'Markets' },
  { value: 'movies', label: 'Movie Theaters' },
  { value: 'museum', label: 'Museums' },
  { value: 'music', label: 'Music Venues' },
  { value: 'park', label: 'Parks' },
  { value: 'photo', label: 'Photo Opportunities' },
];

const FOOD_SUBCATEGORIES = [
  'bakery','bbq','breakfast','burritos','burgers','chicken','crawfish','dessert',
  'dumplings','hall','hotdogs','pasta','pho','pizza','poke','ramen','ricebowl',
  'salads','sandwiches','seafood','soup','steak','sushi','tacos','upscale',
];

const ACTIVITY_SUBCATEGORIES = [
  'attraction','bar','baseball','basketball','books','coffee','comedy','daiquiris',
  'football','gokart','golf','market','movies','museum','music','park','photo',
  'rodeo','soccer','volleyball','zoo',
];

const BADGES = [
  'michelin rated','black owned','open late','NFC mobile payments','drive thru',
  'outdoor seating','vegetarian options','alcohol available','hookah','live music',
  'DJ','cash only','photogenic','cash only',
];
const UNIQUE_BADGES = [...new Set(BADGES)];

const STEPS = ['Basic Info', 'Media & Description', 'Subcategories', 'Badges', 'Coordinates', 'Preview'];

function locationToForm(loc) {
  const badgesRaw = loc.badges || [];
  const hasPaidParking = badgesRaw.includes('paid parking');
  return {
    name: loc.name || '',
    category: loc.category || 'food',
    neighborhood: loc.neighborhood || '',
    website: loc.website || '',
    img: loc.img || '',
    blurb: loc.blurb || '',
    bullet1: (loc.description && loc.description[0]) || '',
    bullet2: (loc.description && loc.description[1]) || '',
    bullet3: (loc.description && loc.description[2]) || '',
    subcategory: loc.subcategory || [],
    badges: badgesRaw.filter(b => b !== 'paid parking'),
    parking: hasPaidParking,
    lat: loc.coordinates ? String(loc.coordinates[0]) : '',
    lng: loc.coordinates ? String(loc.coordinates[1]) : '',
  };
}

export default function ManageLocations() {
  const navigate = useNavigate();
  const { locations, loading: locsLoading } = useLocations();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(null);
  const [copied, setCopied] = useState(false);
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch {
      setLoginError('Invalid email or password.');
    } finally {
      setLoginLoading(false);
    }
  }

  function selectLocation(loc) {
    setSelectedLocation(loc);
    setForm(locationToForm(loc));
    setStep(0);
    setSubmitState('idle');
    setSubmitError('');
  }

  function clearSelection() {
    setSelectedLocation(null);
    setForm(null);
    setStep(0);
    setSubmitState('idle');
    setSubmitError('');
  }

  const filteredLocations = [...locations]
    .filter(loc => {
      const q = search.toLowerCase();
      return (
        loc.name?.toLowerCase().includes(q) ||
        loc.neighborhood?.toLowerCase().includes(q) ||
        loc.category?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const isFood = form?.category === 'food';
  const subcategoryOptions = isFood ? FOOD_SUBCATEGORIES : ACTIVITY_SUBCATEGORIES;

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleArrayItem(field, value) {
    setForm(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  }

  function buildLocationObject() {
    const badges = form.parking ? [...form.badges, 'paid parking'] : form.badges;
    return {
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      badges: badges.length ? badges : [],
      coordinates: [parseFloat(form.lat), parseFloat(form.lng)],
      neighborhood: form.neighborhood,
      img: form.img,
      website: form.website,
      blurb: form.blurb,
      description: [form.bullet1, form.bullet2, form.bullet3].filter(Boolean),
    };
  }

  function formatOutput() {
    const obj = buildLocationObject();
    const lines = [];
    lines.push('    {');
    lines.push(`        name: '${obj.name}',`);
    lines.push(`        category: '${obj.category}',`);
    lines.push(`        subcategory: [${obj.subcategory.map(s => `'${s}'`).join(', ')}],`);
    if (obj.badges && obj.badges.length) {
      lines.push(`        badges: [${obj.badges.map(b => `'${b}'`).join(', ')}],`);
    }
    lines.push(`        coordinates: [${obj.coordinates[0]}, ${obj.coordinates[1]}],`);
    lines.push(`        neighborhood: '${obj.neighborhood}',`);
    lines.push(`        img: '${obj.img}',`);
    lines.push(`        website: '${obj.website}',`);
    lines.push(`        blurb: '${obj.blurb}',`);
    lines.push(`        description: [${obj.description.map(d => `'${d}'`).join(', ')}]`);
    lines.push('    },');
    return lines.join('\n');
  }

  function handleCopy() {
    navigator.clipboard.writeText(formatOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleUpdate() {
    setSubmitState('loading');
    setSubmitError('');
    try {
      const obj = buildLocationObject();
      await updateDoc(doc(db, 'locations', selectedLocation.id), obj);
      setSubmitState('success');
    } catch (err) {
      setSubmitError(err.message);
      setSubmitState('error');
    }
  }

  function canAdvance() {
    if (step === 0) return form.name.trim() && form.neighborhood && form.category;
    if (step === 1) return form.img.trim() && form.blurb.trim() && form.bullet1.trim();
    if (step === 4) return form.lat && form.lng;
    return true;
  }

  const signOutBtn = (
    <button
      onClick={() => signOut(auth)}
      style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
    >
      Sign out
    </button>
  );

  if (authLoading) {
    return <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Avenir Next Condensed, sans-serif', fontSize: '1.2rem' }}>Loading...</p>;
  }

  if (!user) {
    return (
      <div className="add-location">
        <div className="add-location__header">
          <h1>Manage Locations</h1>
          <p>Sign in to continue.</p>
        </div>
        <form className="add-location__login" onSubmit={handleLogin}>
          <label className="add-location__label">
            Email
            <input className="add-location__input" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required autoFocus />
          </label>
          <label className="add-location__label">
            Password
            <input className="add-location__input" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
          </label>
          {loginError && <p className="add-location__error">{loginError}</p>}
          <button className="add-location__nav-btn primary" type="submit" disabled={loginLoading}>
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  if (selectedLocation && form) {
    return (
      <div className="add-location">
        <div className="add-location__header">
          <h1>Edit Location</h1>
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

        <div className="add-location__stepper">
          {STEPS.map((label, i) => (
            <button
              key={label}
              className={`add-location__step-btn${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
              onClick={() => setStep(i)}
            >
              <span className="add-location__step-num">{i + 1}</span>
              <span className="add-location__step-label">{label}</span>
            </button>
          ))}
        </div>

        <div className="add-location__body">

          {step === 0 && (
            <div className="add-location__section">
              <h2>Basic Info</h2>
              <label className="add-location__label">
                Name
                <input className="add-location__input" type="text" value={form.name} onChange={e => setField('name', e.target.value)} />
              </label>
              <label className="add-location__label">
                Category
                <select className="add-location__select" value={form.category} onChange={e => { setField('category', e.target.value); setField('subcategory', []); }}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </label>
              <label className="add-location__label">
                Neighborhood
                <select className="add-location__select" value={form.neighborhood} onChange={e => setField('neighborhood', e.target.value)}>
                  <option value="">— Select a neighborhood —</option>
                  {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label className="add-location__label">
                Website URL
                <input className="add-location__input" type="url" placeholder="https://..." value={form.website} onChange={e => setField('website', e.target.value)} />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="add-location__section">
              <h2>Media &amp; Description</h2>
              <label className="add-location__label">
                Image URL
                <input className="add-location__input" type="url" placeholder="https://i.imgur.com/..." value={form.img} onChange={e => setField('img', e.target.value)} />
              </label>
              {form.img && (
                <div className="add-location__img-preview">
                  <img src={form.img} alt="preview" onError={e => e.target.style.display='none'} />
                </div>
              )}
              <label className="add-location__label">
                Blurb <span className="add-location__hint">(1–2 sentences shown on the card)</span>
                <textarea className="add-location__textarea" rows={3} value={form.blurb} onChange={e => setField('blurb', e.target.value)} />
              </label>
              <p className="add-location__sublabel">Highlight Bullet Points <span className="add-location__hint">(up to 3)</span></p>
              <input className="add-location__input" type="text" placeholder="Bullet 1" value={form.bullet1} onChange={e => setField('bullet1', e.target.value)} />
              <input className="add-location__input" type="text" placeholder="Bullet 2" value={form.bullet2} onChange={e => setField('bullet2', e.target.value)} />
              <input className="add-location__input" type="text" placeholder="Bullet 3" value={form.bullet3} onChange={e => setField('bullet3', e.target.value)} />
            </div>
          )}

          {step === 2 && (
            <div className="add-location__section">
              <h2>Subcategories</h2>
              <p className="add-location__hint">Select all that apply for filtering.</p>
              <div className="add-location__checkbox-grid">
                {subcategoryOptions.map(opt => (
                  <label key={opt} className="add-location__checkbox-item">
                    <input type="checkbox" checked={form.subcategory.includes(opt)} onChange={() => toggleArrayItem('subcategory', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {form.subcategory.length > 0 && (
                <p className="add-location__selected-tags">Selected: {form.subcategory.join(', ')}</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="add-location__section">
              <h2>Badges &amp; Attributes</h2>
              <div className="add-location__toggle-row">
                <span className="add-location__toggle-label">Parking Available</span>
                <button className={`add-location__toggle${form.parking ? ' on' : ''}`} onClick={() => setField('parking', !form.parking)} type="button">
                  <span className="add-location__toggle-thumb" />
                </button>
                <span className="add-location__toggle-state">{form.parking ? 'Paid Parking' : 'No / Free'}</span>
              </div>
              <p className="add-location__sublabel" style={{ marginTop: '1.5rem' }}>Select all badges that apply:</p>
              <div className="add-location__checkbox-grid">
                {UNIQUE_BADGES.map(badge => (
                  <label key={badge} className="add-location__checkbox-item">
                    <input type="checkbox" checked={form.badges.includes(badge)} onChange={() => toggleArrayItem('badges', badge)} />
                    <span>{badge}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="add-location__section">
              <h2>Coordinates</h2>
              <p className="add-location__hint">
                Find coordinates by right-clicking a location on Google Maps. Houston is roughly <strong>29.76°N, -95.37°W</strong>.
              </p>
              <div className="add-location__coord-row">
                <label className="add-location__label">
                  Latitude
                  <input className="add-location__input" type="number" step="any" placeholder="29.7604" value={form.lat} onChange={e => setField('lat', e.target.value)} />
                </label>
                <label className="add-location__label">
                  Longitude
                  <input className="add-location__input" type="number" step="any" placeholder="-95.3698" value={form.lng} onChange={e => setField('lng', e.target.value)} />
                </label>
              </div>
              {form.lat && form.lng && (
                <p className="add-location__selected-tags">[{form.lat}, {form.lng}]</p>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="add-location__section">
              <h2>Preview &amp; Save Changes</h2>
              <p className="add-location__hint">Review your changes, then save to Firebase.</p>
              <pre className="add-location__preview">{formatOutput()}</pre>
              <div className="add-location__action-row">
                <button className={`add-location__copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button
                  className={`add-location__submit-btn${submitState === 'success' ? ' success' : ''}`}
                  onClick={handleUpdate}
                  disabled={submitState === 'loading' || submitState === 'success'}
                >
                  {submitState === 'loading' && 'Saving…'}
                  {submitState === 'success' && 'Updated!'}
                  {submitState === 'error' && 'Try Again'}
                  {submitState === 'idle' && 'Update in Firebase'}
                </button>
              </div>
              {submitState === 'error' && <p className="add-location__error">{submitError}</p>}
              {submitState === 'success' && (
                <p className="add-location__success">Location updated in Firestore.</p>
              )}
              <div className="add-location__summary">
                <h3>Summary</h3>
                <ul>
                  <li><strong>Name:</strong> {form.name || '—'}</li>
                  <li><strong>Category:</strong> {form.category}</li>
                  <li><strong>Neighborhood:</strong> {form.neighborhood || '—'}</li>
                  <li><strong>Subcategories:</strong> {form.subcategory.join(', ') || '—'}</li>
                  <li><strong>Badges:</strong> {[...(form.parking ? ['paid parking'] : []), ...form.badges].join(', ') || '—'}</li>
                  <li><strong>Coordinates:</strong> {form.lat && form.lng ? `[${form.lat}, ${form.lng}]` : '—'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="add-location__nav">
          <button className="add-location__nav-btn secondary" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</button>
          {step < STEPS.length - 1 && (
            <button className="add-location__nav-btn primary" onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}>Next</button>
          )}
          {step === STEPS.length - 1 && (
            <button className="add-location__nav-btn reset" onClick={clearSelection}>Back to List</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="manage-locations">
      <div className="add-location__header">
        <h1>Manage Locations</h1>
        <p>Signed in as {user.email}&nbsp;·&nbsp;{signOutBtn}</p>
      </div>

      <div className="manage-locations__toolbar">
        <input
          className="manage-locations__search"
          type="text"
          placeholder="Search by name, neighborhood, or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="manage-locations__add-btn" onClick={() => navigate('/add-location')}>
          + Add Location
        </button>
      </div>

      <div className="manage-locations__list">
        {locsLoading ? (
          <p className="manage-locations__empty">Loading locations…</p>
        ) : filteredLocations.length === 0 ? (
          <p className="manage-locations__empty">No locations found.</p>
        ) : (
          filteredLocations.map(loc => (
            <button key={loc.id} className="manage-locations__row" onClick={() => selectLocation(loc)}>
              <span className="manage-locations__row-name">{loc.name}</span>
              <span className="manage-locations__row-meta">{loc.category}&nbsp;·&nbsp;{loc.neighborhood}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
