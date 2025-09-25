# A2S - Aesthetics to Spaces

A modern property rental and interior design platform built with React, TypeScript, Express.js, and MongoDB.

## 🚀 Features

- **Property Search & Rental**: Browse and book premium properties
- **AI Assistant**: Get personalized recommendations and assistance
- **Design Studio**: Interactive room design and furniture selection
- **Consultant Booking**: Connect with professional interior designers
- **User Authentication**: Secure login and registration system
- **Payment Integration**: Stripe payment processing
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui

## 🛠 Tech Stack

### Frontend
- **React 18.3** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for data fetching
- **Wouter** for routing
- **Framer Motion** for animations

### Backend
- **Express.js 4.21** with TypeScript
- **MongoDB** with native MongoDB driver
- **bcryptjs** for password hashing
- **Express Session** for authentication
- **Stripe** for payment processing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git**
- **MongoDB Atlas account** (or local MongoDB installation)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Asha0509/A2S_final.git
cd A2S_final
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/a2s_database

# Session Secret (generate a random string)
SESSION_SECRET=your_super_secret_session_key_here

# Stripe Configuration (optional - for payment processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string and replace the DATABASE_URL in your `.env` file

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection string: `mongodb://localhost:27017/a2s_database`

### 5. Database Seeding (Optional)

The application will automatically seed the database with sample data on first startup. This includes:
- Sample users (admin@example.com / password123)
- Properties
- Consultants
- Furniture items

### 6. Start Development Server

#### Option A: Full Stack Development (Recommended)
```bash
npm run dev
```
This starts both frontend (port 5174) and backend (port 5000) concurrently.

#### Option B: Frontend Only
```bash
npm run dev
```

#### Option C: Backend Only
```bash
npm run dev:server
```

### 7. Access the Application

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000

## 🔐 Demo Credentials

Use these credentials to test the application:

- **Admin User**:
  - Email: admin@example.com
  - Password: password123

- **Regular User**:
  - Email: user@example.com
  - Password: password123

## 🏗 Building for Production

### 1. Build the Application
```bash
npm run build
```

This will:
- Build the frontend to `dist/`
- Bundle the backend to `dist/index.js`

### 2. Start Production Server
```bash
npm start
```

## 📁 Project Structure

```
A2S_final/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configurations
│   │   └── types/          # TypeScript type definitions
│   └── index.html
├── server/                 # Backend application
│   ├── index.ts            # Main server file
│   ├── routes.ts           # API routes
│   ├── mongodb.ts          # Database connection
│   ├── mongoStorage.ts     # Database operations
│   ├── mongoSeed.ts        # Database seeding
│   ├── storage.ts          # Storage interface
│   └── vite.ts             # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env                    # Environment variables
```

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run dev:server` | Start backend server only |
| `npm run build` | Build for production |
| `npm run build:frontend` | Build frontend only |
| `npm run build:backend` | Build backend only |
| `npm start` | Start production server |
| `npm run check` | TypeScript type checking |

## 🔧 Configuration

### Vite Configuration
The project uses Vite for the frontend with:
- React plugin
- TypeScript support
- Tailwind CSS integration
- Proxy configuration for API calls

### Database Configuration
- **Production**: MongoDB Atlas
- **Development**: Local MongoDB or Atlas
- **Seeding**: Automatic on first startup

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: DATABASE_URL environment variable is required
```
**Solution**: Ensure your `.env` file contains a valid MongoDB connection string.

#### 2. Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Kill the process using port 5000 or change the PORT in your `.env` file.

#### 3. Module Not Found Errors
**Solution**: Delete `node_modules` and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. Build Errors
**Solution**: Run type checking to identify TypeScript errors:
```bash
npm run check
```

### Environment Variables Checklist

Ensure these environment variables are set:
- ✅ `DATABASE_URL` - MongoDB connection string
- ✅ `SESSION_SECRET` - Random secret for session encryption
- ⚠️ `STRIPE_SECRET_KEY` - Optional for payments
- ⚠️ `STRIPE_PUBLISHABLE_KEY` - Optional for payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review existing issues on GitHub
3. Create a new issue with detailed information about your problem

---

**Happy Coding!** 🎉