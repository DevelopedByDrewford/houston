import { useState, useMemo } from "react";

import CategoryButtons from '../components/CategoryButtons';
import Filters from "../components/Filters";
import Location from "../components/Location";
import SpotCard from "../components/SpotCard";

import buttonData from "../data/restaurant-types";
import buildRestaurantsFiltered from "../utils/restaurants-filtered";
import { useLocations } from "../contexts/LocationsContext";

const MiniMap = ({ count }) => (
  <div className="filter-rail__map">
    <svg viewBox="0 0 100 75" preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <pattern id="grid-r" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M6 0 L0 0 L0 6" fill="none" stroke="currentColor" strokeWidth="0.12" opacity="0.18"/>
        </pattern>
      </defs>
      <rect width="100" height="75" fill="url(#grid-r)"/>
      <path d="M-2 46 C18 38,30 52,48 42 S80 36,102 46" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6"/>
      <path d="M10 10 C22 18,30 8,44 20 S70 28,92 18" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.4" strokeDasharray="1 1.5"/>
      <path d="M0 38 L100 36" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.4"/>
      <path d="M50 0 L52 75" stroke="#d65a1f" strokeOpacity="0.5" strokeWidth="0.4"/>
      <ellipse cx="50" cy="42" rx="28" ry="16" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.45" strokeDasharray="0.8 0.8"/>
    </svg>
    {[
      { x: 32, y: 35 }, { x: 52, y: 44 }, { x: 50, y: 58 }, { x: 62, y: 66 },
      { x: 74, y: 72 }, { x: 28, y: 66 }, { x: 80, y: 50 }, { x: 66, y: 32 },
    ].map((p, i) => (
      <span key={i} style={{
        position: 'absolute',
        left: `${p.x}%`, top: `${p.y}%`,
        transform: 'translate(-50%, -50%)',
        width: 6, height: 6, borderRadius: '50%',
        background: '#d65a1f',
        boxShadow: '0 0 0 2px #eee7d8, 0 0 0 3px #d65a1f',
        display: 'block',
      }}/>
    ))}
  </div>
);

