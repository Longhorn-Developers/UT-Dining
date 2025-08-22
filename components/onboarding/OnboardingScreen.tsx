import * as Haptics from 'expo-haptics';
import { ChevronLeft } from 'lucide-react-native';
import { usePostHog } from 'posthog-react-native';
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
import { getSafePostHog } from '~/services/analytics/posthog';
import { ONBOARDING_STEPS, useOnboardingStore } from '~/store/useOnboardingStore';
import { useSettingsStore } from '~/store/useSettingsStore';
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
import ReferralSourceScreen from './screens/ReferralSourceScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const ONBOARDING_SCREENS = [
  ONBOARDING_STEPS.WELCOME,
  ONBOARDING_STEPS.DATA_COLLECTION,
  ONBOARDING_STEPS.REFERRAL_SOURCE,
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
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const posthog = usePostHog();
  const analytics = getSafePostHog(posthog);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  const currentStepShared = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const { currentStep, setCurrentStep, completeOnboarding } = useOnboardingStore();
  const [hasDataSelection, setHasDataSelection] = React.useState(false);
  const [selectedMotivations, setSelectedMotivations] = React.useState<string[]>([]);
  const [hasReferralSource, setHasReferralSource] = React.useState(false);
  const [referralSource, setReferralSource] = React.useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = React.useState<{
    location: string;
    notifications: string;
  } | null>(null);
  const [hasTrackedStart, setHasTrackedStart] = React.useState(false);

  // Track onboarding start only once
  React.useEffect(() => {
    if (!isOnboardingComplete && !hasTrackedStart) {
      analytics.capture('onboarding_start', {
        onboarding_version: '1.0',
        timestamp: new Date().toISOString(),
      });
      setHasTrackedStart(true);
    }
  }, [isOnboardingComplete, hasTrackedStart, analytics]);

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
    analytics.capture('onboarding_completed', {
      selected_motivations: selectedMotivations,
      motivation_count: selectedMotivations.length,
      referral_source: referralSource || 'undetermined',
      location_permission: permissionStatus?.location || 'undetermined',
      notifications_permission: permissionStatus?.notifications || 'undetermined',
      onboarding_version: '1.1',
    });

    completeOnboarding();
  };

  const renderScreen = (stepId: string, index: number) => {
    switch (stepId) {
      case ONBOARDING_STEPS.WELCOME:
        return <WelcomeScreen key={index} width={width} />;
      case ONBOARDING_STEPS.DATA_COLLECTION:
        return (
          <DataCollectionScreen
            key={index}
            width={width}
            onSelectionChange={setHasDataSelection}
            onSelectionUpdate={setSelectedMotivations}
          />
        );
      case ONBOARDING_STEPS.REFERRAL_SOURCE:
        return (
          <ReferralSourceScreen
            key={index}
            width={width}
            onSelectionChange={setHasReferralSource}
            onSelectionUpdate={setReferralSource}
          />
        );
      case ONBOARDING_STEPS.FEATURES_MENUS:
        return <MenusFeatureScreen key={index} width={width} />;
      case ONBOARDING_STEPS.FEATURES_MAP:
        return <MapFeatureScreen key={index} width={width} />;
      case ONBOARDING_STEPS.FEATURES_FAVORITES:
        return <FavoritesFeatureScreen key={index} width={width} />;
      case ONBOARDING_STEPS.PERMISSIONS:
        return (
          <PermissionsScreen key={index} width={width} onPermissionsChange={setPermissionStatus} />
        );
      case ONBOARDING_STEPS.COMPLETE:
        return (
          <CompleteScreen
            key={index}
            width={width}
            handleComplete={handleComplete}
            isCurrentScreen={currentStep === index}
          />
        );
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
      <Container className={cn('mx-0', isDarkMode ? 'bg-neutral-900' : 'bg-white')}>
        <View className="flex-row items-center px-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToPrevious}
            disabled={currentStep === 0}
            className={cn('rounded-full', currentStep === 0 ? 'opacity-0' : 'opacity-100')}
          >
            <ChevronLeft
              size={24}
              color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']}
            />
          </TouchableOpacity>

          <View className="flex-1 items-center justify-center px-4">
            <ProgressIndicator
              step={currentStep}
              totalSteps={ONBOARDING_SCREENS.length}
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
            className={cn(
              'w-full rounded-full p-3',
              isDarkMode ? 'bg-ut-burnt-orange/90' : 'bg-ut-burnt-orange',
            )}
            style={[animatedStyle]}
          >
            <Text className="py-2 text-center font-semibold text-white">
              {currentStep === ONBOARDING_SCREENS.length - 1
                ? 'Finish'
                : (currentStep === 1 && !hasDataSelection) ||
                    (currentStep === 2 && !hasReferralSource)
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
