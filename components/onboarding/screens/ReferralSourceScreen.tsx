import * as Haptics from 'expo-haptics';
import {
  Book,
  Calendar,
  Eye,
  HelpCircle,
  Mail,
  Megaphone,
  Search,
  Users,
} from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
  onSelectionChange: (hasSelection: boolean) => void;
  onSelectionUpdate: (selectedTag: string | null) => void;
};

const REFERRAL_SOURCES = [
  { id: 'friend-family', label: 'Friend or family', icon: Users },
  { id: 'social-media', label: 'Social media (TikTok, LinkedIn, etc.)', icon: Megaphone },
  { id: 'advertisement', label: 'Advertisement (online or in-person)', icon: Mail },
  { id: 'on-campus', label: 'Seen being used on campus', icon: Eye },
  { id: 'search-engine', label: 'Search engine (Google, Bing, etc.)', icon: Search },
  { id: 'class-professor', label: 'Professor or class', icon: Book },
  { id: 'event-fair', label: 'At an event or fair', icon: Calendar },
  { id: 'other', label: 'Other', icon: HelpCircle },
];

const ReferralSourceScreen = ({ width, onSelectionChange, onSelectionUpdate }: Props) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const isDark = useSettingsStore((state) => state.isDarkMode);

  const toggleTag = (tagId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newSelection = selectedTag === tagId ? null : tagId;

    setSelectedTag(newSelection);
    onSelectionChange(newSelection !== null);
    onSelectionUpdate(newSelection);
  };

  return (
    <View
      style={{ width }}
      className={cn('flex-1 px-6 py-8', isDark ? 'bg-neutral-900' : 'bg-white')}
    >
      <View className="mb-8">
        <Text
          className={cn(
            'mb-1 text-center font-bold text-3xl',
            isDark ? 'text-white' : 'text-gray-900',
          )}
        >
          How’d you hear about us?
        </Text>
        <Text className={cn('text-center text-lg', isDark ? 'text-gray-300' : 'text-gray-600')}>
          Select the option that best fits.
        </Text>
      </View>

      <View className="flex-1">
        <View className="flex-row flex-wrap justify-between">
          {REFERRAL_SOURCES.map((tag) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={tag.id}
              onPress={() => toggleTag(tag.id)}
              className={cn(
                'mb-4 w-[48%] rounded-xl p-4',
                selectedTag === tag.id
                  ? 'border-ut-burnt-orange bg-ut-burnt-orange/10'
                  : isDark
                    ? ' bg-neutral-800'
                    : 'border border-gray-200 bg-white',
              )}
            >
              <View className="items-center">
                <tag.icon
                  size={32}
                  color={
                    selectedTag === tag.id
                      ? COLORS['ut-burnt-orange']
                      : isDark
                        ? COLORS['ut-grey-dark-mode']
                        : COLORS['ut-grey']
                  }
                />
                <Text
                  className={cn(
                    'mt-2 text-center font-medium text-sm',
                    selectedTag === tag.id
                      ? 'text-ut-burnt-orange'
                      : isDark
                        ? 'text-gray-300'
                        : 'text-gray-700',
                  )}
                >
                  {tag.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ReferralSourceScreen;
