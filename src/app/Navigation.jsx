import { Link, NavLink } from "react-router-dom";

const Navigation = ({ setLat, setLon, setZoom }) => {
  const resetCoordinates = () => {
    setLat(29.7604);
    setLon(-95.3698);
    setZoom(11);
  };

  const handleReset = () => {
    if (mapRef?.current) {
      mapRef.current.setView([29.7604, -95.3698], 11);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClick = (shouldResetCoordinates = false) => () => {
    scrollToTop();
    if (shouldResetCoordinates) {
      resetCoordinates();
      handleReset();
    }
  };

  return (
    <nav className="navigation">
      <Link to="/" className="navigation__brand" onClick={handleClick(true)}>
        <img src="https://i.imgur.com/5Vui63v.png" className="navigation__rocket" alt="" />
        <span className="navigation__wordmark">Houston</span>
      </Link>
      <div className="navigation__links">
        <NavLink to="/" onClick={handleClick(true)} end>Map</NavLink>
        <NavLink to="/food" onClick={handleClick()}>Food</NavLink>
        <NavLink to="/activities" onClick={handleClick()}>Activities</NavLink>
        <NavLink to="/neighborhoods">Hoods</NavLink>
        <NavLink to="/resources">Resources</NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
