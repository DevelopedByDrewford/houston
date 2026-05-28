// Region metadata and curated display data for each neighborhood.
// region: grouping for filter tabs
// tag: short descriptor shown on cards
// img: hero/card image
// blurb: one-liner for the tile card (longer blurbs live in neighborhoods.js)

const REGION_COPY = {
  all:        'Eighty-eight corners of Houston, sorted into six regions. Use the tabs, the map, or the directory at the bottom — every name links to its own page.',
  inner_loop: 'The dense core. Walking is realistic here, bikes are common, and most nights end on a patio in Montrose or Midtown.',
  north:      'The Heights and the wards above it. Bungalows, breweries, soul food landmarks, and one of the best music halls in the country.',
  south:      'The Museum District, Rice Village, and the long curve south. Trees, institutions, and the medical center where everyone in Texas ends up sooner or later.',
  east:       "Once the immigrant entry point and the freight-rail spine. Now where the city's artists, taquerias, and warehouse parties live.",
  west:       'Galleria, River Oaks, the Energy Corridor, Memorial Park. Shopping cathedrals, suburban tree canopies, and a Korean grocery as big as a mall.',
  outer:      'The metro. Master-planned communities, Vietnamese-Cajun crawfish, NASA in Clear Lake, the Renaissance Festival in Todd Mission.',
};

const REGIONS = [
  { id: 'all',        label: 'All' },
  { id: 'inner_loop', label: 'Inner Loop' },
  { id: 'north',      label: 'Heights & North' },
  { id: 'south',      label: 'Museum District & South' },
  { id: 'east',       label: 'East End' },
  { id: 'west',       label: 'Galleria & West' },
  { id: 'outer',      label: 'Greater Houston' },
];

