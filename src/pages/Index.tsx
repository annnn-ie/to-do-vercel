
import React from 'react';
import { TodoContainer } from '@/components/TodoContainer';
import { PriorityGuide } from '@/components/PriorityGuide';

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="container py-8">
        <TodoContainer />
        <PriorityGuide />
      </div>
    </div>
  );
};

export default Index;
