import { LayoutChangeEvent, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '~/store/useSettingsStore';
import { cn } from '~/utils/utils';

export const Container = ({
  onLayout,
  className,
  children,
  disableBottomPadding = false,
  disableInsets = false,
}: {
  onLayout?: (event: LayoutChangeEvent) => void;
  className?: string;
  children: React.ReactNode;
  disableBottomPadding?: boolean;
  disableInsets?: boolean;
}) => {
  const insets = useSafeAreaInsets();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <View
      onLayout={onLayout}
      style={{
        paddingTop: disableInsets ? 0 : insets.top,
        paddingBottom: disableInsets || disableBottomPadding ? 0 : insets.bottom,
        paddingLeft: disableInsets ? 0 : insets.left,
        paddingRight: disableInsets ? 0 : insets.right,
      }}
      className={cn(
        'mx-6 flex flex-1 flex-col gap-y-8 pb-24',
        isDarkMode ? 'bg-gray-900' : 'bg-white',
        className
      )}>
      {children}
    </View>
  );
};
