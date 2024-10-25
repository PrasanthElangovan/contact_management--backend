
# Contact Management Backend API

This is a backend project built with Next.js, Sequelize, and MySQL for managing contacts and user authentication. It includes features like registration, login, password reset, contact management, and file handling (upload/download contacts in CSV/XLSX format).

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MySQL](https://www.mysql.com/)
- [Next.js](https://nextjs.org/)

### Installation

1. Clone the repository:

-   git clone <your-repo-url>


2. Navigate into the project directory:

-   cd contact_management--Backend

3. Install the dependencies:

-   npm install

4. Create a .env file in the root directory and add the required environment variables. (See Environment Variables section)

5. Run the MySQL database and set up tables using Sequelize models:

-   npx sequelize-cli db:migrate

6. Start the server:
-   npm run dev

### Features
-   User Authentication: Register, login, and password reset.
-   Contact Management: CRUD operations for contacts.
-   Data Validation: Input validation for contacts and users.
-   File Handling: Upload and download contacts in CSV/XLSX format.
-   Date-Time Handling: Timezone support for contacts' created times.
-   Soft Delete: Paranoid option enabled for contacts.

### Environment Variables
Create a .env file in the root of your project and add the following:

-   `DATABASE_URL=mysql://<DB_USER>:<DB_PASSWORD>@localhost:3306/contact_management
-   JWT_SECRET=your_jwt_secret_key_here
-   EMAIL_SERVICE=gmail
-   EMAIL_USER=your_email@gmail.com
-   EMAIL_PASS=your_email_password`

Replace <DB_USER>, <DB_PASSWORD>, and other placeholders with your actual values.

### Endpoints

### Authentication
-   POST /api/auth/register: Register a new user.
-   POST /api/auth/login: Login an existing user.
-   POST /api/auth/sendResetLink: Send a password reset link to the user's email.
-   POST /api/auth/resetPassword: Reset password using a reset token.
-   POST /api/auth/verifyEmail: Verify a user's email address.

### Contact Management
-   GET /api/contacts: Fetch all contacts, supports timezone conversion.
-   POST /api/contacts: Add a new contact.
-   GET /api/contacts/[id]: Fetch a single contact by ID.
-   PUT /api/contacts/[id]: Update a contact by ID.
-   DELETE /api/contacts/[id]: Soft delete a contact by ID.

### File Handling
-   POST /api/upload: Upload contacts from CSV/XLSX files.
-   GET /api/download: Download contacts in CSV/XLSX format.

### Notes:
1. Be sure to replace placeholders with actual values in `.env` and set up Sequelize migrations if they’re not already configured.
2. Add any specific testing setup under "Run Tests" if you have or plan to include test cases.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
