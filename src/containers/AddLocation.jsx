import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import '../styles/containers/add-location.css';

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
  'DJ','cash only','photogenic','dog friendly',
];
const UNIQUE_BADGES = [...new Set(BADGES)];

const STEPS = ['Basic Info', 'Media & Description', 'Subcategories', 'Badges', 'Coordinates', 'Preview'];

const defaultForm = {
  name: '',
  category: 'food',
  neighborhood: '',
  website: '',
  img: '',
  blurb: '',
  bullet1: '',
  bullet2: '',
  bullet3: '',
  subcategory: [],
  badges: [],
  parking: false,
  lat: '',
  lng: '',
};

export default function AddLocation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [copied, setCopied] = useState(false);
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) navigate('/manage');
    });
  }, [navigate]);

  const isFood = form.category === 'food';
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
    const badges = form.parking
      ? [...form.badges, 'paid parking']
      : form.badges;

    const obj = {
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      badges: badges.length ? badges : undefined,
      coordinates: [parseFloat(form.lat), parseFloat(form.lng)],
      neighborhood: form.neighborhood,
      img: form.img,
      website: form.website,
      blurb: form.blurb,
      description: [form.bullet1, form.bullet2, form.bullet3].filter(Boolean),
    };

    if (!obj.badges) delete obj.badges;
    return obj;
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

  async function handleSubmit() {
    setSubmitState('loading');
    setSubmitError('');
    try {
      const obj = buildLocationObject();
      await addDoc(collection(db, 'locations'), obj);
      setSubmitState('success');
      setTimeout(() => window.location.reload(), 1500);
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

  if (authLoading || !user) {
    return <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Avenir Next Condensed, sans-serif', fontSize: '1.2rem' }}>Loading...</p>;
  }

  return (
    <div className="add-location">
      <div className="add-location__header">
        <h1>Add a Location</h1>
        <p>
          <button
            onClick={() => navigate('/manage')}
            style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
          >
            ← Manage
          </button>
          &nbsp;·&nbsp;Signed in as {user.email}&nbsp;·&nbsp;
          <button
            onClick={() => signOut(auth)}
            style={{ background: 'none', border: 'none', color: '#E57200', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
          >
            Sign out
          </button>
        </p>
      </div>

      {/* Stepper */}
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

        {/* Step 0 — Basic Info */}
        {step === 0 && (
          <div className="add-location__section">
            <h2>Basic Info</h2>

            <label className="add-location__label">
              Name
              <input
                className="add-location__input"
                type="text"
                placeholder="e.g. Breakfast Klub"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
              />
            </label>

            <label className="add-location__label">
              Category
              <select
                className="add-location__select"
                value={form.category}
                onChange={e => {
                  setField('category', e.target.value);
                  setField('subcategory', []);
                }}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>

            <label className="add-location__label">
              Neighborhood
              <select
                className="add-location__select"
                value={form.neighborhood}
                onChange={e => setField('neighborhood', e.target.value)}
              >
                <option value="">— Select a neighborhood —</option>
                {NEIGHBORHOODS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>

            <label className="add-location__label">
              Website URL
              <input
                className="add-location__input"
                type="url"
                placeholder="https://..."
                value={form.website}
                onChange={e => setField('website', e.target.value)}
              />
            </label>
          </div>
        )}

        {/* Step 1 — Media & Description */}
        {step === 1 && (
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
              />
            </label>

            {form.img && (
              <div className="add-location__img-preview">
                <img src={form.img} alt="preview" onError={e => e.target.style.display='none'} />
              </div>
            )}

            <label className="add-location__label">
              Blurb <span className="add-location__hint">(1–2 sentences shown on the card)</span>
              <textarea
                className="add-location__textarea"
                placeholder="Short description of the location..."
                rows={3}
                value={form.blurb}
                onChange={e => setField('blurb', e.target.value)}
              />
            </label>

            <p className="add-location__sublabel">Highlight Bullet Points <span className="add-location__hint">(up to 3, shown on the location page)</span></p>
            <input
              className="add-location__input"
              type="text"
              placeholder="Bullet 1"
              value={form.bullet1}
              onChange={e => setField('bullet1', e.target.value)}
            />
            <input
              className="add-location__input"
              type="text"
              placeholder="Bullet 2"
              value={form.bullet2}
              onChange={e => setField('bullet2', e.target.value)}
            />
            <input
              className="add-location__input"
              type="text"
              placeholder="Bullet 3"
              value={form.bullet3}
              onChange={e => setField('bullet3', e.target.value)}
            />
          </div>
        )}

        {/* Step 2 — Subcategories */}
        {step === 2 && (
          <div className="add-location__section">
            <h2>Subcategories</h2>
            <p className="add-location__hint">Select all that apply for filtering.</p>
            <div className="add-location__checkbox-grid">
              {subcategoryOptions.map(opt => (
                <label key={opt} className="add-location__checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.subcategory.includes(opt)}
                    onChange={() => toggleArrayItem('subcategory', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {form.subcategory.length > 0 && (
              <p className="add-location__selected-tags">
                Selected: {form.subcategory.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Step 3 — Badges */}
        {step === 3 && (
          <div className="add-location__section">
            <h2>Badges &amp; Attributes</h2>

            <div className="add-location__toggle-row">
              <span className="add-location__toggle-label">Parking Available</span>
              <button
                className={`add-location__toggle${form.parking ? ' on' : ''}`}
                onClick={() => setField('parking', !form.parking)}
                type="button"
              >
                <span className="add-location__toggle-thumb" />
              </button>
              <span className="add-location__toggle-state">{form.parking ? 'Paid Parking' : 'No / Free'}</span>
            </div>

            <p className="add-location__sublabel" style={{ marginTop: '1.5rem' }}>
              Select all badges that apply:
            </p>
            <div className="add-location__checkbox-grid">
              {UNIQUE_BADGES.map(badge => (
                <label key={badge} className="add-location__checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.badges.includes(badge)}
                    onChange={() => toggleArrayItem('badges', badge)}
                  />
                  <span>{badge}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Coordinates */}
        {step === 4 && (
          <div className="add-location__section">
            <h2>Coordinates</h2>
            <p className="add-location__hint">
              Find coordinates by right-clicking a location on Google Maps and selecting the first option (lat, lng).
              Houston is roughly <strong>29.76°N, -95.37°W</strong>.
            </p>

            <div className="add-location__coord-row">
              <label className="add-location__label">
                Latitude
                <input
                  className="add-location__input"
                  type="number"
                  step="any"
                  placeholder="29.7604"
                  value={form.lat}
                  onChange={e => setField('lat', e.target.value)}
                />
              </label>
              <label className="add-location__label">
                Longitude
                <input
                  className="add-location__input"
                  type="number"
                  step="any"
                  placeholder="-95.3698"
                  value={form.lng}
                  onChange={e => setField('lng', e.target.value)}
                />
              </label>
            </div>

            {form.lat && form.lng && (
              <p className="add-location__selected-tags">
                [{form.lat}, {form.lng}]
              </p>
            )}
          </div>
        )}

        {/* Step 5 — Preview */}
        {step === 5 && (
          <div className="add-location__section">
            <h2>Preview</h2>
            <p className="add-location__hint">
              Copy this entry and paste it into <code>src/data/locations.js</code>.
            </p>

            <pre className="add-location__preview">{formatOutput()}</pre>

            <div className="add-location__action-row">
              <button
                className={`add-location__copy-btn${copied ? ' copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>

              <button
                className={`add-location__submit-btn${submitState === 'success' ? ' success' : ''}`}
                onClick={handleSubmit}
                disabled={submitState === 'loading' || submitState === 'success'}
              >
                {submitState === 'loading' && 'Saving…'}
                {submitState === 'success' && 'Saved to Firebase!'}
                {submitState === 'error' && 'Try Again'}
                {submitState === 'idle' && 'Save to Firebase'}
              </button>

            </div>

            {submitState === 'error' && (
              <p className="add-location__error">{submitError}</p>
            )}

            {submitState === 'success' && (
              <p className="add-location__success">
                Location saved to Firestore under the <code>locations</code> collection.
              </p>
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

      {/* Navigation buttons */}
      <div className="add-location__nav">
        <button
          className="add-location__nav-btn secondary"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
        >
          Back
        </button>

        {step < STEPS.length - 1 && (
          <button
            className="add-location__nav-btn primary"
            onClick={() => setStep(s => s + 1)}
            disabled={!canAdvance()}
          >
            Next
          </button>
        )}

        {step === STEPS.length - 1 && (
          <button
            className="add-location__nav-btn reset"
            onClick={() => { setForm(defaultForm); setStep(0); setSubmitState('idle'); setSubmitError(''); }}
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
}
