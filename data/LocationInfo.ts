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

export type LocationType = 'Dining Hall' | 'Restaurant' | 'Convenience Store';

export interface LocationInfo {
  name: string;
  description: string;
  type: LocationType;
  address: string;
  mapLink: string;
  schedules: OpeningHours[];
}

export const LOCATION_INFO: LocationInfo[] = [
  {
    name: 'J2 Dining',
    description:
      'Positioned on the south side of campus, J2 Dining houses a top-9 allergen free line as well as other unique options.\n\nJ2 Dining is located on the second floor of Jester Center and serves a varied menu for you to create your ideal meal. The offerings at J2 include something for everyone.',
    address: '201 E 21st St Austin, TX 78705',
    type: 'Dining Hall',
    mapLink: 'https://maps.app.goo.gl/oQJCkYWNgyFkMvFf7',
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
  },
  {
    name: 'JCL Dining',
    type: 'Dining Hall',
    mapLink: 'https://maps.app.goo.gl/DccikGcpeV4tpZSj7',
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
  },
  {
    name: 'Kins Dining',
    description:
      'Serving the northwest side of campus, Kins Dining hosts several serving lines and outdoor patio seating. Kins Dining is in Kinsolving Hall and offers a dining experience where you can piece together your ideal meal from the assortment of food lines and menu specials.\n\nEnjoy your meal inside the dining hall or on the outdoor patio overlooking the Kinsolving garden.',
    type: 'Dining Hall',
    mapLink: 'https://maps.app.goo.gl/zaxxqbgcuGBgQwBY9',
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
  },
  {
    name: "Jesta' Pizza",
    description:
      'Build your own pizza with an array of sauces and toppings and find other quick bites on the south side of campus inside Jester Center.\n\nJesta’ Pizza offers an assortment of options for you to create your ideal pie. Other snacks and beverages are also available for purchase.',
    type: 'Restaurant',
    mapLink: 'https://maps.app.goo.gl/918gcsqhiFcq2CYS6',
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
  },
  {
    name: 'Cypress Bend Cafe',
    description:
      'Explore this grill and coffee shop all in one located in San Jacinto Residence Hall. Cypress Bend Cafe serves Starbucks coffee and beverages, bakery items and other grab and go options.\n\nIn addition, you can choose from a variety of meal options at the grill.',
    type: 'Restaurant',
    mapLink: 'https://maps.app.goo.gl/h3T5ZbVH86rnNfp26',
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
  },
  {
    name: 'Jester City Market',
    description:
      'Grab a bite on the go, shop for the essentials or stop in for a beverage on the ground floor of Jester Center.\n\nJester City Market has all your convenience store needs including school supplies, snacks and other goods. Stop in to see all we have to offer.',
    type: 'Convenience Store',
    mapLink: 'https://maps.app.goo.gl/PrsZA1x88GUqdhhx6',
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
  },
  {
    name: 'Littlefield Patio Cafe',
    description:
      'Discover bistro-style dining, grab and go offerings and coffee options on the northwest side of campus, adjacent to Littlefield Hall.\n\nLittlefield Patio Cafe offers a la carte meal options in addition to Starbucks coffee and drinks, bakery selections and other selections.Enjoy your meal on the namesake patio dining area or inside the cafe.',
    type: 'Restaurant',
    address: '2503 Whitis Ave Austin, TX 78705',
    mapLink: 'https://maps.app.goo.gl/CtBnkvwy6qCDNtyi9',
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
  },
];
