# Drew's Houston Spots

## Overview

Static website designed to share my favorite places in Houston, Texas.

Hosted @ https://houston.drewford.dev

Using React, Leaflet, CSS, & Slugify

Firebase Database, Auth, & API


Homepage artwork by Jim Koehn

## Content

### Restaurants

- Bakeries
- BBQ
- Burgers
- Burritos
- Breakfast
- Chicken
- Crawfish
- Dessert
- Dumplings
- Hotdogs
- Pasta
- Pho
- Pizza
- Poke
- Ramen
- Rice Bowl
- Salads
- Sandwiches
- Seafood
- Soup
- Steakhouses
- Sushi
- Tacos
- Upscale
- Food Halls

### Activities

- Attractions
- Bars & Lounges
- Bookstores & Libraries
- Coffee, Tea, & Boba
- Daiquiri Shops
- Markets
- Museums
- Movie Theaters
- Music Venues
- Parks
- Photo Opps

## Logic

### Adding a location
1. locations object

javascript array of objects, organized by category in src/data/locations

| key | value type |
| ------ | ----- |
| name | string |
| category | string| 
| subcategory | array of strings|
| badges | array of strings |
| coordinates | array of 2 numbers (x, y) |
| neighborhood | string |
| img | string |
| website | string |
| blurb | string |
| description | array of strings |

* all restaurants are category 'food' and use subcategory for icon and filtering
* subcategory[0] defines map icon
* badges sourced from google maps/about + hours of operation
* badges should follow badge order on src/data/badges
* coordinates sourced from right-click on google maps location
* img should be wide, not too large a file
* description should include recs or important details

2. map icons

- determined by locations.subcategory[0]
- icon imported from react icons into src/data/icons
- subcategory icons are updated on leaflet icon
- new categories require more work on leaflet to create a layerGroup
- icon should be visible on leaflet map at coordinates upon refresh

3. categories & subcategories

 - food uses subcategory for list view, everything else uses category
 - create logic for category, subcategory in src/utils/restaurants-filtered and src/utils/activities-filtered
 - create buttons for category, subcategory with src/data/restaurant-types and src/data/activity-types  
 - buttons and results should populate immediately

4. badges 

 - badges list stored in src/data/badges
 - new badges require new entry into src/data/badges
 - badges are to follow custom order from src/data/badges
 - badges are used for filters on src/components/filters

5. img

 - png images, uploaded and stored on Imgur bucket

### List View Page logic

### Leaflet Logic

### Adding a resource
