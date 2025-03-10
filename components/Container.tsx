import { LayoutChangeEvent, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '~/utils/utils';

export const Container = ({
  onLayout,
  className,
  children,
}: {
  onLayout?: (event: LayoutChangeEvent) => void;
  className?: string;
  children: React.ReactNode;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      onLayout={onLayout}
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className={cn(styles.container, className)}>
      {children}
    </View>
  );
};

const styles = {
  container: 'flex flex-col flex-1 mx-6 gap-y-8 pb-24',
};
