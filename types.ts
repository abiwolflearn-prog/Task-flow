export type Category = 'Personal' | 'Work' | 'School' | 'Shopping' | 'Other';

export interface Task {
  id: string;
  text: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

export type FilterCategory = Category | 'All';
