import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLocations } from '../contexts/LocationsContext';
import neighborhoodBlurbs from '../data/neighborhoods';
import activityTypes from '../data/activity-types';

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const CompassMark = ({ size = 28, color = 'currentColor' }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block' }} aria-hidden="true">
    <circle cx="20" cy="20" r="18.5" fill="none" stroke={color} strokeWidth="1"/>
    <path d="M20 4 L22 19 L20 36 L18 19 Z" fill={color} />
    <path d="M4 20 L19 22 L36 20 L19 18 Z" fill={color} opacity="0.55" />
    <circle cx="20" cy="20" r="1.4" fill={color} />
  </svg>
);

const Star = ({ size = 10, color }) => (
  <svg viewBox="0 0 10 10" width={size} height={size}
    style={{ display: 'inline-block', verticalAlign: 'middle' }} aria-hidden="true">
    <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill={color} />
  </svg>
);

const MonoLabel = ({ children, muted }) => (
  <span style={{
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: muted ? 'rgba(26,34,56,0.42)' : 'var(--accent)',
    fontWeight: 500,
  }}>{children}</span>
);

const RuleNumber = ({ n }) => (
  <span style={{
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.12em',
    color: 'var(--ink)',
    opacity: 0.5,
    fontFeatureSettings: '"tnum"',
  }}>{n}</span>
);

function SectionHeader({ n, title, sub, right }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 24,
      borderBottom: '1px solid rgba(26,34,56,0.12)',
      paddingBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap', gap: 12 }}>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.22em',
          color: 'var(--accent)',
        }}>§ {n}</span>
        <h2 style={{
          margin: 0,
          fontFamily: 'var(--serif)',
          fontWeight: 400,
          fontSize: 'clamp(28px, 4vw, 36px)',
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          lineHeight: 1,
        }}>{title}</h2>
        {sub && (
          <span style={{
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            fontSize: 15,
            color: 'var(--ink)',
            opacity: 0.5,
          }}>— {sub}</span>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

// ─── Map placeholder ───────────────────────────────────────────────────────────

function MapBlock() {
  const pins = [
    { x: 36, y: 24, label: 'Heights' },
    { x: 50, y: 48, label: 'Downtown' },
    { x: 50, y: 20, label: 'Northside' },
    { x: 38, y: 53, label: 'Montrose' },
    { x: 47, y: 60, label: 'Midtown' },
    { x: 55, y: 55, label: 'EaDo' },
    { x: 62, y:51, label: 'Second Ward' },
    { x: 60, y: 38, label: 'Fifth Ward' },
    { x: 46, y: 80, label: 'Museum Dist.' },
    { x: 22, y: 60, label: 'River Oaks' },
    { x: 34, y: 74, label: 'Rice Village' },
  ];
  return (
    <div style={{
      position: 'relative',
      aspectRatio: '16/9',
      background: '#eee7d8',
      borderRadius: 2,
      overflow: 'hidden',
      border: '1px solid rgba(26,34,56,0.1)',
    }}>
      <svg viewBox="0 0 100 56" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id="mapgrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M6 0 L0 0 L0 6" fill="none" stroke="rgba(26,34,56,0.18)" strokeWidth="0.12"/>
          </pattern>
        </defs>
        <rect width="100" height="56" fill="url(#mapgrid)"/>

        {/* Vertical Line */}
        <path d="M 50 0 L 52 100"
          stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="0.4"/>

        {/* Buffalo Bayou — runs W to E, bending through downtown */}
        {/* <path d="M 0 38 C 12 36, 22 40, 34 38 S 44 34, 52 36 S 64 38, 80 34 S 92 30, 102 32"
          fill="none" stroke="rgba(80,130,180,0.55)" strokeWidth="1.1"/> */}
        <path d="M 0 26 C 12 24, 22 28, 34 26 S 44 22, 52 24 S 64 26, 80 22 S 92 18, 102 20"
          fill="none" stroke="rgba(80,130,180,0.55)" strokeWidth="1.1"/>

        {/* Brays Bayou — south of center */}
        {/* <path d="M 0 58 C 18 54, 32 58, 48 56 S 70 52, 102 56"
          fill="none" stroke="rgba(80,130,180,0.3)" strokeWidth="0.6" strokeDasharray="1.2 1.2"/> */}

        {/* Loop 610 — oval shifted slightly east/south of true center */}
        {/* <ellipse cx="50" cy="32" rx="26" ry="14"
          fill="none" stroke="rgba(26,34,56,0.4)" strokeWidth="0.45" strokeDasharray="0.8 0.8"/> */}

        {/* I-45 / US-59 — diagonal SW to NE through downtown */}
        {/* <path d="M 20 56 L 52 36 L 72 10"
          stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="0.5"/> */}

        {/* I-10 — east-west, roughly through Heights/Downtown */}
        <path d="M 0 34 L 102 32"
          stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="0.45"/>

        {/* I-69 / US-59 Southwest — toward Greenway/Rice */}
        {/* <path d="M 50 36 L 38 56 L 28 68"
          stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="0.4"/> */}

        {/* Shepherd/Durham — N-S artery through Heights & Montrose */}
        <path d="M 36 4 L 36 56"
          stroke="rgba(26,34,56,0.2)" strokeWidth="0.25" strokeDasharray="0.6 1"/>

        {/* Main St — N-S through Midtown */}
        {/* <path d="M 50 30 L 44 70"
          stroke="rgba(26,34,56,0.2)" strokeWidth="0.25" strokeDasharray="0.6 1"/> */}
      </svg>

      {pins.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          transform: 'translate(-50%, -100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.06em',
            color: 'var(--ink)', opacity: 0.7, whiteSpace: 'nowrap',
            background: '#f4ede0', padding: '1px 4px', borderRadius: 1,
          }}>{p.label}</span>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 0 2px #f4ede0, 0 0 0 3px var(--accent)',
          }}/>
        </div>
      ))}

      <div style={{
        position: 'absolute', right: 12, top: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        color: 'var(--ink)', opacity: 0.65,
      }}>
        <CompassMark size={26} color="var(--ink)" />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em' }}>N</span>
      </div>

      <div style={{
        position: 'absolute', left: 12, bottom: 10,
        color: 'var(--ink)', opacity: 0.65,
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
      }}>├──────┤ 2 MI</div>
    </div>
  );
}

