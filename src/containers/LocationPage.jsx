import { useParams, Link } from 'react-router-dom';

import Location from '../components/Location.jsx';
import NotFound from './NotFound.jsx';

import generateLocationSlug from '../utils/slug.js';
import { useLocations } from '../contexts/LocationsContext';

const LocationPage = ({ setLat, setLon, setZoom }) => {
  const { slug } = useParams();
  const { locations, loading } = useLocations();

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Avenir Next Condensed, sans-serif', fontSize: '1.2rem' }}>Loading...</p>;
  }

  const location = locations.find(loc => generateLocationSlug(loc) === slug);

  if (!location) return <NotFound />;

  const renderLink = () => {
    if (location.category === 'food') {
      return <Link to="/eats" className="see-more-link">See more restaurants</Link>;
    }
    return <Link to="/activities" className="see-more-link">See more activities</Link>;
  };

  return (
    <div className="location-details-page">
      <Location
        item={location}
        setLat={setLat}
        setLon={setLon}
        setZoom={setZoom}
      />
      <div className="see-more-container">
        {renderLink()}
      </div>
    </div>
  );
};

export default LocationPage;
