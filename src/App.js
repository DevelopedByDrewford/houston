import { useState, useRef } from 'react'
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

import TestContainer from './containers/TestContainer';
import AddLocation from './containers/AddLocation';

// Utilities
import ScrollToTopReroute from './utils/ScrollToTopReroute';
import ScrollToTopButton from './utils/ScrollToTopButton'; // update path as needed

function App() {
  const [lat, setLat] = useState(29.7604);
  const [lon, setLon] = useState(-95.3698);
  const [zoom, setZoom] = useState(13);
  const scrollRef = useRef();

  return (
      <Router>
        <div className='app-router-wrapper'>
          <div className='app-router-wrapper__inner' ref={scrollRef}>

          <ScrollToTopReroute />
          <ScrollToTopButton targetRef={scrollRef} />

            <Navigation 
              setLat={setLat}  
              setLon={setLon} 
              setZoom={setZoom}/>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Home 
                      lat={lat} 
                      setLat={setLat}
                      lon={lon} 
                      setLon={setLon}
                      zoom={zoom}
                      setZoom={setZoom}
                      key={lat}
                    /> 
                  } 
                />
                <Route 
                  path="/location/:slug" 
                  element={<LocationPage 
                    setLat={setLat} 
                    setLon={setLon} 
                    setZoom={setZoom} />}/>
                <Route 
                  path='/food'
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
                  path="/neighborhoods"
                  element={<Neighborhoods />} />
                <Route 
                  path="/neighborhoods/:slug" 
                  element={
                    <NeighborhoodPage 
                      setLat={setLat} 
                      setLon={setLon} 
                      setZoom={setZoom}/>} />
                <Route 
                  path="/resources" 
                  element={<Resources />} />

                <Route
                  path='/test'
                  element={<TestContainer />} />

                <Route
                  path='/add-location'
                  element={<AddLocation />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </div>
      </Router>
  );
}

export default App;