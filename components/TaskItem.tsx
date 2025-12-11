import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Check, X, Calendar } from 'lucide-react';
import { Task, Category } from '../types';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const categoryColors: Record<Category, string> = {
  Personal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Work: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  School: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Shopping: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={`
        group flex flex-col sm:flex-row items-center gap-4 p-4 mb-3 rounded-xl border transition-all duration-300
        ${task.completed 
          ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-75' 
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900'}
      `}
    >
      <div className="flex items-center w-full gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
            ${task.completed 
              ? 'bg-indigo-500 border-indigo-500 text-white' 
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 text-transparent'}
          `}
        >
          <Check className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0">
          {isEditing ? (
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg px-2 py-1 outline-none text-slate-800 dark:text-slate-200"
            />
          ) : (
            <div className="flex flex-col gap-1">
              <span className={`
                text-base font-medium truncate transition-all
                ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}
              `}>
                {task.text}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${categoryColors[task.category]}`}>
                  {task.category}
                </span>
                <span className="flex items-center text-xs text-slate-400 dark:text-slate-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {isEditing ? (
           // While editing, we rely on Enter/Blur to save, but showing a visual cancel helps
           <button 
             onClick={() => { setEditText(task.text); setIsEditing(false); }}
             className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
           >
             <X className="w-4 h-4" />
           </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