// ─── Featured card (hero right column) ────────────────────────────────────────

function FeaturedCard({ spot }) {
  if (!spot) {
    return (
      <div style={{
        aspectRatio: '4/5', borderRadius: 2,
        background: 'rgba(26,34,56,0.08)',
        animation: 'home-pulse 1.5s ease-in-out infinite',
      }}/>
    );
  }

  const catLabel = (() => {
    if (Array.isArray(spot.subcategory) && spot.subcategory[0]) {
      const s = spot.subcategory[0];
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return spot.category ? spot.category.charAt(0).toUpperCase() + spot.category.slice(1) : '';
  })();

  return (
    <figure style={{ margin: 0 }}>
      <div style={{
        position: 'relative',
        aspectRatio: '4/5',
        overflow: 'hidden',
        background: '#1a1a1a',
        borderRadius: 2,
      }}>
        <img src={spot.img} alt={spot.name} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'saturate(0.92) contrast(1.02)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 48%, rgba(0,0,0,.6) 100%)',
        }}/>
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: 'var(--paper)', color: 'var(--ink)',
          padding: '5px 10px', borderRadius: 1,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>This week's pick</div>
        <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, color: '#fff' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase',
            opacity: 0.85, marginBottom: 6,
          }}>{spot.neighborhood} · {catLabel}</div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 38px)',
            lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 400,
          }}>{spot.name}</div>
        </div>
      </div>
      {spot.blurb && (
        <figcaption style={{
          fontFamily: 'var(--serif)', fontSize: 14.5, color: 'var(--ink)', opacity: 0.7,
          marginTop: 14, fontStyle: 'italic', lineHeight: 1.5,
        }}>
          "{spot.blurb.length > 100 ? spot.blurb.slice(0, 100) + '…' : spot.blurb}"
          <span style={{ opacity: 0.6 }}> — from the entry</span>
        </figcaption>
      )}
    </figure>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', { month: 'long' }) + ', ' + today.getFullYear();
