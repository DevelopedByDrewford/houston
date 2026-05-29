import { Link, useParams } from 'react-router-dom';

import Location from '../components/Location';
import neighborhoodBlurbs from '../data/neighborhoods';
import { useLocations } from '../contexts/LocationsContext';

const slugify = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const NeighborhoodPage = ({ setLat, setLon, setZoom }) => {
  const { slug } = useParams();
  const { locations, loading } = useLocations();

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Avenir Next Condensed, sans-serif', fontSize: '1.2rem' }}>Loading...</p>;
  }

  const matched = locations.find(
    (loc) => slugify(loc.neighborhood) === slug
  );

  if (!matched) return <div>Neighborhood not found.</div>;

  const allInNeighborhood = locations
    .filter((loc) => loc.neighborhood === matched.neighborhood)
    .sort((a, b) => a.name.localeCompare(b.name));

  const blurbObj = neighborhoodBlurbs.find(
    (item) => item.name === matched.neighborhood
  );

  if (!blurbObj) {
    console.log(matched.neighborhood, 'not found in blurbs data page');
  }

  return (
    <div className='neighborhood-details-page'>
      <div
        className='neighborhood-details--bg'
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(${blurbObj.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='neighborhood-details--header'>
          <h2 className='neighborhood-details__title'>
            {matched.neighborhood}&nbsp;
            {allInNeighborhood.length > 0 && (
              <span>{allInNeighborhood.length}</span>
            )}
          </h2>
        </div>

        <p className='neighborhood-details__blurb'>
          {blurbObj?.blurb?.length && blurbObj.blurb}
        </p>

        {blurbObj?.nearby?.length > 0 && (
          <div className='nearby-container'>
            <div className='neighborhoods__nearby--title'>
              Nearby Neighborhoods
            </div>
            <ul className='neighborhoods neighborhoods__nearby'>
              {blurbObj.nearby.map((item, key) => {
                const slug = item.toLowerCase().replace(/\s+/g, '-');
                const nearbyBlurb = neighborhoodBlurbs.find(
                  (n) => n.name === item
                );
                const Icon = nearbyBlurb?.icon;

                return (
                  <li className='neighborhood' key={key}>
                    <Link
                      to={`/atlas/${slug}`}
                      style={nearbyBlurb?.img ? { backgroundImage: `url(${nearbyBlurb.img})` } : undefined}
                    >
                      <div className="neighborhood__overlay">
                        {Icon && <Icon />}
                        <span>{item}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className='location__container'>
        {allInNeighborhood.map((item, key) => (
          <Location
            key={key}
            item={item}
            setLat={setLat}
            setLon={setLon}
            setZoom={setZoom}
          />
        ))}
      </div>
    </div>
  );
};

export default NeighborhoodPage;
