// Example migration - Create users table
// Run this with: node -e "require('./utils/migrationRunner').runMigration('001_create_users.js')"

exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      signup_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create index on email for faster lookups
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);
};

exports.down = async (client) => {
  await client.query('DROP TABLE IF EXISTS users CASCADE;');
};
