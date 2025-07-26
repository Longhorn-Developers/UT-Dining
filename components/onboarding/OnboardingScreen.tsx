import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ONBOARDING_STEPS, useOnboardingStore } from '~/store/useOnboardingStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';
import { Container } from '../Container';
import { ProgressIndicator } from './ProgressIndicator';
import CompleteScreen from './screens/CompleteScreen';
import DataCollectionScreen from './screens/DataCollectionScreen';
import FavoritesFeatureScreen from './screens/FavoritesFeatureScreen';
import MapFeatureScreen from './screens/MapFeatureScreen';
import MenusFeatureScreen from './screens/MenusFeatureScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const ONBOARDING_SCREENS = [
  ONBOARDING_STEPS.WELCOME,
  ONBOARDING_STEPS.DATA_COLLECTION,
  ONBOARDING_STEPS.FEATURES_MENUS,
  ONBOARDING_STEPS.FEATURES_MAP,
  ONBOARDING_STEPS.FEATURES_FAVORITES,
  ONBOARDING_STEPS.PERMISSIONS,
  ONBOARDING_STEPS.COMPLETE,
];

interface OnboardingScreenProps {
  isOnboardingComplete: boolean;
}

const OnboardingScreen = ({ isOnboardingComplete }: OnboardingScreenProps) => {
  const { width } = useWindowDimensions();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  const currentStepShared = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const { currentStep, setCurrentStep, completeOnboarding } = useOnboardingStore();
  const [hasDataSelection, setHasDataSelection] = React.useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      if (!isScrolling.value) return;

      const newStep = Math.round(event.contentOffset.x / width);
      if (newStep !== currentStepShared.value) {
        currentStepShared.value = newStep;
        runOnJS(setCurrentStep)(newStep);
      }
    },
    onMomentumEnd: () => {
      isScrolling.value = false;
    },
  });

  const goToNext = useCallback(() => {
    const nextStep = Math.min(currentStep + 1, ONBOARDING_SCREENS.length - 1);
    if (nextStep === currentStep) return;

    currentStepShared.value = nextStep;
    setCurrentStep(nextStep);
    scrollRef.current?.scrollTo({ x: nextStep * width, y: 0, animated: true });
  }, [currentStep, width, scrollRef, setCurrentStep, currentStepShared]);

  const goToPrevious = useCallback(() => {
    const prevStep = Math.max(currentStep - 1, 0);
    if (prevStep === currentStep) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    currentStepShared.value = prevStep;
    setCurrentStep(prevStep);
    scrollRef.current?.scrollTo({ x: prevStep * width, y: 0, animated: true });
  }, [currentStep, width, scrollRef, setCurrentStep, currentStepShared]);

  const handleComplete = () => {
    completeOnboarding();
  };

  const renderScreen = (stepId: string, index: number) => {
    switch (stepId) {
      case ONBOARDING_STEPS.WELCOME:
        return <WelcomeScreen key={index} width={width} />;
      case ONBOARDING_STEPS.DATA_COLLECTION:
        return (
          <DataCollectionScreen key={index} width={width} onSelectionChange={setHasDataSelection} />
        );
      case ONBOARDING_STEPS.FEATURES_MENUS:
        return <MenusFeatureScreen key={index} width={width} />;
      case ONBOARDING_STEPS.FEATURES_MAP:
        return <MapFeatureScreen key={index} width={width} />;
      case ONBOARDING_STEPS.FEATURES_FAVORITES:
        return <FavoritesFeatureScreen key={index} width={width} />;
      case ONBOARDING_STEPS.PERMISSIONS:
        return <PermissionsScreen key={index} width={width} />;
      case ONBOARDING_STEPS.COMPLETE:
        return <CompleteScreen key={index} width={width} handleComplete={handleComplete} />;
      default:
        return null;
    }
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 50, stiffness: 400 });
    opacity.value = withSpring(0.8, { damping: 50, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 50, stiffness: 400 });
    opacity.value = withSpring(1, { damping: 50, stiffness: 400 });
  };

  const handlePress = () => {
    // Ensure animation resets on press
    scale.value = withSpring(1, { damping: 50, stiffness: 400 });
    opacity.value = withSpring(1, { damping: 50, stiffness: 400 });

    if (currentStep === ONBOARDING_SCREENS.length - 1) {
      handleComplete();
    } else {
      goToNext();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Modal animationType="slide" presentationStyle="fullScreen" visible={!isOnboardingComplete}>
      <Container className="mx-0 mt-2 mb-2">
        <View className="flex-row items-center px-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToPrevious}
            disabled={currentStep === 0}
            className={cn('rounded-full', currentStep === 0 ? 'opacity-0' : 'opacity-100')}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS['ut-grey']} />
          </TouchableOpacity>

          <View className="flex-1 items-center justify-center px-4">
            <ProgressIndicator
              step={currentStep}
              totalSteps={ONBOARDING_SCREENS.length}
              stepWidth={width}
              className="w-[180px]"
            />
          </View>

          <View className="w-6" />
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {ONBOARDING_SCREENS.map((stepId, index) => renderScreen(stepId, index))}
        </Animated.ScrollView>

        <View className="px-4">
          <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            className="w-full rounded-full bg-ut-burnt-orange p-3"
            style={[animatedStyle]}
          >
            <Text className="py-2 text-center font-semibold text-white">
              {currentStep === ONBOARDING_SCREENS.length - 1
                ? 'Get Started'
                : currentStep === 1 && !hasDataSelection
                  ? 'Skip'
                  : 'Continue'}
            </Text>
          </AnimatedPressable>
        </View>
      </Container>
    </Modal>
  );
};

export default OnboardingScreen;
