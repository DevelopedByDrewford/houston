import { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.pinsearch';
import 'leaflet-providers'; 

import icons from '../data/icons';
import generateLocationSlug from '../utils/slug.js';

const Leaflet = ({ lat, lon, zoom, setZoom, locations }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const getIconUrl = (location) => {
    if (location.category === 'bar') return icons.bar;
    if (location.category === 'books') return icons.books;
    if (location.category === 'coffee') return icons.coffee;
    if (location.category === 'daiquiris') return icons.daiquiris;
    if (location.category === 'market') return icons.market;
    if (location.category === 'movies') return icons.movies;
    if (location.category == 'museum') return icons.museums;
    if (location.category === 'music') return icons.music;
    if (location.category === 'park') return icons.parks;
    if (location.category === 'photo') return icons.photo;

    const sub = location.subcategory?.[0];
    if (sub === 'soccer') return icons.soccer;
    if (sub === 'baseball') return icons.baseball;
    if (sub === 'kemah') return icons.kemah;
    if (sub === 'gokart') return icons.gokart;
    if (sub === 'meow') return icons.meow;
    if (sub === 'basketball') return icons.basketball;
    if (sub === 'volleyball') return icons.volleyball;
    if (sub === 'zoo') return icons.zoo;
    if (sub === 'comedy') return icons.comedy;
    if (sub === 'football') return icons.football;
    if (sub === 'faire') return icons.faire;
    if (sub === 'rodeo') return icons.rodeo;
    if (sub === 'golf') return icons.golf;
    // Restaurants
    if (sub === 'bakery') return icons.bakery;
    if (sub === 'bbq') return icons.bbq;
    if (sub === 'burgers') return icons.burgers;
    if (sub === 'breakfast') return icons.breakfast;
    if (sub === 'chicken') return icons.chicken;
    if (sub === 'dessert') return icons.dessert;
    if (sub === 'dumplings') return icons.dumplings;
    if (sub === 'hotdogs') return icons.hotdogs;
    if (sub === 'poke') return icons.poke;
    if (sub === 'pho') return icons.pho;
    if (sub === 'pizza') return icons.pizza;
    if (sub === 'ramen') return icons.ramen;
    if (sub === 'ricebowl') return icons.rice;
    if (sub === 'sandwiches') return icons.sandwiches;
    if (sub === 'seafood') return icons.seafood;
    if (sub === 'sushi') return icons.sushi;
    if (sub === 'tacos') return icons.tacos;
    if (sub === 'upscale') return icons.upscale;
    if (sub === 'hall') return icons.foodhalls;

    if (location.category === 'food') return icons.burgers;

    return icons.default || ''; // fallback
  };

  const getScaleForZoom = (zoom) => {
    if (zoom < 13) return 0.6;
    if (zoom < 15) return 0.8;
    return 1;
  };

  const createIcon = (iconUrl, scale = 1) =>
    L.icon({
      iconUrl,
      iconSize: [38 * scale, 38 * scale],
      iconAnchor: [19 * scale, 38 * scale],
      popupAnchor: [0, -38 * scale],
    });


  useEffect(() => {
    if (!document.getElementById('map')._leaflet_id) {
      const map = L.map('map', {
        center: [lat, lon],
        zoom: zoom,
        layers: [],
      });
      mapRef.current = map;

      const initialScale = getScaleForZoom(zoom);

      // Map Style Jawg.Streets
      L.tileLayer('https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=ScS5NFRBzDSrPBfMGtCkQqSmDR6U3G4n7jL7H0llqfGG0hdaELXcklA8eQqLyyGU', {
      }).addTo(map);
      
      // Create Layer Group
      const restaurants = L.layerGroup();
      const bars = L.layerGroup();
      const books = L.layerGroup();
      const coffee = L.layerGroup();
      const daiquiris = L.layerGroup();
      const markets = L.layerGroup();
      const movies = L.layerGroup();
      const museums = L.layerGroup();
      const music = L.layerGroup();
      const parks = L.layerGroup();
      const photo = L.layerGroup();
      const attractions = L.layerGroup();

      locations.forEach((location) => {
        const iconUrl = getIconUrl(location);
        const icon = createIcon(iconUrl, initialScale);

        // Marker
        const marker = L.marker([location.coordinates[0], location.coordinates[1]], {
          icon,
          title: location.name || 'Location',
        }).addTo(map);

        // Popup
        marker.bindPopup(`
          <div class='popup'>
            <img src=${location.img} width=200 /><br/>
            <div class='popup__content'>
              <span class='popup__neighborhood'>${location.neighborhood}</span>
              <span class='popup__name'>${location.name}</span>
              <span className='popup__blurb'>
                ${location.blurb?.length > 173
                  ? `${location.blurb.slice(0, 170)}...`
                  : location.blurb}
              </span>
              <br>
              <a href="/location/${generateLocationSlug(location)}">View Details</a>
            </div>
          </div>`);

        markersRef.current.push({ marker, location });

        if (location.category === 'food') restaurants.addLayer(marker);
        else if (location.category === 'bar') bars.addLayer(marker);
        else if (location.category === 'books') books.addLayer(marker);
        else if (location.category === 'coffee') coffee.addLayer(marker);
        else if (location.category === 'daiquiris') daiquiris.addLayer(marker);
        else if (location.category === 'market') markets.addLayer(marker);
        else if (location.category === 'movies') movies.addLayer(marker);
        else if (location.category === 'museum') museums.addLayer(marker);
        else if (location.category === 'music') music.addLayer(marker);
        else if (location.category === 'park') parks.addLayer(marker);
        else if (location.category === 'photo') photo.addLayer(marker);
        else if (location.category === 'attraction') attractions.addLayer(marker);
      });

      // Add layers to map
      restaurants.addTo(map);
      attractions.addTo(map);
      bars.addTo(map);
      books.addTo(map);
      coffee.addTo(map);
      daiquiris.addTo(map);
      markets.addTo(map);
      movies.addTo(map);
      museums.addTo(map);
      music.addTo(map);
      parks.addTo(map);
      photo.addTo(map);

      // Search bar
      L.control.pinSearch({
        position: 'topright',
        placeholder: 'Search...',
        buttonText: 'Search',
        onSearch: function () {
          setZoom(17);
          map.setZoom(17);
        },
        searchBarWidth: '200px',
        searchBarHeight: '30px',
        maxSearchResults: 3,
      }).addTo(map);

      // Layer control
      const layerControl = L.control.layers({}, {}).addTo(map);
      layerControl.addOverlay(restaurants, 'Restaurants');
      layerControl.addOverlay(bars, 'Bars & Lounges');
      layerControl.addOverlay(books, 'Books');
      layerControl.addOverlay(coffee, 'Coffee');
      layerControl.addOverlay(daiquiris, 'Daiquiris');
      layerControl.addOverlay(markets, 'Markets');
      layerControl.addOverlay(movies, 'Movie Theaters');
      layerControl.addOverlay(museums, 'Museums');
      layerControl.addOverlay(music, 'Music Venues');
      layerControl.addOverlay(parks, 'Parks');
      layerControl.addOverlay(photo, 'Photo Opp');
      layerControl.addOverlay(attractions, 'Attractions');

      // Zoom scaling logic
      map.on('zoomend', () => {
        const currentZoom = map.getZoom();
        const newScale = getScaleForZoom(currentZoom);

        markersRef.current.forEach(({ marker, location }) => {
          const iconUrl = getIconUrl(location);
          const newIcon = createIcon(iconUrl, newScale);
          marker.setIcon(newIcon);
        });
      });
    }
  }, [zoom, lat, lon, setZoom]);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.pinsearch/src/Leaflet.PinSearch.css"
        crossOrigin=""
      />
      <script
        src="https://unpkg.com/leaflet.pinsearch/src/Leaflet.PinSearch.js"
        crossOrigin=""
      ></script>
      <div id="map" style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
};

export default Leaflet;
