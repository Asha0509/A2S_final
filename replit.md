# A2S - Aesthetics to Spaces

## Overview

A2S (Aesthetics to Spaces) is a comprehensive real estate and interior design platform that combines property search, room design customization, AI assistance, and professional consultation services. The application provides users with tools to find properties (buy, rent, or land), design and visualize room layouts using a 2.5D studio, interact with an AI assistant for intelligent recommendations, and book consultations with verified experts in Vastu and interior design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based architecture with TypeScript and Vite for build tooling. The frontend follows a component-based structure with:

- **Framework**: React with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **UI Components**: Radix UI primitives wrapped with custom styling for accessibility

### Backend Architecture
The backend is built with Express.js and uses a clean REST API architecture:

- **Server Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Structure**: RESTful endpoints organized by resource (properties, room designs, consultants, bookings, AI chats)
- **Development Setup**: Vite integration for hot module replacement during development

### Data Storage Solutions
The application uses PostgreSQL as the primary database with a well-structured schema:

- **Database**: PostgreSQL with connection pooling via Neon Database serverless
- **ORM**: Drizzle ORM for schema management and migrations
- **Schema Design**: Normalized tables for users, properties, room designs, consultants, bookings, AI chats, and saved properties
- **Data Validation**: Zod schemas for runtime type validation integrated with Drizzle

### Authentication and Authorization
Currently implements a basic session-based authentication system:

- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **User Management**: User registration and login with hashed passwords
- **Authorization**: Role-based access control for different user types

### Core Features Architecture

#### Property Search Module
- Multi-purpose search (buy/rent/land) with dynamic filtering
- Advanced filter system including price ranges, location, property type, facing direction, and amenities
- Property card components with contextual actions based on property purpose

#### Room Design Studio
- 2.5D room visualization with drag-and-drop furniture placement
- Customizable room elements including walls, floors, lighting, and furniture
- Save and load design functionality with user-specific design collections

#### AI Assistant Integration
- Chat-based interface for property recommendations and design suggestions
- Conversation history management with persistent chat sessions
- Contextual suggestions based on user preferences and search history

#### Consultation Booking System
- Expert categorization (Vastu consultants vs Interior designers)
- Availability management with time slot booking
- Rating and review system for consultant profiles

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migration and schema management tool

### UI and Styling Libraries
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built component library based on Radix UI primitives
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Static type checking for both frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility

### State Management and Data Fetching
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form validation and management
- **Zod**: Schema validation for form inputs and API responses

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class management
- **class-variance-authority**: Type-safe CSS class variants
- **nanoid**: Unique ID generation

### Development Environment
- **Replit Integration**: Development environment optimizations with error overlay and debugging tools
- **Hot Module Replacement**: Real-time code updates during development
- **TypeScript Path Mapping**: Clean import paths with @ aliases for client and shared code