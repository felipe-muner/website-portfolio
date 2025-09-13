# Summit Gym Management System

A comprehensive gym and CrossFit management system built with Next.js 15, Drizzle ORM, and NextAuth.js.

## 🚀 Features

- **Member Management**: Complete CRUD operations for gym/CrossFit members
- **Plan Types**: Gym-only, combo plans, 5-pass systems
- **Check-in System**: Track member visits and facility usage
- **Day Pass Sales**: Walk-in customer management
- **Revenue Tracking**: Automated revenue splitting for combo plans (80% CrossFit, 20% Gym)
- **Role-based Access**: Owner, Manager, Staff permissions
- **Shop Management**: Inventory and POS system
- **Membership Pausing**: Flexible pause/resume functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with Google OAuth
- **UI**: Tailwind CSS + shadcn/ui components
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 22+
- PostgreSQL database (Neon recommended)
- Google OAuth credentials

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd summit-gym
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required values:
   ```env
   DATABASE_URL="postgresql://username:password@host:5432/database"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Generate and push database schema**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Create initial admin user**
   ```bash
   INITIAL_ADMIN_EMAIL="your-email@gmail.com" npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   ├── login/         # Authentication
│   │   ├── members/       # Member management
│   │   └── layout.tsx     # Admin layout with auth
│   └── api/auth/          # NextAuth API routes
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── providers/        # Context providers
│   └── ui/              # shadcn/ui components
├── lib/                  # Utilities
│   ├── auth.ts          # NextAuth configuration
│   └── db/              # Database setup
│       ├── index.ts     # Database connection
│       └── schema.ts    # Drizzle schema
├── scripts/             # Database scripts
└── types/              # TypeScript definitions
```

## 🗃️ Database Schema

### Core Tables
- **members**: Customer information and membership details
- **admin_users**: System users with role-based access
- **membership_pauses**: Track membership suspensions
- **check_ins**: Facility usage tracking
- **day_passes**: Walk-in customer passes
- **payments**: Revenue tracking with automatic splits
- **shop_items** & **shop_sales**: Inventory management

### Authentication Tables
- Standard NextAuth.js tables for session management

## 🔐 Authentication Flow

1. Admin visits `/admin/login`
2. Google OAuth authentication
3. Email validation against `admin_users` table
4. Role-based dashboard access

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Owner** | Full system access, user management |
| **Manager** | All operations except user management |
| **Staff** | Reception duties only (members, check-ins, day passes) |

## 💳 Pricing Structure

### Memberships
- **Gym/Steam/Ice-bath**: 1,900฿ (1mo) to 16,000฿ (12mo)
- **Fitness Classes**: 2,800฿ (1mo)
- **Group Training**: 4,200฿ (1mo) to 21,600฿ (6mo)
- **Open-Gym**: 3,000฿ (1mo)
- **Combo Plans**: 5,000฿ (1mo) to 25,800฿ (6mo)

### Day Passes
- **Gym**: 300฿
- **Fitness Class**: 300฿  
- **CrossFit**: 600฿
- **Open-Gym**: 450฿

### 5-Pass Plans
- **Gym/Fitness**: 1,250฿
- **CrossFit**: 2,250฿
- Valid for 1 month, non-shareable

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Create initial admin user
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Database Setup
1. Create Neon PostgreSQL database
2. Run migrations: `npm run db:push`
3. Create admin user: `npm run db:seed`

## 🔄 GitHub Actions

### Branch Status Checks
- Runs on all PRs to `main`
- Linting and build verification
- Automatic PR comments

### Claude Code Integration
- AI-assisted code reviews
- Responds to `@claude` mentions in issues/PRs

## 📊 Business Logic

### Revenue Splitting
- **Gym-only plans**: 100% to gym
- **Combo plans**: 80% CrossFit, 20% gym
- **Shop sales**: 100% to gym

### Membership Pausing
- Maximum 90 days per pause
- Maximum 2 pauses per membership
- 5-pass plans cannot be paused
- Accurate day calculation for remaining time

## 🛡️ Security Features

- Environment variable validation
- Role-based route protection
- Secure session management
- SQL injection prevention with Drizzle ORM

## 📱 Mobile Responsive

Optimized for tablet use at reception desks with responsive design for all screen sizes.

## 🆘 Support

For issues or questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Use `@claude` for AI assistance in issues/PRs

## 📄 License

Private project - All rights reserved
