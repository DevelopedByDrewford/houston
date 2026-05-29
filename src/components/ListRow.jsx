import { Link } from 'react-router-dom';
import generateLocationSlug from '../utils/slug';

const slugifyNeighborhood = (text) =>
  (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const ListRow = ({ item, index }) => {
  const catLabel = Array.isArray(item.subcategory)
    ? item.subcategory[0]
    : (item.category || '');

  const locationSlug = generateLocationSlug(item);

  return (
    <li className="list-row">
      <span className="list-row__index">№ {String(index + 1).padStart(3, '0')}</span>

      <div className="list-row__thumb">
        {item.img && <img src={item.img} alt={item.name} />}
      </div>

      <div className="list-row__body">
        <Link
          className="list-row__name"
          to={`/location/${locationSlug}`}
        >
          {item.name}
        </Link>
        <div className="list-row__meta">
          <Link
            to={`/atlas/${slugifyNeighborhood(item.neighborhood)}`}
            className="list-row__neighborhood"
          >
            {item.neighborhood}
          </Link>
          {catLabel && (
            <>
              <span className="list-row__dot">·</span>
              <span className="list-row__category">{catLabel}</span>
            </>
          )}
        </div>
        {item.blurb && <p className="list-row__blurb">{item.blurb}</p>}
      </div>

      {item.badges && item.badges.length > 0 && (
        <div className="list-row__badges">
          {item.badges.slice(0, 2).map(b => (
            <span key={b} className="list-row__badge">{b}</span>
          ))}
        </div>
      )}
    </li>
  );
};

export default ListRow;
