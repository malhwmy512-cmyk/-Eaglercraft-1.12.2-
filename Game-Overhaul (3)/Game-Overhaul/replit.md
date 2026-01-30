# TerraForge - Minecraft Seed Archive

## Overview

TerraForge is a full-stack web application for discovering, sharing, and rating Minecraft world seeds. Users can browse a curated database of seeds with filtering by category, difficulty, and popularity. The app also embeds an Eaglercraft client allowing users to play Minecraft directly in the browser. Built with a React frontend and Express backend, using PostgreSQL for data persistence and Replit Auth for user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom industrial/gaming theme (Orbitron + Rajdhani fonts)
- **Animations**: Framer Motion for complex animations
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful JSON API with routes defined in server/routes.ts
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **Authentication**: Replit Auth via OpenID Connect (server/replit_integrations/auth/)

### Data Storage
- **Database**: PostgreSQL (required via DATABASE_URL environment variable)
- **Schema Location**: shared/schema.ts defines all tables using Drizzle
- **Key Tables**:
  - `users` - User accounts (managed by Replit Auth)
  - `sessions` - Session storage for authentication
  - `seeds` - Minecraft world seeds with metadata (category, difficulty, features, view count)
  - `ratings` - User ratings and comments for seeds

### API Structure
- `GET /api/seeds` - List seeds with optional filters (search, category, difficulty, sortBy)
- `GET /api/seeds/featured` - Get featured seeds
- `GET /api/seeds/:id` - Get single seed details
- `POST /api/seeds` - Create new seed (authenticated)
- `GET /api/seeds/:id/ratings` - Get ratings for a seed
- `POST /api/seeds/:id/ratings` - Add rating (authenticated)
- `GET /api/categories` - List available seed categories
- `GET /api/auth/user` - Get current authenticated user

### Authentication Flow
- Uses Replit's OpenID Connect provider
- Session-based authentication stored in PostgreSQL
- Protected routes use `isAuthenticated` middleware
- User data upserted on login via authStorage

### Key Design Decisions
1. **Shared Code**: Types and schemas in shared/ directory are used by both frontend and backend
2. **Drizzle-Zod Integration**: Schema validation uses drizzle-zod for type-safe form validation
3. **Embedded Game**: Eaglercraft HTML file served from client/public/game/ directory
4. **Industrial Theme**: Custom dark theme with magma orange accent colors and sharp industrial styling

## External Dependencies

### Database
- **PostgreSQL**: Required, connection via DATABASE_URL environment variable
- **Drizzle Kit**: Used for schema migrations (`npm run db:push`)

### Authentication
- **Replit Auth**: OpenID Connect provider (ISSUER_URL defaults to https://replit.com/oidc)
- **Required Env Vars**: SESSION_SECRET, REPL_ID, DATABASE_URL

### Third-Party Services
- **Google Fonts**: Orbitron and Rajdhani fonts loaded via CDN

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod` - Database ORM and validation
- `@tanstack/react-query` - Server state management
- `passport` / `openid-client` - Authentication
- `express-session` / `connect-pg-simple` - Session handling
- `framer-motion` - Animations
- Full shadcn/ui component set via Radix UI primitives