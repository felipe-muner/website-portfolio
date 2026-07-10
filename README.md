# Website Portfolio

A comprehensive gym and CrossFit management system built with Next.js 15, Drizzle ORM, and NextAuth.js featuring advanced revenue sharing, flexible membership plans, and intelligent check-in validation.

## 🚀 Features

### 👥 Member Management
- Complete CRUD operations for gym/CrossFit members with nationality tracking
- Advanced member profiles with passport ID, birthday tracking, and contact information
- Member birthday dashboard with age calculations and celebration reminders
- Comprehensive member search and filtering capabilities

### 📋 Membership Plans & Pricing
- **Unlimited Plans**: 1, 3, 6, 12-month memberships for gym, CrossFit, and combo access
- **Visit-Based Plans**: 5-pass and 10-pass systems with intelligent visit tracking
- **Day Passes**: Single-visit access for walk-in customers
- **Thai National Discounts**: Special pricing for Thai nationals on all plans
- **Combo Plans**: Mixed gym/CrossFit access with automated revenue splitting

### ✅ Smart Check-in System
- Email or passport ID validation for member access
- **Visit Tracking Rules**:
  - Same-day re-entry doesn&apos;t deduct additional visits for pass plans
  - Automatic visit countdown for 5-pass/10-pass memberships
  - Real-time membership status validation (active/expired/paused)
- Day pass integration with facility-specific access control
- Recent check-ins dashboard with detailed member information

### 💰 Advanced Payment & Revenue Sharing
- **Automated Revenue Splitting**:
  - Gym-only plans: 100% to gym
  - Combo plans: Configurable percentage splits (default 80% CrossFit, 20% Gym)
  - CrossFit plans: 100% to CrossFit
- Payment history tracking with share amount calculations
- Multiple payment methods (cash/card) support
- Thai national discount application

### 📊 Reports & Analytics
- Comprehensive income reports with date range filtering
- Revenue breakdown by facility (gym vs CrossFit)
- Transaction analysis with growth comparisons
- Daily revenue tracking with facility-specific insights
- Detailed transaction logs with member information

### 🔐 Role-Based Access Control
- **Admin Role**: Full system access including user management, reports, and all features
- **Staff Role**: Reception-focused access (members, check-ins, birthdays, limited features)
- Secure authentication via Google OAuth with email whitelist validation

### ⏸️ Membership Management
- **Membership Pausing**:
  - Maximum 90 days per pause period
  - Maximum 2 pause periods per membership
  - Accurate day calculation for remaining membership time
  - Visit-based plans (5-pass/10-pass) cannot be paused
- Membership activation/deactivation controls
- End date management with pause period extensions

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
   cd website-portfolio
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
├── app/                           # Next.js App Router
│   ├── admin/                    # Admin dashboard
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── members/         # Member management (CRUD, profiles)
│   │   │   ├── checkin/         # Check-in validation system
│   │   │   ├── birthdays/       # Birthday tracking dashboard
│   │   │   ├── reports/         # Revenue reports & analytics
│   │   │   ├── plans/           # Membership plan management
│   │   │   ├── users/           # Admin user management
│   │   │   └── dashboard/       # Main dashboard
│   │   ├── login/               # Authentication pages
│   │   └── layout.tsx           # Admin layout with auth
│   └── api/                     # API routes
│       ├── admin/               # Admin-specific endpoints
│       │   ├── members/         # Member CRUD & payments
│       │   ├── reports/         # Financial reporting
│       │   ├── users/           # User management
│       │   └── recent-checkins/ # Check-in history
│       ├── checkin/             # Public check-in validation
│       └── auth/                # NextAuth routes
├── components/                   # Reusable components
│   ├── admin/                   # Admin dashboard components
│   │   ├── members/             # Member tables, forms, profiles
│   │   ├── plans/               # Plan management components
│   │   ├── users/               # User management components
│   │   └── sidebar.tsx          # Navigation sidebar
│   ├── providers/               # Context providers
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utilities & configuration
│   ├── auth.ts                  # NextAuth configuration
│   ├── db/                      # Database setup
│   │   ├── index.ts             # Database connection
│   │   └── schema.ts            # Drizzle schema definitions
│   └── types/                   # TypeScript definitions
│       └── database.ts          # Database type exports
├── scripts/                     # Database & utility scripts
│   ├── seed-*.ts               # Data seeding scripts
│   ├── add-single-user.ts      # User creation utility
│   └── create-admin.ts         # Admin user creation
└── tests/                      # Test suites
    ├── e2e/                    # End-to-end tests
    └── unit/                   # Unit tests
