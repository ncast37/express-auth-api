const pool = require('../config/database');

// Run a single migration
const runMigration = async (migrationFile) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if this migration was already run
    const result = await client.query(
      'SELECT filename FROM migrations WHERE filename = $1',
      [migrationFile]
    );

    if (result.rows.length > 0) {
      console.log(`Migration ${migrationFile} already executed`);
      return;
    }

    // Import and run the migration
    const migration = require(`../migrations/${migrationFile}`);
    await migration.up(client);

    // Record that migration was run
    await client.query(
      'INSERT INTO migrations (filename) VALUES ($1)',
      [migrationFile]
    );

    await client.query('COMMIT');
    console.log(`Migration ${migrationFile} executed successfully`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Migration ${migrationFile} failed:`, error);
    throw error;
  } finally {
    client.release();
  }
};

// Run all pending migrations
const runMigrations = async () => {
  const fs = require('fs');
  const path = require('path');
  
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found');
    return;
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js'))
    .sort();

  for (const file of files) {
    await runMigration(file);
  }
};

module.exports = { runMigration, runMigrations };
