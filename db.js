#!/usr/bin/env node

const { runMigrations, runMigration } = require('./utils/migrationRunner');
const pool = require('./config/database');

const command = process.argv[2];
const arg = process.argv[3];

async function main() {
  try {
    switch (command) {
      case 'migrate':
        console.log('Running all pending migrations...');
        await runMigrations();
        break;
        
      case 'migrate:single':
        if (!arg) {
          console.error('Please provide migration filename');
          process.exit(1);
        }
        console.log(`Running migration: ${arg}`);
        await runMigration(arg);
        break;
        
      case 'test':
        console.log('Testing database connection...');
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Database connected successfully at:', result.rows[0].now);
        client.release();
        break;
        
      default:
        console.log(`
Database CLI Tool

Usage:
  node db.js test                    # Test database connection
  node db.js migrate                 # Run all pending migrations
  node db.js migrate:single <file>   # Run specific migration

Examples:
  node db.js test
  node db.js migrate
  node db.js migrate:single 001_create_users.js
        `);
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
