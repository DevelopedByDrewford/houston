import React, { useEffect, useState } from 'react';

import Highlight from '../components/Highlight';
import Weather from '../components/Weather';
import Leaflet from "../map/Leaflet";
import locations from "../data/locations";

const Home = ({lat, setLat, lon, setLon, zoom, setZoom}) => {
  const totalLocations = Object.keys(locations).length;

  return (
    <div className='container home'>
      <div className='home__hero'>
        <img
          className='home__header-img'
          src='https://i.imgur.com/hrgsIPz.png'
          alt='Houston skyline' />
        <div className='home__header'>
          <h1>Houston Spots</h1>
          <p>{totalLocations} curated spots around town</p>
        </div>
      </div>


      <div className='home__widgets-box'>
        <Weather />
        <Highlight setLat={setLat} setLon={setLon} setZoom={setZoom}/>
      </div>

      <Leaflet lat={lat} lon={lon} zoom={zoom} setZoom={setZoom}/>
    </div>
  );
};

export default Home;
