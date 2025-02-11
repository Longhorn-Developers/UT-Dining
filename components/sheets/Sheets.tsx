// https://rnas.vercel.app/guides/

import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';

import LocationAboutSheet from './LocationAboutSheet';

import { LocationInfo } from '~/data/LocationInfo';

registerSheet('location-about', LocationAboutSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'location-about': SheetDefinition<{
      payload: {
        location: LocationInfo;
      };
    }>;
  }
}

export {};
