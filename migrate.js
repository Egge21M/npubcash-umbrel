const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const db = new Database("test.db");

function getMigrationFiles() {
  return fs
    .readdirSync(path.join(__dirname, "migrations"))
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

function getSchemaVersion() {
  try {
    const row = db.prepare("SELECT version FROM schema_version").get();
    return row ? row.version : 0;
  } catch (e) {
    return 0;
  }
}

function applyMigrations() {
  const currentVersion = getSchemaVersion();
  const migrationFiles = getMigrationFiles();

  db.exec("BEGIN");

  try {
    migrationFiles.forEach((file) => {
      const version = parseInt(file.split("_")[0], 10);
      if (version > currentVersion) {
        const migration = fs.readFileSync(
          path.join(__dirname, "migrations", file),
          "utf-8",
        );
        db.exec(migration);
        console.log(`Applied migration: ${file}`);
      }
    });
    db.exec("COMMIT");
  } catch (err) {
    console.error("Migration failed:", err);
    db.exec("ROLLBACK");
    throw err;
  }
}

applyMigrations();
db.close();
