import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Alert = ({ title, description }: { title: string; description: string }) => (
  <SafeAreaView className="px-4">
    <View className="flex-row items-center gap-x-3 rounded-lg border border-ut-grey/25 bg-white p-4 pr-12">
      <View className="h-full w-1 rounded-full bg-ut-burnt-orange" />

      <View className="gap-y-1">
        <Text className="text-lg font-bold leading-snug">{title}</Text>
        <Text className="text-sm">{description}</Text>
      </View>
    </View>
  </SafeAreaView>
);

export default Alert;