```

## 🗃️ Database Schema

### Core Business Tables
- **`members`**: Customer profiles with passport ID, nationality, plan details, and membership status
- **`plans`**: Configurable membership plans with pricing, duration, visit limits, and revenue share percentages
- **`payments`**: Payment records with automatic gym/CrossFit share amount calculations
- **`check_ins`**: Facility usage tracking with timestamp and facility type
- **`membership_pauses`**: Pause history with duration limits and admin attribution
- **`day_passes`**: Walk-in customer single-visit passes
- **`nationalities`**: Country reference data with flags for member profiles

### Admin & Access Control
- **`admin_users`**: System users with role-based permissions (admin/staff)
- **`users`**, **`accounts`**, **`sessions`**: NextAuth.js authentication tables

### Commerce (Future)
- **`shop_items`** & **`shop_sales`**: Inventory and point-of-sale system

### Key Schema Features
- **Soft deletes**: `deletedAt` timestamp on all tables
- **Audit trails**: `createdAt` and `updatedAt` timestamps
- **Flexible plan types**: Extensible enum system for membership plans
- **Revenue sharing**: Built-in percentage calculations for combo plans
- **Visit tracking**: `usedVisits` counter for pass-based memberships

## 🔐 Authentication Flow

1. Admin visits `/admin/login`
2. Google OAuth authentication
3. Email validation against `admin_users` table
4. Role-based dashboard access

## 👥 User Roles & Permissions

| Role | Dashboard | Members | Check-ins | Birthdays | Reports | Plans | Admin Users | Shop |
|------|-----------|---------|-----------|-----------|---------|--------|-------------|------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Staff** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### Role Descriptions
- **Admin**: Full system access including user management, financial reports, plan configuration, and shop management
- **Staff**: Reception-focused access for day-to-day operations (member management, check-ins, birthday tracking)

## 💳 Membership Plans & Pricing Structure

### 🏋️ Gym-Only Memberships
| Duration | Regular Price | Thai Discount | Plan Type |
|----------|---------------|---------------|-----------|
| 1 Month | 1,900฿ | 1,600฿ | `gym_only_1month` |
| 3 Months | 5,200฿ | 4,400฿ | `gym_only_3month` |
| 6 Months | 9,600฿ | 8,200฿ | `gym_only_6month` |
| 12 Months | 16,000฿ | 14,000฿ | `gym_only_12month` |
| 5-Pass | 1,250฿ | 1,100฿ | `gym_5pass` |
| Drop-in | 300฿ | 250฿ | `gym_only_dropin` |

### 🥊 CrossFit Memberships
| Duration | Regular Price | Thai Discount | Plan Type |
|----------|---------------|---------------|-----------|
| 1 Month | 4,200฿ | 3,600฿ | `crossfit_1month` |
| 3 Months | 11,400฿ | 9,600฿ | `crossfit_3month` |
| 10-Pass | 3,500฿ | 3,000฿ | `crossfit_10pass` |
| Drop-in | 600฿ | 500฿ | `crossfit_dropin` |

### 🤸 Fitness Classes
| Duration | Regular Price | Thai Discount | Plan Type |
|----------|---------------|---------------|-----------|
| 1 Month | 2,800฿ | 2,400฿ | `fitness_1month` |
| 5-Pass | 1,250฿ | 1,100฿ | `fitness_5pass` |
| Drop-in | 300฿ | 250฿ | `fitness_dropin` |

### 🏋️‍♀️ Open Gym
| Duration | Regular Price | Thai Discount | Plan Type |
|----------|---------------|---------------|-----------|
| 1 Month | 3,000฿ | 2,600฿ | `open_gym_1month` |
| 5-Pass | 1,350฿ | 1,200฿ | `open_gym_5pass` |
| Drop-in | 450฿ | 400฿ | `open_gym_dropin` |

### 🔥 Combo Plans (Gym + CrossFit/Fitness)
| Plan | Duration | Regular Price | Thai Discount | Revenue Split | Plan Type |
|------|----------|---------------|---------------|---------------|-----------|
| Fitness + Gym | 1 Month | 4,000฿ | 3,400฿ | 60% Gym, 40% Fitness | `fitness_gym_1month` |
| Group Classes | 1 Month | 4,200฿ | 3,600฿ | 20% Gym, 80% CrossFit | `group_classes_1month` |
| Group Classes | 3 Months | 11,400฿ | 9,600฿ | 20% Gym, 80% CrossFit | `group_classes_3month` |
| Open Gym Combo | 1 Month | 5,000฿ | 4,400฿ | 60% Gym, 40% Open Gym | `open_gym_combo_1month` |

## 🎯 Check-in System Rules

### Visit Tracking Logic
- **Time-based Plans**: Unlimited check-ins during membership period
- **Visit-based Plans**:
  - 5-pass plans: 5 visits maximum
  - 10-pass plans: 10 visits maximum
  - **Same-day re-entry rule**: Multiple check-ins on the same day only count as 1 visit
- **Day Passes**: Single-use, facility-specific access

### Membership Status Validation
| Status | Check-in Allowed | Message |
|--------|------------------|---------|
| **Active** | ✅ | Welcome message with remaining time/visits |
| **Expired** | ❌ | Membership expired, payment required |
| **Paused** | ❌ | Contact reception to resume membership |
| **Inactive** | ❌ | Contact reception to reactivate |

### Facility Access Rules
| Pass Type | Gym | CrossFit | Fitness Class |
|-----------|-----|----------|---------------|
| `gym_only_dropin` | ✅ | ❌ | ❌ |
| `crossfit_dropin` | ❌ | ✅ | ❌ |
| `fitness_dropin` | ❌ | ❌ | ✅ |
| `open_gym` | ✅ | ❌ | ❌ |

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

## 📊 Revenue Sharing System

The system automatically calculates and tracks revenue sharing based on plan configuration:

### Revenue Split Logic
```
Payment Amount × Plan Share Percentage = Facility Share Amount
```

### Default Revenue Splits
| Plan Category | Gym Share | CrossFit Share |
|---------------|-----------|----------------|
| **Gym Plans** | 100% | 0% |
| **CrossFit Plans** | 0% | 100% |
| **Fitness Plans** | 0% | 100% |
| **Combo Plans** | 20% | 80% |
| **Shop Sales** | 100% | 0% |

### Share Calculation Examples
- **Gym 1-Month (1,900฿)**: Gym = 1,900฿, CrossFit = 0฿
- **Group Classes 1-Month (4,200฿)**: Gym = 840฿ (20%), CrossFit = 3,360฿ (80%)
- **Fitness + Gym Combo (4,000฿)**: Gym = 2,400฿ (60%), Fitness = 1,600฿ (40%)

## ⏸️ Membership Pausing Rules

### Pause Limitations
- **Maximum pause duration**: 90 days per pause
- **Maximum pauses per membership**: 2 total pauses
- **Non-pausable plans**: Visit-based plans (5-pass, 10-pass)
- **Time-based plans only**: Monthly/yearly memberships can be paused

### Pause Calculations
- Original end date remains unchanged for reference
- Current end date extends by pause duration
- Accurate day calculation preserves exact remaining time
- Pause history tracked with admin user attribution

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
