// https://rnas.vercel.app/

import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';

import FiltersSheet from './FiltersSheet';
import FoodInfoSheet from './FoodInfoSheet';
import LocationAboutSheet from './LocationAboutSheet';

import { LocationInfo } from '~/data/LocationInfo';

registerSheet('location-about', LocationAboutSheet);
registerSheet('food-info', FoodInfoSheet);
registerSheet('filters', FiltersSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'location-about': SheetDefinition<{
      payload: {
        location: LocationInfo;
      };
    }>;
    'food-info': SheetDefinition;
    filters: SheetDefinition;
  }
}

export {};
