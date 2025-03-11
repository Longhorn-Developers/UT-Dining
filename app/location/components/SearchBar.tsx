import { Search, X } from 'lucide-react-native';
import React from 'react';
import { View, TextInput } from 'react-native';

type Props = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchBar = ({ query, setQuery }: Props) => {
  return (
    <View className="flex-row items-center rounded-lg border border-ut-grey/15 bg-white px-3 py-2.5">
      <Search size={18} color="#888888" />
      <TextInput
        className="ml-2 min-h-4 flex-1 text-base leading-tight placeholder:text-ut-grey/75"
        placeholder="Search for food name..."
        value={query}
        onChangeText={setQuery}
      />
      {query.length > 0 && <X size={18} color="#888888" onPress={() => setQuery('')} />}
    </View>
  );
};

export default SearchBar;
