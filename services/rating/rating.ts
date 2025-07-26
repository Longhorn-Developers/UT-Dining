import * as StoreReview from 'expo-store-review';

import { useAppLaunchStore } from '~/store/useAppLaunchStore';

export interface RatingService {
  checkAndShowRatingPrompt: () => Promise<void>;
  canShowRatingPrompt: () => Promise<boolean>;
}

class RatingServiceImpl implements RatingService {
  async checkAndShowRatingPrompt(): Promise<void> {
    try {
      const { shouldShowRatingPrompt, markRatingPromptShown } = useAppLaunchStore.getState();

      // Check if we should show the rating prompt
      if (!shouldShowRatingPrompt()) {
        return;
      }

      // Check if the device supports in-app review
      const canShow = await this.canShowRatingPrompt();
      if (!canShow) {
        console.log('📱 Rating prompt not available on this device');
        // Mark as shown even if we can't show it to avoid repeated attempts
        markRatingPromptShown();
        return;
      }

      console.log('⭐ Showing rating prompt');
      await StoreReview.requestReview();

      // Mark the rating prompt as shown
      markRatingPromptShown();
    } catch (error) {
      console.error('❌ Error showing rating prompt:', error);
      // Mark as shown even if there was an error to avoid repeated failures
      useAppLaunchStore.getState().markRatingPromptShown();
    }
  }

  async canShowRatingPrompt(): Promise<boolean> {
    try {
      // Check if store review is available on this platform
      const isAvailable = await StoreReview.isAvailableAsync();

      // On iOS, also check if we can actually show the review
      if (isAvailable && StoreReview.hasAction) {
        return await StoreReview.hasAction();
      }

      return isAvailable;
    } catch (error) {
      console.error('❌ Error checking rating prompt availability:', error);
      return false;
    }
  }
}

export const ratingService = new RatingServiceImpl();
