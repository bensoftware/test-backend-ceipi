# Node.js JWT Authentication and Expense Management Backend

A Node.js backend application demonstrating JWT authentication with refresh tokens, user management, and expense tracking using PostgreSQL and Sequelize.

## Features

- User registration and login with JWT authentication
- Refresh token functionality for secure session management
- Role-based access control (User, Moderator, Admin)
- Expense creation and management
- PostgreSQL database integration with Sequelize ORM
- CORS enabled for cross-origin requests

<<<<<<< HEAD
## Tech Stack
=======
- NODE JS 
- Express  :4.17.1
- Postgresql
- JWT
>>>>>>> 55d20e110c27e5d562172af2c3a2807e9d408885

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM for database operations
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **UUID** - Unique identifier generation

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd node-test-ceipi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=8080
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=testdb
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```

4. Database setup:
   - Create a PostgreSQL database named `testdb`
   - Update the database credentials in `app/config/db.config.js` or use environment variables

## Running the Application

To start the server:

```bash
node server.js
```

The server will run on `http://localhost:8080` (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/refreshtoken` - Refresh access token

### User Management
- `GET /api/test/all` - Public access
- `GET /api/test/user` - User board (requires authentication)
- `GET /api/test/mod` - Moderator board (requires moderator role)
- `GET /api/test/admin` - Admin board (requires admin role)

### Expense Management
- `POST /api/create` - Create a new expense (requires authentication)

## Project Structure

```
node-test-ceipi/
├── app/
│   ├── config/
│   │   ├── auth.config.js
│   │   └── db.config.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── expense.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── authJwt.js
│   │   ├── index.js
│   │   └── verifySignUp.js
│   ├── models/
│   │   ├── expense.model.js
│   │   ├── index.js
│   │   ├── refreshToken.model.js
│   │   ├── role.model.js
│   │   └── user.model.js
│   └── routes/
│       ├── auth.routes.js
│       ├── expense.routes.js
│       └── user.routes.js
├── node_modules/
├── .env
├── package.json
├── README.md
└── server.js
```

## Testing

Currently, no automated tests are implemented. To test the API, you can use tools like Postman or curl.

Example curl command for signup:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on tutorials from [BezKoder](https://www.bezkoder.com/)
- Express.js documentation
- Sequelize documentation

