import * as Haptics from 'expo-haptics';
import { Filter, Heart, ChefHat, RotateCwIcon } from 'lucide-react-native';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import ActionSheet, { ScrollView, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALLERGEN_ICONS, ALLERGEN_EXCEPTIONS } from '~/data/AllergenInfo';
import { useFiltersStore } from '~/store/useFiltersStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

const FiltersSheet = ({ sheetId }: SheetProps<'filters'>) => {
  const insets = useSafeAreaInsets();

  // Get filters from store
  const {
    filters,
    toggleFavoriteFilter,
    toggleMealPlanFilter,
    toggleAllergenFilter,
    toggleDietaryFilter,
    resetFilters,
  } = useFiltersStore();

  // Helper function to format allergen keys
  const formatKey = (key: string) => {
    return key
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get allergens excluding dietary preferences
  const allergens = Object.entries(ALLERGEN_ICONS).filter(([key]) => !ALLERGEN_EXCEPTIONS.has(key));

  // Get dietary preferences
  const dietaryOptions = Object.entries(ALLERGEN_ICONS).filter(([key]) =>
    ALLERGEN_EXCEPTIONS.has(key)
  );

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.5}
      containerStyle={{ backgroundColor: 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-2">
              <Filter color={COLORS['ut-burnt-orange']} size={20} />
              <Text className="text-3xl font-bold">Filters</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                resetFilters();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="flex-row items-center gap-x-1 rounded-full border border-ut-grey/50 px-3 py-1">
              <RotateCwIcon size={16} color={COLORS['ut-grey']} />
              <Text className="text-sm font-medium text-ut-grey">Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Special Filters */}
          <Text className="mb-2 text-xl font-semibold">My Items</Text>
          <View className="mb-6 flex-row gap-x-2">
            <TouchableOpacity
              onPress={() => {
                toggleFavoriteFilter();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={cn(
                'flex-1 flex-row items-center justify-center gap-x-2 rounded-lg border py-3',
                filters.favorites
                  ? 'border-ut-burnt-orange bg-ut-burnt-orange'
                  : 'border-ut-grey/15 bg-white'
              )}>
              <Heart
                size={18}
                color={filters.favorites ? 'white' : COLORS['ut-grey']}
                fill={filters.favorites ? 'white' : 'transparent'}
              />
              <Text
                className={cn('font-medium', filters.favorites ? 'text-white' : 'text-ut-grey')}>
                Favorites
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleMealPlanFilter();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={cn(
                'flex-1 flex-row items-center justify-center gap-x-2 rounded-lg border py-3',
                filters.mealPlan
                  ? 'border-ut-burnt-orange bg-ut-burnt-orange'
                  : 'border-ut-grey/15 bg-white'
              )}>
              <ChefHat size={18} color={filters.mealPlan ? 'white' : COLORS['ut-grey']} />
              <Text className={cn('font-medium', filters.mealPlan ? 'text-white' : 'text-ut-grey')}>
                Meal Plan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Allergens */}
          <Text className="text-xl font-semibold">Allergen Free</Text>
          <Text className="mb-2 text-sm text-ut-grey">
            Show only items that do not contain these allergens
          </Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
            {allergens.map(([key, iconSource]) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  toggleAllergenFilter(key);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={cn(
                  'flex-row items-center gap-x-2 rounded-lg border px-3 py-2',
                  filters.allergens[key]
                    ? 'border-ut-burnt-orange bg-ut-burnt-orange'
                    : 'border-ut-grey/15 bg-white'
                )}>
                <Image source={iconSource} className="size-4 rounded-full" resizeMode="contain" />
                <Text
                  className={cn(
                    'text-sm font-medium',
                    filters.allergens[key] ? 'text-white' : 'text-ut-grey'
                  )}>
                  {formatKey(key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dietary Preferences */}
          <Text className="text-xl font-semibold">Dietary Preferences</Text>
          <Text className="mb-2 text-sm text-ut-grey">
            Show only items that match these dietary preferences
          </Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {dietaryOptions.map(([key, iconSource]) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  toggleDietaryFilter(key);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={cn(
                  'flex-row items-center gap-x-2 rounded-lg border px-3 py-2',
                  filters.dietary[key]
                    ? 'border-ut-burnt-orange bg-ut-burnt-orange'
                    : 'border-ut-grey/15 bg-white'
                )}>
                <Image source={iconSource} className="size-4" resizeMode="contain" />
                <Text
                  className={cn(
                    'text-sm font-medium',
                    filters.dietary[key] ? 'text-white' : 'text-ut-grey'
                  )}>
                  {formatKey(key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-4">
            <Text className="text-xs text-ut-grey">
              Note: Allergen and dietary data comes directly from University Housing and Dining and
              may not always be accurate. Use discretion when making dietary choices.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default FiltersSheet;
