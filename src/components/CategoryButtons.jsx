import { useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

function CategoryButtons({ buttonData, changeCategory, activeCategory }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="category-slider-wrapper">
      <button className="scroll-btn left" onClick={scrollLeft}>
        <MdChevronLeft />
      </button>

      <div className="category-btn__box scroll-container" ref={scrollRef}>
        {buttonData.map((obj, key) => {
          const isActive = activeCategory === obj.value;
          return (
            <button
              className={`category-btn${isActive ? ' category-btn--active' : ''}`}
              onClick={changeCategory}
              key={key}
              value={obj.value}
              name={obj.title ? obj.title : obj.label}
            >
              <span className="category-btn__thumb">
                <img src={obj.img} alt={obj.label} />
              </span>
              <span className="category-btn__label">{obj.label}</span>
              {obj.count !== undefined && (
                <span className="category-btn__count">{obj.count}</span>
              )}
            </button>
          );
        })}
      </div>

      <button className="scroll-btn right" onClick={scrollRight}>
        <MdChevronRight />
      </button>
    </div>
  );
}

export default CategoryButtons;
