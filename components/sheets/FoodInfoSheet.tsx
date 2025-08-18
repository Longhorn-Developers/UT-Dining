import { InfoIcon } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';
import ActionSheet, { type SheetProps } from 'react-native-actions-sheet';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALLERGEN_EXCEPTIONS, ALLERGEN_ICONS } from '~/data/AllergenInfo';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

// Helper function to organize allergen data
const categorizeAllergens = () => {
  const allergens = Object.entries(ALLERGEN_ICONS)
    .filter(([key]) => !ALLERGEN_EXCEPTIONS.has(key))
    .map(([key, icon]) => ({
      key,
      icon,
      displayName: key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }));

  const dietary = Object.entries(ALLERGEN_ICONS)
    .filter(([key]) => ALLERGEN_EXCEPTIONS.has(key))
    .map(([key, icon]) => ({
      key,
      icon,
      displayName: key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }));

  return { allergens, dietary };
};

const FoodInfoSheet = ({ sheetId }: SheetProps<'food-info'>) => {
  const insets = useSafeAreaInsets();
  const { allergens, dietary } = categorizeAllergens();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.5}
      containerStyle={{ backgroundColor: isDarkMode ? '#171717' : 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding
    >
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[60vh]">
        <View className="p-6">
          {/* Header */}
          <View>
            <View className="mb-2 flex-row items-center gap-x-2">
              <InfoIcon color={COLORS['ut-burnt-orange']} />
              <Text className={cn('font-bold text-3xl', isDarkMode ? 'text-white' : 'text-black')}>
                Food Legend
              </Text>
            </View>
          </View>

          {/* Allergens Section */}
          <View>
            <Text className={cn('font-semibold text-xl', isDarkMode ? 'text-white' : 'text-black')}>
              Allergens
            </Text>
            <Text className={cn('mb-3 text-sm', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
              Foods containing these allergens are labeled
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {allergens.map((item) => (
                <View key={item.key} className="mb-4 w-[21%] items-center">
                  <View
                    className={cn(
                      'mb-1 rounded-full border p-3',
                      isDarkMode ? 'border-gray-700 bg-neutral-800' : 'border-gray-200 bg-neutral-50',
                    )}
                  >
                    <Image
                      source={item.icon}
                      className="size-10 rounded-full"
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    className={cn(
                      'text-center font-medium text-xs',
                      isDarkMode ? 'text-gray-300' : 'text-ut-grey',
                    )}
                  >
                    {item.displayName}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View
            className={cn(
              'mb-4 w-full border-b',
              isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15',
            )}
          />

          {/* Dietary Section */}
          <View>
            <Text className={cn('font-semibold text-xl', isDarkMode ? 'text-white' : 'text-black')}>
              Dietary Preferences
            </Text>
            <Text className={cn('mb-3 text-sm', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
              Foods that meet these preferences are labeled
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {dietary.map((item) => (
                <View key={item.key} className="mb-4 w-[21%] items-center">
                  <View
                    className={cn(
                      'mb-1 rounded-full border p-3',
                      isDarkMode ? 'border-gray-700 bg-neutral-800' : 'border-gray-200 bg-neutral-50',
                    )}
                  >
                    <Image source={item.icon} className="size-10" resizeMode="contain" />
                  </View>
                  <Text
                    className={cn(
                      'text-center font-medium text-xs',
                      isDarkMode ? 'text-gray-300' : 'text-ut-grey',
                    )}
                  >
                    {item.displayName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default FoodInfoSheet;
