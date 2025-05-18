export type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface TimeInterval {
  openTime: number; // e.g., 900 for 9:00 AM, 1630 for 4:30 PM
  closeTime: number; // e.g., 1400 for 2:00 PM, 2000 for 8:00 PM
}

export interface OpeningHours {
  days: WeekDay[]; // Days these intervals apply to
  // Multiple intervals in one day.
  intervals: TimeInterval[];
}

export type LocationType = 'Dining Hall' | 'Restaurant' | 'Convenience Store' | 'Coffee Shop';

export interface LocationInfo {
  name: string;
  colloquialName?: string;
  description: string;
  type: LocationType;
  address: string;
  googleMapsLink: string;
  appleMapsLink: string;
  schedules: OpeningHours[];
  mealTimes: {
    breakfast?: TimeInterval;
    lunch?: TimeInterval;
    dinner?: TimeInterval;
  };
}

export const LOCATION_INFO: LocationInfo[] = [
  {
    name: 'J2 Dining',
    colloquialName: 'J2',
    description:
      'Positioned on the south side of campus, J2 Dining houses a top-9 allergen free line as well as other unique options.\n\nJ2 Dining is located on the second floor of Jester Center and serves a varied menu for you to create your ideal meal. The offerings at J2 include something for everyone.',
    address: '201 E 21st St Austin, TX 78705',
    type: 'Dining Hall',
    googleMapsLink: 'https://maps.app.goo.gl/oQJCkYWNgyFkMvFf7',
    appleMapsLink:
      'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=18232725234478875257&ll=30.282849,-97.736878&lsp=9902&q=J2%20Dining',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        intervals: [{ openTime: 700, closeTime: 2100 }],
      },
      {
        days: ['Friday'],
        intervals: [{ openTime: 700, closeTime: 2000 }],
      },
      {
        days: ['Saturday', 'Sunday'],
        intervals: [
          { openTime: 900, closeTime: 1400 },
          { openTime: 1630, closeTime: 2000 },
        ],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 700, closeTime: 900 },
      lunch: { openTime: 1100, closeTime: 1330 },
      dinner: { openTime: 1730, closeTime: 2000 },
    },
  },
  {
    name: 'JCL Dining',
    colloquialName: 'JCL',
    type: 'Dining Hall',
    googleMapsLink: 'https://maps.app.goo.gl/DccikGcpeV4tpZSj7',
    appleMapsLink:
      'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=12474801943275870923&ll=30.282840,-97.736945&lsp=9902&q=Jester%20City%20Limits',
    address: '201 E 21st St Austin, TX 78705',
    description:
      'Found on the south side of campus, Jester City Limits (JCL) offers a versatile dining experience. JCL is on the ground floor of Jester Center and provides an array of food lines you can choose your meal from.\n\nJester Center’s energetic atmosphere guarantees a unique meal with a menu created by our talented culinary team.',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        intervals: [{ openTime: 1030, closeTime: 2100 }],
      },
      {
        days: ['Friday'],
        intervals: [{ openTime: 1030, closeTime: 1500 }],
      },
      {
        days: ['Saturday', 'Sunday'],
        intervals: [],
      },
    ],
    mealTimes: {
      lunch: { openTime: 1030, closeTime: 1500 },
      dinner: { openTime: 1500, closeTime: 2100 },
    },
  },
  {
    name: 'Kins Dining',
    colloquialName: 'Kins',
    description:
      'Serving the northwest side of campus, Kins Dining hosts several serving lines and outdoor patio seating. Kins Dining is in Kinsolving Hall and offers a dining experience where you can piece together your ideal meal from the assortment of food lines and menu specials.\n\nEnjoy your meal inside the dining hall or on the outdoor patio overlooking the Kinsolving garden.',
    type: 'Dining Hall',
    googleMapsLink: 'https://maps.app.goo.gl/zaxxqbgcuGBgQwBY9',
    appleMapsLink:
      'https://maps.apple.com/?address=2605%20Whitis%20Ave,%20Austin,%20TX%2078705,%20United%20States&auid=9838945571614486266&ll=30.290260,-97.739890&lsp=9902&q=Kins%20Dining',
    address: '2605 Whitis Ave Austin, TX 78705',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        intervals: [{ openTime: 700, closeTime: 2100 }],
      },
      {
        days: ['Friday'],
        intervals: [{ openTime: 700, closeTime: 2000 }],
      },

      {
        days: ['Saturday', 'Sunday'],
        intervals: [
          { openTime: 900, closeTime: 1400 },
          { openTime: 1630, closeTime: 2000 },
        ],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 700, closeTime: 1100 },
      lunch: { openTime: 1100, closeTime: 1630 },
      dinner: { openTime: 1630, closeTime: 2000 },
    },
  },
  {
    name: "Jesta' Pizza",
    colloquialName: "Jizza's",
    description:
      'Build your own pizza with an array of sauces and toppings and find other quick bites on the south side of campus inside Jester Center.\n\nJesta’ Pizza offers an assortment of options for you to create your ideal pie. Other snacks and beverages are also available for purchase.',
    type: 'Restaurant',
    googleMapsLink: 'https://maps.app.goo.gl/918gcsqhiFcq2CYS6',
    appleMapsLink:
      'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=17503097336762474961&ll=30.282849,-97.736878&lsp=9902&q=Jesta%E2%80%99%20Pizza',
    address: '201 E 21st St Austin, TX 78705',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        intervals: [{ openTime: 1100, closeTime: 2200 }],
      },
      {
        days: ['Saturday'],
        intervals: [], // Closed on Saturdays
      },
      {
        days: ['Sunday'],
        intervals: [{ openTime: 1600, closeTime: 2200 }],
      },
    ],
    mealTimes: {},
  },
  {
    name: 'Cypress Bend Cafe',
    colloquialName: 'Cypress',
    description:
      'Explore this grill and coffee shop all in one located in San Jacinto Residence Hall. Cypress Bend Cafe serves Starbucks coffee and beverages, bakery items and other grab and go options.\n\nIn addition, you can choose from a variety of meal options at the grill.',
    type: 'Restaurant',
    googleMapsLink: 'https://maps.app.goo.gl/h3T5ZbVH86rnNfp26',
    appleMapsLink:
      'https://maps.apple.com/?address=309%20E%2021st%20St,%20Austin,%20TX%2078705,%20United%20States&auid=16696211541944805550&ll=30.283025,-97.734464&lsp=9902&q=Cypress%20Bend%20Cafe',
    address: '309 E 21st St Austin, TX 78705',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        intervals: [{ openTime: 700, closeTime: 1900 }],
      },
      {
        days: ['Friday'],
        intervals: [{ openTime: 700, closeTime: 1800 }],
      },
      {
        days: ['Saturday', 'Sunday'],
        intervals: [],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 700, closeTime: 1200 },
      lunch: { openTime: 1200, closeTime: 1700 },
    },
  },
  {
    name: 'Jester City Market',
    colloquialName: 'Jarket',
    description:
      'Grab a bite on the go, shop for the essentials or stop in for a beverage on the ground floor of Jester Center.\n\nJester City Market has all your convenience store needs including school supplies, snacks and other goods. Stop in to see all we have to offer.',
    type: 'Convenience Store',
    googleMapsLink: 'https://maps.app.goo.gl/PrsZA1x88GUqdhhx6',
    appleMapsLink:
      'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705,%20United%20States&auid=8818684010108699137&ll=30.282849,-97.736878&lsp=9902&q=Jester%20City%20Market',
    address: '201 E 21st St Austin, TX 78705',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        intervals: [{ openTime: 1000, closeTime: 2300 }],
      },
      {
        days: ['Friday'],
        intervals: [{ openTime: 1000, closeTime: 2200 }],
      },
      {
        days: ['Saturday'],
        intervals: [{ openTime: 1200, closeTime: 2000 }],
      },
      {
        days: ['Sunday'],
        intervals: [{ openTime: 1200, closeTime: 2300 }],
      },
    ],
    mealTimes: {
      lunch: { openTime: 1000, closeTime: 1800 },
      dinner: { openTime: 1900, closeTime: 2200 },
    },
  },
  {
    name: 'Littlefield Patio Cafe',
    colloquialName: 'Littlefield Cafe',
    description:
      'Discover bistro-style dining, grab and go offerings and coffee options on the northwest side of campus, adjacent to Littlefield Hall.\n\nLittlefield Patio Cafe offers a la carte meal options in addition to Starbucks coffee and drinks, bakery selections and other selections.Enjoy your meal on the namesake patio dining area or inside the cafe.',
    type: 'Restaurant',
    address: '2503 Whitis Ave Austin, TX 78705',
    googleMapsLink: 'https://maps.app.goo.gl/CtBnkvwy6qCDNtyi9',
    appleMapsLink:
      'https://maps.apple.com/?address=2503%20Whitis%20Ave,%20Austin,%20TX%20%2078705,%20United%20States&auid=12052977383648341965&ll=30.289327,-97.739752&lsp=9902&q=Littlefield%20Patio%20Cafe',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        intervals: [{ openTime: 700, closeTime: 1900 }],
      },
      {
        days: ['Friday'],
        intervals: [{ openTime: 700, closeTime: 1800 }],
      },
      {
        days: ['Saturday', 'Sunday'],
        intervals: [],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 700, closeTime: 1200 },
      lunch: { openTime: 1200, closeTime: 1900 },
    },
  },

  // Coffee Shop Locations
  {
    name: 'Jester Java',
    colloquialName: 'Java',
    description:
      'Order breakfast tacos, Starbucks coffee and baked goods on the south side of campus, inside Jester Center.',
    type: 'Coffee Shop',
    address: '201 E 21st St Austin, TX 78705',
    googleMapsLink: 'https://maps.app.goo.gl/CtBnkvwy6qCDNtyi9',
    appleMapsLink: 'https://maps.apple.com/?address=201%20E%2021st%20St,%20Austin,%20TX%20%2078705',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        intervals: [{ openTime: 730, closeTime: 1600 }],
      },
      {
        days: ['Saturday', 'Sunday'],
        intervals: [],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 730, closeTime: 1100 },
      lunch: { openTime: 1100, closeTime: 1600 },
    },
  },
  {
    name: 'Longhorn Coffee Co.',
    colloquialName: 'LCC',
    description:
      'Check out this coffee shop proudly serving Starbucks coffee and other on the go options in the WCP Student Activity Center.',
    type: 'Coffee Shop',
    address: '2201 Speedway, Austin, TX 78712',
    googleMapsLink: 'https://maps.app.goo.gl/',
    appleMapsLink: 'https://maps.apple.com/?address=2201%20Speedway,%20Austin,%20TX%2078712',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        intervals: [{ openTime: 800, closeTime: 1700 }],
      },
      {
        days: ['Saturday', 'Sunday'],
        intervals: [],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 800, closeTime: 1100 },
      lunch: { openTime: 1100, closeTime: 1700 },
    },
  },
  {
    name: "Prufrock's",
    colloquialName: "Prufrock's",
    description:
      'Order Starbucks beverages and quick food options on the ground floor of the Perry-Castañeda Library.',
    type: 'Coffee Shop',
    address: '101 E 21st St, Austin, TX 78705',
    googleMapsLink: 'https://maps.app.goo.gl/',
    appleMapsLink: 'https://maps.apple.com/?address=101%20E%2021st%20St,%20Austin,%20TX%2078705',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        intervals: [{ openTime: 800, closeTime: 2000 }],
      },
      {
        days: ['Saturday'],
        intervals: [{ openTime: 1000, closeTime: 1700 }],
      },
      {
        days: ['Sunday'],
        intervals: [{ openTime: 1200, closeTime: 2000 }],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 800, closeTime: 1100 },
      lunch: { openTime: 1100, closeTime: 1700 },
    },
  },
  {
    name: 'Union Coffee House',
    colloquialName: 'Union',
    description:
      'Make a stop at the Texas Union and pick up Starbucks coffee, bakery items and other grab and go options.',
    type: 'Coffee Shop',
    address: '2308 Whitis Ave, Austin, TX 78712',
    googleMapsLink: 'https://maps.app.goo.gl/',
    appleMapsLink: 'https://maps.apple.com/?address=2308%20Whitis%20Ave,%20Austin,%20TX%2078712',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        intervals: [{ openTime: 730, closeTime: 1800 }],
      },
      {
        days: ['Saturday', 'Sunday'],
        intervals: [],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 730, closeTime: 1100 },
      lunch: { openTime: 1100, closeTime: 1800 },
    },
  },
  {
    name: 'Up and Atom',
    colloquialName: 'Up & Atom',
    description:
      'Power your day with quick bites and Ruta Maya coffee at this conveniently located coffee shop in Welch Hall.',
    type: 'Coffee Shop',
    address: '105 E 24th St, Austin, TX 78712',
    googleMapsLink: 'https://maps.app.goo.gl/',
    appleMapsLink: 'https://maps.apple.com/?address=105%20E%2024th%20St,%20Austin,%20TX%2078712',
    schedules: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        intervals: [{ openTime: 730, closeTime: 1700 }],
      },
      {
        days: ['Saturday', 'Sunday'],
        intervals: [],
      },
    ],
    mealTimes: {
      breakfast: { openTime: 730, closeTime: 1100 },
      lunch: { openTime: 1100, closeTime: 1700 },
    },
  },
];

// Function to get location name on display settings
export const getLocationName = (originalName: string, useColloquial: boolean): string => {
  if (!useColloquial) return originalName;

  const locationInfo = LOCATION_INFO.find((location) => location.name === originalName);
  if (locationInfo?.colloquialName) {
    return locationInfo.colloquialName;
  }

  return originalName;
};
