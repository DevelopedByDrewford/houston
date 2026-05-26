import { events, schedules, community, music, sports, creators } from '../data/resources.js'

import { FaTiktok, FaYoutube, FaInstagram, FaFacebook, FaSnapchat, FaPinterest, FaTwitter  } from 'react-icons/fa';

import ResourceSlider from '../components/ResourceSlider.jsx';
import ContactForm from '../components/ContactForm.jsx';

const Resources = () => {

  const iconMap = {
    tiktok: FaTiktok,
    youtube: FaYoutube,
    instagram: FaInstagram,
    facebook: FaFacebook,
    snapchat: FaSnapchat,
    pinterest: FaPinterest,
    twitter: FaTwitter
  };

  return (
    <div className='resources'>
      <h1>Resources</h1>

      {/* Events */}
      <div className='resources__section'>
        <div className='resources__section-label'>Find Events</div>
        <ResourceSlider title='Events in Town' items={events} />
        <ResourceSlider title='Events by Org' items={schedules} />
      </div>

      {/* Creators */}
      <div className='resources__section'>
        <div className='resources__subheader'>Local Creators</div>
        <div className='resources__slider'>
          {creators.map((item, index) => {
            return (
              <div className='creator' key={index}>
                <div className='creator__badge'>Creator</div>

                <img src={item.img} alt={`${item.name}'s profile photo`} className='creator__img'/>

                <div className='creator__name'>{item.name}</div>
                <div className='creator__handle'>{item.handle}</div>

                <div className="creator__socials">
                  {Object.entries(item.links || {}).map(([key, url]) => {
                    const IconComponent = iconMap[key];
                    return IconComponent ? (
                      <a key={key} href={url} target="_blank" rel="noopener noreferrer" className='creator__socials--link'>
                        <IconComponent />
                      </a>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community */}
      <div className='resources__section'>
        <ResourceSlider title='Community' items={community} />
      </div>

      {/* Sports */}
      <div className='resources__section'>
        <ResourceSlider title='Professional Sports' items={sports} />
      </div>

      {/* Tickets */}
      <div className='resources__section'>
        <ResourceSlider title='Ticket Apps' items={music} />
      </div>

      <ContactForm />
    </div>
  );
};

export default Resources;
