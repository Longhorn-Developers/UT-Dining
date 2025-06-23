// https://rnas.vercel.app/

import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';

import FiltersSheet from './FiltersSheet';
import FoodInfoSheet from './FoodInfoSheet';
import LocationAboutSheet from './LocationAboutSheet';
import MicrowaveLocationSheet from './MicrowaveLocationSheet';
import SettingsSheet from './SettingsSheet';

import { Location } from '~/db/schema';

registerSheet('location-about', LocationAboutSheet);
registerSheet('food-info', FoodInfoSheet, 'food');
registerSheet('filters', FiltersSheet);
registerSheet('settings', SettingsSheet);
registerSheet('microwave-location', MicrowaveLocationSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'location-about': SheetDefinition<{
      payload: {
        location: Location;
      };
    }>;
    'food-info': SheetDefinition;
    filters: SheetDefinition;
    settings: SheetDefinition;
    'microwave-location': SheetDefinition<{
      payload: {
        name: string;
        address: string;
        description: string;
        note?: string;
      };
    }>;
  }
}

export {};
