
import React from 'react';
import { Tag } from '@/store/todoStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TodoTagProps {
  tag: Tag;
}

const getTagColorClass = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'todo-tag-green': 'bg-todo-tag-green text-green-800',
    'todo-tag-yellow': 'bg-todo-tag-yellow text-yellow-800',
    'todo-tag-orange': 'bg-todo-tag-orange text-orange-800',
    'todo-tag-purple': 'bg-todo-tag-purple text-purple-800',
    'todo-tag-pink': 'bg-todo-tag-pink text-pink-800',
    'todo-tag-blue': 'bg-todo-tag-blue text-blue-800',
    'todo-tag-peach': 'bg-todo-tag-peach text-orange-900',
    'todo-tag-gray': 'bg-todo-tag-gray text-gray-800'
  };
  
  return colorMap[colorName] || 'bg-gray-200 text-gray-800';
};

export const TodoTag: React.FC<TodoTagProps> = ({ tag }) => {
  return (
    <Badge className={cn(
      'text-xs',
      getTagColorClass(tag.color)
    )}>
      #{tag.text}
    </Badge>
  );
};
