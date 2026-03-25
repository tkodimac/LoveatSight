import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

/// A singleton helper that manages the local SQLite database for matches
/// and messages. All chat data lives in two tables:
///   - `matches`  (matchId TEXT PRIMARY KEY, ...)
///   - `messages` (id INTEGER PRIMARY KEY, matchId TEXT, ...)
///
/// The [deleteMatch] method permanently removes both the match record and
/// every message belonging to it — this is what the Panic button triggers.
class DatabaseHelper {
  DatabaseHelper._internal();
  static final DatabaseHelper instance = DatabaseHelper._internal();

  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'loveatfirst.db');

    return openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        // Matches table – stores one row per active chat/match.
        await db.execute('''
          CREATE TABLE IF NOT EXISTS matches (
            matchId   TEXT PRIMARY KEY,
            userId    TEXT,
            matchedAt TEXT,
            status    TEXT
          )
        ''');

        // Messages table – stores every message for every match.
        await db.execute('''
          CREATE TABLE IF NOT EXISTS messages (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            matchId   TEXT NOT NULL,
            senderId  TEXT,
            content   TEXT,
            sentAt    TEXT,
            FOREIGN KEY (matchId) REFERENCES matches (matchId)
              ON DELETE CASCADE
          )
        ''');
      },
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Deletion
  // ──────────────────────────────────────────────────────────────────────────

  /// Permanently deletes the match row AND all messages with the given
  /// [matchId]. Runs both deletes inside a single transaction so the
  /// operation is atomic.
  Future<void> deleteMatch(String matchId) async {
    final db = await database;
    await db.transaction((txn) async {
      // Delete all messages for this match first (FK safety).
      await txn.delete(
        'messages',
        where: 'matchId = ?',
        whereArgs: [matchId],
      );
      // Then delete the match itself.
      await txn.delete(
        'matches',
        where: 'matchId = ?',
        whereArgs: [matchId],
      );
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Helpers (insert / query – used for seeding / testing)
  // ──────────────────────────────────────────────────────────────────────────

  Future<void> insertMatch(Map<String, dynamic> match) async {
    final db = await database;
    await db.insert(
      'matches',
      match,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> insertMessage(Map<String, dynamic> message) async {
    final db = await database;
    await db.insert(
      'messages',
      message,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<Map<String, dynamic>>> getMessagesForMatch(
      String matchId) async {
    final db = await database;
    return db.query(
      'messages',
      where: 'matchId = ?',
      whereArgs: [matchId],
      orderBy: 'sentAt ASC',
    );
  }
}
