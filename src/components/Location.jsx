import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Badges from "./Badges";

const Location = ({item, setLat, setLon, setZoom}) => {
    const navigate = useNavigate();
    const hasImg = item.img && item.img.length > 0;
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleClick = () => {
        if (!item.coordinates) return;
        setLat(item.coordinates[0]);
        setLon(item.coordinates[1]);
        setZoom(17);
        navigate('/');
      };

    const slugify = (text) =>
        (text || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

    return (
      <div className='location'>

        {/* style inspo: https://www.sixsenses.com/en/hotels-resorts/ */}

        <div className={`location__img-box${hasImg && !imgLoaded ? ' location__img-box--skeleton' : ''}`}>
            {hasImg &&
                <img
                    className='location__img'
                    src={item.img}
                    alt="Item"
                    onLoad={() => setImgLoaded(true)}
                    style={imgLoaded ? undefined : { opacity: 0, position: 'absolute' }}
                />}
        </div>

        <div className='location__details'>
            {/* Neighborhood */}
            <Link to={`/neighborhoods/${slugify(item.neighborhood)}`} className='location__details--neighborhood'>
                {item.neighborhood}
            </Link>

            {/* Name */}
            <a className='location__details--name' href={item.website} target='_blank'>
                <span>{item.name}</span>
            </a>
            
            {/* Blurb */}
            <p className='location__details--blurb'>
                {item.blurb}
            </p>
            
            {/* Badges / Filters */}
            {item.badges && 
                <Badges item={item}/>}

            {/* Desciption */}
            <ul className='location__details--description'>
                {(item.description || []).map((point, i) => (
                    <li key={i} className='location__details--description-item'>
                        {point}
                    </li>
                ))}
            </ul>

            <div className='location__btn-box'>
                {/* View on Map */}
                <button 
                    className='location__details--map-btn'
                    onClick={handleClick}>
                        <span>View on Map</span>
                </button>

                {/* Website */}
                <a 
                    className='location__details--site-btn'
                    href={item.website}
                    target='_blank'>
                        <span>View Website</span>
                </a>
            </div>

        </div>

      </div>
    );
  };
  
  export default Location;