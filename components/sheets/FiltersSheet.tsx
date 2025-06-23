import * as Haptics from 'expo-haptics';
import { Filter, Heart, ChefHat, RotateCwIcon } from 'lucide-react-native';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import ActionSheet, { ScrollView, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALLERGEN_ICONS, ALLERGEN_EXCEPTIONS } from '~/data/AllergenInfo';
import { useFiltersStore } from '~/store/useFiltersStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

const FiltersSheet = ({ sheetId }: SheetProps<'filters'>) => {
  const insets = useSafeAreaInsets();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

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
      containerStyle={{ backgroundColor: isDarkMode ? '#111827' : 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-2">
              <Filter color={COLORS['ut-burnt-orange']} size={20} />
              <Text className={cn('text-3xl font-bold', isDarkMode ? 'text-white' : 'text-black')}>
                Filters
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                resetFilters();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={cn(
                'flex-row items-center gap-x-1 rounded-full border px-3 py-1',
                isDarkMode ? 'border-gray-700' : 'border-ut-grey/50'
              )}>
              <RotateCwIcon size={16} color={isDarkMode ? '#ccc' : COLORS['ut-grey']} />
              <Text
                className={cn(
                  'text-sm font-medium',
                  isDarkMode ? 'text-gray-200' : 'text-ut-grey'
                )}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          {/* Special Filters */}
          <Text className={cn('mb-2 text-xl font-semibold', isDarkMode ? 'text-gray-100' : '')}>
            My Items
          </Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            <TouchableOpacity
              onPress={toggleFavoriteFilter}
              className={cn(
                'flex-row items-center gap-x-2 rounded-lg border px-3 py-2',
                filters.favorites
                  ? 'border-ut-burnt-orange bg-ut-burnt-orange'
                  : isDarkMode
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-ut-grey/15 bg-white'
              )}>
              <Heart size={16} color={filters.favorites ? '#fff' : COLORS['ut-burnt-orange']} />
              <Text
                className={cn(
                  'text-sm font-medium',
                  filters.favorites ? 'text-white' : isDarkMode ? 'text-gray-200' : 'text-ut-grey'
                )}>
                Favorites
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleMealPlanFilter}
              className={cn(
                'flex-row items-center gap-x-2 rounded-lg border px-3 py-2',
                filters.mealPlan
                  ? 'border-ut-burnt-orange bg-ut-burnt-orange'
                  : isDarkMode
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-ut-grey/15 bg-white'
              )}>
              <ChefHat size={16} color={filters.mealPlan ? '#fff' : COLORS['ut-burnt-orange']} />
              <Text
                className={cn(
                  'text-sm font-medium',
                  filters.mealPlan ? 'text-white' : isDarkMode ? 'text-gray-200' : 'text-ut-grey'
                )}>
                Meal Plan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Allergen Filters */}
          <Text className={cn('text-xl font-semibold', isDarkMode ? 'text-gray-100' : '')}>
            Allergens
          </Text>
          <Text className={cn('mb-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
            Exclude items that contain these allergens
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
                    : isDarkMode
                      ? 'border-gray-700 bg-gray-800'
                      : 'border-ut-grey/15 bg-white'
                )}>
                <Image source={iconSource} className="size-4 rounded-full" resizeMode="contain" />
                <Text
                  className={cn(
                    'text-sm font-medium',
                    filters.allergens[key]
                      ? 'text-white'
                      : isDarkMode
                        ? 'text-gray-200'
                        : 'text-ut-grey'
                  )}>
                  {formatKey(key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dietary Preferences */}
          <Text className={cn('text-xl font-semibold', isDarkMode ? 'text-gray-100' : '')}>
            Dietary Preferences
          </Text>
          <Text className={cn('mb-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
            Show only items that match these dietary preferences
          </Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
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
                    : isDarkMode
                      ? 'border-gray-700 bg-gray-800'
                      : 'border-ut-grey/15 bg-white'
                )}>
                <Image source={iconSource} className="size-4 rounded-full" resizeMode="contain" />
                <Text
                  className={cn(
                    'text-sm font-medium',
                    filters.dietary[key]
                      ? 'text-white'
                      : isDarkMode
                        ? 'text-gray-200'
                        : 'text-ut-grey'
                  )}>
                  {formatKey(key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default FiltersSheet;
