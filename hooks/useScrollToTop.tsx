import type { FlashList } from '@shopify/flash-list';
import { useCallback, useRef, useState } from 'react';
import { Animated, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

export const useScrollToTop = <T,>(listRef: React.RefObject<FlashList<T>>) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollButtonAnimation = useRef(new Animated.Value(0)).current;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollPosition = event.nativeEvent.contentOffset.y;
      const threshold = 500;

      if (scrollPosition > threshold && !showScrollToTop) {
        setShowScrollToTop(true);
        Animated.spring(scrollButtonAnimation, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 40,
        }).start();
      } else if (scrollPosition <= threshold && showScrollToTop) {
        Animated.spring(scrollButtonAnimation, {
          toValue: 0,
          useNativeDriver: true,
          friction: 7,
        }).start(() => {
          setShowScrollToTop(false);
        });
      }
    },
    [showScrollToTop, scrollButtonAnimation],
  );

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [listRef]);

  return {
    showScrollToTop,
    scrollButtonAnimation,
    handleScroll,
    scrollToTop,
  };
};
