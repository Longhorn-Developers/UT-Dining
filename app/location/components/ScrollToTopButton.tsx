import { ArrowUp } from 'lucide-react-native';
import { Animated, TouchableOpacity } from 'react-native';

interface ScrollToTopButtonProps {
  visible: boolean;
  animationValue: Animated.Value;
  onPress: () => void;
}

const ScrollToTopButton = ({ visible, animationValue, onPress }: ScrollToTopButtonProps) => {
  const scaleAnim = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View
      style={{
        opacity: animationValue,
        transform: [{ scale: scaleAnim }],
        position: 'absolute',
        bottom: 40,
        right: 40,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        className="size-12 items-center justify-center rounded-full bg-ut-burnt-orange shadow-md"
        activeOpacity={0.8}
      >
        <ArrowUp size={24} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ScrollToTopButton;
