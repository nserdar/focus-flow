import * as SQLite from 'expo-sqlite';
import { Task, Session, DailyStat } from '@types/index';
import { getStartOfDay, getEndOfDay } from '@utils/formatters';

const DATABASE_NAME = 'focus_flow.db';

class DatabaseService {
  private db: SQLite.Database | null = null;

  /**
   * Initialize database
   */
  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  /**
   * Create all tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      // Tasks table
      `CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        targetPomodoros INTEGER DEFAULT 4,
        completedPomodoros INTEGER DEFAULT 0,
        dueDate INTEGER,
        priority TEXT DEFAULT 'medium',
        category TEXT
      );`,

      // Sessions table
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        taskId TEXT,
        duration INTEGER NOT NULL,
        type TEXT NOT NULL,
        startTime INTEGER NOT NULL,
        endTime INTEGER NOT NULL,
        completed INTEGER DEFAULT 1,
        interruptedAt INTEGER,
        FOREIGN KEY (taskId) REFERENCES tasks(id)
      );`,

      // Daily stats table
      `CREATE TABLE IF NOT EXISTS daily_stats (
        date TEXT PRIMARY KEY,
        totalFocusTime INTEGER DEFAULT 0,
        totalBreakTime INTEGER DEFAULT 0,
        sessionsCompleted INTEGER DEFAULT 0,
        tasksCompleted INTEGER DEFAULT 0,
        streakCount INTEGER DEFAULT 0,
        avgFocusQuality INTEGER DEFAULT 0
      );`,

      // Create indexes
      `CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate);`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_taskId ON sessions(taskId);`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_startTime ON sessions(startTime);`,
    ];

    for (const sql of tables) {
      await this.db.execAsync(sql);
    }
  }

  /**
   * Add task
   */
  async addTask(task: Task): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO tasks (id, title, description, completed, createdAt, updatedAt, targetPomodoros, completedPomodoros, dueDate, priority, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.title,
        task.description || null,
        task.completed ? 1 : 0,
        task.createdAt,
        task.updatedAt,
        task.targetPomodoros,
        task.completedPomodoros,
        task.dueDate || null,
        task.priority,
        task.category || null,
      ]
    );
  }

  /**
   * Get all tasks
   */
  async getTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Task>(
      `SELECT * FROM tasks ORDER BY createdAt DESC`
    );

    return result.map(this.parseDatabaseTask);
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<Task>(
      `SELECT * FROM tasks WHERE id = ?`,
      [id]
    );

    return result ? this.parseDatabaseTask(result) : null;
  }

  /**
   * Update task
   */
  async updateTask(task: Task): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `UPDATE tasks SET title = ?, description = ?, completed = ?, updatedAt = ?, targetPomodoros = ?, completedPomodoros = ?, dueDate = ?, priority = ?, category = ?
       WHERE id = ?`,
      [
        task.title,
        task.description || null,
        task.completed ? 1 : 0,
        task.updatedAt,
        task.targetPomodoros,
        task.completedPomodoros,
        task.dueDate || null,
        task.priority,
        task.category || null,
        task.id,
      ]
    );
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`DELETE FROM tasks WHERE id = ?`, [id]);
    await this.db.runAsync(`DELETE FROM sessions WHERE taskId = ?`, [id]);
  }

  /**
   * Add session
   */
  async addSession(session: Session): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO sessions (id, taskId, duration, type, startTime, endTime, completed, interruptedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.id,
        session.taskId || null,
        session.duration,
        session.type,
        session.startTime,
        session.endTime,
        session.completed ? 1 : 0,
        session.interruptedAt || null,
      ]
    );
  }

  /**
   * Get sessions for date range
   */
  async getSessionsForDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
    if (!this.db) throw new Error('Database not initialized');

    const startTime = getStartOfDay(startDate);
    const endTime = getEndOfDay(endDate);

    const result = await this.db.getAllAsync<Session>(
      `SELECT * FROM sessions WHERE startTime >= ? AND startTime <= ? ORDER BY startTime DESC`,
      [startTime, endTime]
    );

    return result.map(this.parseDatabaseSession);
  }

  /**
   * Get daily stats
   */
  async getDailyStats(date: Date): Promise<DailyStat | null> {
    if (!this.db) throw new Error('Database not initialized');

    const dateStr = date.toISOString().split('T')[0];

    const result = await this.db.getFirstAsync<DailyStat>(
      `SELECT * FROM daily_stats WHERE date = ?`,
      [dateStr]
    );

    return result ? this.parseDatabaseDailyStat(result) : null;
  }

  /**
   * Update daily stats
   */
  async updateDailyStats(stats: DailyStat): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const dateStr = stats.date;

    // Check if exists
    const existing = await this.db.getFirstAsync(
      `SELECT date FROM daily_stats WHERE date = ?`,
      [dateStr]
    );

    if (existing) {
      await this.db.runAsync(
        `UPDATE daily_stats SET totalFocusTime = ?, totalBreakTime = ?, sessionsCompleted = ?, tasksCompleted = ?, streakCount = ?, avgFocusQuality = ?
         WHERE date = ?`,
        [
          stats.totalFocusTime,
          stats.totalBreakTime,
          stats.sessionsCompleted,
          stats.tasksCompleted,
          stats.streakCount,
          stats.avgFocusQuality,
          dateStr,
        ]
      );
    } else {
      await this.db.runAsync(
        `INSERT INTO daily_stats (date, totalFocusTime, totalBreakTime, sessionsCompleted, tasksCompleted, streakCount, avgFocusQuality)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          dateStr,
          stats.totalFocusTime,
          stats.totalBreakTime,
          stats.sessionsCompleted,
          stats.tasksCompleted,
          stats.streakCount,
          stats.avgFocusQuality,
        ]
      );
    }
  }

  /**
   * Get stats for date range
   */
  async getStatsForDateRange(startDate: Date, endDate: Date): Promise<DailyStat[]> {
    if (!this.db) throw new Error('Database not initialized');

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const result = await this.db.getAllAsync<DailyStat>(
      `SELECT * FROM daily_stats WHERE date >= ? AND date <= ? ORDER BY date DESC`,
      [startStr, endStr]
    );

    return result.map(this.parseDatabaseDailyStat);
  }

  /**
   * Parse database task to Task type
   */
  private parseDatabaseTask(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      targetPomodoros: row.targetPomodoros,
      completedPomodoros: row.completedPomodoros,
      dueDate: row.dueDate,
      priority: row.priority,
      category: row.category,
    };
  }

  /**
   * Parse database session to Session type
   */
  private parseDatabaseSession(row: any): Session {
    return {
      id: row.id,
      taskId: row.taskId,
      duration: row.duration,
      type: row.type,
      startTime: row.startTime,
      endTime: row.endTime,
      completed: row.completed === 1,
      interruptedAt: row.interruptedAt,
    };
  }

  /**
   * Parse database daily stat
   */
  private parseDatabaseDailyStat(row: any): DailyStat {
    return {
      date: row.date,
      totalFocusTime: row.totalFocusTime,
      totalBreakTime: row.totalBreakTime,
      sessionsCompleted: row.sessionsCompleted,
      tasksCompleted: row.tasksCompleted,
      streakCount: row.streakCount,
      avgFocusQuality: row.avgFocusQuality,
    };
  }

  /**
   * Clear all data (for development)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`DELETE FROM tasks; DELETE FROM sessions; DELETE FROM daily_stats;`);
  }

  /**
   * Close database
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();
