import { LayoutChangeEvent, SafeAreaView } from 'react-native';

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
  return (
    <SafeAreaView onLayout={onLayout} className={cn(styles.container, className)}>
      {children}
    </SafeAreaView>
  );
};

const styles = {
  container: 'flex flex-col flex-1 mx-6 gap-y-8 pb-24',
};
