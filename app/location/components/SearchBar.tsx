import { Search, X } from 'lucide-react-native';
import React from 'react';
import { View, TextInput } from 'react-native';

import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type Props = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchBar = ({ query, setQuery }: Props) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <View
      className={cn(
        'flex-row items-center rounded-lg border px-3 py-2.5',
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-ut-grey/15 bg-white'
      )}>
      <Search size={18} color={isDarkMode ? '#aaa' : COLORS['ut-grey']} />
      <TextInput
        className={cn(
          'ml-2 min-h-4 flex-1 text-base leading-tight',
          isDarkMode ? 'text-white' : 'placeholder:text-gray-400'
        )}
        placeholder="Search for food name..."
        value={query}
        onChangeText={setQuery}
        placeholderTextColor={isDarkMode ? '#777' : undefined}
      />
      {query.length > 0 && (
        <X size={18} color={isDarkMode ? '#aaa' : COLORS['ut-grey']} onPress={() => setQuery('')} />
      )}
    </View>
  );
};

export default SearchBar;