const FilterRail = ({ items }) => {
  const neighborhoodCounts = useMemo(() => {
    const counts = {};
    items.forEach(r => { counts[r.neighborhood] = (counts[r.neighborhood] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [items]);

  return (
    <aside className="filter-rail">
      <div className="filter-rail__section-label">On the map</div>
      <MiniMap count={items.length} />
      <div className="filter-rail__map-footer">
        <span>{items.length} pins</span>
        <a href="/" className="filter-rail__map-link">Full map →</a>
      </div>

      {neighborhoodCounts.length > 0 && (
        <div className="filter-rail__hoods">
          <div className="filter-rail__section-label">By neighborhood</div>
          <ul className="filter-rail__hood-list">
            {neighborhoodCounts.map(([name, count]) => (
              <li key={name} className="filter-rail__hood-row">
                <span>{name}</span>
                <span className="filter-rail__hood-count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="filter-rail__quote">
        "Each entry is a real visit. No partnerships, no comped meals."
        <span className="filter-rail__quote-attr">— from the colophon</span>
      </div>
    </aside>
  );
};

const Restaurants = ({ setLat, setLon, setZoom }) => {
  const { locations, loading } = useLocations();
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [title, setTitle] = useState(buttonData[0].title || buttonData[0].label);
  const [description, setDescription] = useState(buttonData[0].description);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const restaurantsFiltered = useMemo(
    () => buildRestaurantsFiltered(locations),
    [locations]
  );

  const enrichedButtonData = useMemo(
    () => buttonData.map(btn => ({
      ...btn,
      count: restaurantsFiltered[btn.value]?.length || 0,
    })),
    [restaurantsFiltered]
  );

  const totalCount = restaurantsFiltered['food']?.length || 0;

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

  const searchRestaurants = (locs) => {
    const term = searchTerm.toLowerCase();
    return locs.filter((place) => {
      const name = String(place.name || "").toLowerCase();
      const blurb = String(place.blurb || "").toLowerCase();
      const desc = Array.isArray(place.description)
        ? place.description.join(" ").toLowerCase()
        : String(place.description || "").toLowerCase();
      return name.includes(term) || blurb.includes(term) || desc.includes(term);
    });
  };

  const categoryRestaurants = restaurantsFiltered[selectedCategory] || [];
  const filteredRestaurants = filterRestaurants(categoryRestaurants);
  const searchedRestaurants = searchRestaurants(locations);
  const pageRestaurants = modalOpen ? searchedRestaurants : filteredRestaurants;
  const pageLength = pageRestaurants.length;

  return (
    <div className="listing-page">
      {/* ── Listing Hero ─────────────────────────────── */}
      <section className="listing-hero">
        <div className="listing-hero__meta">
          <span className="listing-hero__meta-label listing-hero__meta-label--accent">§ 02 · The Index</span>
          <span className="listing-hero__meta-divider"/>
          <span className="listing-hero__meta-label listing-hero__meta-label--dim">{totalCount} entries</span>
        </div>
        <div className="listing-hero__content">
          <h1 className="listing-hero__title">
            The Food <em>Index</em>
          </h1>
          <p className="listing-hero__copy">
            A long index of restaurants, cafés, bakeries, and bars worth your time.
            Sorted by what you're hungry for.
          </p>
        </div>
      </section>

      {loading && (
        <p className="listing-loading">Loading…</p>
      )}

      {!loading && !modalOpen && (
        <>
          {/* ── Search ──────────────────────────────── */}
          <div className="listing__search-section">
            <div className="listing__search-bar">
              <input
                type="text"
                placeholder="Search All"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim() !== "") setModalOpen(true);
                }}
              />
            </div>
          </div>

          {/* ── Category Strip ──────────────────────── */}
          <div className="listing-category-strip-wrapper">
            <CategoryButtons
              buttonData={enrichedButtonData}
              changeCategory={changeCategory}
              activeCategory={selectedCategory}
            />
          </div>

          {/* ── Category Copy ───────────────────────── */}
          <section className="category-copy">
            <div className="category-copy__inner">
              <div>
                <span className="category-copy__now-showing">Now showing</span>
                <div className="category-copy__title">{title}</div>
                <div className="category-copy__count">{pageLength} entries</div>
              </div>
              <p className="category-copy__text">{description}</p>
            </div>
          </section>

          {/* ── Toolbar ─────────────────────────────── */}
          <div className="listing-toolbar">
            <span className="listing-toolbar__filter-label">Filter</span>
            <Filters
              list={restaurantsFiltered}
              selectedCategory={selectedCategory}
              onFilterChange={setSelectedFilters}
              compact
            />
            <div className="listing-toolbar__right">
              <span className="listing-toolbar__count">{pageLength} of {totalCount}</span>
              <div className="view-toggle">
                <button
                  className={`view-toggle__btn${viewMode === 'grid' ? ' view-toggle__btn--active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >Grid</button>
                <button
                  className={`view-toggle__btn${viewMode === 'list' ? ' view-toggle__btn--active' : ''}`}
                  onClick={() => setViewMode('list')}
                >List</button>
              </div>
            </div>
          </div>

          {/* ── Listing Body ─────────────────────────── */}
          <div className="listing-body">
            {viewMode === 'grid' ? (
              <div className="listing-body__split">
                <div className="spot-grid">
                  {pageRestaurants.map((item, i) => (
                    <SpotCard
                      key={i}
                      item={item}
                      index={i}
                      setLat={setLat}
                      setLon={setLon}
                      setZoom={setZoom}
                    />
                  ))}
                </div>
                <FilterRail items={pageRestaurants} />
              </div>
            ) : (
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
            )}
          </div>
        </>
      )}

      {/* ── Search Modal ─────────────────────────────── */}
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
