import { Link } from "react-router-dom";

const Navigation = ({ setLat, setLon, setZoom }) => {
  // Reset Map Coordinates to Houston center
  const resetCoordinates = () => {
    setLat(29.7604);
    setLon(-95.3698);
    setZoom(11);
  };

  // Reset map without useState (if already on Map component)
  const handleReset = () => {
    if (mapRef?.current) {
      mapRef.current.setView([29.7604, -95.3698], 11);
    } else {
      console.warn("Map is not ready yet.");
    }
  };

  // Scroll to top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Combines scroll + optional coordinate reset
  const handleClick = (shouldResetCoordinates = false) => () => {
    scrollToTop();
    if (shouldResetCoordinates) {
      resetCoordinates();
      handleReset();
    }
  };

  return (
    <div className="navigation">
      <Link to="/" onClick={handleClick(true)}>Map</Link>
      <Link to="/food" onClick={handleClick()}>Food</Link>
      <Link to="/activities" onClick={handleClick()}>Activities</Link>
      <Link to="/neighborhoods">Hoods</Link>
      <Link to='/resources'>Resources</Link>
      {/* <Link to="/about" onClick={handleClick()}>About</Link> */}
    </div>
  );
};

export default Navigation;
