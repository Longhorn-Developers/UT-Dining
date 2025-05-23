import { LayoutChangeEvent, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '~/store/useSettingsStore';
import { cn } from '~/utils/utils';

export const Container = ({
  onLayout,
  className,
  children,
  disableBottomPadding = false,
}: {
  onLayout?: (event: LayoutChangeEvent) => void;
  className?: string;
  children: React.ReactNode;
  disableBottomPadding?: boolean;
}) => {
  const insets = useSafeAreaInsets();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <View
      onLayout={onLayout}
      style={{
        paddingTop: insets.top,
        paddingBottom: disableBottomPadding ? 0 : insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
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

const styles = {
  container: 'flex flex-col flex-1 mx-6 gap-y-8 pb-24',
};
