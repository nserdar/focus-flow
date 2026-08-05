import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimerState } from '@types/index';
import { DEFAULT_FOCUS_DURATION, DEFAULT_SHORT_BREAK, DEFAULT_LONG_BREAK } from '@utils/constants';

const initialState: TimerState = {
  isRunning: false,
  timeRemaining: DEFAULT_FOCUS_DURATION * 60,
  currentSession: 'focus',
  sessionsCompleted: 0,
  currentTaskId: undefined,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    /**
     * Start the timer
     */
    startTimer: (state) => {
      state.isRunning = true;
    },

    /**
     * Pause the timer
     */
    pauseTimer: (state) => {
      state.isRunning = false;
    },

    /**
     * Tick the timer (decrease by 1 second)
     */
    tickTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },

    /**
     * Reset timer to initial state
     */
    resetTimer: (state) => {
      state.isRunning = false;
      state.timeRemaining = DEFAULT_FOCUS_DURATION * 60;
      state.currentSession = 'focus';
    },

    /**
     * Complete current session and start next
     */
    completeSession: (state) => {
      state.isRunning = false;
      state.sessionsCompleted += 1;

      // Determine next session type
      const isLongBreak = state.sessionsCompleted % 4 === 0;
      
      if (state.currentSession === 'focus') {
        state.currentSession = isLongBreak ? 'longBreak' : 'break';
        state.timeRemaining = isLongBreak 
          ? DEFAULT_LONG_BREAK * 60 
          : DEFAULT_SHORT_BREAK * 60;
      } else {
        state.currentSession = 'focus';
        state.timeRemaining = DEFAULT_FOCUS_DURATION * 60;
      }
    },

    /**
     * Skip current session
     */
    skipSession: (state) => {
      state.isRunning = false;
      state.currentSession = state.currentSession === 'focus' ? 'break' : 'focus';
      state.timeRemaining = state.currentSession === 'focus' 
        ? DEFAULT_FOCUS_DURATION * 60 
        : DEFAULT_SHORT_BREAK * 60;
    },

    /**
     * Set custom duration for current session
     */
    setDuration: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload * 60;
    },

    /**
     * Set current task ID
     */
    setCurrentTaskId: (state, action: PayloadAction<string | undefined>) => {
      state.currentTaskId = action.payload;
    },

    /**
     * Interrupt session
     */
    interruptSession: (state) => {
      state.isRunning = false;
    },

    /**
     * Restore timer state
     */
    restoreTimer: (state, action: PayloadAction<Partial<TimerState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  startTimer,
  pauseTimer,
  tickTimer,
  resetTimer,
  completeSession,
  skipSession,
  setDuration,
  setCurrentTaskId,
  interruptSession,
  restoreTimer,
} = timerSlice.actions;

export default timerSlice.reducer;
