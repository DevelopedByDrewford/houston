import { useState } from "react";

import CategoryButtons from '../components/CategoryButtons';
import Filters from "../components/Filters";
import Location from "../components/Location";

import buttonData from "../data/restaurant-types";
import buildRestaurantsFiltered from "../utils/restaurants-filtered";
import { useLocations } from "../contexts/LocationsContext";

const Restaurants = ({ setLat, setLon, setZoom }) => {
  const { locations, loading } = useLocations();
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [title, setTitle] = useState(buttonData[0].title);
  const [description, setDescription] = useState(buttonData[0].description);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const restaurantsFiltered = buildRestaurantsFiltered(locations);

  const changeCategory = (e) => {
    const { value } = e.currentTarget;
    const selectedObj = buttonData.find((obj) => obj.value === value);
    if (selectedObj) {
      setSelectedCategory(value);
      setTitle(e.currentTarget.name);
      setDescription(selectedObj.description);
    }
  };

  const filterRestaurants = (restaurants) => {
    return restaurants.filter((place) => {
      return Object.entries(selectedFilters).every(([badgeName, isChecked]) => {
        if (!isChecked) return true;
        if (badgeName === "free parking") {
          return !place.badges?.includes("paid parking");
        }
        return place.badges?.includes(badgeName);
      });
    });
  };

  const searchRestaurants = (locations) => {
    const term = searchTerm.toLowerCase();
    return locations.filter((place) => {
      const name = String(place.name || "").toLowerCase();
      const blurb = String(place.blurb || "").toLowerCase();
      const description = Array.isArray(place.description)
        ? place.description.join(" ").toLowerCase()
        : String(place.description || "").toLowerCase();

      return (
        name.includes(term) ||
        blurb.includes(term) ||
        description.includes(term)
      );
    });
  };

  const categoryRestaurants = restaurantsFiltered[selectedCategory] || [];
  const filteredRestaurants = filterRestaurants(categoryRestaurants);
  const searchedRestaurants = searchRestaurants(locations);
  const pageRestaurants = modalOpen ? searchedRestaurants : filteredRestaurants;

  let pageLength = pageRestaurants.length;

  return (
    <div className='restaurant-listing'>
      <h2 className='listing__header listing__header--food'>
        <span>HouStOn EaTs</span>
      </h2>

      {loading && <p style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Avenir Next Condensed, sans-serif', fontSize: '1.2rem' }}>Loading...</p>}

      {!loading && !modalOpen && (
        <div className="listing__search-bar">
          <input
            type="text"
            placeholder="Search All"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!modalOpen && e.target.value.trim() !== "") {
                setModalOpen(true);
              }
            }}
          />
        </div>
      )}

      {!loading && !modalOpen && (
        <>
          <CategoryButtons
            buttonData={buttonData}
            changeCategory={changeCategory}/>

          <Filters
            list={restaurantsFiltered}
            selectedCategory={selectedCategory}
            onFilterChange={setSelectedFilters}
          />

          <div className='category__header'>
            <div className='category__header--title'>{title} ({pageLength})</div>
            <div className='category__header--description'>{description}</div>
          </div>

          <div className="location__container">
            {pageRestaurants.map((item, key) => (
              <Location
                key={key}
                item={item}
                setLat={setLat}
                setLon={setLon}
                setZoom={setZoom}
              />
            ))}
          </div>
        </>
      )}

      {!loading && modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={e => e.stopPropagation()}>

            <div className="listing__search-bar" style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Search All"
                value={searchTerm}
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="modal-close" onClick={() => {
              setSearchTerm("");
              setModalOpen(false);
            }}>
              &times;
            </button>

            <h3 className='search-results-found'>Search Results ({pageLength})</h3>
            <div className="location__container">
              {pageRestaurants.length > 0 ? (
                pageRestaurants.map((item, key) => (
                  <Location
                    key={key}
                    item={item}
                    setLat={setLat}
                    setLon={setLon}
                    setZoom={setZoom}
                  />
                ))
              ) : (
                <p className='no-results-found'>
                  <img src='https://i.imgur.com/N9iaEmW.png' alt='No Results'/>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
