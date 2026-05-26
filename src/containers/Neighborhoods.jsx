import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import locations from '../data/locations';
import neighborhoodBlurbs from '../data/neighborhoods';

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Neighborhoods = () => {
  const [query, setQuery] = useState('');

  const neighborhoods = useMemo(() => {
    if (!Array.isArray(locations)) return [];

    return [...new Set(
      locations
        .map(loc => loc.neighborhood)
        .filter(n => typeof n === 'string')
    )].sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    return neighborhoods.filter(name =>
      name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, neighborhoods]);

  return (
    <div className="neighborhood-list">
      <h2>Neighborhoods <span>({filtered.length}/{neighborhoods.length})</span></h2>
      <input
        type="text"
        placeholder="Search neighborhoods..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="neighborhood-search"
      />

      <ul className='neighborhoods'>
        {filtered.map((name, index) => {
          const match = neighborhoodBlurbs.find(b => b.name === name);
          const Icon = match?.icon;

          return (
            <li className='neighborhood' key={index}>
              <Link
                to={`/neighborhoods/${slugify(name)}`}
                style={match?.img ? { backgroundImage: `url(${match.img})` } : undefined}
              >
                <div className="neighborhood__overlay">
                  {Icon && <Icon />}
                  <span>{name}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Neighborhoods;