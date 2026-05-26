const sortByName = (arr) => [...arr].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

export default function buildActivitiesFiltered(locations) {
  return {
    all: sortByName(locations.filter(place => place.category !== 'food')),
    bars: sortByName(locations.filter(place => place.category === 'bar')),
    books: sortByName(locations.filter(place => place.category === 'books')),
    coffee: sortByName(locations.filter(place => place.category === 'coffee')),
    daiquiris: sortByName(locations.filter(place => place.category === 'daiquiris')),
    markets: sortByName(locations.filter(place => place.category === 'market')),
    movies: sortByName(locations.filter(place => place.category === 'movies')),
    museum: sortByName(locations.filter(place => place.category === 'museum')),
    music: sortByName(locations.filter(place => place.category === 'music')),
    parks: sortByName(locations.filter(place => place.category === 'park')),
    photo: sortByName(locations.filter(place => place.category === 'photo')),
    attraction: sortByName(locations.filter(place => place.category === 'attraction')),
  };
}
