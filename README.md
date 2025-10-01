# Payment Records API

## Overview

This project is a backend API for tracking payments, managing user accounts, and organizing bank transactions. It's built with Node.js, TypeScript, Express, and TypeORM.

**NOTE: This project is currently under active development.** Many features are still being implemented, and changes to the architecture may occur.

## Current Features

### Authentication
- User registration with name, email, and password
- User login with JWT token authentication
- Token refresh mechanism
- Password reset via email
- Secure logout

###  User Management
- User profile update
- User information retrieval
- Most used banks analytics

###  Bank & Transaction Management *(In Development)*
- User-bank relationship management
- Transaction tracking and history
- Bank usage analytics

## Technologies Used

- **Node.js & TypeScript**: Core programming languages
- **Express**: Web framework
- **TypeORM**: Database ORM with PostgreSQL
- **JWT**: Authentication tokens
- **Zod & Class Validator**: Data validation
- **Nodemailer**: Email services for password reset
- **TypeORM Extensions**: Database seeding

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd payment_records
```

2. Install dependencies
```bash
npm install
```

3. Configure your environment variables
```
Copy .env.example to .env and update the values
```

4. Start the development server
```bash
npm start
```

### Database Seeding

To populate your database with test data:

```bash
npm run seed
```

## Project Structure

```
src/
├── modules/              # Feature modules
│   ├── Auth/             # Authentication module
│   ├── Bank/             # Bank management module
│   └── User/             # User management module
├── shared/               # Shared resources
│   ├── db/               # Database configuration
│   ├── errors/           # Error handling
│   └── middlewares/      # Express middlewares
└── app.ts                # Application entry point
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `POST /auth/refresh-token` - Refresh authentication token
- `POST /auth/logout` - Logout a user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### User Management
- `PUT /user` - Update user information
- `GET /user/:id` - Get user information (coming soon)
- `GET /user/banks` - Get user banks analytics (coming soon)

## Roadmap

- [ ] Complete transaction management
- [ ] Bank relationship optimization
- [ ] Reporting features
- [ ] Admin panel
- [ ] Data visualization
- [ ] Mobile app integration

## Contributing

This project is currently in development, but contributions are welcome. Please feel free to submit issues or pull requests.

## License

This project is licensed under the ISC License.