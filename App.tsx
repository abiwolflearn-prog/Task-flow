import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import FilterControls from './components/FilterControls';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, Category, FilterCategory, SortOption } from './types';
import { Layers } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-data', []);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('taskflow-theme', false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('All');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Dark Mode Side Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers
  const addTask = (text: string, category: Category) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      category,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
  };

  const editTask = (id: string, newText: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, text: newText } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Filter and Sort Logic
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by Category
    if (filterCategory !== 'All') {
      result = result.filter(t => t.category === filterCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => t.text.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'a-z':
          return a.text.localeCompare(b.text);
        case 'z-a':
          return b.text.localeCompare(a.text);
        default:
          return 0;
      }
    });

    // Optional: Move completed to bottom always? 
    // The prompt didn't specify, but it's good UX. 
    // Let's stick strictly to prompt sorting requirements to avoid confusion, 
    // but usually 'completed last' is a secondary sort.
    // We will stick to the user's explicit sort choice.

    return result;
  }, [tasks, filterCategory, searchQuery, sortOption]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
        
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={() => setDarkMode(!darkMode)} 
        />

        <TaskForm onAddTask={addTask} />

        <div className="mb-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 px-1">
          <div className="flex gap-4">
             <span><strong>{stats.pending}</strong> Pending</span>
             <span><strong>{stats.completed}</strong> Completed</span>
          </div>
          <div>Total: {stats.total}</div>
        </div>

        <FilterControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        <div className="space-y-1 min-h-[300px]">
          {processedTasks.length > 0 ? (
            processedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                onEdit={editTask}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Layers className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm opacity-75">
                {tasks.length === 0 ? "Get started by adding a task above!" : "Try adjusting your filters."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
