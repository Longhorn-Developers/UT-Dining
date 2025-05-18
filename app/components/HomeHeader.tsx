import React from 'react';
import { View, Text } from 'react-native';

import FilterBar from '~/components/FilterBar';
import TopBar from '~/components/TopBar';
import { timeOfDay } from '~/utils/time';

type HomeHeaderProps = {
  currentTime: Date;
  lastUpdated: Date | null;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  showRequeryAlert: boolean;
};

const HomeHeader = ({
  currentTime,
  lastUpdated,
  selectedFilter,
  setSelectedFilter,
  showRequeryAlert,
}: HomeHeaderProps) => {
  const getGreetingMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 11) {
      return 'Good Morning! ☀️';
    } else if (hour < 18) {
      return 'Good Afternoon! 🌤️';
    } else {
      return 'Good Evening! 🌙';
    }
  };

  const getSubtitleMessage = () => {
    switch (timeOfDay(currentTime)) {
      case 'morning':
        return 'Breakfast is served.';
      case 'afternoon':
        return 'Lunch is served.';
      case 'evening':
        return 'Dinner is served.';
      default:
        return '';
    }
  };

  return (
    <View className="mt-6 flex gap-y-5">
      <TopBar />

      <View className="gap-y-4">
        <View>
          <Text className="font-sans text-3xl font-extrabold">{getGreetingMessage()}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="font-medium text-ut-grey">{getSubtitleMessage()}</Text>
            {showRequeryAlert && (
              <Text className="text-[9px] font-semibold italic text-ut-burnt-orange">
                Data is outdated. Pull down to refresh.
              </Text>
            )}

            {!showRequeryAlert && lastUpdated && (
              <Text className="text-[9px] italic text-ut-grey">
                Last updated:{' '}
                {lastUpdated.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </Text>
            )}
          </View>
        </View>

        <FilterBar
          selectedItem={selectedFilter}
          setSelectedItem={setSelectedFilter}
          items={[
            { id: 'all', title: 'All' },
            { id: 'dining', title: 'Dining Hall' },
            { id: 'restaurants', title: 'Restaurants' },
            { id: 'convenience', title: 'Convenience Store' },
            { id: 'coffee', title: 'Coffee Shop' },
          ]}
        />
      </View>
    </View>
  );
};

export default HomeHeader;
