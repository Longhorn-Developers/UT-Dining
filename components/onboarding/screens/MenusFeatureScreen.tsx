import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
};

const MenusFeatureScreen = ({ width }: Props) => {
  return (
    <View style={{ width }} className="flex-1 px-6 py-8">
      <View className="flex-1 items-center justify-center">
        {/* Image/Video placeholder */}
        <View className="mb-8 h-64 w-80 items-center justify-center rounded-3xl bg-gray-100">
          <Ionicons name="restaurant" size={60} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-4 text-gray-500 text-sm">Real-time Menus Demo</Text>
        </View>

        <View>
          <Text className="mb-2 text-center font-bold text-3xl text-gray-900">Real-time Menus</Text>
          <Text className="mx-auto max-w-[250px] text-center text-gray-600 text-lg leading-6">
            No more guessing. Know what’s on the menu before you go
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MenusFeatureScreen;
