# Express Authentication API

A scalable Express.js API with PostgreSQL database and JWT-based authentication system. Features user signup, login, and protected routes with Docker containerization.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **PostgreSQL Database** - Robust relational database with Docker
- **Password Security** - Bcrypt hashing with salt rounds
- **Input Validation** - Server-side validation for all endpoints
- **Docker Integration** - Containerized PostgreSQL database
- **Auto-migrations** - Database schema setup on container start
- **Protected Routes** - Middleware-based route protection
- **Environment Configuration** - Secure environment variable management

## 📋 Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/express-auth-api.git
   cd express-auth-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_NAME=myapp
   DB_USER=postgres
   DB_PASSWORD=password123
   DB_HOST=localhost
   DB_PORT=5432

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Application
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    signup_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Authenticate user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Example Requests

#### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Protected Route
```bash
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📁 Project Structure

```
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   └── authController.js    # Authentication business logic
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── migrations/
│   └── 001_create_users_table.sql  # Database migrations
├── models/
│   └── User.js             # User data model
├── routes/
│   ├── api.js              # General API routes
│   ├── auth.js             # Authentication routes
│   └── proxy.js            # Proxy routes
├── docker-compose.yml      # Docker services configuration
├── package.json           # Project dependencies
├── server.js             # Application entry point
└── README.md            # Project documentation
```

## 🔒 Security Features

- **Password Hashing** - Bcrypt with configurable salt rounds
- **JWT Tokens** - Secure token-based authentication
- **Environment Variables** - Sensitive data protection
- **Input Validation** - Server-side request validation
- **CORS Configuration** - Cross-origin request handling
- **Error Handling** - Secure error responses

## 🐳 Docker Usage

The project includes a PostgreSQL database running in Docker:

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
```

## 🧪 Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints:

1. **Signup** a new user
2. **Login** to get JWT token
3. **Access protected routes** with the token
4. **Test error cases** (invalid credentials, missing tokens, etc.)

## 🚀 Deployment

1. **Set production environment variables**
2. **Use a production PostgreSQL database**
3. **Set strong JWT secret**
4. **Configure CORS for your frontend domain**
5. **Enable HTTPS**

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_NAME` | Database name | `myapp` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password123` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Built With

- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Docker** - Containerization
- **Node.js** - Runtime environment
