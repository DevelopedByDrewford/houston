

import { FaTree, FaShoppingBasket, FaCity, FaBuilding, FaMusic, FaLandmark, FaShoppingBag, FaLightbulb, FaHandsHelping, FaBriefcase, FaRoad, FaHardHat, FaRoute, FaCocktail, FaRainbow, FaBeer, FaUniversity, FaShoppingCart, FaUtensils } from 'react-icons/fa';
import { FaBridgeWater, FaHatCowboy, FaStore } from "react-icons/fa6";
import { LuFerrisWheel } from "react-icons/lu";
import { MdStadium, MdOutlineTempleBuddhist, MdFamilyRestroom, MdWarehouse, MdLocationCity, MdPeople, MdDirectionsCar, MdExplore, MdGridView, MdApartment, MdSchool, MdHomeWork, MdStreetview } from 'react-icons/md';
import { HiOfficeBuilding } from 'react-icons/hi';
import { GiPineTree, GiDeerHead, GiKnifeFork, GiVillage, GiFamilyHouse, GiBrickWall, GiGardeningShears, GiTreehouse, GiOak, GiGraduateCap, GiRailRoad, GiFactory, GiFlowerPot, GiCrystalBars, GiSunflower, GiForestCamp, GiRoyalLove, GiWell, GiSpaceShuttle, GiDiamondRing } from 'react-icons/gi';


