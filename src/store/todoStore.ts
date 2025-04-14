
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high' | 'none';
export type Tag = { text: string; color: string };

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  tags: Tag[];
  createdAt: number;
}

interface TodoState {
  todos: TodoItem[];
  addTodo: (text: string) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  toggleCompleted: (id: string) => void;
  clearAllTodos: () => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
}

const TAG_COLORS = [
  'todo-tag-green',
  'todo-tag-yellow',
  'todo-tag-orange',
  'todo-tag-purple',
  'todo-tag-pink',
  'todo-tag-blue',
  'todo-tag-peach',
  'todo-tag-gray',
];

const getTagColor = (tag: string): string => {
  // Use a hash function to deterministically assign a color to each tag
  const hashCode = tag.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return TAG_COLORS[Math.abs(hashCode) % TAG_COLORS.length];
};

const extractPriority = (text: string): { cleanText: string; priority: Priority } => {
  const priorityRegex = /(!{1,3})\s*/g;
  let priority: Priority = 'none';
  
  const cleanText = text.replace(priorityRegex, (match) => {
    if (match.includes('!!!')) priority = 'high';
    else if (match.includes('!!')) priority = 'medium';
    else if (match.includes('!')) priority = 'low';
    return '';
  });
  
  return { cleanText, priority };
};

const extractTags = (text: string): { cleanText: string; tags: Tag[] } => {
  const tagRegex = /#(\w+)\b/g;
  const tags: Tag[] = [];
  let matches;
  
  // Find all tags
  while ((matches = tagRegex.exec(text)) !== null) {
    const tagText = matches[1];
    tags.push({ 
      text: tagText, 
      color: getTagColor(tagText) 
    });
  }
  
  // Remove tags from text
  const cleanText = text.replace(tagRegex, '').trim();
  
  return { cleanText, tags };
};

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      
      addTodo: (text) => {
        const { cleanText: textWithoutTags, tags } = extractTags(text);
        const { cleanText, priority } = extractPriority(textWithoutTags);
        
        if (cleanText.trim() === '') return;
        
        const newTodo: TodoItem = {
          id: Date.now().toString(),
          text: cleanText.trim(),
          completed: false,
          priority,
          tags,
          createdAt: Date.now(),
        };
        
        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },
      
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) => 
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        }));
      },
      
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      
      toggleCompleted: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },
      
      clearAllTodos: () => {
        set({ todos: [] });
      },
      
      reorderTodos: (startIndex, endIndex) => {
        set((state) => {
          const result = [...state.todos];
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          
          return { todos: result };
        });
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);
