# User Model Documentation

## Overview
The User model is a PostgreSQL database model that provides CRUD (Create, Read, Update, Delete) operations for managing user data in the application. This module handles all database interactions related to user accounts, including user creation, authentication data management, and user information retrieval.

## Database Schema
The User model works with a PostgreSQL table with the following structure:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Dependencies
- **pg**: PostgreSQL client for Node.js
- **bcrypt**: Password hashing library
- **../config/database**: Database connection pool

## Configuration
- **SALT_ROUNDS**: Set to 10 for bcrypt password hashing

## Available Methods

### Create Operations

#### `createUser(userData)`
Creates a new user account with hashed password.

**Parameters:**
- `userData` (Object): User information
  - `name` (string): User's full name
  - `email` (string): User's email address  
  - `password` (string): Plain text password (will be hashed)

**Returns:** 
- User object with `id`, `name`, `email`, `signup_date`
- Password hash is NOT returned for security

**Example:**
```javascript
const newUser = await User.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123'
});
```

### Read Operations

#### `findById(id)`
Retrieves a user by their unique ID.

**Parameters:**
- `id` (number): User's database ID

**Returns:**
- User object or `undefined` if not found
- Excludes password_hash for security

**Example:**
```javascript
const user = await User.findById(123);
```

#### `findByEmail(email)`
Retrieves a user by their email address.

**Parameters:**
- `email` (string): User's email address

**Returns:**
- User object or `undefined` if not found
- Excludes password_hash for security

**Example:**
```javascript
const user = await User.findByEmail('john@example.com');
```

#### `findAll(limit, offset)`
Retrieves multiple users with pagination support.

**Parameters:**
- `limit` (number, optional): Maximum number of users to return (default: 10)
- `offset` (number, optional): Number of users to skip (default: 0)

**Returns:**
- Array of user objects ordered by signup_date (newest first)

**Example:**
```javascript
const users = await User.findAll(20, 0); // Get first 20 users
const nextUsers = await User.findAll(20, 20); // Get next 20 users
```

#### `count()`
Returns the total number of users in the database.

**Parameters:** None

**Returns:**
- Number representing total user count

**Example:**
```javascript
const totalUsers = await User.count();
```

### Update Operations

#### `update(id, updateData)`
Updates user information for an existing user.

**Parameters:**
- `id` (number): User's database ID
- `updateData` (Object): Fields to update
  - Can include: `name`, `email`, `password`
  - Password will be automatically hashed if provided

**Returns:**
- Updated user object
- Excludes password_hash for security

**Example:**
```javascript
const updatedUser = await User.update(123, {
  name: 'Jane Smith',
  email: 'jane@example.com'
});

// Update password
const userWithNewPassword = await User.update(123, {
  password: 'newSecurePassword456'
});
```

### Delete Operations

#### `delete(id)`
Permanently removes a user from the database.

**Parameters:**
- `id` (number): User's database ID

**Returns:**
- Deleted user object (last snapshot before deletion)

**Example:**
```javascript
const deletedUser = await User.delete(123);
```

### Utility Operations

#### `emailExists(email)`
Checks if an email address is already registered.

**Parameters:**
- `email` (string): Email address to check

**Returns:**
- Boolean: `true` if email exists, `false` otherwise

**Example:**
```javascript
const isEmailTaken = await User.emailExists('john@example.com');
if (isEmailTaken) {
  throw new Error('Email already registered');
}
```

## Security Features

### Password Handling
- All passwords are hashed using bcrypt with 10 salt rounds
- Plain text passwords are never stored in the database
- Password hashes are never returned in query results (except when specifically needed for authentication)

### SQL Injection Protection
- All queries use parameterized statements ($1, $2, etc.)
- User input is properly escaped and sanitized

## Error Handling
The model relies on PostgreSQL constraints and calling code for error handling:

- **Unique constraint violations**: Thrown when duplicate emails are inserted
- **Not null violations**: Thrown when required fields are missing
- **Connection errors**: Thrown when database is unavailable

## Usage Patterns

### Typical User Registration Flow
```javascript
// 1. Check if email exists
const emailTaken = await User.emailExists(email);
if (emailTaken) {
  throw new Error('Email already registered');
}

// 2. Create new user
const user = await User.createUser({
  name: userData.name,
  email: userData.email,
  password: userData.password
});
```

### Typical User Authentication Flow
```javascript
// 1. Find user by email
const user = await User.findByEmail(email);
if (!user) {
  throw new Error('User not found');
}

// 2. Verify password (handled in controller/service layer)
// Note: This model doesn't include password verification
// That should be handled separately using bcrypt.compare()
```

### Pagination Example
```javascript
// Get users for page 2 (20 users per page)
const page = 2;
const usersPerPage = 20;
const offset = (page - 1) * usersPerPage;

const users = await User.findAll(usersPerPage, offset);
const totalUsers = await User.count();
const totalPages = Math.ceil(totalUsers / usersPerPage);
```

## Important Notes

### Known Issues in Current Implementation
⚠️ **The current code has several bugs that need fixing:**

1. **Missing await keywords** in password hashing operations
2. **Incorrect method calls** (pool vs pool.query)
3. **Variable name mismatches** (password vs username)
4. **Incomplete findAll method** (missing return statement)
5. **Syntax errors** in some queries

### Security Considerations
- Never log or expose password hashes
- Always validate input data before calling these methods
- Consider implementing rate limiting for authentication attempts
- Use HTTPS in production to protect data in transit

### Performance Considerations
- Database queries should be wrapped in try-catch blocks
- Consider adding database indexes on frequently queried fields (email)
- Use connection pooling (already implemented via config/database)
- Monitor query performance and add pagination where needed

## File Location
`models/User.js`

## Last Updated
This documentation reflects the User model as of the current codebase state. Please update this documentation when making changes to the model.