const neighborhoodBlurbs = [
    {
        name: 'Acres Home',
        blurb: "Acres Home is a historic neighborhood located in northwest Houston, known for its tight-knit community and rich cultural heritage. The area features local restaurants, parks, and annual events that celebrate its vibrant history. It’s a welcoming place where tradition and growth come together in the heart of the city’s northwest side.",
        nearby: ['Central Northwest', 'Greenspoint', 'Independence Heights', 'Jersey Village', 'Northside', 'Oak Forest'],
        icon: FaTree,
        img: 'https://i.imgur.com/bjzXRJ2.png'
    },
    {
        name: 'Airline',
        blurb: "Airline is a diverse and bustling neighborhood located just north of central Houston, known for its vibrant markets and cultural mix. One of its most iconic spots is the Houston Farmers Market, offering a rich selection of local produce and international goods. The area is a hub for authentic food, small businesses, and a strong sense of local pride. Airline is where tradition, entrepreneurship, and community come together.",
        nearby: ['Northside', 'Independence Heights', 'Acres Home'],
        icon: FaStore,
        img: 'https://i.imgur.com/gczEaJs.png' 
    },
    {
        name: 'Astrodome Area',
        blurb: "The Astrodome area sits just south of downtown Houston, known for its iconic stadium and surrounding sports complexes. This bustling district blends entertainment, dining, and event venues with ongoing development. Visitors and locals alike enjoy easy access to concerts, games, and nearby parks in this vibrant part of the city.",
        nearby: ['Museum District', 'South Central', 'South Side', 'University Place', 'West University Place'],
        icon: MdStadium,
        img: 'https://i.imgur.com/U1IBhjG.png'
    },
    {
        name: 'Atascocita',
        blurb: "Atascocita is a growing suburban community located northeast of Houston, known for its family-friendly atmosphere and scenic lakes. This area offers plenty of parks, golf courses, and shopping centers, making it popular for those seeking a quieter lifestyle close to the city. With strong schools and community events, Atascocita blends small-town charm with convenient Houston access.",
        nearby: ['Deerbrook', 'Humble', 'Summerwood'],
        icon: FaBridgeWater,
        img: 'https://i.imgur.com/dM4OAIa.png'
    },
    {
        name: 'Bellaire',
        blurb: "Bellaire is a charming enclave in southwest Houston known for its rich cultural diversity and dynamic food scene. From authentic international cuisines to trendy cafes and bakeries, Bellaire attracts food lovers from all over the city. Its tree-lined streets, walkable neighborhoods, and strong community spirit make it a unique blend of urban convenience and small-town warmth.",
        nearby: ['West University', 'Meyerland', 'Gulfton'],
        icon: FaUtensils,  
        img: 'https://i.imgur.com/vJrs4N3.png'
    },
    {
        name: 'Blalock Market',
        blurb: "Blalock Market is a bustling retail hub located in the Spring Branch neighborhood of northwest Houston. Situated along the Katy Freeway (I-10) between Loop 610 and Beltway 8, it serves the upscale Memorial and Spring Branch areas. Anchored by 99 Ranch Market, the center offers a diverse mix of dining, shopping, and services, making it a popular destination for both locals and visitors. With high traffic counts and a variety of amenities, Blalock Market is a vibrant part of Houston's retail landscape.",
        nearby: ['Central Northwest', 'CityCentre', 'Mid West', 'Northwest Houston', 'Uptown'],
        icon: FaShoppingBasket,
        img: 'https://i.imgur.com/fs4QW4j.png'
    },
    {
        name: 'Central Northwest',
        blurb: "Central Northwest Houston includes neighborhoods like Oak Forest and Garden Oaks, located just north of Loop 610 and west of I-45. The area features a mix of classic ranch-style and newer homes. With easy access to downtown and the Galleria, plus parks and good schools nearby, it offers a balanced mix of city convenience and residential charm.",
        nearby: ['Acres Home', 'Blalock Market', 'Independence Heights', 'Jersey Village', 'Oak Forest'],
        icon: HiOfficeBuilding,
        img: 'https://i.imgur.com/7zEDdGc.jpeg'
    },
    {
        name: 'Chinatown',
        blurb: "Houston's Chinatown, also known as Asiatown, is a vibrant neighborhood located in the southwestern part of the city, primarily along Bellaire Boulevard between Fondren and Beltway 8. Established in the 1980s, it has grown into one of the largest and most diverse Asian communities in the United States . The area boasts a rich tapestry of cultures, including Chinese, Vietnamese, Korean, Malaysian, and more, reflected in its array of restaurants, markets, and cultural centers . Visitors can explore bustling shopping centers, savor authentic Asian cuisines, and experience vibrant cultural festivals throughout the year.",
        nearby: ['CityCentre', 'Galleria', 'Mid West', 'Westside', 'West University Place'],
        icon: MdOutlineTempleBuddhist,
        img: 'https://i.imgur.com/MJoN0wZ.png'
    },
    {
        name: 'Cinco Ranch',
        blurb: "Cinco Ranch is a master-planned community located approximately 25 miles west of downtown Houston, within Fort Bend and Harris counties. This expansive neighborhood offers a blend of suburban tranquility and modern amenities, making it a sought-after destination for families and professionals alike. Residents enjoy access to top-rated schools, a variety of parks, and recreational facilities, including the Cinco Ranch Golf Club. The community's strategic location provides convenient access to major highways, facilitating easy commutes to Houston's business districts.",
        nearby: ['Energy Corridor', 'Katy', 'Westside'],
        icon: MdFamilyRestroom,
        img: 'https://i.imgur.com/CtYQZBV.png'
    },
    {
        name: 'CityCentre',
        blurb: "CityCentre is a lively mixed-use development located just west of downtown Houston in the Uptown area. Known for its walkable streets, it offers a blend of shopping, dining, entertainment, and residential options. With year-round events and easy access to major highways, CityCentre is a popular spot for both locals and visitors seeking an urban lifestyle.",
        nearby: ['Blalock Market', 'Chinatown', 'Energy Corridor', 'Mid West', 'Westside'],
        icon: FaCity,
        img: 'https://i.imgur.com/Gooaw4t.png'
    },
    {
        name: 'Cypress',
        blurb: 'Cypress, Texas, boasts a vibrant and evolving social and culinary scene that reflects its rapid growth and diverse community. The area has become a hotspot for food enthusiasts, offering a range of dining experiences from upscale eateries to unique local gems.',
        nearby: ['Jersey Village'],
        icon: GiPineTree,
        img: 'https://i.imgur.com/tGglN94.png'
    },
    {
        name: 'Deerbrook',
        blurb: "Deerbrook is a suburban area in northeast Houston, centered around Deerbrook Mall in Humble. The mall, established in 1984, serves as a major retail hub with over 130 stores, including anchors like Macy’s, JCPenney, and Dillard’s . The surrounding community offers a mix of residential neighborhoods, such as Deerbrook Estates, which feature mid-sized homes and are known for their family-friendly atmosphere . Residents enjoy convenient access to shopping, dining, and recreational options, including nearby parks like Jesse H. Jones Park & Nature Center . With its blend of suburban charm and urban amenities, Deerbrook provides a balanced lifestyle for its residents.",
        nearby: ['Atascocita', 'East Aldine', 'Houston Gardens', 'Humble'],
        icon: GiDeerHead,
        img: 'https://i.imgur.com/pnIoR4L.png'
    },
    {
        name: 'Downtown',
        blurb: "Downtown Houston sits at the heart of the city, just south of the Interstate 45 corridor. It’s a bustling urban core packed with skyscrapers, theaters, and historic landmarks. The area is served by Houston’s METRORail, making it easy to navigate between entertainment, dining, and business districts. With a lively mix of offices, apartments, and cultural venues, Downtown offers a vibrant city experience day and night.",
        nearby: ['EaDo', 'Fourth Ward', 'Greater Fifth Ward', 'Hyde Park', 'Midtown', 'Montrose', 'Northside', 'South Central', 'Washington'],
        icon: FaBuilding,
        img: 'https://i.imgur.com/073SKpA.png'
    },
    {
        name: 'EaDo',
        blurb: "EaDo (East Downtown) is a dynamic neighborhood located just east of downtown Houston, Texas. Once home to Houston's original Chinatown, the area has transformed into a vibrant hub known for its cultural diversity and artistic flair. Today, EaDo boasts a thriving arts scene, with numerous murals and galleries adorning its streets. The neighborhood offers a rich tapestry of ethnic shops, restaurants, bars, and music venues, making it a popular destination for both locals and visitors. Its proximity to major business districts, including downtown Houston, the Texas Medical Center, and the Houston Ship Channel, adds to its appeal as a central and accessible location within the city.",
        nearby: ['Downtown', 'Eastwood', 'Greater Fifth Ward', 'Midtown', 'Montrose', 'Northside', 'Second Ward', 'South Central'],
        icon: FaMusic,
        img: 'https://i.imgur.com/bOpeaV8.png'
    },
    {
        name: 'East Aldine',
        blurb: "East Aldine is a vibrant community located in unincorporated Harris County, just north of downtown Houston. This 20-square-mile district is home to a diverse population of approximately 63,000 residents . The area is undergoing significant revitalization, with the East Aldine Town Center serving as a focal point for economic and community development. This multi-phase project includes a new office building, amphitheater, playground with a splash pad, and plans for 100,000 square feet of retail and commercial space.",
        nearby: ['Deerbrook', 'Houston Gardens', 'Humble', 'Little York', 'Northside'],
        icon: MdWarehouse,
        img: 'https://i.imgur.com/kY0JG1d.png'
    },
    {
        name: 'Eastwood',
        blurb: "Eastwood, just east of downtown Houston, blends historic charm with a modern, community-driven vibe. Known for its early 20th-century architecture, the neighborhood is also a hidden gem for food lovers—think fresh pastries and breakfast tacos at La Reynera, $1 Taco Tuesdays at Taqueria Monchys, and laid-back nights with live music at Bohemeo’s. With frequent local events, green spaces like Eastwood Park, and easy access to the East End’s cultural spots, Eastwood offers a cozy yet vibrant slice of city life.",
        nearby: ['EaDo', 'Gulfgate', 'Second Ward', 'South Central', 'South Side'],
        icon: GiVillage,
        img: 'https://i.imgur.com/rKWi1xM.jpeg'
    },
    {
        name: 'Energy Corridor',
        blurb: "The Energy Corridor is a prominent business district situated on the west side of Houston, Texas, stretching along a 7-mile segment of Interstate 10 (Katy Freeway) from Kirkwood Road to Barker Cypress Road, and extending south along Eldridge Parkway to Briar Forest Drive. This area is renowned for housing the headquarters and regional offices of major energy corporations, including BP, Shell, ConocoPhillips, and Citgo. Beyond its corporate significance, the Energy Corridor offers a blend of residential options, dining establishments, and recreational spaces. The district is bordered by over 26,000 acres of urban parks, such as George Bush Park and Terry Hershey Park, providing ample opportunities for outdoor activities. With its strategic location, the Energy Corridor serves as a hub for professionals and families alike, combining business, leisure, and community living.",
        nearby: ['Cinco Ranch', 'CityCentre', 'Katy', 'Westside'],
        icon: FaLightbulb,
        img: 'https://i.imgur.com/FnywpoV.png'
    },
    {
        name: 'Fourth Ward',
        blurb: "The Fourth Ward, also known as Freedmen’s Town, is a historic neighborhood located just west of downtown Houston. Established in 1866 by formerly enslaved individuals, it became a vibrant center of African American culture and commerce. The community is renowned for its hand-laid brick streets, a testament to the resilience and self-sufficiency of its early residents. Despite facing challenges such as urban development and gentrification, efforts continue to preserve its rich heritage. Today, the Fourth Ward stands as a symbol of Houston's African American history and ongoing cultural significance.",
        nearby: ['Downtown', 'Hyde Park', 'Midtown', 'Montrose', 'Washington'],
        icon: FaLandmark,
        img: 'https://i.imgur.com/3p9bFER.png'
    },
    {
        name: 'Galleria',
        blurb: "The Galleria area, also known as Uptown Houston, is a vibrant commercial and residential district located west of downtown. Centered around The Galleria mall, Texas' largest shopping center, the area boasts over 400 stores, 50 restaurants, and an indoor ice rink . Beyond retail, the neighborhood features luxury high-rise condos, office towers, and a diverse culinary scene. With its prime location, the Galleria area offers a dynamic blend of work, shopping, and entertainment options.",
        nearby: ['Chinatown', 'Mid West', 'River Oaks', 'Uptown', 'West University Place'],
        icon: FaShoppingBag,
        img: 'https://i.imgur.com/5bwGdT7.png'
    },
    {
        name: 'Greater Fifth Ward',
        blurb: "The Greater Fifth Ward, located just northeast of downtown Houston, is a historically rich and culturally vibrant neighborhood. Once a thriving center for African American commerce and culture, it has evolved into a diverse community with a significant Hispanic population, comprising 47% of residents, while 42% identify as Black. The area is characterized by its dense suburban feel, with a mix of residential homes and local businesses. Despite facing challenges such as environmental concerns and economic disparities, the Greater Fifth Ward remains a testament to resilience and community spirit. Residents enjoy access to local parks and are within close proximity to downtown Houston's amenities. The neighborhood's rich history and ongoing efforts toward revitalization make it a unique and integral part of Houston's landscape.",
        nearby: ['EaDo', 'Downtown', 'Northside', 'Washington'],
        icon: FaHandsHelping,
        img: 'https://i.imgur.com/Q4szUhm.png'
    },
    {
        name: 'Greenspoint',
        blurb: "Greater Greenspoint, also known as the North Houston District, is a diverse and evolving neighborhood located in northeastern Houston. Once a bustling commercial hub centered around Greenspoint Mall, the area has experienced significant changes over the years. While the mall has closed, new developments like CityNorth are revitalizing the district, offering a mix of shopping, dining, and entertainment options. The neighborhood boasts a variety of parks, including the 11-acre Thomas R. Wussow Park, providing residents with recreational spaces. With a population of over 84,000, Greater Greenspoint is characterized by its cultural diversity and a median age of 29, making it a vibrant community within Houston.",
        nearby: ['Acres Home', 'Jersey Village', 'Willowbrook'],
        icon: MdLocationCity,
        img: 'https://i.imgur.com/rlZWpee.png'
    },
    {
        name: 'Greenway',
        blurb: "Greenway/Upper Kirby is a vibrant neighborhood located just southwest of downtown Houston, nestled within the 610 Loop. This area seamlessly blends urban living with suburban charm, offering tree-lined streets, a mix of historic homes, and modern condominiums. Residents enjoy proximity to major employment centers, including the Texas Medical Center, and a plethora of dining, shopping, and entertainment options. The neighborhood boasts well-maintained parks, such as Levy Park, providing green spaces for relaxation and recreation. With its walkability, diverse community, and strong sense of local identity, Greenway/Upper Kirby stands out as one of Houston's most desirable places to live.",
        nearby: ['Montrose', 'Midtown', 'Museum District', 'River Oaks', 'University Place', 'West University Place'],
        icon: FaBriefcase,
        img: 'https://i.imgur.com/tg2PmFP.png'
    },
    {
        name: 'Gulfgate',
        blurb: "Gulfgate, located in Houston's East End, offers a vibrant mix of dining and entertainment options. Doneraki, a family-owned Mexican restaurant, has been serving authentic dishes since 1973 . For Vietnamese cuisine, Son Nam Restaurant is a local favorite, known for its traditional offerings . The area also boasts a variety of eateries catering to diverse tastes.",
        nearby: ['Eastwood', 'Southeast Houston', 'South Side'],
        icon: FaRoad,
        img: 'https://i.imgur.com/suFWJbs.png'
    },
    {
        name: 'Heights',
        blurb: "The Houston Heights, located just northwest of downtown, is a vibrant neighborhood known for its eclectic dining and lively social scene. Food enthusiasts can indulge in a variety of cuisines, from the inventive dishes at Jūn to the classic flavors at Puebla's Mexican Kitchen. The area also boasts a plethora of bars and entertainment venues, including the laid-back Big Star Bar and the upscale Postino Wine Café. For those seeking cultural experiences, the Heights offers art galleries, boutique shopping, and live music venues like White Oak Music Hall. Whether you're savoring a meal, enjoying a drink, or exploring local art, the Heights provides a dynamic blend of activities for all to enjoy.",
        nearby: ['Independence Heights', 'Memorial Park', 'Northwest Houston', 'Northside', 'Oak Forest', 'Washington'],
        icon: GiFamilyHouse,
        img: 'https://i.imgur.com/RL69dJb.png'
    },
    {
        name: 'Houston Gardens',
        blurb: "The culture in Houston Gardens follows along Homestead road, weekend car shows double as block parties, with candy-painted slabs lined up beside tricked-out trucks. Food trucks serve everything from smoked brisket to elote, while daiquiri stands keep the vibe cool and buzzing. It’s loud, laid-back, and all about showing out, eating good, and kicking it with the community.",
        nearby: ['East Aldine', 'Deerbrook', 'Humble', 'Little York', 'Northside', 'Summerwood'],
        icon: GiGardeningShears,
        img: 'https://i.imgur.com/MZa3suj.png'
    },
    {
        name: 'Humble',
        blurb: "Located just north of Houston, Humble offers a delightful mix of dining, entertainment, and outdoor activities. Food enthusiasts can savor a variety of cuisines at local favorites like Humble City Cafe, known for its hearty American fare, and Pappas Seafood House, offering fresh Gulf Coast seafood. For those seeking adventure, the upcoming Score Entertainment complex at Deerbrook Mall promises go-karting, laser tag, bowling, and more, making it a hub for family fun. Nature lovers can explore the serene Mercer Arboretum & Botanic Gardens, while families can enjoy interactive exhibits at the Houston Interactive Aquarium. Whether you're dining out or seeking entertainment, Humble provides a welcoming atmosphere for all.",
        nearby: ['Atascocita', 'East Aldine', 'Deerbrook', 'Houston Gardens', 'Spring', 'Summerwood'],
        icon: FaHardHat,
        img: 'https://i.imgur.com/uM59Zq2.png'
    },
    {
        name: 'Hyde Park',
        blurb: "Hyde Park, part of the Montrose area, is known for its vibrant dining and nightlife. Enjoy wood-fired pizzas at Hyde Park Kitchen + Bar or inventive dishes at Traveler’s Table. The neighborhood also offers cozy cocktail lounges with live music, perfect for a laid-back evening. Community events like National Night Out add to its welcoming atmosphere.",
        nearby: ['Downtown', 'Fourth Ward', 'Midtown', 'Montrose', 'River Oaks'],
        icon: MdLocationCity,
        img: 'https://i.imgur.com/sJAezN0.png'
    },
    {
        name: 'Independence Heights',
        blurb: "Independence Heights, Houston's first African American municipality, boasts a rich cultural heritage and a vibrant community. The neighborhood offers a variety of dining options, including the beloved Esther's Cajun Cafe & Soul Food, known for its hearty Southern dishes. For a taste of local history, Barbecue Inn serves classic BBQ favorites in a nostalgic setting. Gatlin's Fins & Feathers brings a modern twist to Gulf Coast cuisine with dishes like gumbo and fried chicken. Beyond dining, the community celebrates its roots with events such as Juneteenth celebrations at Independence Park, fostering a strong sense of unity and pride.",
        nearby: ['Acres Home', 'Central Northwest', 'Heights', 'Northside', 'Oak Forest'],
        icon: GiBrickWall,
        img: 'https://i.imgur.com/MyOdkpr.png'
    },
    {
        name: 'Jersey Village',
        blurb: "Jersey Village, located in the northwestern part of Houston, offers a blend of local charm and community spirit. Dining options include Adriatic Café, known for its authentic Italian dishes, and Little Kitchen HTX, offering a diverse menu in a cozy setting. For a casual outing, Senate Avenue Brewing Co. provides craft beers and a relaxed atmosphere. The community hosts events like the annual Jersey Village Restaurant Week, celebrating local eateries and fostering a sense of togetherness.",
        nearby: ['Acres Home', 'Cypress', 'Central Northwest', 'Greenspoint', 'Willowbrook'],
        icon: GiVillage,
        img: 'https://i.imgur.com/QnX1v4U.png'
    },
    {
        name: 'Katy',
        blurb: "Katy, Texas, located just west of Houston, offers a vibrant mix of dining and entertainment options. At Katy Asian Town, you can explore a variety of Asian cuisines, including Malaysian dishes at Phat Eatery. For a fun night out, Home Run Dugout combines baseball simulation with a full-service bar and restaurant. Families can enjoy attractions like Katy Mills Mall, which features shopping, dining, and entertainment options. Additionally, the city hosts events such as Music Under the Stars at LaCenterra, offering live music in a relaxed outdoor setting.",
        nearby: ['Cinco Ranch', 'Energy Corridor', 'Westside'],
        icon: FaHatCowboy,
        img: 'https://i.imgur.com/4HC1MKD.png'
    },
    {
        name: 'Kemah',
        blurb: "Just southeast of Houston along Galveston Bay, Kemah is a lively waterfront destination known for its blend of dining and entertainment. The Kemah Boardwalk features restaurants like Landry’s Seafood House and Bubba Gump Shrimp Co., offering fresh seafood with scenic views . Visitors can enjoy amusement rides, arcade games, and seasonal festivals, making it a family-friendly spot year-round . Whether you're seeking a romantic dinner or a fun-filled day with the kids, Kemah offers a memorable coastal experience.",
        nearby: ['Webster'],
        icon: LuFerrisWheel,
        img: 'https://i.imgur.com/Nnk2K5P.png'
    },
    {
        name: 'Little York',
        blurb: "East Little York, situated just east of I-45 and north of U.S. 59, offers a blend of local flavors and community spirit. For a taste of authentic Mexican cuisine, Doña Tere Mexican Restaurant serves up beloved tamales and pambazos . Barbecue enthusiasts can enjoy classic smoked meats at Pappas Bar-B-Q on Eastex Freeway . The neighborhood also features community centers that host events and activities for residents of all ages ",
        nearby: ['East Aldine', 'Houston Gardens', 'Northside'],
        icon: FaRoute,
        img: 'https://i.imgur.com/8kUBd84.png'
    },
    {
        name: 'Memorial Park',
        blurb: "Nestled in the heart of Houston, Memorial Park offers a blend of outdoor recreation and nearby dining options. Visitors can enjoy activities like running on the Seymour Lieberman Trail, golfing at the Memorial Park Golf Course, or exploring the Houston Arboretum & Nature Center. For dining, nearby establishments such as Brenner's on the Bayou and El Tiempo Cantina on Washington Avenue provide a variety of culinary experiences. Whether you're seeking active pursuits or a relaxing meal, Memorial Park and its surroundings cater to diverse interests.",
        nearby: ['Heights', 'Northwest Houston', 'River Oaks', 'Uptown', 'Washington'],
        icon: GiTreehouse,
        img: 'https://i.imgur.com/LE8Nreo.png'
    },
    {
        name: 'Mid West',
        blurb: "Mid West Houston, nestled between Westheimer and Richmond, offers a diverse culinary scene and vibrant social spots. Food enthusiasts can savor authentic Persian dishes at Aban Persian Restaurant or indulge in flavorful dumplings at Dumplings & Noodles by Cooking Girl. For a lively evening, Soju Blues provides Korean fare alongside private karaoke rooms, perfect for group gatherings. Additionally, the upcoming Ashford Beer Garden promises a Munich-inspired experience with yard games and live entertainment, enhancing the area's social landscape.",
        nearby: ['Blalock Market', 'CityCentre', 'Chinatown', 'Galleria', 'River Oaks', 'Uptown', 'Westside'],
        icon: MdApartment,
        img: 'https://i.imgur.com/LNj85CD.png'
    },
    {
        name: 'Midtown',
        blurb: "Midtown, nestled between Downtown and the Museum District, is a vibrant hub for dining and nightlife. Start your day with wings and waffles at The Breakfast Klub or enjoy Vietnamese crepes at Xeo Yum. Evenings come alive at spots like Lost & Found, offering rooftop cocktails, or Belle Station for sports and live DJs. For a unique experience, Solarium combines pickleball courts with a full-service bar and restaurant, making it a lively destination for both sports and socializing.",
        nearby: ['Downtown', 'EaDo', 'Fourth Ward', 'Hyde Park', 'Greenway', 'Montrose', 'Museum District', 'South Central', 'South Side'],
        icon: FaCocktail,
        img: 'https://i.imgur.com/M4n5yMA.png'
    },
    {
        name: 'Montrose',
        blurb: "Montrose, just west of downtown, is a vibrant neighborhood renowned for its eclectic dining and lively nightlife. Food enthusiasts can savor upscale Japanese cuisine at Katami or enjoy global street food at Traveler’s Cart. Evenings come alive at venues like Jethro’s Cocktail Lounge, known for inventive drinks and smash burgers, or The Toasted Coconut, offering tropical cocktails and a laid-back atmosphere. The neighborhood also hosts the Montrose Live market on weekends, featuring local art, food trucks, and vintage finds.",
        nearby: ['Downtown', 'EaDo', 'Fourth Ward', 'Hyde Park', 'Greenway', 'Midtown', 'Museum District', 'River Oaks', 'Washington'],
        icon: FaRainbow,
        img: 'https://i.imgur.com/f1D69fH.png'
    },
    {
        name: 'Museum District',
        blurb: "Houston's Museum District, nestled just south of downtown, offers a rich tapestry of cultural attractions complemented by diverse dining and social venues. After exploring institutions like the Museum of Fine Arts or the Houston Museum of Natural Science, visitors can indulge in Southern cuisine at Lucille's or savor Italian fare at Café Leonelli within the MFAH's Kinder Building. For a relaxed evening, Poolside at Hotel ZaZa provides specialty cocktails in a chic outdoor setting. Whether you're seeking art, food, or nightlife, the Museum District delivers a well-rounded experience.",
        nearby: ['Astrodome Area', 'Greenway', 'Midtown', 'Montrose', 'Rice Village', 'South Central', 'South Side', 'University Place', 'West University Place'],
        icon: FaLandmark,
        img: 'https://i.imgur.com/fmRlI8o.png'
    },
    {
        name: 'Northside',
        blurb: "Northside, just north of downtown Houston, blends rich culture with a growing food and social scene. Start your day at Cariño Coffee, serving Mexican-inspired lattes like mazapán and café de olla in a cozy setting. For lunch, Cochinita & Co. offers tacos and tamales while supporting anti-trafficking efforts. Evenings come alive at Rabbit’s Got the Gun, a bar with inventive cocktails, or enjoy classic Tex-Mex at the original Taqueria Arandas. Community events, such as family picnics and gatherings at Moody Park, foster a strong neighborhood spirit.",
        nearby: ['Acres Home', 'EaDo', 'East Aldine', 'Downtown', 'Greater Fifth Ward', 'Heights', 'Houston Gardens', 'Independence Heights', 'Little York', 'Washington'],
        icon: MdExplore,
        img: 'https://i.imgur.com/8fynE8j.png'
    },
    {
        name: 'Northwest Houston',
        blurb: "Northwest Houston is a vibrant mix of diverse cultures reflected in its food and social spots. Dive into authentic Mexican street tacos at El Rey Taqueria or savor crispy fried chicken with a twist at Gus’s World Famous Fried Chicken. Catch live music and weekend farmers markets at the historic West Little York Civic Center. With sprawling parks like Bear Creek Pioneers, the area blends lively dining with plenty of outdoor fun, perfect for family outings or casual nights out.",
        nearby: ['Blalock Market', 'Heights', 'Memorial Park', 'Oak Forest', 'Uptown'],
        icon: MdGridView,
        img: 'https://i.imgur.com/6rUQRqF.png'
    },
    {
        name: 'Oak Forest',
        blurb: "Oak Forest, affectionately known as 'GOOF,' is a vibrant neighborhood in northwest Houston that blends suburban charm with a lively social scene. The area boasts a diverse culinary landscape, from the cozy ambiance of d'Alba's wood-fired pizzas to the coastal flavors at Millie's Kitchen & Cocktails . For a taste of authentic Thai and Lao cuisine, Sao Lao Thai Café offers dishes like their signature boat noodles in a BYOB setting . Social gatherings are a staple here, with events such as the annual Le Tour de Oak Forest bike ride and the Pride Sunday Funday at Wakefield Crowbar . Whether you're enjoying a meal at a local bistro or participating in community festivities, Oak Forest offers a welcoming atmosphere for all.",
        nearby: ['Acres Home', 'Central Northwest', 'Heights', 'Independence Heights', 'Northwest Houston'],
        icon: GiOak,
        img: 'https://i.imgur.com/k19pGeB.png'
    },
    {
        name: 'Rice Village',
        blurb: "Rice Village is a vibrant neighborhood in Houston, offering a dynamic blend of dining, shopping, and cultural experiences. The area boasts a diverse culinary scene, with establishments like Milton's, an 'American trattoria' known for its inventive Italian dishes , and Navy Blue, a modern American seafood concept by chef Aaron Bludorn . For those seeking Mediterranean flavors, Hamsa offers vibrant Israeli cuisine . Beyond its eateries, Rice Village hosts events such as the Farmers Market on the first and third Sundays of each month, featuring local produce and artisanal goods . With its eclectic mix of activities and establishments, Rice Village stands out as a must-visit destination in Houston.",
        nearby: ['Museum District', 'University Place', 'West University Place'],
        icon: GiGraduateCap,
        img: 'https://i.imgur.com/UP2J3Od.png'
    },
    {
        name: 'River Oaks',
        blurb: "River Oaks is Houston’s epitome of elegance, where upscale dining and cultural experiences converge. Indulge in refined cuisine at establishments like Leo’s River Oaks, known for its sophisticated ambiance and delectable offerings . For a taste of Italy, Zanti Cucina Italiana offers authentic dishes in a stylish setting . The neighborhood also hosts exclusive events such as the Spring Garden Celebration, featuring live music and floral displays . Whether you're savoring gourmet meals or enjoying cultural festivities, River Oaks provides a luxurious backdrop for an unforgettable experience.",
        nearby: ['Galleria', 'Greenway', 'Hyde Park', 'Memorial Park', 'Montrose', 'Mid West', 'Uptown', 'Washington', 'Westside'],
        icon: GiDiamondRing,
        img: 'https://i.imgur.com/4zgf0wZ.png'
    },
    {
        name: 'Rosenberg',
        blurb: "Just southwest of Houston, Rosenberg mixes small-town charm with big-time flavor—think smoky BBQ joints, family taquerias, and old-school diners. It’s also home to pro-level action thanks to LOVB volleyball, bringing serious spikes and energy to this quiet corner of Fort Bend County.",
        nearby: ['Sugar Land'],
        icon: GiRailRoad,
        img: 'https://i.imgur.com/3KgxV5X.jpeg'
    },
    {
        name: 'Second Ward',
        blurb: "The Second Ward, also known as Segundo Barrio, is a vibrant and culturally rich neighborhood in Houston's East End. This area is renowned for its diverse culinary offerings, reflecting its Mexican-American heritage. Notable establishments include El Tiempo Cantina, known for its Tex-Mex classics, and Moon Tower Inn, offering gourmet hot dogs and a selection of craft beers . For a taste of South American cuisine, Andes Café serves dishes like lomo saltado and hornado, blending flavors from Venezuela, Colombia, and Peru",
        nearby: ['EaDo', 'Eastwood'],
        icon: GiFactory,
        img: 'https://i.imgur.com/MLSutXx.png'
    },
    {
        name: 'South Central',
        blurb: "South Central Houston offers a rich culinary scene with local favorites like Tequila 45 and The Neighborhood Scoop, serving up flavorful dishes and sweet treats. The South Houston Community Center hosts events that bring neighbors together, making this area a lively spot for food and community gatherings.",
        nearby: ['Astrodome Area', 'EaDo', 'Downtown', 'Midtown', 'Museum District', 'South Side'],
        icon: MdPeople,
        img: 'https://i.imgur.com/rX9Y8wb.jpeg'
    },
    {
        name: 'South Side',
        blurb: "The South Side of Houston, encompassing neighborhoods like Sunnyside, is a vibrant tapestry of culture, cuisine, and community spirit. This area boasts a rich culinary scene, with establishments such as Frenchy's Chicken offering beloved Creole dishes, and local favorites like Betty's Kitchen MS and TP Seafood serving up hearty meals that reflect the neighborhood's diverse palate.",
        nearby: ['Astrodome Area', 'Eastwood', 'Gulfgate', 'Midtown', 'Museum District', 'South Central', 'Southeast Houston'],
        icon: MdStreetview,
        img: 'https://i.imgur.com/Ys8q9Dw.png'
    },
    {
        name: 'Southeast Houston',
        blurb: "Southeast Houston is a vibrant area where diverse cuisines and community events come together. Local favorites like Frenchy's Chicken offer beloved Creole dishes, while The Don'Key in Pasadena serves up hearty meals reflecting the neighborhood's diverse palate. For those seeking a sweet treat, House of Pies on Fuqua Street is a beloved institution offering all-day breakfast and a variety of pies.",
        nearby: ['Gulfgate', 'South Side'],
        icon: MdDirectionsCar,
        img: 'https://i.imgur.com/2ixSXGP.png'
    },
    {
        name: 'Spring',
        blurb: "Spring, Texas offers a delightful mix of historic charm and modern dining. In Old Town Spring, Wunsche Bros. Café & Saloon, established in 1902, serves hearty American fare in a historic setting . Nearby, Adriatic Café Italian Grill offers flavorful Italian dishes in a cozy atmosphere. The community comes together for events like the Memorial Funky Food Truck Mania, celebrating food and fun . Whether you're exploring local eateries or enjoying community festivities, Spring provides a welcoming environment for all.",
        nearby: ['Humble', 'The Woodlands', 'Tomball', 'Willowbrook'],
        icon: GiFlowerPot,
        img: 'https://i.imgur.com/fYTRRTz.png'
    },
    {
        name: 'Stafford',
        blurb: "Stafford may be small, but its food scene punches way above its weight. Tucked between major highways, this unassuming suburb serves up standout Viet-Cajun crawfish, Nigerian jollof rice, smoky Texas BBQ, and hidden gems like Himalayan momo joints. It’s a lowkey melting pot with high-reward eats.",
        nearby: ['Chinatown', 'Sugar Land' ],
        icon: GiKnifeFork,
        img: 'https://i.imgur.com/j1xtM4w.png'
    },
    {
        name: 'Sugar Land',
        blurb: "Sugar Land is where global flavors meet Texas hospitality. From the bustling Sugar Land Town Square to vibrant spots along Highway 6, you’ll find everything from fresh sushi with a Latin twist to classic Creole gumbo and hearty Tex-Mex. Whether you’re craving an upscale steakhouse dinner, Southern comfort food, or authentic Filipino dishes, Sugar Land’s diverse dining scene serves up something delicious for every appetite.",
        nearby: ['Rosenberg', 'Stafford'],
        icon: GiCrystalBars,
        img: 'https://i.imgur.com/ws5fzPw.png'
    },
    {
        name: 'Summerwood',
        blurb: "Summerwood is a vibrant, master-planned community in northeast Houston, offering a blend of diverse dining options and active community life. Residents and visitors can enjoy a variety of restaurants, including Café Rian Cajun Café, known for its Louisiana-inspired dishes, and Bocca Italian Kitchen, offering classic Italian fare. For those craving Asian cuisine, Akashi Asian Bistro & Sushi Bar provides a fusion of Japanese and Chinese flavors in a chic setting. Other local favorites include Bangkok Social, Taste of Paris, and Urban Bird Hot Chicken, each offering unique culinary experiences.",
        nearby: ['Atascocita', 'Houston Gardens', 'Humble'],
        icon: GiSunflower,
        img: 'https://i.imgur.com/Wn0HtBE.jpeg'
    },
    {
        name: 'The Woodlands',
        blurb: "The Woodlands blends upscale eats and lively socials around Market Street and the scenic Waterway. From cocktails at Como Social Club to chef-driven bites at Amrina, it’s a polished but playful spot to dine, drink, and mingle.",
        nearby: ['Spring', 'Todd Mission'],
        icon: GiForestCamp,
        img: 'https://i.imgur.com/jNTCv5a.png'
    },
    {
        name: 'Todd Mission',
        blurb: "Todd Mission, a quaint town northwest of Houston, is best known as the home of the Texas Renaissance Festival—the largest event of its kind in the U.S., drawing over 500,000 visitors each fall . Beyond the festival's immersive medieval experience, the town boasts a vibrant social scene with eclectic eateries and lively bars, making it a hotspot for both food enthusiasts and social butterflies.",
        nearby: ['The Woodlands', 'Tomball'],
        icon: GiRoyalLove,
        img: 'https://i.imgur.com/PQG1yvx.png'
    },
    {
        name: 'Tomball',
        blurb: "Tomball blends small-town charm with big Texas flavor. You’ll find cozy cafes, family-owned barbecue joints, and a lively historic downtown full of events and local shops. On weekends, the farmers market and live music bring the community together. It’s a welcoming spot for great eats and easygoing fun.",
        nearby: ['Spring', 'Willowbrook'],
        icon: GiWell,
        img: 'https://i.imgur.com/clXVUrP.png'
    },
    {
        name: 'University Place',
        blurb: "University Place offers a vibrant mix of culture and cuisine. With Rice Village at its heart, the neighborhood boasts an array of eateries—from contemporary French at Eau Tour to Israeli flavors at Hamsa and classic Italian at Roma Ristorante. Its walkable streets, proximity to Rice University, and lively cafes create a welcoming atmosphere for both locals and visitors.",
        nearby: ['Astrodome Area', 'Greenway', 'Museum District', 'Rice Village', 'West University Place'],
        icon: FaUniversity,
        img: 'https://i.imgur.com/EE4kPPm.png'
    },
    {
        name: 'Uptown',
        blurb: "Uptown Houston is where luxury meets lively. By day, it's a shopper's paradise with The Galleria's 375+ stores. By night, the scene shifts to chic dining and vibrant lounges. Savor Italian elegance at Amalfi Ristorante, indulge in Cuban flair at Emilia's Havana, or experience the fusion of French and Japanese at CIEL. For a unique twist, Musaafer offers upscale Indian cuisine that's both artful and aromatic. Whether you're sipping cocktails at Segreto Lounge or enjoying live music at Rockhouse Southern Kitchen, Uptown serves up sophistication with a side of fun.",
        nearby: ['Blalock Market', 'Galleria', 'River Oaks', 'Memorial Park', 'Mid West', 'Northwest Houston'],
        icon: FaBuilding,
        img: 'https://i.imgur.com/64dFNpj.jpeg'
    },
    {
        name: 'Washington',
        blurb: "Washington Ave keeps the party close and the plates full. This lively strip is packed with craft cocktails, taco joints, rooftop bars, and late-night bites. From boozy brunches to dance floors after dark, it's where Houston goes to let loose and live loud.",
        nearby: ['Downtown', 'Fourth Ward', 'Greater Fifth Ward', 'Heights', 'Montrose', 'Memorial Park', 'Northside', 'River Oaks'],
        icon: FaBeer,
        img: 'https://i.imgur.com/EPcpVPu.png'
    },
    {
        name: 'Webster',
        blurb: "Webster brings big flavor with a side of space. Just down the road from NASA, this hub mixes casual eats, lively sports bars, and hidden gems serving up global bites. It’s laid-back, friendly, and perfect for fueling up before a Rockets launch—or a night out.",
        nearby: ['Kemah'],
        icon: GiSpaceShuttle,
        img: 'https://i.imgur.com/hP8fel3.png'
    },
    {
        name: 'West University Place',
        blurb: "West University Place blends classic charm with a vibrant, family-friendly vibe. Locals gather at Tiny’s No. 5 for brunch in a cozy garden setting, or sip wine under the vines at Simone on Sunset. Little Matt’s, a nationally recognized favorite, delights both kids and adults with arcade games, burgers, and complimentary adult beverages. Nearby, Rice Village offers a walkable mix of eateries like Hamsa for modern Israeli fare and Navy Blue for Gulf Coast seafood. Whether you're craving tacos at El Topo or a sweet treat from Badolina Bakery, West U serves up a warm welcome with every bite.",
        nearby: ['Astrodome Area', 'Chinatown', 'Galleria', 'Greenway', 'Museum District', 'Rice Village', 'University Place'],
        icon: MdSchool,
        img: 'https://i.imgur.com/bjXBdBr.png'
    },
    {
        name: 'Westside',
        blurb: "Westside keeps it chill with cozy cafes, neighborhood grills, and international eats tucked into quiet strips. It’s where locals gather for Tex-Mex, sushi, or a good burger—no fuss, just solid spots and easy vibes.",
        nearby: ['Cinco Ranch', 'CityCentre', 'Chinatown', 'Energy Corridor', 'Katy', 'Mid West', 'River Oaks'],
        icon: MdHomeWork,
        img: 'https://i.imgur.com/f3evgld.png'
    },
    {
        name: 'Willowbrook',
        blurb: "Willowbrook is a vibrant neighborhood in northwest Houston, offering a diverse culinary scene that caters to various tastes. Whether you're in the mood for Southern comfort food, international flavors, or a casual dining experience, Willowbrook has something to satisfy every palate.",
        nearby: ['Greenspoint', 'Jersey Village', 'Spring', 'Tomball'],
        icon: FaShoppingCart,
        img: 'https://i.imgur.com/mkaW2mJ.png'
    }
]

export default neighborhoodBlurbs;