// Volume = current year - launch year + 1 (since we start at Vol. 01, not Vol. 00)
const volume = new Date().getFullYear() - 2025 + 1;
const formattedVolume = String(volume).padStart(2, '0');
// Issue = current month (1-12), resetting to 01 in January of each year, so it always reflects the month number within the current volume
const issue = new Date().getMonth() + 1;


function HeroEditorial({ totalSpots, featuredSpot }) {
  return (
    <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '64px 32px 40px' }}>
      <div className="home-hero-grid">
        {/* Left: headline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <MonoLabel>Vol. {formattedVolume} · Issue {issue}</MonoLabel>
            <span style={{ width: 24, height: 1, background: 'var(--ink)', opacity: 0.25, display: 'block' }}/>
            <MonoLabel muted>{formattedDate}</MonoLabel>
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)',
            fontWeight: 400,
            fontSize: 'clamp(52px, 8vw, 108px)',
            lineHeight: 0.92,
            letterSpacing: '-0.035em',
            color: 'var(--ink)',
            margin: 0,
          }}>
            A field guide to{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)', fontWeight: 400 }}>Houston,</em>
            <br/>kept by hand.
          </h1>

          <p style={{
            fontFamily: 'var(--serif)',
            fontSize: 20,
            lineHeight: 1.5,
            color: 'var(--ink)',
            opacity: 0.78,
            maxWidth: 520,
            marginTop: 28,
          }}>
            {totalSpots > 0 ? totalSpots : '—'} places worth your time, sorted into food,
            things to do, and corners of the city. No partnerships, no algorithm — just a
            long-running list, written down.
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
            <Link to="/eats" style={{
              display: 'inline-block',
              background: 'var(--ink)', color: 'var(--paper)',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              padding: '13px 20px', borderRadius: 2,
              letterSpacing: '0.03em', textDecoration: 'none',
            }}>Open the index →</Link>
            <Link to="/atlas" style={{
              display: 'inline-block',
              background: 'transparent', color: 'var(--ink)',
              border: '1px solid rgba(26,34,56,0.18)',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              padding: '13px 20px', borderRadius: 2,
              letterSpacing: '0.03em', textDecoration: 'none',
            }}>Browse neighborhoods</Link>
          </div>
        </div>

        {/* Right: featured card */}
        <FeaturedCard spot={featuredSpot} />
      </div>
    </section>
  );
}

// ─── Stats strip ───────────────────────────────────────────────────────────────

function StatsStrip({ totalSpots, totalNeighborhoods, weather }) {
  const items = [
    { v: totalSpots || '—', l: 'Curated spots' },
    { v: totalNeighborhoods,  l: 'Neighborhoods covered' },
    { v: '14',               l: 'Updates this month' },
    {
      v: weather ? `${weather.temp}°` : '—',
      l: 'In H-Town right now',
      extra: weather?.condition || null,
    },
  ];

  return (
    <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '12px 32px 28px' }}>
      <div className="home-stats-grid">
        {items.map((it, i) => (
          <div key={i} style={{
            padding: '22px 0',
            borderLeft: i > 0 ? '1px solid rgba(26,34,56,0.08)' : 'none',
            paddingLeft: i > 0 ? 28 : 0,
          }}>
            <div style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(32px, 4vw, 44px)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              fontWeight: 400,
            }}>{it.v}</div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
              textTransform: 'uppercase', marginTop: 10,
              color: 'var(--ink)', opacity: 0.55,
            }}>{it.l}</div>
            {it.extra && (
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 12, marginTop: 5,
                color: 'var(--ink)', opacity: 0.5,
              }}>{it.extra}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Collections ──────────────────────────────────────────────────────────────

const COLLECTIONS = [
  { id: 'food',        label: 'Eats',          blurb: '25 cuisines, breakfast to last-call',   img: 'https://i.imgur.com/yzjy5Ek.png', to: '/eats' },
  { id: 'activities',  label: 'Activities',    blurb: 'Museums, music, parks, photo opps',     img: 'https://i.imgur.com/4CSW5F3.png', to: '/activities' },
  { id: 'hoods',       label: 'Atlas',         blurb: 'Field notes on every corner',           img: 'https://i.imgur.com/bjzXRJ2.png', to: '/atlas' },
  { id: 'resources',   label: 'Community',     blurb: 'Creators and locals worth following',   img: 'https://i.imgur.com/gczEaJs.png', to: '/community' },
];

