
import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, GripVertical } from 'lucide-react';
import { TodoItem as TodoItemType, useTodoStore, Priority } from '@/store/todoStore';
import { cn } from '@/lib/utils';
import { TodoTag } from './TodoTag';
import { Badge } from '@/components/ui/badge';

interface TodoItemProps {
  todo: TodoItemType;
  index: number;
  dragHandleProps?: any;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, index, dragHandleProps }) => {
  const { updateTodo, toggleCompleted, deleteTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (!todo.completed) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (editText.trim() !== '') {
      updateTodo(todo.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editText.trim() !== '') {
        updateTodo(todo.id, { text: editText.trim() });
      }
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const getPriorityBadge = (priority: Priority): string => {
    switch (priority) {
      case 'high':
        return '!!!';
      case 'medium':
        return '!!';
      case 'low':
        return '!';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'high':
        return 'bg-todo-high text-white';
      case 'medium':
        return 'bg-todo-medium text-white';
      case 'low':
        return 'bg-todo-low text-white';
      default:
        return 'bg-transparent';
    }
  };

  return (
    <div 
      className={cn(
        'todo-item',
        todo.completed && 'opacity-60'
      )}
    >
      <div {...dragHandleProps} className="drag-item">
        <GripVertical className="text-gray-400 hover:text-gray-600 transition-colors" size={18} />
      </div>
      
      <button 
        onClick={() => toggleCompleted(todo.id)}
        className={cn(
          'w-5 h-5 rounded-full border flex items-center justify-center',
          todo.completed ? 'border-primary bg-primary text-white' : 'border-gray-300 hover:border-primary/50'
        )}
      >
        {todo.completed && <Check size={12} />}
      </button>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div 
            onClick={handleEdit}
            className={cn(
              'cursor-text flex justify-between items-start',
              todo.completed && 'line-through text-gray-500'
            )}
          >
            <span className="mr-2">{todo.text}</span>
            <div className="flex flex-wrap gap-1 justify-end items-center">
              {todo.priority !== 'none' && (
                <Badge 
                  className={cn(
                    'text-xs',
                    getPriorityColor(todo.priority)
                  )}
                >
                  {getPriorityBadge(todo.priority)}
                </Badge>
              )}
              {todo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {todo.tags.map((tag) => (
                    <TodoTag key={tag.text} tag={tag} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
