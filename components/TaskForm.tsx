import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Category } from '../types';

interface TaskFormProps {
  onAddTask: (text: string, category: Category) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text.trim(), category);
      setText('');
      // Keep category as is or reset if preferred
    }
  };

  const categories: Category[] = ['Personal', 'Work', 'School', 'Shopping', 'Other'];

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`
        mb-8 p-1 rounded-2xl bg-white dark:bg-slate-800 shadow-xl transition-all duration-300 border
        ${isFocused ? 'ring-2 ring-indigo-500 border-transparent shadow-indigo-500/20' : 'border-slate-100 dark:border-slate-700'}
      `}
    >
      <div className="flex flex-col sm:flex-row gap-2 p-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Add a new task..."
            className="w-full bg-transparent p-3 outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium border-r-8 border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/30 flex items-center justify-center min-w-[50px]"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