function Collections({ foodCount, activityCount }) {
  const collections = COLLECTIONS.map(c => ({
    ...c,
    count: c.id === 'food' ? foodCount
         : c.id === 'activities' ? activityCount
         : c.id === 'hoods' ? neighborhoodBlurbs.length
         : 21,
  }));

  return (
    <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '64px 32px 24px' }}>
      <SectionHeader n="01" title="The Index" sub="Browse by what you want from the day" />

      <div className="home-collections-grid">
        {collections.map((c, i) => (
          <Link key={c.id} to={c.to} className="home-collection-card" style={{
            display: 'block', textDecoration: 'none', color: 'var(--ink)',
            border: '1px solid rgba(26,34,56,0.1)',
            borderRadius: 2, overflow: 'hidden',
            background: 'var(--paper)',
          }}>
            <div style={{
              aspectRatio: '4/3', overflow: 'hidden', background: '#1a1a1a', position: 'relative',
            }}>
              <img src={c.img} alt="" style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'saturate(0.85) contrast(1.02)',
                transition: 'transform .6s ease',
              }} className="home-collection-img"/>
              <div style={{
                position: 'absolute', top: 12, left: 12,
                background: 'var(--paper)', color: 'var(--ink)',
                fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
                padding: '4px 8px', borderRadius: 1,
              }}>{String(i + 1).padStart(2, '0')}</div>
              {c.count > 0 && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em',
                  color: '#fff', background: 'rgba(0,0,0,0.55)',
                  padding: '4px 8px', borderRadius: 1,
                }}>{c.count} entries</div>
              )}
            </div>
            <div style={{ padding: '18px 18px 22px' }}>
              <div style={{
                fontFamily: 'var(--serif)', fontSize: 26, lineHeight: 1.05,
                letterSpacing: '-0.02em', fontWeight: 400, marginBottom: 6,
              }}>{c.label}</div>
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)', opacity: 0.58, lineHeight: 1.45,
              }}>{c.blurb}</div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18,
              }}>
                <MonoLabel>Browse →</MonoLabel>
                <Star size={9} color="rgba(26,34,56,0.28)" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Spot card ────────────────────────────────────────────────────────────────

function SpotCard({ spot, index }) {
  const catLabel = (() => {
    if (Array.isArray(spot.subcategory) && spot.subcategory[0]) {
      const s = spot.subcategory[0];
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return spot.category ? spot.category.charAt(0).toUpperCase() + spot.category.slice(1) : '';
  })();

  return (
    <article className="home-spot-card" style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--paper)', cursor: 'pointer',
    }}>
      <div style={{
        aspectRatio: '4/3', overflow: 'hidden', position: 'relative',
        background: '#1a1a1a', borderRadius: 2,
      }}>
        <img src={spot.img} alt={spot.name} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'saturate(0.9) contrast(1.02)',
          transition: 'transform .6s ease',
        }} className="home-spot-img"/>
        <div style={{
          position: 'absolute', top: 10, left: 10,
          fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '4px 8px', borderRadius: 1,
        }}>{catLabel}</div>
      </div>
      <div style={{ padding: '16px 0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <h3 style={{
            margin: 0,
            fontFamily: 'var(--serif)', fontWeight: 400,
            fontSize: 'clamp(18px, 2.5vw, 24px)', letterSpacing: '-0.01em',
            color: 'var(--ink)', lineHeight: 1.1,
          }}>{spot.name}</h3>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--ink)',
            opacity: 0.45, letterSpacing: '0.12em', flexShrink: 0,
          }}>№ {String(index + 1).padStart(3, '0')}</span>
        </div>
        <div style={{
          marginTop: 5,
          fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--accent)',
        }}>{spot.neighborhood}</div>
        {spot.blurb && (
          <p style={{
            margin: '10px 0 0',
            fontFamily: 'var(--sans)', fontSize: 13.5, lineHeight: 1.5,
            color: 'var(--ink)', opacity: 0.68,
          }}>{spot.blurb}</p>
        )}
      </div>
    </article>
  );
}

