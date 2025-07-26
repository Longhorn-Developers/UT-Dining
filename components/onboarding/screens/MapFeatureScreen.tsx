import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { Text, useColorScheme, View } from 'react-native';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
};

const MapFeatureScreen = ({ width }: Props) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [assets] = useAssets([require('~/assets/onboarding/map.png')]);

  if (!assets) {
    return null;
  }

  return (
    <View style={{ width }} className={cn('flex-1 px-6 py-8', isDark ? 'bg-gray-900' : 'bg-white')}>
      <View className="flex-1 items-center justify-center">
        <Image
          source={assets[0]}
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
