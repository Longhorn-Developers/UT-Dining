import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useSettingsStore } from '~/store/useSettingsStore';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
};

const image = require('~/assets/onboarding/map.webp');

const MapFeatureScreen = ({ width }: Props) => {
  const isDark = useSettingsStore((state) => state.isDarkMode);

  return (
    <View
      style={{ width }}
      className={cn('flex-1 px-6 py-8', isDark ? 'bg-neutral-900' : 'bg-white')}
    >
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
            Find Food Near You
          </Text>
          <Text
            className={cn(
              'mx-auto max-w-[340px] text-center text-lg leading-6',
              isDark ? 'text-gray-300' : 'text-gray-600',
            )}
          >
            Discover 50+ locations — dining halls, food trucks, coffee shops, and more across
            campus.{' '}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MapFeatureScreen;
