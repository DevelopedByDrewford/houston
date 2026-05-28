import { useState, useRef, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import {
  FaTiktok, FaYoutube, FaInstagram, FaFacebook,
  FaSnapchat, FaPinterest, FaTwitter,
} from 'react-icons/fa';
import { events, schedules, community, tickets, sports, creators } from '../data/resources.js';

// ---------- Social icon map ----------

const SOCIAL_ICONS = {
  youtube:   FaYoutube,
  tiktok:    FaTiktok,
  instagram: FaInstagram,
  facebook:  FaFacebook,
  twitter:   FaTwitter,
  snapchat:  FaSnapchat,
  pinterest: FaPinterest,
};

function SocialLinks({ links, className = '' }) {
  return (
    <div className={`rs-socials ${className}`}>
      {Object.entries(links || {}).map(([key, url]) => {
        const Icon = SOCIAL_ICONS[key];
        return Icon ? (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer"
             className="rs-socials__link" title={key}>
            <Icon />
          </a>
        ) : null;
      })}
    </div>
  );
}

// ---------- Compass ----------

const CompassMark = ({ size = 28 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block' }}>
    <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M20 4 L22 19 L20 36 L18 19 Z" fill="currentColor" />
    <path d="M4 20 L19 22 L36 20 L19 18 Z" fill="currentColor" opacity="0.55" />
    <circle cx="20" cy="20" r="1.4" fill="currentColor" />
  </svg>
);

// ---------- Section header ----------

function SectionHeader({ n, title, sub, right }) {
  return (
    <div className="rs-section-hdr">
      <div className="rs-section-hdr__left">
        <span className="rs-section-hdr__badge">§ {n}</span>
        <h2 className="rs-section-hdr__title">{title}</h2>
        {sub && <span className="rs-section-hdr__sub">— {sub}</span>}
      </div>
      {right && <div className="rs-section-hdr__right">{right}</div>}
    </div>
  );
}

// ---------- Hero ----------

function ResourcesHero({ featured }) {
  return (
    <section className="rs-hero">
      <div className="rs-hero__meta">
        <span className="rs-hero__meta-label rs-hero__meta-label--accent">§ 05 · The Companions</span>
        <span className="rs-hero__meta-divider" />
        <span className="rs-hero__meta-label rs-hero__meta-label--dim">
          {creators.length} creators · {events.length + schedules.length} calendars
        </span>
      </div>

      <div className="rs-hero__content">
        <div>
          <h1 className="rs-hero__headline">
            People &amp; pages worth <em>following.</em>
          </h1>
          <p className="rs-hero__copy">
            No one's eating Houston alone. Below are the local creators, calendars,
            community orgs, and sports schedules that fill in what this index can't.
            Open them in tabs; they're all good neighbors.
          </p>
        </div>

        <figure className="rs-hero__featured">
          <span className="rs-hero__featured-label">Creator of the issue</span>
          <div className="rs-hero__featured-identity">
            <div className="rs-hero__featured-avatar">
              <img src={featured.img} alt={featured.name} />
            </div>
            <div>
              <div className="rs-hero__featured-name">{featured.name}</div>
              <div className="rs-hero__featured-handle">{featured.handle}</div>
            </div>
          </div>
          <p className="rs-hero__featured-quote">
            "The Food Sheep grazes wide. Twelve of his picks are in this issue's food
            index — most of them I would never have found."
          </p>
          <div className="rs-hero__featured-footer">
            <SocialLinks links={featured.links} className="rs-hero__featured-socials" />
            <span className="rs-hero__featured-picks">{featured.picked} picks here</span>
          </div>
        </figure>
      </div>
    </section>
  );
}

// ---------- Creators ----------

function CreatorsSection({ view, setView }) {
  const [activeBeat, setActiveBeat] = useState('All');
  const beats = useMemo(
    () => ['All', ...Array.from(new Set(creators.map(c => c.beat)))],
    []
  );
  const filtered = activeBeat === 'All' ? creators : creators.filter(c => c.beat === activeBeat);

  return (
    <section className="rs-creators">
      <SectionHeader
        n="05.01" title="People we follow"
        sub="local creators worth a notification"
        right={
          <span className="rs-mono-dim">{filtered.length} of {creators.length}</span>
        }
      />

      <div className="rs-beat-chips">
        {beats.map(b => (
          <button key={b} onClick={() => setActiveBeat(b)}
                  className={`rs-beat-chip${activeBeat === b ? ' rs-beat-chip--active' : ''}`}>
            {b}
          </button>
        ))}
      </div>

      {view === 'cards' ? (
        <div className="rs-creator-grid">
          {filtered.map((c, i) => (
            <CreatorCard key={c.handle} c={c} i={i} />
          ))}
        </div>
      ) : (
        <CreatorTable creators={filtered} />
      )}
    </section>
  );
}

function CreatorCard({ c, i }) {
  return (
    <article className="rs-creator-card">
      <div className="rs-creator-card__header">
        <span className="rs-rule-num">{String(i + 1).padStart(2, '0')}</span>
        <span className="rs-creator-card__badge">Creator</span>
      </div>
      <div className="rs-creator-card__avatar">
        <img src={c.img} alt={c.name} />
      </div>
      <h3 className="rs-creator-card__name">{c.name}</h3>
      <div className="rs-creator-card__handle">{c.handle}</div>
      <div className="rs-creator-card__beat">{c.beat}</div>
      <div className="rs-creator-card__footer">
        <SocialLinks links={c.links} />
        <span className="rs-creator-card__picks">{c.picked} picks</span>
      </div>
    </article>
  );
}

function CreatorTable({ creators: list }) {
  return (
    <ul className="rs-creator-table">
      {list.map((c, i) => (
        <li key={c.handle} className="rs-creator-row">
          <span className="rs-rule-num rs-rule-num--long">№ {String(i + 1).padStart(3, '0')}</span>
          <div className="rs-creator-row__avatar">
            <img src={c.img} alt={c.name} />
          </div>
          <div>
            <div className="rs-creator-row__name">{c.name}</div>
            <div className="rs-creator-row__handle">{c.handle}</div>
          </div>
          <div className="rs-creator-row__beat">{c.beat}</div>
          <SocialLinks links={c.links} />
          <div className="rs-creator-row__picks">{c.picked} picks ›</div>
        </li>
      ))}
    </ul>
  );
}

// ---------- Logo grid section ----------

function LogoSection({ n, title, sub, items }) {
  return (
    <section className="rs-logo-section">
      <SectionHeader n={n} title={title} sub={sub}
        right={<span className="rs-mono-dim">{items.length} sources</span>} />
      <div className="rs-logo-grid">
        {items.map((it, i) => (
          <a key={it.title} href={it.url} target="_blank" rel="noopener noreferrer"
             className="rs-logo-card">
            <div className="rs-logo-card__header">
              <span className="rs-rule-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="rs-logo-card__kind">{it.kind}</span>
            </div>
            <div className="rs-logo-card__img-wrap">
              <img src={it.img} alt={it.title} />
            </div>
            <div className="rs-logo-card__title">{it.title}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- Sports ----------

function SportsSection() {
  return (
    <section className="rs-sports">
      <SectionHeader n="05.04" title="Pro sports" sub="six teams, year-round"
        right={<span className="rs-mono-dim">By season →</span>} />
      <div className="rs-sports-table">
        {sports.map((s, i) => (
          <a key={s.title} href={s.url} target="_blank" rel="noopener noreferrer"
             className={`rs-sport-row${i > 0 ? ' rs-sport-row--border' : ''}`}>
            <span className="rs-rule-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="rs-sport-row__logo">
              <img src={s.img} alt={s.title} />
            </div>
            <div>
              <div className="rs-sport-row__name">Houston {s.title}</div>
              <div className="rs-sport-row__kind">{s.kind}</div>
            </div>
            <div className="rs-sport-row__venue">{s.venue}</div>
            <div className="rs-sport-row__season">{s.season}</div>
            <div className="rs-sport-row__buy">Buy ›</div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- Contact ----------

function ContactSection() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_rt6gxg6', 'template_fqcn51m', form.current, '0MfovJdS9LXoR7xLU')
      .then(() => {
        alert('Tip sent — thanks!');
        form.current.reset();
      }, () => {
        alert('Failed to send. Try again later.');
      });
  };

  return (
    <section className="rs-contact">
      <div className="rs-contact__inner">
        <div className="rs-contact__left">
          <span className="rs-contact__label">§ 05.05 · Submit a tip</span>
          <h2 className="rs-contact__headline">Know a spot I missed?</h2>
          <p className="rs-contact__copy">
            Send a name, neighborhood, and a sentence on why it belongs. I read all of them,
            and I owe most of this index to people sending me their corners of the city.
          </p>
          <div className="rs-contact__email">Or email · drew@houstonguide.io</div>
        </div>

        <form className="rs-contact__form" ref={form} onSubmit={sendEmail}>
          <label className="rs-field rs-field--full">
            <span className="rs-field__label">Your name</span>
            <input type="text" name="name" placeholder="First and last" required className="rs-field__input" />
          </label>
          <label className="rs-field">
            <span className="rs-field__label">Email</span>
            <input type="email" name="email" placeholder="you@somewhere.com" required className="rs-field__input" />
          </label>
          <label className="rs-field">
            <span className="rs-field__label">Spot name</span>
            <input type="text" name="subject" placeholder="What's it called?" required className="rs-field__input" />
          </label>
          <label className="rs-field">
            <span className="rs-field__label">Neighborhood</span>
            <input type="text" name="neighborhood" placeholder="Where in Houston?" className="rs-field__input" />
          </label>
          <label className="rs-field">
            <span className="rs-field__label">Category</span>
            <input type="text" name="category" placeholder="Food, music, parks…" className="rs-field__input" />
          </label>
          <label className="rs-field rs-field--full">
            <span className="rs-field__label">Why it belongs</span>
            <textarea name="message" rows={4} placeholder="A sentence or two." required className="rs-field__input rs-field__input--textarea" />
          </label>
          <div className="rs-contact__form-footer">
            <span className="rs-contact__form-note">I read every submission.</span>
            <button type="submit" className="rs-contact__submit">Send the tip →</button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ---------- Page ----------

const Resources = () => {
  const [creatorView, setCreatorView] = useState('cards');
  const featured = creators[0];

  return (
    <div className="rs-page">
      <ResourcesHero featured={featured} />
      <CreatorsSection view={creatorView} setView={setCreatorView} />
      <LogoSection n="05.02"  title="Find events"      sub="newsletters, calendars, listings"   items={events} />
      <LogoSection n="05.02b" title="Venue schedules"  sub="who's playing, hosting, opening"    items={schedules} />
      <LogoSection n="05.03"  title="Community"        sub="local advocacy, recognition, civic" items={community} />
      <SportsSection />
      <LogoSection n="05.04b" title="Tickets"          sub="resale and primary"                 items={tickets} />
      <ContactSection />
    </div>
  );
};

export default Resources;
