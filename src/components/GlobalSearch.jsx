import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocations } from '../contexts/LocationsContext';
import neighborhoodBlurbs from '../data/neighborhoods';
import { events, schedules, community, sports, creators } from '../data/resources';
import generateLocationSlug from '../utils/slug';

const slugify = (text) =>
  (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const PAGE_ROUTES = [
  { label: 'Home',          path: '/'              },
  { label: 'Food',          path: '/food'          },
  { label: 'Activities',    path: '/activities'    },
  { label: 'Neighborhoods', path: '/neighborhoods' },
  { label: 'Resources',     path: '/resources'     },
];

// Display order: pages first, then neighborhoods, locations, resources
const GROUP_ORDER = ['page', 'neighborhood', 'location', 'resource'];
const GROUP_LABELS = {
  page:         'Pages',
  neighborhood: 'Neighborhoods',
  location:     'Locations',
  resource:     'Resources',
};

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef                = useRef(null);
  const navigate                = useNavigate();
  const { locations }           = useLocations();

  const corpus = useMemo(() => {
    const items = [];

    // Pages first in corpus so they sort to the top
    PAGE_ROUTES.forEach(r => {
      items.push({
        label:   r.label,
        sublabel: r.path,
        type:    'page',
        path:    r.path,
        hidden:  false,
      });
    });

    neighborhoodBlurbs.forEach(n => {
      items.push({
        label:   n.name,
        sublabel: '',
        type:    'neighborhood',
        path:    `/neighborhoods/${slugify(n.name)}`,
        hidden:  false,
      });
    });

    locations.forEach(loc => {
      if (!loc.name) return;
      items.push({
        label:   loc.name,
        sublabel: loc.neighborhood || '',
        type:    'location',
        path:    `/location/${generateLocationSlug(loc)}`,
        hidden:  false,
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
        label:   r.title,
        sublabel: r.sub,
        type:    'resource',
        path:    '/resources',
        hidden:  false,
      });
    });

    items.push({
      label:  'manage',
      sublabel: '',
      type:   'manage',
      path:   '/manage-locations',
      hidden: true,
    });

    items.push({
      label:  'add-location',
      sublabel: '',
      type:   'add-location',
      path:   '/add-location',
      hidden: true,
    });

    return items;
  }, [locations]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return corpus.filter(item => item.label.toLowerCase().includes(q));
  }, [query, corpus]);

  // Flat visible list — used for keyboard navigation indices
  const visibleResults = useMemo(
    () => results.filter(r => !r.hidden),
    [results]
  );

  // Grouped for display, in priority order
  const groups = useMemo(() => {
    const byType = {};
    visibleResults.forEach((r, flatIdx) => {
      if (!byType[r.type]) byType[r.type] = [];
      byType[r.type].push({ ...r, flatIdx });
    });
    return GROUP_ORDER.map(type => ({ type, items: byType[type] || [] }))
                      .filter(g => g.items.length > 0);
  }, [visibleResults]);

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
      setSelected(s => Math.min(s + 1, visibleResults.length - 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
      return;
    }

    if (e.key === 'Enter') {
      if (visibleResults.length > 0) {
        go(visibleResults[Math.min(selected, visibleResults.length - 1)].path);
      } else if (results.length > 0 && results[0].hidden) {
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

        {query.trim() ? (
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
            Type to search &nbsp;·&nbsp; <kbd>↑↓</kbd> navigate &nbsp;·&nbsp; <kbd>↵</kbd> go
          </div>
        )}

      </div>
    </div>
  );
};

export default GlobalSearch;
