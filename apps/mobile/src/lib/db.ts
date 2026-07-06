// ─── SQLite Database Layer ───────────────────────────────────────────
// Offline-first storage for dumps and tasks using expo-sqlite.
// Schema versioning included from day one for future sync compatibility.

import * as SQLite from 'expo-sqlite';
import type { Dump, Task } from '@zenth/utils';

const DB_NAME = 'zenth.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Open (or create) the database and run migrations.
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DB_NAME);

  // Enable WAL mode for better concurrent performance
  await db.execAsync('PRAGMA journal_mode = WAL;');

  // Create schema version table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY
    );
  `);

  // Check current version
  const versionRow = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1'
  );
  const currentVersion = versionRow?.version ?? 0;

  // Run migrations
  if (currentVersion < 1) {
    await migrateToV1(db);
  }

  return db;
}

/**
 * Migration v1: Create dumps and tasks tables.
 */
async function migrateToV1(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS dumps (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      convertedToTaskIds TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      sourceDumpId TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      dueAt INTEGER,
      reminderRepeat TEXT NOT NULL DEFAULT 'none',
      createdAt INTEGER NOT NULL,
      completedAt INTEGER
    );

    INSERT OR REPLACE INTO schema_version (version) VALUES (1);
  `);
}

// ─── Dump Operations ─────────────────────────────────────────────────

export async function insertDump(dump: Dump): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    'INSERT INTO dumps (id, text, createdAt, convertedToTaskIds) VALUES (?, ?, ?, ?)',
    dump.id,
    dump.text,
    dump.createdAt,
    JSON.stringify(dump.convertedToTaskIds)
  );
}

export async function getAllDumps(): Promise<Dump[]> {
  const database = await initDatabase();
  const rows = await database.getAllAsync<{
    id: string;
    text: string;
    createdAt: number;
    convertedToTaskIds: string;
  }>('SELECT * FROM dumps ORDER BY createdAt DESC');

  return rows.map((row) => ({
    ...row,
    convertedToTaskIds: JSON.parse(row.convertedToTaskIds),
  }));
}

export async function updateDumpTaskIds(
  dumpId: string,
  taskIds: string[]
): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    'UPDATE dumps SET convertedToTaskIds = ? WHERE id = ?',
    JSON.stringify(taskIds),
    dumpId
  );
}

export async function deleteDump(id: string): Promise<void> {
  const database = await initDatabase();
  await database.runAsync('DELETE FROM dumps WHERE id = ?', id);
}

// ─── Task Operations ─────────────────────────────────────────────────

export async function insertTask(task: Task): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    'INSERT INTO tasks (id, title, sourceDumpId, status, dueAt, reminderRepeat, createdAt, completedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    task.id,
    task.title,
    task.sourceDumpId,
    task.status,
    task.dueAt,
    task.reminderRepeat,
    task.createdAt,
    task.completedAt
  );
}

export async function getAllTasks(): Promise<Task[]> {
  const database = await initDatabase();
  return await database.getAllAsync<Task>(
    'SELECT * FROM tasks ORDER BY createdAt DESC'
  );
}

export async function updateTaskStatus(
  id: string,
  status: 'active' | 'done',
  completedAt: number | null
): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    'UPDATE tasks SET status = ?, completedAt = ? WHERE id = ?',
    status,
    completedAt,
    id
  );
}

export async function updateTaskDue(
  id: string,
  dueAt: number | null,
  reminderRepeat: 'none' | 'daily' | 'weekly'
): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    'UPDATE tasks SET dueAt = ?, reminderRepeat = ? WHERE id = ?',
    dueAt,
    reminderRepeat,
    id
  );
}

export async function deleteTask(id: string): Promise<void> {
  const database = await initDatabase();
  await database.runAsync('DELETE FROM tasks WHERE id = ?', id);
}

export async function deleteAllData(): Promise<void> {
  const database = await initDatabase();
  await database.execAsync('DELETE FROM tasks; DELETE FROM dumps;');
}
