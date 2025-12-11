import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { FilterCategory, SortOption, Category } from '../types';

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: FilterCategory;
  setFilterCategory: (category: FilterCategory) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  sortOption,
  setSortOption,
}) => {
  const categories: FilterCategory[] = ['All', 'Personal', 'Work', 'School', 'Shopping', 'Other'];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-4 z-10">
      {/* Search Bar */}
      <div className="relative flex-grow group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
          placeholder="Search tasks..."
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        {/* Category Filter */}
        <div className="relative min-w-[140px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
            className="block w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none shadow-sm text-sm font-medium"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative min-w-[140px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="block w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none shadow-sm text-sm font-medium"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
