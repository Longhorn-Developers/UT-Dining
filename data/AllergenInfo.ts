import { ImageSourcePropType } from 'react-native';

const BeefIcon = require('../assets/allergen-icons/Beef.webp');
const EggIcon = require('../assets/allergen-icons/Eggs.webp');
const FishIcon = require('../assets/allergen-icons/Fish.webp');
const HalalIcon = require('../assets/allergen-icons/Halal.webp');
const MilkIcon = require('../assets/allergen-icons/Milk.webp');
const PeanutsIcon = require('../assets/allergen-icons/Peanuts.webp');
const PorkIcon = require('../assets/allergen-icons/Pork.webp');
const SesameSeedsIcon = require('../assets/allergen-icons/Sesame.webp');
const ShellfishIcon = require('../assets/allergen-icons/Shellfish.webp');
const SoyIcon = require('../assets/allergen-icons/Soy.webp');
const TreeNutsIcon = require('../assets/allergen-icons/Tree_Nuts.webp');
const VeganIcon = require('../assets/allergen-icons/Vegan.webp');
const VegetarianIcon = require('../assets/allergen-icons/Veggie.webp');
const WheatIcon = require('../assets/allergen-icons/Wheat.webp');

export type AllergenKey =
  | 'beef'
  | 'egg'
  | 'fish'
  | 'peanuts'
  | 'pork'
  | 'shellfish'
  | 'soy'
  | 'tree_nuts'
  | 'wheat'
  | 'sesame_seeds'
  | 'vegetarian'
  | 'vegan'
  | 'halal'
  | 'milk';

const ALLERGEN_ICONS: Record<AllergenKey, ImageSourcePropType> = {
  beef: BeefIcon,
  egg: EggIcon,
  fish: FishIcon,
  milk: MilkIcon,
  peanuts: PeanutsIcon,
  pork: PorkIcon,
  shellfish: ShellfishIcon,
  soy: SoyIcon,
  tree_nuts: TreeNutsIcon,
  wheat: WheatIcon,
  sesame_seeds: SesameSeedsIcon,
  vegan: VeganIcon,
  vegetarian: VegetarianIcon,
  halal: HalalIcon,
};

// Constants
const NUTRITION_ORDER = [
  'Calories',
  'Total Fat',
  'Saturated Fat',
  'Trans Fat',
  'Cholesterol',
  'Sodium',
  'Total Carbohydrates',
  'Dietary Fiber',
  'Total Sugars',
  'Protein',
  'Vitamin D',
  'Calcium',
  'Iron',
  'Potassium',
];

const DAILY_VALUES: Record<string, number> = {
  Calories: 2000,
  'Total Fat': 78,
  'Saturated Fat': 20,
  Cholesterol: 300,
  Sodium: 2300,
  'Total Carbohydrates': 275,
  'Dietary Fiber': 28,
  'Total Sugars': 50,
  'Vitamin D': 20,
  Calcium: 1300,
  Iron: 18,
  Potassium: 4700,
};

const INDENTED_NUTRITION = new Set(['Saturated Fat', 'Trans Fat', 'Dietary Fiber', 'Total Sugars']);
const ALLERGEN_EXCEPTIONS = new Set(['halal', 'vegan', 'vegetarian']);

export { ALLERGEN_ICONS, NUTRITION_ORDER, DAILY_VALUES, INDENTED_NUTRITION, ALLERGEN_EXCEPTIONS };