const NEIGHBORHOOD_META = [
  // Inner Loop
  { name: 'Downtown',             region: 'inner_loop', tag: 'Bars · Theatre',     img: 'https://i.imgur.com/073SKpA.png', blurb: 'Skyscrapers, theaters, METRORail. The dense city.' },
  { name: 'Midtown',              region: 'inner_loop', tag: 'Late Night',          img: 'https://i.imgur.com/M4n5yMA.png', blurb: 'Breakfast Klub at sunrise, rooftops at midnight.' },
  { name: 'Montrose',             region: 'inner_loop', tag: 'Eat · Drink · Walk',  img: 'https://i.imgur.com/f1D69fH.png', blurb: 'The cocktail bar that taught Houston what to order — and three dozen more nearby.' },
  { name: 'EaDo',                 region: 'inner_loop', tag: 'Art · Warehouse',     img: 'https://i.imgur.com/bOpeaV8.png', blurb: 'Houston\'s original Chinatown, now warehouse galleries and music venues.' },
  { name: 'Hyde Park',            region: 'inner_loop', tag: 'Pizza · Lounges',     img: 'https://i.imgur.com/sJAezN0.png', blurb: 'Sub-pocket of Montrose: wood-fired pizza, cozy lounges, live music.' },
  { name: 'Fourth Ward',          region: 'inner_loop', tag: 'History · Walk',      img: 'https://i.imgur.com/3p9bFER.png', blurb: 'Freedmen\'s Town. Hand-laid brick streets — a city landmark.' },
  { name: 'Washington',           region: 'inner_loop', tag: 'Nightlife · Tacos',   img: 'https://i.imgur.com/EPcpVPu.png', blurb: 'Tacos, rooftop bars, brunch crowds. Loud and loose.' },
  { name: 'Greenway',             region: 'inner_loop', tag: 'Parks · Cafés',       img: 'https://i.imgur.com/tg2PmFP.png', blurb: 'Upper Kirby — tree-lined and walkable, Levy Park anchors it.' },

  // North
  { name: 'Heights',              region: 'north', tag: 'Brunch · Boutique', img: 'https://i.imgur.com/RL69dJb.png', blurb: 'Bungalows and breweries. Jūn, Big Star Bar, White Oak Music Hall.' },
  { name: 'Northside',            region: 'north', tag: 'Coffee · Tacos',    img: 'https://i.imgur.com/8fynE8j.png', blurb: 'Cariño Coffee, Cochinita, Rabbit\'s Got the Gun. Mexican-American backbone.' },
  { name: 'Greater Fifth Ward',   region: 'north', tag: 'History · Soul',    img: 'https://i.imgur.com/Q4szUhm.png', blurb: 'A historically Black neighborhood that fed the blues into the bayou.' },
  { name: 'Acres Home',           region: 'north', tag: 'Community',         img: 'https://i.imgur.com/bjzXRJ2.png', blurb: 'Tight-knit, tree-lined, deep roots.' },
  { name: 'Independence Heights', region: 'north', tag: 'BBQ · Soul',        img: 'https://i.imgur.com/MyOdkpr.png', blurb: 'Houston\'s first African American municipality. Esther\'s, Gatlin\'s, Barbecue Inn.' },
  { name: 'Oak Forest',           region: 'north', tag: 'Pizza · Patio',     img: 'https://i.imgur.com/k19pGeB.png', blurb: 'A.k.a. GOOF. d\'Alba pizza, Sao Lao, neighborhood bike rides.' },
  { name: 'Central Northwest',    region: 'north', tag: 'Residential',       img: 'https://i.imgur.com/7zEDdGc.jpeg', blurb: 'Garden Oaks adjacent. Ranch homes, leafy streets, easy commute.' },
  { name: 'Memorial Park',        region: 'north', tag: 'Parks · Run',       img: 'https://i.imgur.com/LE8Nreo.png', blurb: 'The big park. Trails, arboretum, Brenner\'s on the Bayou next door.' },

  // South
  { name: 'Museum District',      region: 'south', tag: 'Culture',           img: 'https://i.imgur.com/fmRlI8o.png', blurb: 'One mile, twenty institutions. Lucille\'s, Café Leonelli, ZaZa.' },
  { name: 'Rice Village',         region: 'south', tag: 'Cafe · Study',      img: 'https://i.imgur.com/UP2J3Od.png', blurb: 'Milton\'s, Navy Blue, Hamsa. Walkable college-adjacent.' },
  { name: 'University Place',     region: 'south', tag: 'Walkable',          img: 'https://i.imgur.com/EE4kPPm.png', blurb: 'Rice campus radius. Eau Tour, Roma, Hamsa.' },
  { name: 'West University Place', region: 'south', tag: 'Family · Brunch',  img: 'https://i.imgur.com/bjXBdBr.png', blurb: 'Quiet streets, Tiny\'s No. 5, Simone on Sunset, Little Matt\'s.' },
  { name: 'Astrodome Area',       region: 'south', tag: 'Sports · Events',   img: 'https://i.imgur.com/U1IBhjG.png', blurb: 'The big eye, NRG Stadium, the rodeo every March.' },
  { name: 'South Central',        region: 'south', tag: 'Community',         img: 'https://i.imgur.com/rX9Y8wb.jpeg', blurb: 'Tequila 45, The Neighborhood Scoop. Community gatherings.' },
  { name: 'South Side',           region: 'south', tag: 'Soul · Creole',     img: 'https://i.imgur.com/Ys8q9Dw.png', blurb: 'Sunnyside, Frenchy\'s, Betty\'s Kitchen MS.' },

  // East
  { name: 'Second Ward',          region: 'east', tag: 'Tex-Mex · Beer',    img: 'https://i.imgur.com/MLSutXx.png', blurb: 'Segundo Barrio. El Tiempo, Moon Tower, Andes Café.' },
  { name: 'Eastwood',             region: 'east', tag: 'Cozy · Live',       img: 'https://i.imgur.com/rKWi1xM.jpeg', blurb: 'La Reynera at sunrise, Monchys for the $1 tacos, Bohemeo\'s after dark.' },
  { name: 'Gulfgate',             region: 'east', tag: 'Tex-Mex · Pho',    img: 'https://i.imgur.com/suFWJbs.png', blurb: 'Doneraki since 1973. Vietnamese counters worth the drive.' },
  { name: 'Southeast Houston',    region: 'east', tag: 'Late Night',        img: 'https://i.imgur.com/2ixSXGP.png', blurb: 'Frenchy\'s, House of Pies on Fuqua, Don\'Key in Pasadena.' },

  // West
  { name: 'Chinatown',            region: 'west', tag: 'Noodles · Hot Pot', img: 'https://i.imgur.com/MJoN0wZ.png', blurb: 'Asiatown. Bellaire Blvd from Fondren to the Beltway. Worth the drive.' },
  { name: 'Bellaire',             region: 'west', tag: 'Eat · Walk',        img: 'https://i.imgur.com/vJrs4N3.png', blurb: 'Tree-lined enclave. International eats, walkable blocks.' },
  { name: 'Galleria',             region: 'west', tag: 'Shopping · Eat',    img: 'https://i.imgur.com/5bwGdT7.png', blurb: 'Texas\'s biggest mall, an indoor ice rink, towers full of restaurants.' },
  { name: 'Uptown',               region: 'west', tag: 'Upscale',           img: 'https://i.imgur.com/64dFNpj.jpeg', blurb: 'Amalfi, Emilia\'s Havana, CIEL, Musaafer. The luxe end.' },
  { name: 'River Oaks',           region: 'west', tag: 'Upscale · Walk',   img: 'https://i.imgur.com/4zgf0wZ.png', blurb: 'Wealth wears a shade tree. Leo\'s, Zanti, the garden walk.' },
  { name: 'Mid West',             region: 'west', tag: 'Persian · Karaoke', img: 'https://i.imgur.com/LNj85CD.png', blurb: 'Aban, Dumplings & Noodles, Soju Blues karaoke.' },
  { name: 'CityCentre',           region: 'west', tag: 'Mall · Patio',      img: 'https://i.imgur.com/Gooaw4t.png', blurb: 'Walkable mixed-use island, year-round events.' },
  { name: 'Energy Corridor',      region: 'west', tag: 'Work · Parks',      img: 'https://i.imgur.com/FnywpoV.png', blurb: 'Office towers wrapped in 26,000 acres of park.' },
  { name: 'Westside',             region: 'west', tag: 'Casual',            img: 'https://i.imgur.com/f3evgld.png', blurb: 'Easy strips, neighborhood grills, low-key sushi.' },
  { name: 'Northwest Houston',    region: 'west', tag: 'Tacos · Parks',     img: 'https://i.imgur.com/6rUQRqF.png', blurb: 'El Rey tacos, Gus\'s hot chicken, Bear Creek Pioneers Park.' },
  { name: 'Blalock Market',       region: 'west', tag: 'Asian Grocery',     img: 'https://i.imgur.com/fs4QW4j.png', blurb: 'Spring Branch strip anchored by 99 Ranch.' },

  // Outer
  { name: 'Spring',               region: 'outer', tag: 'Historic · Eats',    img: 'https://i.imgur.com/fYTRRTz.png', blurb: 'Old Town Spring, Wunsche Bros, food-truck nights.' },
  { name: 'The Woodlands',        region: 'outer', tag: 'Upscale · Walk',     img: 'https://i.imgur.com/jNTCv5a.png', blurb: 'Market Street, the Waterway, Como Social Club, Amrina.' },
  { name: 'Katy',                 region: 'outer', tag: 'Asian · Family',     img: 'https://i.imgur.com/4HC1MKD.png', blurb: 'Katy Asian Town, Phat Eatery, Home Run Dugout.' },
  { name: 'Cinco Ranch',          region: 'outer', tag: 'Family · Suburb',    img: 'https://i.imgur.com/CtYQZBV.png', blurb: 'Master-planned. Top schools, golf course, easy highways.' },
  { name: 'Cypress',              region: 'outer', tag: 'Suburb · Eats',      img: 'https://i.imgur.com/tGglN94.png', blurb: 'Growing fast. Worth-the-drive eateries hidden in strip malls.' },
  { name: 'Sugar Land',           region: 'outer', tag: 'Global · Suburb',    img: 'https://i.imgur.com/ws5fzPw.png', blurb: 'Town Square + Hwy 6. Latin sushi, Creole gumbo, Filipino plates.' },
  { name: 'Stafford',             region: 'outer', tag: 'Hidden Gems',        img: 'https://i.imgur.com/j1xtM4w.png', blurb: 'Quiet on the surface, big-flavor underneath: Viet-Cajun, Nigerian, momo.' },
  { name: 'Rosenberg',            region: 'outer', tag: 'BBQ · Sports',       img: 'https://i.imgur.com/3KgxV5X.jpeg', blurb: 'Small-town smoke and family taquerias.' },
  { name: 'Tomball',              region: 'outer', tag: 'Historic · Market',  img: 'https://i.imgur.com/clXVUrP.png', blurb: 'Historic downtown, farmers market, family BBQ.' },
  { name: 'Todd Mission',         region: 'outer', tag: 'Festival',           img: 'https://i.imgur.com/PQG1yvx.png', blurb: 'Home of the Texas Renaissance Festival each fall.' },
  { name: 'Webster',              region: 'outer', tag: 'Sports · Casual',    img: 'https://i.imgur.com/hP8fel3.png', blurb: 'Down the road from NASA. Sports bars and global bites.' },
  { name: 'Kemah',                region: 'outer', tag: 'Waterfront · Family', img: 'https://i.imgur.com/Nnk2K5P.png', blurb: 'Waterfront boardwalk. Landry\'s, Bubba Gump, amusement rides.' },
  { name: 'Humble',               region: 'outer', tag: 'Suburb · Park',      img: 'https://i.imgur.com/uM59Zq2.png', blurb: 'Humble City Cafe, Pappas Seafood, the Mercer Arboretum.' },
  { name: 'Deerbrook',            region: 'outer', tag: 'Suburb · Mall',      img: 'https://i.imgur.com/pnIoR4L.png', blurb: 'Mall hub. Family-friendly suburb radius around it.' },
  { name: 'Atascocita',           region: 'outer', tag: 'Lakes · Family',     img: 'https://i.imgur.com/dM4OAIa.png', blurb: 'Lakes, golf, family neighborhoods, easy access to the city.' },
  { name: 'Summerwood',           region: 'outer', tag: 'Family · Eats',      img: 'https://i.imgur.com/Wn0HtBE.jpeg', blurb: 'Bocca, Akashi, Café Rian. Master-planned, lively.' },
  { name: 'Willowbrook',          region: 'outer', tag: 'Global Eats',        img: 'https://i.imgur.com/mkaW2mJ.png', blurb: 'NW Houston, diverse strip-mall food map.' },
  { name: 'Jersey Village',       region: 'outer', tag: 'Suburb · Eats',      img: 'https://i.imgur.com/QnX1v4U.png', blurb: 'Restaurant Week each spring. Adriatic Café, Little Kitchen.' },
  { name: 'Greenspoint',          region: 'outer', tag: 'Redeveloping',       img: 'https://i.imgur.com/rlZWpee.png', blurb: 'North Houston District. CityNorth, parks, redevelopment.' },
  { name: 'Houston Gardens',      region: 'outer', tag: 'Block-Party',        img: 'https://i.imgur.com/MZa3suj.png', blurb: 'Homestead Road car shows, food trucks, daiquiri stands.' },
  { name: 'East Aldine',          region: 'outer', tag: 'Family · Park',      img: 'https://i.imgur.com/kY0JG1d.png', blurb: 'Town Center revitalization, amphitheater, splash pad.' },
  { name: 'Little York',          region: 'outer', tag: 'Tamales · BBQ',      img: 'https://i.imgur.com/8kUBd84.png', blurb: 'Doña Tere tamales, Pappas BBQ on Eastex.' },
  { name: 'Airline',              region: 'outer', tag: 'Market · Global',    img: 'https://i.imgur.com/gczEaJs.png', blurb: 'Houston Farmers Market. International groceries and counters.' },
];

export { REGIONS, REGION_COPY, NEIGHBORHOOD_META };
