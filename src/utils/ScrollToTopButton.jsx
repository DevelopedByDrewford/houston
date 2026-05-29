import { useEffect, useState } from 'react';

export default function ScrollToTopButton({ targetRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
  const container = targetRef?.current;
  if (!container) return;

  const handleScroll = () => {
    const isScrolledDown = container.scrollTop > 100;
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight;

    setVisible(isScrolledDown && !isAtBottom);
  };

  container.addEventListener('scroll', handleScroll);
  return () => container.removeEventListener('scroll', handleScroll);
}, [targetRef]);


  const scrollToTop = () => {
    if (targetRef?.current) {
      targetRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      className='scroll-to-top-button'
    >
      {/* ↑ top */}
      <img src='https://i.imgur.com/5Vui63v.png' />
    </button>
  ) : null;
}