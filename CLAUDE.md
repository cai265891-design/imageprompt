# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 用中文回答我
所有回答都用中文回答

## Project Overview

Saasfly is an enterprise-grade Next.js SaaS boilerplate built with a modern tech stack. It uses a monorepo structure managed by Turbo, with Bun as the package manager.

## Essential Commands

### Development
- `bun install` - Install all dependencies
- `bun run dev` - Start all development servers in parallel
- `bun run dev:web` - Start only the web app (excludes stripe)
- `bun run db:push` - Push database schema changes (run after setting up .env.local)

### Building & Quality
- `bun run build` - Build all applications
- `bun run lint` - Run ESLint across all packages
- `bun run lint:fix` - Fix ESLint issues
- `bun run format:fix` - Format code with Prettier
- `bun run typecheck` - Run TypeScript type checking

### Utilities
- `bun run tailwind-config-viewer` - View Tailwind CSS configuration at localhost:3333
- `bun run gen` - Generate code using Turbo generators

## Architecture

### Monorepo Structure
- `apps/nextjs/` - Main Next.js application with App Router
- `apps/auth-proxy/` - Authentication proxy service
- `packages/api/` - tRPC API definitions and routers
- `packages/auth/` - Authentication utilities (Clerk + NextAuth support)
- `packages/db/` - Database schema (Prisma) and Kysely query builder
- `packages/ui/` - Shared UI components (shadcn/ui based)
- `packages/stripe/` - Stripe integration and webhooks
- `packages/common/` - Shared utilities and configurations
- `tooling/` - ESLint, Prettier, TypeScript, and Tailwind configurations

### Key Technologies
- **Framework**: Next.js 14 with App Router
- **Authentication**: Clerk (primary) with NextAuth fallback
- **Database**: PostgreSQL with Prisma schema management and Kysely for queries
- **API**: tRPC for type-safe APIs
- **State Management**: Zustand for client state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Package Manager**: Bun
- **Monorepo**: Turbo for build orchestration

### Authentication Flow
The app uses Clerk as the primary auth provider. Key files:
- `apps/nextjs/src/app/[lang]/(auth)/` - Authentication pages
- `packages/auth/clerk.ts` - Clerk configuration
- `apps/nextjs/src/middleware.ts` - Auth middleware

### Database Schema
Located in `packages/db/prisma/schema.prisma`. Key models:
- `Customer` - User subscription data
- `Account` - NextAuth accounts (legacy)
- `User` - User profiles
- `Post` - Blog posts

### Internationalization
Supports multiple languages (en, zh, ko, ja) with:
- Config: `apps/nextjs/src/config/i18n-config.ts`
- Translations: `apps/nextjs/src/config/dictionaries/`
- Middleware-based routing: `apps/nextjs/src/middleware.ts`

### Environment Variables
Create `.env.local` from `.env.example`. Key variables:
- `POSTGRES_URL` - Database connection
- `NEXT_PUBLIC_APP_URL` - Application URL
- Clerk auth keys
- Stripe keys for payments
- Resend API key for emails

## Development Patterns

### Component Structure
- Use existing shadcn/ui components from `packages/ui/`
- Follow the established pattern of colocating components with their routes
- Use TypeScript for all new components

### API Development
- Define tRPC routers in `packages/api/src/router/`
- Use the existing auth context for protected routes
- Follow the established error handling patterns

### Database Operations
- Use Kysely for type-safe queries (types generated from Prisma schema)
- Run `bun db:push` after schema changes
- Database utilities are in `packages/db/`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the existing color scheme and design system
- Check `tailwind-config-viewer` for available utilities