import { useState, useRef, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// App
import Navigation from './app/Navigation';
import Footer from './app/Footer';

// Containers
import Home from './containers/Home'
import LocationPage from './containers/LocationPage';
import Neighborhoods from './containers/Neighborhoods';
import NeighborhoodPage from './containers/NeighborhoodPage';
import NotFound from './containers/NotFound';
import Restaurants from './containers/Restaurants';
import Activities from './containers/Activities';
import Resources from './containers/Resources';
import AddLocation from './containers/AddLocation';
import ManageLocations from './containers/ManageLocations';
import SeedLocations from './containers/SeedLocations';
import TestContainer from './containers/TestContainer';

// Context
import { LocationsProvider } from './contexts/LocationsContext';

// Utilities
import ScrollToTopReroute from './utils/ScrollToTopReroute';
import ScrollToTopButton from './utils/ScrollToTopButton';

// Global search
import GlobalSearch from './components/GlobalSearch';

function App() {
  const [lat, setLat] = useState(29.7604);
  const [lon, setLon] = useState(-95.3698);
  const [zoom, setZoom] = useState(13);
  const scrollRef = useRef();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <LocationsProvider>
      <Router>
        <div className='app-router-wrapper'>
          <div className='app-router-wrapper__inner' ref={scrollRef}>

            <ScrollToTopReroute />
            <ScrollToTopButton targetRef={scrollRef} />

            <Navigation
              setLat={setLat}
              setLon={setLon}
              setZoom={setZoom}
              onSearchOpen={() => setSearchOpen(true)} />
            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/location/:slug"
                element={<LocationPage
                  setLat={setLat}
                  setLon={setLon}
                  setZoom={setZoom} />}/>
              <Route
                path='/eats'
                element={
                  <Restaurants
                    setLat={setLat}
                    setLon={setLon}
                    setZoom={setZoom}
                  />
                }
              />
              <Route
                path='/activities'
                element={
                  <Activities
                    setLat={setLat}
                    setLon={setLon}
                    setZoom={setZoom}
                  />
                }
              />
              <Route
                path="/atlas"
                element={<Neighborhoods />} />
              <Route
                path="/atlas/:slug"
                element={
                  <NeighborhoodPage
                    setLat={setLat}
                    setLon={setLon}
                    setZoom={setZoom}/>} />
              <Route
                path="/community"
                element={<Resources />} />

              <Route
                path='/test'
                element={<TestContainer />} />

              <Route
                path='/add-location'
                element={<AddLocation />} />

              <Route
                path='/manage-locations'
                element={<ManageLocations />} />

              <Route
                path='/seed'
                element={<SeedLocations />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </Router>
    </LocationsProvider>
  );
}

export default App;
