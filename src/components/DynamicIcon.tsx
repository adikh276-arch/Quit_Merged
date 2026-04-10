import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import React from 'react';

const iconMap: Record<string, string> = {
  // Body Zones / Body Scan
  'liver': 'Shield',
  'brain': 'Brain',
  'heart': 'Heart',
  'stomach': 'Utensils',
  'skin': 'Sparkles',
  'head': 'Brain',
  'eyes': 'Eye',
  'vision': 'Eye',
  'muscles': 'Dumbbell',
  'joints': 'Link',
  'gut': 'Utensils',
  'core': 'Activity',
  'nerves': 'Zap',
  'nervous-system': 'Zap',
  'chest': 'Heart',
  'lungs': 'Activity',
  'head-mind': 'Brain',
  'gut-core': 'Activity',
  'muscles-joints': 'Dumbbell',
  'skin-nerves': 'Zap',
  'eyes-vision': 'Eye',

  // Visualization / Scenes
  'wind': 'Wind',
  'sprout': 'Sprout',
  'lung': 'Activity',
  'mountain': 'Mountain',
  'party': 'PartyPopper',
  'trophy': 'Trophy',
  'hour': 'Clock',
  'day': 'Calendar',
  'week': 'CalendarDays',
  'month': 'CalendarRange',
  'year': 'Trophy',
  'oxygen': 'Wind',
  'clean': 'CheckCircle2',
  'blood': 'Droplets',
  'mood': 'Smile',
  'energy': 'Zap',
  'sleep': 'Moon',
  'sun': 'Sun',
  'grey': 'Cloud',
  'natural': 'Leaf',
  'meditation': 'Target',
  'fist': 'Zap',
  'sparkle': 'Sparkles',
  'heart-filled': 'Heart',
  'heart-outline': 'Heart',
  'check': 'Check',
  'save': 'Bookmark',
  'saved': 'BookmarkCheck',
};

export const DynamicIcon = ({ name, ...props }: { name: string } & LucideProps) => {
  const iconName = iconMap[name.toLowerCase()] || name;
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
  return <Icon {...props} />;
};
