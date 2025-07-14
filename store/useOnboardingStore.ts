import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

interface OnboardingState {
  // Completion tracking
  isOnboardingComplete: boolean;
  completedSteps: string[];
  currentStep: number;

  // Actions
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  completeStep: (stepId: string) => void;
  setCurrentStep: (step: number) => void;
  skipOnboarding: () => void;

  // Helpers
  hasCompletedStep: (stepId: string) => boolean;
  shouldShowOnboarding: () => boolean;
}

export const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  PERMISSIONS: 'permissions',
  FEATURES: 'features',
  COMPLETE: 'complete',
} as const;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      isOnboardingComplete: false,
      completedSteps: [],
      currentStep: 0,

      completeOnboarding: () => {
        set({
          isOnboardingComplete: true,
          completedSteps: Object.values(ONBOARDING_STEPS),
          currentStep: Object.values(ONBOARDING_STEPS).length,
        });
      },

      resetOnboarding: () => {
        set({
          isOnboardingComplete: false,
          completedSteps: [],
          currentStep: 0,
        });
      },

      completeStep: (stepId: string) => {
        const state = get();
        if (!state.completedSteps.includes(stepId)) {
          set((state) => ({
            completedSteps: [...state.completedSteps, stepId],
          }));
        }
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      skipOnboarding: () => {
        set({
          isOnboardingComplete: true,
          currentStep: Object.values(ONBOARDING_STEPS).length,
        });
      },

      hasCompletedStep: (stepId: string) => {
        return get().completedSteps.includes(stepId);
      },

      shouldShowOnboarding: () => {
        return !get().isOnboardingComplete;
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
