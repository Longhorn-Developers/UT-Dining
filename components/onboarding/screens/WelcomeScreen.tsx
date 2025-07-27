import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useSettingsStore } from '~/store/useSettingsStore';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
};

const WelcomeScreen = ({ width }: Props) => {
  const isDark = useSettingsStore((state) => state.isDarkMode);
  const [assets] = useAssets([require('~/assets/onboarding/icon.webp')]);

  if (!assets) {
    return null;
  }

  return (
    <View style={{ width }} className={cn('flex-1 px-6 py-8', isDark ? 'bg-gray-900' : 'bg-white')}>
      <View className="flex-1 items-center justify-center">
        <Image
          source={assets[0]}
          style={{ width: 200, height: 200 }}
          className="mb-8"
          contentFit="contain"
        />

        <View>
          <Text
            className={cn(
              'my-4 text-center font-bold text-4xl',
              isDark ? 'text-white' : 'text-gray-900',
            )}
          >
            The all-in-one UT Austin dining app 🤘
          </Text>
          <Text
            className={cn(
              'mx-auto max-w-[300px] text-center text-lg leading-6',
              isDark ? 'text-gray-300' : 'text-gray-600',
            )}
          >
            Explore menus, hours, locations, and more—right at your fingertips
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
