const sortByName = (arr) => [...arr].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

export default function buildRestaurantsFiltered(locations) {
  return {
    food: sortByName(locations.filter(place => place.subcategory && place.category !== 'attraction')),
    bakery: sortByName(locations.filter(place => place.subcategory?.includes('bakery'))),
    bbq: sortByName(locations.filter(place => place.subcategory?.includes('bbq'))),
    burgers: sortByName(locations.filter(place => place.subcategory?.includes('burgers'))),
    burritos: sortByName(locations.filter(place => place.subcategory?.includes('burritos'))),
    breakfast: sortByName(locations.filter(place => place.subcategory?.includes('breakfast'))),
    chicken: sortByName(locations.filter(place => place.subcategory?.includes('chicken'))),
    crawfish: sortByName(locations.filter(place => place.subcategory?.includes('crawfish'))),
    dessert: sortByName(locations.filter(place => place.subcategory?.includes('dessert'))),
    dumplings: sortByName(locations.filter(place => place.subcategory?.includes('dumplings'))),
    hotdogs: sortByName(locations.filter(place => place.subcategory?.includes('hotdogs'))),
    poke: sortByName(locations.filter(place => place.subcategory?.includes('poke'))),
    pasta: sortByName(locations.filter(place => place.subcategory?.includes('pasta'))),
    pizza: sortByName(locations.filter(place => place.subcategory?.includes('pizza'))),
    pho: sortByName(locations.filter(place => place.subcategory?.includes('pho'))),
    ramen: sortByName(locations.filter(place => place.subcategory?.includes('ramen'))),
    rice: sortByName(locations.filter(place => place.subcategory?.includes('ricebowl'))),
    salads: sortByName(locations.filter(place => place.subcategory?.includes('salads'))),
    sandwiches: sortByName(locations.filter(place => place.subcategory?.includes('sandwiches'))),
    seafood: sortByName(locations.filter(place => place.subcategory?.includes('seafood'))),
    soup: sortByName(locations.filter(place => place.subcategory?.includes('soup'))),
    steak: sortByName(locations.filter(place => place.subcategory?.includes('steak'))),
    sushi: sortByName(locations.filter(place => place.subcategory?.includes('sushi'))),
    tacos: sortByName(locations.filter(place => place.subcategory?.includes('tacos'))),
    upscale: sortByName(locations.filter(place => place.subcategory?.includes('upscale'))),
    halls: sortByName(locations.filter(place => place.subcategory?.includes('hall'))),
  };
}
