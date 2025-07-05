import { Search, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { View, TextInput, Text, Pressable, Keyboard, TouchableOpacity } from 'react-native';

import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const SearchBar = ({ query, setQuery, onFocus, onBlur }: Props) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleCancel = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
    onBlur?.();
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  return (
    <View className="flex-row items-center gap-x-3">
      <View
        className={cn(
          'flex-1 flex-row items-center rounded-lg border px-3 py-2.5',
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-ut-grey/15 bg-white'
        )}>
        <Search size={18} color={isDarkMode ? '#aaa' : COLORS['ut-grey']} />
        <TextInput
          ref={inputRef}
          className={cn(
            'ml-2 min-h-4 flex-1 text-base leading-tight',
            isDarkMode ? 'text-white' : 'placeholder:text-gray-400'
          )}
          placeholder="Search for food name..."
          value={query}
          onChangeText={setQuery}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
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
      {isFocused && (
        <TouchableOpacity onPress={handleCancel}>
          <Text
            className={cn(
              'text-base font-medium',
              isDarkMode ? 'text-white' : 'text-ut-burnt-orange'
            )}>
            Cancel
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
