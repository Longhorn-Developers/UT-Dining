import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { CircleAlert, MapPin } from 'lucide-react-native';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet, { ActionSheetRef, ScrollView } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS, getColor } from '~/utils/colors';
import { cn } from '~/utils/utils';

type MicrowaveLocationProps = {
  sheetId: string;
  payload: {
    name: string;
    address: string;
    description: string;
    note?: string;
  };
  ref: React.RefObject<ActionSheetRef>;
};

const MicrowaveLocationSheet = ({ payload, sheetId }: MicrowaveLocationProps) => {
  const { name, address, description, note } = payload;
  const insets = useSafeAreaInsets();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const isColorBlindMode = useSettingsStore((state) => state.isColorBlindMode);

  const handleOpenMaps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const encodedAddress = encodeURIComponent(address.replace(/\s/g, '+'));
    const url =
      Platform.OS === 'ios'
        ? `maps://maps.apple.com/?address=${encodedAddress}`
        : `https://www.google.com/maps/place/${encodedAddress}`;
    Linking.openURL(url);
  };

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.2}
      containerStyle={{
        backgroundColor: isDarkMode ? '#1f2937' : 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      indicatorStyle={{
        backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB',
        width: 60,
      }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding
      backgroundInteractionEnabled>
      <ScrollView showsHorizontalScrollIndicator={false} className="p-5">
        {/* Location header */}
        <View className="mb-4 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className={cn('text-2xl font-bold', isDarkMode && 'text-white')}>{name}</Text>
            <TouchableOpacity className="mt-1 flex-row items-center" onPress={handleOpenMaps}>
              <MapPin
                size={16}
                color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']}
              />
              <Text
                className={cn(
                  'ml-1 text-base',
                  isDarkMode ? 'text-ut-grey-dark-mode' : 'text-ut-grey'
                )}>
                {address}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View className="mb-3">
          <Text className={cn('text-base leading-6', isDarkMode && 'text-white')}>
            {description}
          </Text>
        </View>

        {/* Special note */}
        {note && (
          <View className="mb-4 flex-row items-center gap-x-3 self-start rounded-xl bg-ut-burnt-orange/10 px-4 py-2.5">
            <CircleAlert color={getColor('ut-burnt-orange', isColorBlindMode)} size={18} />
            <Text className="text-sm font-medium text-ut-burnt-orange">{note}</Text>
          </View>
        )}

        {/* Navigation button */}
        <TouchableOpacity
          className="mt-2 rounded-xl bg-ut-burnt-orange py-3.5 shadow-sm"
          style={{
            backgroundColor: getColor('ut-burnt-orange', isColorBlindMode),
          }}
          onPress={handleOpenMaps}>
          <Text className="text-center font-bold text-white">Directions</Text>
        </TouchableOpacity>
      </ScrollView>
    </ActionSheet>
  );
};

export default MicrowaveLocationSheet;
