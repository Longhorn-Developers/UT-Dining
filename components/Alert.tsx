import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettingsStore } from '~/store/useSettingsStore';
import { cn } from '~/utils/utils';

const Alert = ({ title, description }: { title: string; description: string }) => {
  const { isDarkMode } = useSettingsStore();

  return (
    <SafeAreaView className="px-4">
      <View
        className={cn(
          'flex-row items-center gap-x-3 rounded-lg border p-4 pr-12',
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-ut-grey/25 bg-white'
        )}>
        <View className="h-full w-1 rounded-full bg-ut-burnt-orange" />

        <View className="gap-y-1">
          <Text
            className={cn(
              'text-lg font-bold leading-snug',
              isDarkMode ? 'text-white' : 'text-black'
            )}>
            {title}
          </Text>
          <Text className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
            {description}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Alert;
