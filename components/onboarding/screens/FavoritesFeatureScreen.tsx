import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { Text, useColorScheme, View } from 'react-native';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
};

const FavoritesFeatureScreen = ({ width }: Props) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [assets] = useAssets([
    require('~/assets/onboarding/favorites.png'),
    require('~/assets/onboarding/meal-plan.png'),
  ]);

  if (!assets) {
    return null;
  }

  return (
    <View style={{ width }} className={cn('flex-1 px-6 py-8', isDark ? 'bg-gray-900' : 'bg-white')}>
      <View className="flex-1 items-center justify-center">
        <View className="flex-row gap-0">
          <Image
            source={assets[0]}
            style={{
              width: 180,
              height: 512,
            }}
            contentFit="contain"
          />
          <Image
            source={assets[1]}
            style={{
              width: 180,
              height: 512,
            }}
            contentFit="contain"
          />
        </View>

        <View>
          <Text
            className={cn(
              'mb-4 text-center font-bold text-3xl',
              isDark ? 'text-white' : 'text-gray-900',
            )}
          >
            Favorites & Meal Planning
          </Text>
          <Text
            className={cn(
              'mx-auto max-w-[300px] text-center text-lg leading-6',
              isDark ? 'text-gray-300' : 'text-gray-600',
            )}
          >
            Keep track of your favotites and plan your meals ahead of time
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FavoritesFeatureScreen;
