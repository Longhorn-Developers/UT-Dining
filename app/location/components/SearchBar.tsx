import { Search, X } from 'lucide-react-native';
import { useRef } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isSearchFocused: boolean;
};

const SearchBar = ({ query, setQuery, onFocus, onBlur, isSearchFocused }: Props) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const inputRef = useRef<TextInput>(null);

  const handleCancel = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
    // Set query to empty string
    setQuery('');
    onBlur?.();
  };

  const handleFocus = () => {
    onFocus?.();
  };

  return (
    <View className="flex-row items-center gap-x-3">
      <View
        className={cn(
          'flex-1 flex-row items-center rounded-lg border px-3 py-2.5',
          isDarkMode ? 'border-gray-700 bg-neutral-800' : 'border-ut-grey/15 bg-white',
        )}
      >
        <Search size={18} color={isDarkMode ? '#aaa' : COLORS['ut-grey']} />
        <TextInput
          ref={inputRef}
          className={cn(
            'ml-2 min-h-4 flex-1 text-base leading-tight',
            isDarkMode ? 'text-white' : 'placeholder:text-gray-400',
          )}
          placeholder="Search for food name..."
          value={query}
          onChangeText={setQuery}
          onFocus={handleFocus}
          placeholderTextColor={isDarkMode ? '#777' : undefined}
        />
        {query.length > 0 && (
          <X
            size={18}
            color={isDarkMode ? '#aaa' : COLORS['ut-grey']}
            onPress={() => setQuery('')}
          />
        )}
      </View>
      {isSearchFocused && (
        <TouchableOpacity onPress={handleCancel}>
          <Text
            className={cn(
              'font-medium text-base',
              isDarkMode ? 'text-white' : 'text-ut-burnt-orange',
            )}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
