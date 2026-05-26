import React from 'react';

import Highlight from '../components/Highlight';
import Weather from '../components/Weather';
import Leaflet from "../map/Leaflet";
import { useLocations } from '../contexts/LocationsContext';

const Home = ({lat, setLat, lon, setLon, zoom, setZoom}) => {
  const { locations, loading } = useLocations();
  const totalLocations = locations.length;

  return (
    <div className='container home'>
      <div className='home__hero'>
        <img
          className='home__header-img'
          src='https://i.imgur.com/hrgsIPz.png'
          alt='Houston skyline' />
        <div className='home__header'>
          <h1>Houston Spots</h1>
          <p>{loading ? '—' : totalLocations} curated spots around town</p>
        </div>
      </div>

      <div className='home__widgets-box'>
        <Weather />
        <Highlight setLat={setLat} setLon={setLon} setZoom={setZoom}/>
      </div>

      {!loading && (
        <Leaflet
          lat={lat}
          lon={lon}
          zoom={zoom}
          setZoom={setZoom}
          locations={locations}
        />
      )}
    </div>
  );
};

export default Home;
