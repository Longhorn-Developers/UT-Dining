import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '~/store/useSettingsStore';
import { cn } from '~/utils/utils';

const Alert = ({ title, description }: { title: string; description: string }) => {
  const { isDarkMode } = useSettingsStore();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className="px-4">
        <View
          className={cn(
            'flex-row items-center gap-x-3 rounded-lg border p-4 pr-12',
            isDarkMode ? 'border-neutral-800 bg-neutral-800' : 'border-ut-grey/25 bg-white',
          )}
        >
          <View className="h-full w-1 rounded-full bg-ut-burnt-orange" />

          <View className="gap-y-1">
            <Text
              className={cn(
                'font-bold text-lg leading-snug',
                isDarkMode ? 'text-white' : 'text-black',
              )}
            >
              {title}
            </Text>
            <Text className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
              {description}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Alert;
