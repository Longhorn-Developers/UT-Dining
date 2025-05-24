type MicrowaveLocation = {
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  note?: string;
};

export const MICROWAVE_LOCATIONS = [
  {
    name: 'Art Building & Museum (ART)',
    address: '2301 San Jacinto Blvd, Austin, TX 78705',
    coordinates: {
      latitude: 30.28587,
      longitude: -97.733131,
    },
    description: 'Found on the 1st floor in the Mary Crouch Student Room.',
  },
  {
    name: 'Robert L. Patton Hall (RLP)',
    address: '305 E 23rd St, Austin, TX 78712',
    coordinates: {
      latitude: 30.284769,
      longitude: -97.73558,
    },
    description: '2nd floor in the LAH office.',
    note: 'LAH Students Only',
  },
  {
    name: 'Belo Center for New Media (BCNM)',
    address: '300 W Dean Keeton St, Austin, TX 78712',
    coordinates: {
      latitude: 30.29027,
      longitude: -97.740562,
    },
    description: '3rd floor, Grad Student Lounge (3.108).',
    note: 'Graduate Students Only',
  },
  {
    name: 'Norman Hackerman Building (NHB)',
    address: '100 E 24TH ST, Austin, TX 78712',
    coordinates: {
      latitude: 30.28761,
      longitude: -97.737819,
    },
    description: '2nd-6th floors, break area by stairs.',
  },
  {
    name: 'Student Service Building (SSB)',
    address: '100 W Dean Keeton St, Austin, TX 78712',
    coordinates: {
      latitude: 30.28968,
      longitude: -97.738113,
    },
    description: 'Ground floor, vending machine area.',
  },
  {
    name: 'Sutton Hall (SUT)',
    address: '305 Inner Campus Drive, Austin, TX 78705',
    coordinates: {
      latitude: 30.284944,
      longitude: -97.740774,
    },
    description: 'Student Lounge.',
  },
  {
    name: 'George I. Sánchez Building (SZB)',
    address: '1912 Speedway, Austin, TX 78712',
    coordinates: {
      latitude: 30.282539,
      longitude: -97.737556,
    },
    description: '2nd floor, vending machine area by 2.210.',
  },
  {
    name: 'The Texas Union (UNB)',
    address: '2308 Whitis Ave, Austin, TX 78712',
    coordinates: {
      latitude: 30.286613,
      longitude: -97.741231,
    },
    description: `1st floor, Tower Burger and Fries and 40 Acres 
Showroom areas.`,
  },
  {
    name: 'William C. Powers, Jr. Center (WCP)',
    address: '2201 Speedway, Austin, TX 78712',
    coordinates: {
      latitude: 30.284881,
      longitude: -97.7368,
    },
    description: `Ground floor next to Provisions On Demand (P.O.D.) 
and at the corner of the food court.`,
  },
  {
    name: 'Graduate School of Business (GSB)',
    address: '100 W 21st St, Austin, TX 78712',
    coordinates: {
      latitude: 30.284152,
      longitude: -97.73809,
    },
    description: "3rd floor Student Lounge (3.328), near O's Cafe.",
  },
] as const satisfies MicrowaveLocation[];
