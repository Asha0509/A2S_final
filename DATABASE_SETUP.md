# A2S Database Setup Guide

This guide explains how to set up the database connection for the A2S (Aesthetics to Spaces) application.

## Database Architecture

The application uses:

- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Neon** (recommended) or any PostgreSQL provider for hosting

## Database Schema

The application includes the following tables:

- `users` - User authentication and profiles
- `properties` - Real estate properties (buy/rent/land)
- `room_designs` - User's room design projects
- `consultants` - Vastu and interior design experts
- `bookings` - Consultation bookings
- `ai_chats` - AI assistant conversation history
- `saved_properties` - User's saved/favorited properties
- `furniture_items` - Available furniture catalog
- `cart_items` - User's shopping cart for furniture
- `orders` - Furniture orders and installations

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### 2. Database Provider Options

#### Option A: Neon (Recommended - Free Tier Available)

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from your Neon dashboard
4. Add to your `.env` file:

```
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:

```sql
CREATE DATABASE a2s_db;
```

3. Add to your `.env` file:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/a2s_db
```

#### Option C: Other Providers (Supabase, Railway, etc.)

Follow the provider's documentation to get your PostgreSQL connection string.

### 3. Database Migration and Setup

Once you have your DATABASE_URL configured:

```bash
# Install dependencies
npm install

# Generate migration files (if schema changes)
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data (optional - happens automatically on server start)
npm run db:seed

# Open Drizzle Studio to view your data (optional)
npm run db:studio
```

### 4. Development vs Production

#### Development Mode

- If no `DATABASE_URL` is provided, the app uses in-memory storage
- Database connection is tested on startup
- Auto-seeding occurs when database is first connected

#### Production Mode

- `DATABASE_URL` is required
- Database connection failures will prevent server startup
- Seeding only occurs if database is empty

## Database Operations

### Available Scripts

```bash
npm run db:push       # Push schema changes to database
npm run db:generate   # Generate migration files
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database with sample data
npm run db:studio     # Open Drizzle Studio (database GUI)
```

### Storage Layer

The application automatically switches between storage implementations:

- **DatabaseStorage**: Used when `DATABASE_URL` is configured
- **MemStorage**: Used for development without database

## Troubleshooting

### Common Issues

1. **Connection String Format**

   - Ensure your DATABASE_URL includes all required components
   - Check for special characters in password (may need URL encoding)
   - Verify SSL settings (`sslmode=require` for hosted databases)

2. **Permission Errors**

   - Ensure your database user has CREATE, READ, WRITE permissions
   - Check firewall settings for remote connections

3. **Schema Sync Issues**
   - Run `npm run db:push` to sync schema changes
   - Use `npm run db:generate` before pushing major changes

### Logging

The server logs database connection status on startup:

- ✅ Successful connection with seeding
- ⚠️ Connection failed, falling back to memory storage
- ℹ️ No DATABASE_URL provided, using memory storage

## Development Workflow

1. Make schema changes in `shared/schema.ts`
2. Run `npm run db:generate` to create migrations
3. Run `npm run db:push` to apply changes
4. Test your changes locally
5. Deploy with environment variables configured

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Rotate database credentials regularly
- Use SSL connections for production databases

## Data Backup

For production databases:

1. Enable automated backups through your provider
2. Test backup restoration procedures
3. Consider database replication for high availability

## Support

If you encounter issues:

1. Check the server logs for connection errors
2. Verify your DATABASE_URL format
3. Test connection with a database client
4. Review provider-specific documentation