// ─── Food section ─────────────────────────────────────────────────────────────

const FOOD_FILTER_CATS = ['All', 'Ramen', 'Sushi', 'Tacos', 'Burgers', 'Pizza', 'BBQ', 'Breakfast', 'Dumplings'];

function FoodSection({ foodSpots }) {
  const [activeCat, setActiveCat] = useState('All');

  const shown = useMemo(() => {
    if (activeCat === 'All') return foodSpots.slice(0, 4);
    const val = activeCat.toLowerCase();
    return foodSpots
      .filter(s => Array.isArray(s.subcategory) && s.subcategory.includes(val))
      .slice(0, 4);
  }, [activeCat, foodSpots]);

  return (
    <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '64px 32px 24px' }}>
      <SectionHeader
        n="02" title="Eats" sub="Restaurants & bars, by category"
        right={
          <Link to="/eats" style={{ textDecoration: 'none' }}>
            <MonoLabel muted>See all categories →</MonoLabel>
          </Link>
        }
      />

      {/* Filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
        {FOOD_FILTER_CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{
            fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 500,
            padding: '8px 14px', borderRadius: 999,
            background: activeCat === c ? 'var(--ink)' : 'transparent',
            color: activeCat === c ? 'var(--paper)' : 'var(--ink)',
            border: `1px solid ${activeCat === c ? 'var(--ink)' : 'rgba(26,34,56,0.16)'}`,
            cursor: 'pointer', letterSpacing: '0.02em',
            transition: 'background .18s, color .18s, border-color .18s',
          }}>{c}</button>
        ))}
      </div>

      <div className="home-food-grid" style={{ marginTop: 36 }}>
        {/* Spot cards */}
        <div className="home-spotcards-grid" key={activeCat}>
          {shown.length > 0
            ? shown.map((s, i) => <SpotCard key={s.id || s.name || i} spot={s} index={i} />)
            : [...Array(4)].map((_, i) => (
                <div key={i} style={{
                  aspectRatio: '4/3', background: 'rgba(26,34,56,0.07)',
                  borderRadius: 2, animation: 'home-pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}/>
              ))
          }
        </div>

        {/* Map */}
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--ink)', opacity: 0.55, marginBottom: 12,
          }}>On the map</div>
          <MapBlock />
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 12,
            fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--ink)', opacity: 0.55,
          }}>
            <span>Showing {foodSpots.length} places</span>
            <Link to="/eats" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Open full map →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Activities section ────────────────────────────────────────────────────────

