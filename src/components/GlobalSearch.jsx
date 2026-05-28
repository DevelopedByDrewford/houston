import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocations } from '../contexts/LocationsContext';
import neighborhoodBlurbs from '../data/neighborhoods';
import { events, schedules, community, sports, creators } from '../data/resources';
import generateLocationSlug from '../utils/slug';
import restaurantButtons from '../data/restaurant-types';
import activityButtons from '../data/activity-types';

const slugify = (text) =>
  (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const PAGE_ROUTES = [
  { label: 'Home',          path: '/'              },
  { label: 'Food',          path: '/food'          },
  { label: 'Activities',    path: '/activities'    },
  { label: 'Neighborhoods', path: '/neighborhoods' },
  { label: 'Resources',     path: '/resources'     },
];

const GROUP_ORDER = ['page', 'category', 'neighborhood', 'location', 'resource'];
const GROUP_LABELS = {
  page:         'Pages',
  category:     'Categories',
  neighborhood: 'Neighborhoods',
  location:     'Locations',
  resource:     'Resources',
};

// Activity button values → location category strings
const ACTIVITY_VALUE_TO_CATEGORY = {
  bars: 'bar', markets: 'market', parks: 'park',
};

// Restaurant button values → subcategory strings (only for mismatches)
const RESTAURANT_VALUE_TO_SUBCATEGORY = {
  rice: 'ricebowl', halls: 'hall',
};

// Build keyword → location-filter map from button data + broad keywords
const KEYWORD_MATCHERS = (() => {
  const map = new Map();

  ['food', 'eat', 'eating', 'restaurant', 'restaurants', 'dining'].forEach(k =>
    map.set(k, loc => loc.category === 'food')
  );

  ['things', 'activities', 'activity'].forEach(k =>
    map.set(k, loc => loc.category !== 'food')
  );

  restaurantButtons.forEach(btn => {
    if (btn.value === 'food') return;
    const sub = RESTAURANT_VALUE_TO_SUBCATEGORY[btn.value] || btn.value;
    const fn = loc => loc.category === 'food' && loc.subcategory?.includes(sub);
    [btn.value, btn.label?.toLowerCase(), btn.title?.toLowerCase()]
      .filter(Boolean)
      .forEach(k => { if (!map.has(k)) map.set(k, fn); });
  });

  activityButtons.forEach(btn => {
    if (btn.value === 'all') return;
    const cat = ACTIVITY_VALUE_TO_CATEGORY[btn.value] || btn.value;
    const fn = loc => loc.category === cat;
    [btn.value, btn.label?.toLowerCase(), btn.title?.toLowerCase()]
      .filter(Boolean)
      .forEach(k => { if (!map.has(k)) map.set(k, fn); });
  });

  return map;
})();

// Parse "X in Y" — returns null if keyword isn't recognized (falls back to regular search)
const parseChain = (query) => {
  const m = query.match(/^(.+?)\s+in\s*(.*)$/i);
  if (!m) return null;

  const keywordRaw = m[1].trim().toLowerCase();
  const neighborhoodRaw = m[2].trim().toLowerCase();
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

  let matchedNeighborhood = null;
  if (neighborhoodRaw.length >= 1) {
    matchedNeighborhood =
      neighborhoodBlurbs.find(n => n.name.toLowerCase().startsWith(neighborhoodRaw)) ||
      neighborhoodBlurbs.find(n => n.name.toLowerCase().includes(neighborhoodRaw));
  }

  return {
    keywordRaw,
    neighborhoodRaw,
    matcher,
    matchedKeyword,
    matchedNeighborhood,
    isComplete: !!matchedNeighborhood,
  };
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef                = useRef(null);
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
        path:     `/food?category=${btn.value}`,
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
        path:     `/neighborhoods/${slugify(n.name)}`,
        hidden:   false,
      });
    });

    locations.forEach(loc => {
      if (!loc.name) return;
      items.push({
        label:    loc.name,
        sublabel: loc.neighborhood || '',
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
        path:     '/resources',
        hidden:   false,
      });
    });

    items.push({ label: 'manage',       sublabel: '', type: 'manage',       path: '/manage-locations', hidden: true });
    items.push({ label: 'add-location', sublabel: '', type: 'add-location', path: '/add-location',     hidden: true });

    return items;
  }, [locations]);

  // Chain mode — activated when keyword is recognized; null otherwise (regular search)
  const chain = useMemo(() => {
    if (!query.toLowerCase().includes(' in')) return null;
    return parseChain(query);
  }, [query]);

  const chainResults = useMemo(() => {
    if (!chain?.isComplete) return [];
    const n = chain.matchedNeighborhood;
    const locs = locations
      .filter(loc => loc.name && chain.matcher(loc) && loc.neighborhood === n.name)
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(loc => ({
        label:    loc.name,
        sublabel: loc.neighborhood || '',
        path:     `/location/${generateLocationSlug(loc)}`,
      }));
    locs.push({
      label:    n.name,
      sublabel: 'Neighborhood',
      path:     `/neighborhoods/${slugify(n.name)}`,
    });
    return locs;
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

  // Unified list for keyboard nav
  const activeList = chain ? chainResults : visibleResults;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => { setSelected(0); }, [query]);

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
      <div className="gsearch-modal" onClick={e => e.stopPropagation()}>

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
              <span className="gsearch-chain-sep">in</span>
              <span className={`gsearch-chain-token${chain.matchedNeighborhood ? '' : ' gsearch-chain-token--dim'}`}>
                {chain.matchedNeighborhood?.name || chain.neighborhoodRaw || '…'}
              </span>
            </div>

            {chain.isComplete ? (
              chainResults.length > 1 ? (
                <div className="gsearch-results" role="listbox">
                  <div className="gsearch-group">
                    <div className="gsearch-group-label">
                      {chainResults.length - 1} location{chainResults.length - 1 !== 1 ? 's' : ''}
                    </div>
                    {chainResults.map((r, i) => (
                      <div key={`chain-${r.path}-${i}`}>
                        {i === chainResults.length - 1 && <div className="gsearch-divider" />}
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
                <p className="gsearch-empty">
                  No results for <em>"{capitalize(chain.matchedKeyword)}"</em> in <em>"{chain.matchedNeighborhood.name}"</em>
                </p>
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
            <div className="gsearch-hint-chain">try &ldquo;pizza in midtown&rdquo; &nbsp;·&nbsp; &ldquo;things in heights&rdquo;</div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GlobalSearch;
