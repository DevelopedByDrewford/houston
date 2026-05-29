import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocations } from '../contexts/LocationsContext';
import neighborhoodBlurbs from '../data/neighborhoods';
import badges from '../data/badges';
import { events, schedules, community, sports, creators } from '../data/resources';
import generateLocationSlug from '../utils/slug';
import restaurantButtons from '../data/restaurant-types';
import activityButtons from '../data/activity-types';

const slugify = (text) =>
  (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const PAGE_ROUTES = [
  { label: 'Home',          path: '/'              },
  { label: 'Eats',          path: '/eats'          },
  { label: 'Activities',    path: '/activities'    },
  { label: 'Atlas',         path: '/atlas'         },
  { label: 'Community',     path: '/community'     },
];

const GROUP_ORDER = ['page', 'category', 'neighborhood', 'location', 'resource'];
const GROUP_LABELS = {
  page:         'Pages',
  category:     'Categories',
  neighborhood: 'Neighborhoods',
  location:     'Locations',
  resource:     'Resources',
};

// Short display label for each location category / subcategory
const CATEGORY_SHORT_LABEL = {
  // Food subcategories
  bakery: 'Bakery', bbq: 'BBQ', burgers: 'Burgers', burritos: 'Burritos',
  breakfast: 'Breakfast', chicken: 'Chicken', crawfish: 'Crawfish',
  dessert: 'Dessert', dumplings: 'Dumplings', hotdogs: 'Hot Dogs',
  pasta: 'Pasta', pho: 'Pho', pizza: 'Pizza', poke: 'Poke',
  ramen: 'Ramen', ricebowl: 'Rice Bowl', salads: 'Salads',
  sandwiches: 'Sandwiches', seafood: 'Seafood', soup: 'Soup',
  steak: 'Steakhouse', sushi: 'Sushi', tacos: 'Tacos', upscale: 'Upscale',
  hall: 'Food Hall',
  // Activity categories
  bar: 'Bar', books: 'Bookstore', coffee: 'Coffee', daiquiris: 'Daiquiris',
  market: 'Market', movies: 'Theater', museum: 'Museum',
  music: 'Music Venue', park: 'Park', photo: 'Photo', attraction: 'Attraction',
};

// Key words (Keep it Fun!!!)
const foodKeyWords = ['food', 'eat', 'eating', 'restaurant', 'restaurants', 'dining', 'bites', 'grub', 'cuisine', 'eats'];
const activityKeyWords = ['things', 'activities', 'activity', 'fun', 'stuff to do', 'shenanigans,', 'good times', 'vibes', 'trouble'];
const drinkKeyWords = ['drinks', 'drink', 'sips', 'beverages', 'libations', 'pours', 'cocktails'];

// Keywords that cast a wide net — show per-item category in chain results
const BROAD_KEYWORDS = new Set([
  ...foodKeyWords,
  ...activityKeyWords, 
  ...drinkKeyWords
]);

const getLocCategory = (loc) => {
  if (loc.category === 'food' && loc.subcategory?.length > 0) {
    return CATEGORY_SHORT_LABEL[loc.subcategory[0]] || '';
  }
  return CATEGORY_SHORT_LABEL[loc.category] || '';
};

// Activity button values → location category strings
const ACTIVITY_VALUE_TO_CATEGORY = {
  bars: 'bar', markets: 'market', parks: 'park',
};

// Restaurant button values → subcategory strings (only for mismatches)
const RESTAURANT_VALUE_TO_SUBCATEGORY = {
  rice: 'ricebowl', halls: 'hall',
};

// Build keyword → location-filter map and keyword → route path map from button data
const KEYWORD_MATCHERS = new Map();
const KEYWORD_PATHS    = new Map();

(() => {
  const addFood = (keys, matcher, path) =>
    keys.forEach(k => { if (!KEYWORD_MATCHERS.has(k)) { KEYWORD_MATCHERS.set(k, matcher); KEYWORD_PATHS.set(k, path); } });

  addFood(foodKeyWords,
    loc => loc.category === 'food', '/eats');

  addFood(activityKeyWords,
    loc => loc.category !== 'food', '/activities');

  addFood(drinkKeyWords,
    loc => ['bar', 'coffee', 'daiquiris'].includes(loc.category), '/activities');

  restaurantButtons.forEach(btn => {
    if (btn.value === 'food') return;
    const sub  = RESTAURANT_VALUE_TO_SUBCATEGORY[btn.value] || btn.value;
    const fn   = loc => loc.category === 'food' && loc.subcategory?.includes(sub);
    const path = `/eats?category=${btn.value}`;
    [btn.value, btn.label?.toLowerCase(), btn.title?.toLowerCase()]
      .filter(Boolean)
      .forEach(k => addFood([k], fn, path));
  });

  activityButtons.forEach(btn => {
    if (btn.value === 'all') return;
    const cat  = ACTIVITY_VALUE_TO_CATEGORY[btn.value] || btn.value;
    const fn   = loc => loc.category === cat;
    const path = `/activities?category=${btn.value}`;
    [btn.value, btn.label?.toLowerCase(), btn.title?.toLowerCase()]
      .filter(Boolean)
      .forEach(k => addFood([k], fn, path));
  });

  // Badge keywords — filter by badge across all categories
  badges.forEach(badge => {
    const key = badge.name.toLowerCase();
    addFood([key], loc => loc.badges?.includes(badge.name), null);
    BROAD_KEYWORDS.add(key);
  });

  // Shorthand aliases for badge filters
  [
    ['patio',        loc => loc.badges?.includes('outdoor seating')],
    ['vegan',        loc => loc.badges?.includes('vegetarian options')],
    ['late night',   loc => loc.badges?.includes('open late')],
    ['free parking', loc => !loc.badges?.includes('paid parking')],
  ].forEach(([key, fn]) => {
    addFood([key], fn, null);
    BROAD_KEYWORDS.add(key);
  });
})();

// Parse "X in Y" or "X near Y" — returns null if keyword isn't recognized (falls back to regular search)
const parseChain = (query) => {
  const m = query.match(/^(.+?)\s+(in|near)\s*(.*)$/i);
  if (!m) return null;

  const keywordRaw     = m[1].trim().toLowerCase();
  const separator      = m[2].toLowerCase();
  const neighborhoodRaw = m[3].trim().toLowerCase();
  if (!keywordRaw) return null;

  // Require at least a partial keyword match to enter chain mode
  let matcher = KEYWORD_MATCHERS.get(keywordRaw);
  let matchedKeyword = matcher ? keywordRaw : null;

  if (!matcher && keywordRaw.length >= 2) {
    for (const [key, fn] of KEYWORD_MATCHERS) {
      if (key.startsWith(keywordRaw)) {
        matcher = fn;
        matchedKeyword = key;
        break;
      }
    }
  }

  if (!matcher) return null;

  const base = {
    keywordRaw,
    neighborhoodRaw,
    separator,
    type:           separator,
    matcher,
    matchedKeyword,
    keywordPath:    KEYWORD_PATHS.get(matchedKeyword) || null,
    isBroadKeyword: BROAD_KEYWORDS.has(matchedKeyword),
  };

  // "in the loop" — activates when no real neighborhood matches the same prefix
  if (
    neighborhoodRaw.length >= 2 &&
    'the loop'.startsWith(neighborhoodRaw) &&
    !neighborhoodBlurbs.some(n => n.name.toLowerCase().startsWith(neighborhoodRaw))
  ) {
    return { ...base, matchedNeighborhood: { name: 'The Loop' }, isInnerLoop: true, isComplete: true };
  }

  let matchedNeighborhood = null;
  if (neighborhoodRaw.length >= 1) {
    matchedNeighborhood =
      neighborhoodBlurbs.find(n => n.name.toLowerCase().startsWith(neighborhoodRaw)) ||
      neighborhoodBlurbs.find(n => n.name.toLowerCase().includes(neighborhoodRaw));
  }

  return { ...base, matchedNeighborhood, isInnerLoop: false, isComplete: !!matchedNeighborhood };
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef                = useRef(null);
  const modalRef                = useRef(null);
  const navigate                = useNavigate();
  const { locations }           = useLocations();

  const corpus = useMemo(() => {
    const items = [];

    PAGE_ROUTES.forEach(r => {
      items.push({
        label:    r.label,
        sublabel: r.path,
        type:     'page',
        path:     r.path,
        hidden:   false,
      });
    });

    restaurantButtons.forEach(btn => {
      items.push({
        label:    btn.title || btn.label,
        sublabel: 'Food',
        type:     'category',
        path:     `/eats?category=${btn.value}`,
        keywords: [btn.value, btn.label],
      });
    });

    activityButtons.forEach(btn => {
      items.push({
        label:    btn.title || btn.label,
        sublabel: 'Activities',
        type:     'category',
        path:     `/activities?category=${btn.value}`,
        keywords: [btn.value, btn.label],
      });
    });

    neighborhoodBlurbs.forEach(n => {
      items.push({
        label:    n.name,
        sublabel: '',
        type:     'neighborhood',
        path:     `/atlas/${slugify(n.name)}`,
        hidden:   false,
      });
    });

    locations.forEach(loc => {
      if (!loc.name) return;
      const cat = getLocCategory(loc);
      items.push({
        label:    loc.name,
        sublabel: [cat, loc.neighborhood].filter(Boolean).join(' · '),
        type:     'location',
        path:     `/location/${generateLocationSlug(loc)}`,
        hidden:   false,
      });
    });

    const allResources = [
      ...events.map(r    => ({ title: r.title, sub: 'Events'    })),
      ...schedules.map(r => ({ title: r.title, sub: 'Schedules' })),
      ...community.map(r => ({ title: r.title, sub: 'Community' })),
      ...sports.map(r    => ({ title: r.title, sub: 'Sports'    })),
      ...creators.map(r  => ({ title: r.name,  sub: 'Creators'  })),
    ];
    allResources.forEach(r => {
      if (!r.title) return;
      items.push({
        label:    r.title,
        sublabel: r.sub,
        type:     'resource',
        path:     '/community',
        hidden:   false,
      });
    });

    items.push({ label: 'manage',       sublabel: '', type: 'manage',       path: '/manage-locations', hidden: true });
    items.push({ label: 'add-location', sublabel: '', type: 'add-location', path: '/add-location',     hidden: true });

    return items;
  }, [locations]);

  // Chain mode — activated when keyword is recognized; null otherwise (regular search)
  const chain = useMemo(() => {
    const q = query.toLowerCase();
    if (!q.includes(' in') && !q.includes(' near')) return null;
    return parseChain(query);
  }, [query]);

  const chainData = useMemo(() => {
    const empty = { items: [], primaryCount: 0, nearbyCount: 0, nearbyStart: 0, hasNeighborhoodLink: false };
    if (!chain?.isComplete) return empty;
    const n = chain.matchedNeighborhood;

    const toResult = (loc, neighborhood) => {
      const cat = chain.isBroadKeyword ? getLocCategory(loc) : null;
      return {
        label:    loc.name,
        sublabel: [cat, neighborhood].filter(Boolean).join(' · '),
        path:     `/location/${generateLocationSlug(loc)}`,
      };
    };

    // Inner-loop: search across all innerLoop: true neighborhoods
    if (chain.isInnerLoop) {
      const innerLoopSet = new Set(
        neighborhoodBlurbs.filter(nb => nb.innerLoop).map(nb => nb.name)
      );
      const locs = locations
        .filter(loc => loc.name && chain.matcher(loc) && innerLoopSet.has(loc.neighborhood))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map(loc => toResult(loc, loc.neighborhood));
      return { items: locs, primaryCount: locs.length, nearbyCount: 0, nearbyStart: locs.length, hasNeighborhoodLink: false };
    }

    const primaryLocs = locations
      .filter(loc => loc.name && chain.matcher(loc) && loc.neighborhood === n.name)
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(loc => toResult(loc, n.name));

    let nearbyLocs = [];
    if (chain.type === 'near' && n.nearby?.length > 0) {
      const nearbySet = new Set(n.nearby);
      nearbyLocs = locations
        .filter(loc => loc.name && chain.matcher(loc) && nearbySet.has(loc.neighborhood))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map(loc => toResult(loc, loc.neighborhood));
    }

    const items = [
      ...primaryLocs,
      ...nearbyLocs,
      { label: n.name, sublabel: 'Neighborhood', path: `/atlas/${slugify(n.name)}` },
    ];

    return {
      items,
      primaryCount:        primaryLocs.length,
      nearbyCount:         nearbyLocs.length,
      nearbyStart:         primaryLocs.length,
      hasNeighborhoodLink: true,
    };
  }, [chain, locations]);

  const results = useMemo(() => {
    if (chain) return [];
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return corpus.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.keywords?.some(k => k.toLowerCase().includes(q))
    );
  }, [query, corpus, chain]);

  const visibleResults = useMemo(() => results.filter(r => !r.hidden), [results]);

  const groups = useMemo(() => {
    const byType = {};
    visibleResults.forEach((r, flatIdx) => {
      if (!byType[r.type]) byType[r.type] = [];
      byType[r.type].push({ ...r, flatIdx });
    });
    return GROUP_ORDER.map(type => ({ type, items: byType[type] || [] }))
                      .filter(g => g.items.length > 0);
  }, [visibleResults]);

  // Fallback nav list when chain resolves but finds no locations
  const chainFallbackList = useMemo(() => {
    const threshold = chainData.hasNeighborhoodLink ? 1 : 0;
    if (!chain?.isComplete || chainData.items.length > threshold) return null;
    const items = [];
    if (chain.keywordPath) {
      items.push({ label: `View all ${capitalize(chain.matchedKeyword)}`, path: chain.keywordPath });
    }
    if (!chain.isInnerLoop) {
      items.push({
        label: `Explore ${chain.matchedNeighborhood.name}`,
        path:  `/atlas/${slugify(chain.matchedNeighborhood.name)}`,
      });
    }
    return items.length > 0 ? items : null;
  }, [chain, chainData]);

  // Unified list for keyboard nav
  const activeList = chainFallbackList ?? (chain ? chainData.items : visibleResults);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    modalRef.current?.querySelector('.gsearch-result--active, .gsearch-result--action-active')
      ?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const go = (path) => { navigate(path); onClose(); };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); return; }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, activeList.length - 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
      return;
    }

    if (e.key === 'Enter') {
      if (activeList.length > 0) {
        go(activeList[Math.min(selected, activeList.length - 1)].path);
      } else if (!chain && results.length > 0 && results[0].hidden) {
        go(results[0].path);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="gsearch-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <div className="gsearch-modal" ref={modalRef} onClick={e => e.stopPropagation()}>

        <div className="gsearch-header">
          <svg className="gsearch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="gsearch-input"
            placeholder="Search locations, neighborhoods, resources…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="gsearch-esc" onClick={onClose}>ESC</kbd>
        </div>

        {chain ? (
          <>
            <div className="gsearch-chain-row">
              <span className="gsearch-chain-token">
                {capitalize(chain.matchedKeyword)}
              </span>
              <span className="gsearch-chain-sep">{chain.separator}</span>
              <span className={`gsearch-chain-token${chain.matchedNeighborhood ? '' : ' gsearch-chain-token--dim'}`}>
                {chain.matchedNeighborhood?.name || chain.neighborhoodRaw || '…'}
              </span>
            </div>

            {chain.isComplete ? (
              chainData.items.length > 1 ? (
                <div className="gsearch-results" role="listbox">
                  <div className="gsearch-group">
                    <div className="gsearch-group-label">
                      {chain.type === 'near' && chainData.nearbyCount > 0
                        ? `${chainData.primaryCount} in ${chain.matchedNeighborhood.name} · ${chainData.nearbyCount} nearby`
                        : `${chainData.primaryCount + chainData.nearbyCount} location${chainData.primaryCount + chainData.nearbyCount !== 1 ? 's' : ''}`
                      }
                    </div>
                    {chainData.items.map((r, i) => (
                      <div key={`chain-${r.path}-${i}`}>
                        {chain.type === 'near' && chainData.nearbyCount > 0 && i === chainData.nearbyStart && (
                          <div className="gsearch-divider" />
                        )}
                        {chainData.hasNeighborhoodLink && i === chainData.items.length - 1 && <div className="gsearch-divider" />}
                        <div
                          className={`gsearch-result${i === selected ? ' gsearch-result--active' : ''}`}
                          onClick={() => go(r.path)}
                          onMouseEnter={() => setSelected(i)}
                          role="option"
                          aria-selected={i === selected}
                        >
                          <span className="gsearch-result__label">{r.label}</span>
                          {r.sublabel && <span className="gsearch-result__sub">{r.sublabel}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <p className="gsearch-empty">
                    No results for <em>"{capitalize(chain.matchedKeyword)}"</em> {chain.separator} <em>"{chain.matchedNeighborhood.name}"</em>
                  </p>
                  <div className="gsearch-results" role="listbox">
                    <div className="gsearch-group">
                      {chainFallbackList.map((r, i) => (
                        <div
                          key={`fallback-${i}`}
                          className={`gsearch-result gsearch-result--action${i === selected ? ' gsearch-result--action-active' : ''}`}
                          onClick={() => go(r.path)}
                          onMouseEnter={() => setSelected(i)}
                          role="option"
                          aria-selected={i === selected}
                        >
                          <span className="gsearch-result__label">{r.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            ) : (
              <p className="gsearch-empty">
                {chain.neighborhoodRaw.length === 0
                  ? 'Type a neighborhood…'
                  : <>No neighborhood matching <em>"{chain.neighborhoodRaw}"</em></>}
              </p>
            )}
          </>
        ) : query.trim() ? (
          visibleResults.length > 0 ? (
            <div className="gsearch-results" role="listbox">
              {groups.map((group, gi) => (
                <div key={group.type} className="gsearch-group">
                  {gi > 0 && <div className="gsearch-divider" />}
                  <div className="gsearch-group-label">{GROUP_LABELS[group.type]}</div>
                  {group.items.map(r => (
                    <div
                      key={`${r.type}-${r.path}-${r.flatIdx}`}
                      className={`gsearch-result${r.flatIdx === selected ? ' gsearch-result--active' : ''}`}
                      onClick={() => go(r.path)}
                      onMouseEnter={() => setSelected(r.flatIdx)}
                      role="option"
                      aria-selected={r.flatIdx === selected}
                    >
                      <span className="gsearch-result__label">{r.label}</span>
                      {r.sublabel && <span className="gsearch-result__sub">{r.sublabel}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="gsearch-empty">No results for <em>"{query}"</em></p>
          )
        ) : (
          <div className="gsearch-hint-row">
            <div>Type to search &nbsp;·&nbsp; <kbd>↑↓</kbd> navigate &nbsp;·&nbsp; <kbd>↵</kbd> go</div>
            <div className="gsearch-hint-chain">try &ldquo;coffee in heights&rdquo; &nbsp;·&nbsp; &ldquo;open late near downtown&rdquo; &nbsp;·&nbsp; &ldquo;vibes in the loop&rdquo;</div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GlobalSearch;
