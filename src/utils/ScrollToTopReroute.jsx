import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = {};

const getContainer = () => document.querySelector('.app-router-wrapper__inner') || window;

const ScrollToTopReroute = () => {
  const { key } = useLocation();
  const navType = useNavigationType();
  const prevKey = useRef(null);

  useEffect(() => {
    const container = getContainer();

    // Save outgoing position before the key changes
    if (prevKey.current && prevKey.current !== key) {
      const el = document.querySelector('.app-router-wrapper__inner');
      positions[prevKey.current] = el ? el.scrollTop : window.scrollY;
    }
    prevKey.current = key;

    if (navType === 'POP') {
      const saved = positions[key] ?? 0;
      const el = document.querySelector('.app-router-wrapper__inner');
      if (el) {
        el.scrollTop = saved;
      } else {
        window.scrollTo(0, saved);
      }
    } else {
      if (container === window) {
        window.scrollTo(0, 0);
      } else {
        container.scrollTop = 0;
      }
    }
  }, [key, navType]);

  return null;
};

export default ScrollToTopReroute;
