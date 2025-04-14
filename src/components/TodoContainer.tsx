import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { TodoItem } from './TodoItem';
import { useTodoStore } from '@/store/todoStore';
import { toast } from '@/components/ui/sonner';

export const TodoContainer: React.FC = () => {
  const { todos, addTodo, reorderTodos, clearAllTodos } = useTodoStore();
  const [newTodoText, setNewTodoText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText);
      setNewTodoText('');
      toast.success('Todo added successfully');
    } else {
      // Shake the input if empty
      if (inputRef.current) {
        inputRef.current.classList.add('animate-shake');
        setTimeout(() => {
          inputRef.current?.classList.remove('animate-shake');
        }, 500);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    reorderTodos(sourceIndex, destinationIndex);
  };

  const handleClearAll = () => {
    if (todos.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all todos?')) {
      clearAllTodos();
      toast.success('All todos cleared');
    }
  };

  return (
    <div className="todo-container">
      <h1 className="text-3xl font-bold mb-2 text-center tracking-tight">To-do Today</h1>
      <div className="text-center text-xs text-gray-400 mb-8">
        <p>Tip: Use ! for low priority, !! for medium, !!! for high</p>
        <p>Use #tag to add tags to your tasks</p>
      </div>
      
      <div className="todo-input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a new task... (use ! for priority and # for tags)"
          className="todo-input"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleAddTodo} size="icon">
          <Plus size={18} />
        </Button>
      </div>
      
      {todos.length > 0 ? (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {todos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <TodoItem 
                            todo={todo} 
                            index={index} 
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearAll}
              className="text-gray-500 hover:text-red-500 flex items-center gap-1"
            >
              <Trash size={14} />
              Clear All
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <p className="mb-2">Your todo list is empty</p>
          <p className="text-sm">
            Add a new task above to get started
            <br />
            <span className="text-xs mt-2 block opacity-70">
              Use ! for priority and # for tags
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
