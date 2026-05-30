import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = {};

const getContainer = () => document.querySelector('.app-router-wrapper__inner') || window;

const ScrollToTopReroute = () => {
  const { pathname, key } = useLocation();
  const navType = useNavigationType();
  const prevKey = useRef(null);
  const prevPathname = useRef(null);

  useEffect(() => {
    const container = getContainer();
    const pathnameChanged = prevPathname.current !== pathname;

    // Save outgoing scroll position only when leaving a page
    if (prevKey.current && prevKey.current !== key && pathnameChanged) {
      const el = document.querySelector('.app-router-wrapper__inner');
      positions[prevKey.current] = el ? el.scrollTop : window.scrollY;
    }
    prevKey.current = key;
    prevPathname.current = pathname;

    // Search-param-only changes (same pathname) should not scroll
    if (!pathnameChanged) return;

    if (navType === 'POP') {
      const saved = positions[key] ?? 0;
      const el = document.querySelector('.app-router-wrapper__inner');
      if (el) el.scrollTop = saved;
      else window.scrollTo(0, saved);
    } else {
      if (container === window) window.scrollTo(0, 0);
      else container.scrollTop = 0;
    }
  }, [key, navType, pathname]);

  return null;
};

export default ScrollToTopReroute;
