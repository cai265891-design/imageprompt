# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 用中文回答我
所有回答都用中文回答

## Project Overview

Saasfly is an enterprise-grade Next.js SaaS boilerplate built with a modern tech stack. It uses a monorepo structure managed by Turbo, with Bun as the package manager. The project supports internationalization (en, zh, ko, ja) and includes enterprise features like admin dashboard, Stripe payments, and comprehensive authentication.

## Quick Start

1. **Setup environment**: `cp .env.example .env.local` and configure required variables
2. **Install dependencies**: `bun install`
3. **Setup database**: Configure `POSTGRES_URL` then run `bun run db:push`
4. **Start development**: `bun run dev:web` (or `bun run dev` to include Stripe service)
5. **Access app**: Open http://localhost:3000

## Essential Commands

### Development
- `bun install` - Install all dependencies
- `bun run dev` - Start all development servers in parallel (includes stripe)
- `bun run dev:web` - Start only the web app (excludes stripe service)
- `bun run db:push` - Push database schema changes (run after setting up .env.local with POSTGRES_URL)
- `bun run clean` - Clean all node_modules
- `bun run clean:workspaces` - Clean workspace build artifacts

### Building & Quality
- `bun run build` - Build all applications
- `bun run lint` - Run ESLint across all packages
- `bun run lint:fix` - Fix ESLint issues
- `bun run format:fix` - Format code with Prettier
- `bun run typecheck` - Run TypeScript type checking

### Utilities
- `bun run tailwind-config-viewer` - View Tailwind CSS configuration at localhost:3333
- `bun run gen` - Generate code using Turbo generators
- `bun run check-deps` - Check dependency version consistency across packages

### Package-specific Commands
- In `apps/nextjs/`: `bun with-env` - Run commands with environment variables from `.env.local`
- In `packages/db/`: `bun db:push` - Push Prisma schema to database

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

### Build System
- Uses Turbo for monorepo orchestration
- Contentlayer for MDX content management (configuration in `contentlayer.config.ts`)
- Next.js build includes contentlayer build step
- Vercel deployment configured with root directory at `apps/nextjs`

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
The app uses Clerk as the primary auth provider since June 1st, 2025. Key files:
- `apps/nextjs/src/app/[lang]/(auth)/` - Authentication pages
- `packages/auth/clerk.ts` - Clerk configuration
- `apps/nextjs/src/middleware.ts` - Auth middleware with i18n support
- NextAuth fallback available in separate branch: https://github.com/saasfly/saasfly/tree/feature-nextauth

### Database Schema
Located in `packages/db/prisma/schema.prisma`. Key models:
- `Customer` - User subscription data with Stripe integration
- `User` - User profiles 
- `Account/Session` - NextAuth accounts (legacy support)
- `K8sClusterConfig` - Kubernetes cluster configurations
- Subscription plans: FREE, PRO, BUSINESS

### Internationalization
Supports multiple languages (en, zh, ko, ja) with:
- Config: `apps/nextjs/src/config/i18n-config.ts`
- Translations: `apps/nextjs/src/config/dictionaries/`
- Middleware-based routing: `apps/nextjs/src/middleware.ts`

### Environment Variables
Create `.env.local` from `.env.example` in the root directory. Key variables:

#### Required Variables
- `POSTGRES_URL` - Database connection
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_CLERK_*` - Clerk authentication keys

#### Optional Variables
- `STRIPE_*` - Stripe payment keys (for payments)
- `RESEND_*` - Resend email API keys (for emails)
- `ADMIN_EMAIL` - Admin emails for dashboard access (comma-separated)
- `NEXT_PUBLIC_POSTHOG_*` - PostHog analytics configuration
- `COZE_WORKFLOW_ID` / `COZE_BOT_ID` - Coze AI integration for image generation
- `IS_DEBUG` - Debug mode flag

Note: Database must be prepared before running `bun db:push`

## Development Patterns

### Component Structure
- Use existing shadcn/ui components from `packages/ui/`
- Follow the established pattern of colocating components with their routes
- Use TypeScript for all new components
- Place new pages in `apps/nextjs/src/app/[lang]/` following i18n structure

### API Development
- Define tRPC routers in `packages/api/src/router/`
- Use the existing auth context for protected routes
- Follow the established error handling patterns
- API endpoints should be type-safe using tRPC procedures
- tRPC client is configured in `apps/nextjs/src/trpc/`
- Use `@tanstack/react-query` for data fetching with tRPC

### Database Operations
- Use Kysely for type-safe queries (types generated from Prisma schema)
- Run `bun db:push` after schema changes
- Database utilities are in `packages/db/`
- Always use Kysely types for database queries

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the existing color scheme and design system
- Check `tailwind-config-viewer` for available utilities
- Use shadcn/ui components when available

## Enterprise Features

### Admin Dashboard
- Access at `/admin/dashboard` (alpha feature)
- Configure admin emails via `ADMIN_EMAIL` environment variable
- Currently static pages only, headless architecture planned

### Payment Integration
- Stripe integration in `packages/stripe/`
- Subscription plans: FREE, PRO, BUSINESS
- Webhook handling for payment events

### Email System
- Resend integration for transactional emails
- Email templates in React Email format
- Configuration via `RESEND_API_KEY`

### AI Integration
- Coze API integration for image generation features
- Supports multiple AI models (normal, flux, midjourney, stableDiffusion)
- Configuration via `COZE_WORKFLOW_ID` and `COZE_BOT_ID` environment variables

## Testing & Quality

### Current Quality Checks
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting
- CI/CD via GitHub Actions

### No Test Framework
- Project currently has no Jest/Vitest configuration
- Quality assurance through type checking and linting
- Manual testing required for new features

### Development Tools
- **Source Code Jump**: In development mode, click on page elements to jump directly to the source code in VSCode
  - Shortcut: Alt + Shift + S
  - Also available via right-click context menu
  - Requires sourcemap configuration in `next.config.mjs`

## Common Issues & Solutions

### Database Setup
1. Ensure PostgreSQL is running or use Vercel Postgres
2. Set `POSTGRES_URL` in `.env.local`
3. Run `bun db:push` to initialize schema

### Authentication Issues
- Clerk is the primary provider since June 2025
- Check `NEXT_PUBLIC_CLERK_*` environment variables
- NextAuth fallback available in separate branch

### Build Issues
- Use `bun run clean` to reset dependencies
- Check dependency consistency with `bun run check-deps`
- Ensure all environment variables are set for builds

## Deployment Scripts

The project includes several deployment and debugging scripts:
- `deploy-fix.sh`, `deploy-final-fix.sh` - Automated deployment fixes
- `fix-auth-issue.sh` - Fix authentication issues
- `test-vercel-build.sh` - Test Vercel build locally
- `debug-204-issue.sh` - Debug HTTP 204 response issues
- `validate-auth-fix.sh` - Validate authentication configuration

## Additional Documentation

For more detailed information, refer to these files:
- `README.md` - Main project documentation with features and tech stack
- `DEVELOPMENT_TOOLS.md` - Source code jump functionality guide
- `DEPLOYMENT_GUIDE.md` - Detailed Vercel deployment instructions
- `COZE_API_SETUP.md` - AI image generation integration guide
- `CONTRIBUTING.md` - PR submission guidelines and standards