function ActivitiesSection({ todaysPick, activityCounts }) {
  const catLabel = (() => {
    if (!todaysPick) return '';
    if (Array.isArray(todaysPick.subcategory) && todaysPick.subcategory[0]) {
      const s = todaysPick.subcategory[0];
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return todaysPick.category
      ? todaysPick.category.charAt(0).toUpperCase() + todaysPick.category.slice(1)
      : '';
  })();

  // Skip the first "All" entry
  const actList = activityTypes.slice(1).map((a, i) => ({
    label: a.title || a.label,
    count: activityCounts[i] || 6,
  }));

  return (
    <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '64px 32px 24px' }}>
      <SectionHeader n="03" title="Activities" sub="Looking, listening, loitering" />

      <div className="home-activities-grid" style={{ marginTop: 36 }}>
        {/* Today's pick dark card */}
        {todaysPick ? (
          <div style={{
            background: 'var(--ink)', color: 'var(--paper)',
            borderRadius: 2, padding: 32,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28,
            alignItems: 'center', overflow: 'hidden',
          }}>
            <div>
              <MonoLabel>Today's pick</MonoLabel>
              <h3 style={{
                margin: '14px 0 6px',
                fontFamily: 'var(--serif)', fontWeight: 400,
                fontSize: 'clamp(32px, 4vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1,
                color: 'var(--paper)',
              }}>{todaysPick.name}</h3>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
                opacity: 0.65, textTransform: 'uppercase', color: 'var(--paper)',
              }}>{todaysPick.neighborhood} · {catLabel}</div>
              {todaysPick.blurb && (
                <p style={{
                  fontFamily: 'var(--serif)', fontSize: 15.5, lineHeight: 1.5,
                  opacity: 0.82, maxWidth: 300, marginTop: 14, fontStyle: 'italic',
                  color: 'var(--paper)',
                }}>{todaysPick.blurb.length > 100
                  ? todaysPick.blurb.slice(0, 100) + '…'
                  : todaysPick.blurb
                }</p>
              )}
              <Link to="/activities" style={{
                display: 'inline-block', marginTop: 20,
                background: 'var(--accent)', color: '#fff',
                fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 500,
                padding: '11px 18px', borderRadius: 2,
                letterSpacing: '0.03em', textDecoration: 'none',
              }}>Browse activities →</Link>
            </div>
            {todaysPick.img && (
              <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: 2 }}>
                <img src={todaysPick.img} alt={todaysPick.name} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                }}/>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: 'rgba(26,34,56,0.08)', borderRadius: 2, minHeight: 200,
            animation: 'home-pulse 1.5s ease-in-out infinite',
          }}/>
        )}

        {/* Activities list */}
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.55, marginBottom: 12,
          }}>By kind</div>
          <ul style={{
            listStyle: 'none', margin: 0, padding: 0,
            borderTop: '1px solid rgba(26,34,56,0.1)',
          }}>
            {actList.map((a, i) => (
              <li key={a.label} className="home-activity-row" style={{
                borderBottom: '1px solid rgba(26,34,56,0.08)',
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                padding: '11px 0',
                fontFamily: 'var(--serif)', fontSize: 19, color: 'var(--ink)', fontWeight: 400,
                cursor: 'pointer', transition: 'color .18s',
              }}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <RuleNumber n={String(i + 1).padStart(2, '0')} />
                  {a.label}
                </span>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em',
                  color: 'var(--ink)', opacity: 0.38,
                }}>{a.count} ›</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Neighborhoods section ────────────────────────────────────────────────────

const FEATURED_HOODS = [
  { name: 'Montrose',        tag: 'Eat / Drink / Walk' },
  { name: 'Heights',         tag: 'Brunch / Boutique'  },
  { name: 'Midtown',         tag: 'Late Night'          },
  { name: 'Chinatown',       tag: 'Noodles / Hot Pot'  },
  { name: 'Downtown',        tag: 'Bars / Theatre'      },
  { name: 'EaDo',            tag: 'Art / Warehouse'     },
  { name: 'Second Ward',     tag: 'Tex-Mex / Murals'    },  
  { name: 'Museum District', tag: 'Culture'             },
];

function HoodsSection({ neighborhoodCounts }) {
  const hoods = FEATURED_HOODS.map(h => ({
    ...h,
    spots: neighborhoodCounts[h.name] || 0,
  }));

  return (
    <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '64px 32px 24px' }}>
      <SectionHeader
        n="04"
        title="Atlas"
        sub={`${neighborhoodBlurbs.length} corners of the city`}
      />

      <div className="home-hoods-grid" style={{
        marginTop: 32,
        background: 'rgba(26,34,56,0.1)',
        border: '1px solid rgba(26,34,56,0.1)',
      }}>
        {hoods.map((h, i) => (
          <Link key={h.name} to="/atlas" className="home-hood-card" style={{
            background: 'var(--paper)', color: 'var(--ink)', textDecoration: 'none',
            padding: '22px 20px 20px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 148, transition: 'background .22s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <RuleNumber n={String(i + 1).padStart(2, '0')} />
              <Star size={9} color="rgba(26,34,56,0.18)" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.1,
              }}>{h.name}</div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: 'var(--accent)', marginTop: 8,
              }}>{h.tag}</div>
              {h.spots > 0 && (
                <div style={{
                  fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink)',
                  opacity: 0.48, marginTop: 4,
                }}>{h.spots} spots</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Field Notes / Community ───────────────────────────────────────────────────

function FieldNotes() {
  return (
    <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '72px 32px 64px' }}>
      <div className="home-fieldnotes-grid" style={{
        borderTop: '1px solid rgba(26,34,56,0.12)',
        paddingTop: 56,
      }}>
        <div>
          <MonoLabel>§ 05 · Community</MonoLabel>
          <h2 style={{
            margin: '14px 0 0',
            fontFamily: 'var(--serif)', fontWeight: 400,
            fontSize: 'clamp(28px, 4vw, 40px)',
            letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1,
          }}>A few notes<br/>from the editor.</h2>
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 17.5, lineHeight: 1.65,
          color: 'var(--ink)', opacity: 0.85,
          columnCount: 2, columnGap: 32,
        }}>
          <p style={{ margin: 0 }}>
            <span style={{
              float: 'left', fontFamily: 'var(--serif)',
              fontSize: 52, lineHeight: 0.85,
              marginRight: 8, marginTop: 4,
              color: 'var(--accent)', fontStyle: 'italic',
            }}>H</span>ouston is big in a way that defies a single list. So this isn't one
            — it's a long-running notebook of the places I keep going back to, plus a
            handful that surprised me on the way home.
          </p>
          <p style={{ marginTop: 16 }}>
            Each entry is a real visit. No partnerships, no comped meals. If a spot closes,
            it leaves the index. If hours change, the entry changes. If you find a mistake,
            the email's at the bottom — please tell me.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Utility: daily rotating pick ─────────────────────────────────────────────

function getDailyPick(pool, cacheKey) {
  if (!pool.length) return null;
  const today = new Date().toDateString();
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const { name, date } = JSON.parse(raw);
      if (date === today) {
        const hit = pool.find(l => l.name === name);
        if (hit) return hit;
      }
    }
  } catch {}
  const pick = pool[Math.floor(Math.random() * pool.length)];
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ name: pick.name, date: today }));
  } catch {}
  return pick;
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { locations, loading } = useLocations();

  const foodSpots = useMemo(
    () => locations.filter(l => l.category === 'food' && l.img),
    [locations]
  );
  const otherSpots = useMemo(
    () => locations.filter(l => l.category !== 'food' && l.img),
    [locations]
  );

  const [featuredSpot, setFeaturedSpot] = useState(null);
  const [todaysPick, setTodaysPick]     = useState(null);

  useEffect(() => {
    if (loading) return;
    if (foodSpots.length)  setFeaturedSpot(getDailyPick(foodSpots,  'home_featured_v2'));
    const todayPool = otherSpots.length ? otherSpots : foodSpots;
    if (todayPool.length)  setTodaysPick(getDailyPick(todayPool, 'home_today_v2'));
  }, [loading, foodSpots, otherSpots]);

  // Stable activity counts — seeded once on mount, stable across re-renders
  // We deliberately pass an empty dep array here; useMemo guarantees single-run.
  const activityCounts = useMemo(() =>
    activityTypes.slice(1).map(() => Math.floor(3 + Math.random() * 16)),
  []); /* eslint-disable-line */

  // Spots per neighbourhood
  const neighborhoodCounts = useMemo(() => {
    const counts = {};
    locations.forEach(l => {
      if (l.neighborhood) counts[l.neighborhood] = (counts[l.neighborhood] || 0) + 1;
    });
    return counts;
  }, [locations]);

  // Reuse any cached weather from the existing Weather component
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('weatherCache');
      if (raw) {
        const { data } = JSON.parse(raw);
        if (data?.Temperature) {
          setWeather({ temp: data.Temperature.Imperial.Value, condition: data.WeatherText });
        }
      }
    } catch {}
  }, []);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100%' }}>
      <HeroEditorial totalSpots={locations.length} featuredSpot={featuredSpot} />
      <StatsStrip
        totalSpots={locations.length}
        totalNeighborhoods={neighborhoodBlurbs.length}
        weather={weather}
      />
      <Collections
        foodCount={foodSpots.length}
        activityCount={otherSpots.length}
      />
      <FoodSection foodSpots={foodSpots} />
      <ActivitiesSection todaysPick={todaysPick} activityCounts={activityCounts} />
      <HoodsSection neighborhoodCounts={neighborhoodCounts} />
      <FieldNotes />
    </div>
  );
}
