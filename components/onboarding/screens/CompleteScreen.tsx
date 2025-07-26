import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
  handleComplete: () => void;
  isCurrentScreen: boolean;
};

const CompleteScreen = ({ width, isCurrentScreen }: Props) => {
  const lottieRef = useRef<LottieView>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (!isCurrentScreen) {
      lottieRef.current?.reset();
    }
  }, [isCurrentScreen]);

  return (
    <View style={{ width }} className={cn('flex-1 px-6', isDark ? 'bg-gray-900' : 'bg-white')}>
      <View className="flex-1 items-center justify-center">
        <View className="items-center">
          <LottieView
            ref={lottieRef}
            source={require('~/assets/onboarding/success-lottie.json')}
            autoPlay={isCurrentScreen}
            loop
            style={{ width: 300, height: 300 }}
            resizeMode="cover"
          />

          <Text
            style={{
              marginTop: -48,
            }}
            className={cn(
              'mb-4 text-center font-bold text-3xl',
              isDark ? 'text-white' : 'text-gray-900',
            )}
          >
            You're all set 🤘
          </Text>
          <Text
            className={cn(
              'max-w-[260px] text-center text-lg leading-6',
              isDark ? 'text-gray-300' : 'text-gray-600',
            )}
          >
            Thanks for setting things up — now it's time to find your next meal
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CompleteScreen;
