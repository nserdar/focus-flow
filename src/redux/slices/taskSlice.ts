import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@types/index';
import { generateId } from '@utils/helpers';

interface TaskState {
  items: Task[];
  selectedTaskId: string | null;
}

const initialState: TaskState = {
  items: [],
  selectedTaskId: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /**
     * Add a new task
     */
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = Date.now();
      const task: Task = {
        ...action.payload,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      state.items.push(task);
    },

    /**
     * Update existing task
     */
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: Date.now(),
        };
      }
    },

    /**
     * Delete task
     */
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      if (state.selectedTaskId === action.payload) {
        state.selectedTaskId = null;
      }
    },

    /**
     * Toggle task completion
     */
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.items.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.updatedAt = Date.now();
      }
    },

    /**
     * Increment completed pomodoros
     */
    incrementCompletedPomodoros: (state, action: PayloadAction<string>) => {
      const task = state.items.find(t => t.id === action.payload);
      if (task && task.completedPomodoros < task.targetPomodoros) {
        task.completedPomodoros += 1;
        task.updatedAt = Date.now();
      }
    },

    /**
     * Set selected task
     */
    selectTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },

    /**
     * Reorder tasks
     */
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },

    /**
     * Load tasks from database
     */
    loadTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },

    /**
     * Clear all tasks
     */
    clearTasks: (state) => {
      state.items = [];
      state.selectedTaskId = null;
    },

    /**
     * Update task priority
     */
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: 'low' | 'medium' | 'high' }>) => {
      const task = state.items.find(t => t.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
        task.updatedAt = Date.now();
      }
    },

    /**
     * Update task category
     */
    updateTaskCategory: (state, action: PayloadAction<{ id: string; category: string }>) => {
      const task = state.items.find(t => t.id === action.payload.id);
      if (task) {
        task.category = action.payload.category;
        task.updatedAt = Date.now();
      }
    },

    /**
     * Update task due date
     */
    updateTaskDueDate: (state, action: PayloadAction<{ id: string; dueDate?: number }>) => {
      const task = state.items.find(t => t.id === action.payload.id);
      if (task) {
        task.dueDate = action.payload.dueDate;
        task.updatedAt = Date.now();
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  incrementCompletedPomodoros,
  selectTask,
  reorderTasks,
  loadTasks,
  clearTasks,
  updateTaskPriority,
  updateTaskCategory,
  updateTaskDueDate,
} = taskSlice.actions;

export default taskSlice.reducer;
