import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useSettingsStore } from '~/store/useSettingsStore';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
};

const image = require('~/assets/onboarding/menu.webp');

const MenusFeatureScreen = ({ width }: Props) => {
  const isDark = useSettingsStore((state) => state.isDarkMode);

  return (
    <View style={{ width }} className={cn('flex-1 px-6 py-8', isDark ? 'bg-gray-900' : 'bg-white')}>
      <View className="flex-1 items-center justify-center">
        <Image
          source={image}
          style={{
            width: 236,
            height: 512,
          }}
          contentFit="contain"
          className="mb-8"
        />

        <View>
          <Text
            className={cn(
              'mb-4 text-center font-bold text-3xl',
              isDark ? 'text-white' : 'text-gray-900',
            )}
          >
            Browse Menus with Ease
          </Text>
          <Text
            className={cn(
              'mx-auto max-w-[300px] text-center text-lg leading-6',
              isDark ? 'text-gray-300' : 'text-gray-600',
            )}
          >
            No more guessing. Know what's on the menu before you go
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MenusFeatureScreen;
