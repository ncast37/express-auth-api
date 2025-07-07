const pool = require('../config/database');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const User = {

    // Create a new user
    async createUser(userData) {
        const { name, email, password } = userData;

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const query = `
        INSERT INTO users (name, email, password_hash, signup_date, created_at, updated_at)
        VALUES($1, $2, $3, NOW(), NOW(), NOW())
        RETURNING id, name, email, signup_date, created_at, updated_at
        `;

        const result = await pool.query(query, [name, email, passwordHash]);

        return result.rows[0];
    },

    // READ - Get user by id
    async findById(id) {
        const query = `SELECT id, name, email, signup_date, created_at, updated_at
        FROM users
        WHERE id = $1`;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // READ - get user by email
    async findByEmail(email) {
        const query = `SELECT id, name, email, signup_date, created_at, updated_at
        FROM users
        WHERE email = $1`;

        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    // READ - get user email with password
    async findByEmailWithPassword(email) {
        const query = `SELECT id, name, email, password_hash, signup_date, created_at, updated_at
        FROM users
        WHERE email = $1`;

        const result = await pool.query(query, [email]);

        return result.rows[0];
    },


    //READ - get all users (with pagination)
    async findAll(limit = 10, offset = 0) {
        const query = `
        SELECT id, name, email, signup_date, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2`;

        const result = await pool.query(query, [limit, offset]);
        return result.rows;
    },

    //READ - count total users 
    async count() {
        const query = `
        SELECT COUNT(*) as total FROM users`;

        const result = await pool.query(query);
        return parseInt(result.rows[0].total);
    },

    // Update -- Update user by ID
    async update(id, updateData) {
        const fields = [];
        const values = [];

        let paramCount = 1;

        //add id as first parameter
        values.push(id);
        paramCount++;

        //Build SET clause dynamically
        for (const [key, value] of Object.entries(updateData)) {
            if (key !== 'password') {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        //Handle password separately (needs hashing)
        if (updateData.password) {
            const passwordHash = await bcrypt.hash(updateData.password, SALT_ROUNDS);
            fields.push(`password_hash = $${paramCount}`);
            values.push(passwordHash);
        }

        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }

        const query = `
        UPDATE users
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $1
        RETURNING id, name, email, signup_date, created_at, updated_at`;

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // DELETE - Delete user by ID
    async delete(id) {
        const query = `
      DELETE FROM users 
      WHERE id = $1 
      RETURNING id, name, email, signup_date, created_at, updated_at
    `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async emailExists(email) {
        const query = 'SELECT id FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows.length > 0;
    },
    async verifyPassword(user, plainPassword) {
        return await bcrypt.compare(plainPassword, user.password_hash);
    },
}

module.exports = User;
