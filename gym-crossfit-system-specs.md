# Gym + CrossFit Management System Specifications

## Overview

Comprehensive gym and crossfit management system with manual payment processing, membership management, day passes, shop functionality, and revenue splitting between gym (20%) and crossfit (80%) for combo plans.

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with Gmail OAuth
- **UI**: Tailwind CSS + shadcn/ui components
- **Deployment**: Vercel

## Database Schema

### Admin Users

```sql
admin_users
- id (crypto.randomUUID())
- email (gmail address)
- name
- role (owner, manager, staff)
- is_active (boolean)
- created_at
- updated_at
- deleted_at (soft delete)
- last_login
```

### Members

```sql
members
- id (crypto.randomUUID())
- passport_id (unique)
- email (unique)
- name
- phone
- plan_type (gym_only, gym_crossfit, gym_5pass, fitness_5pass, crossfit_5pass)
- plan_duration (1,3,6,12 months)
- start_date
- original_end_date (original expiry)
- current_end_date (adjusted for pauses)
- is_active
- is_paused (boolean)
- pause_count (track how many times paused)
- remaining_visits (for 5-pass plans)
- created_at
- updated_at
- deleted_at (soft delete)

```

### Membership Pauses

```sql
membership_pauses
- id (crypto.randomUUID())
- member_id (foreign key)
- pause_start_date
- pause_end_date (null if still paused)
- pause_reason (optional)
- paused_by_admin
- created_at
- updated_at
- deleted_at (soft delete)
```

### Check-ins

```sql
check_ins
- id (crypto.randomUUID())
- member_id (foreign key)
- facility_type (gym, crossfit, fitness_class)
- check_in_time
- created_at
- updated_at
- deleted_at (soft delete)
```

### Day Passes

```sql
day_passes
- id (crypto.randomUUID())
- customer_name
- passport_id/email (optional for drop-ins)
- pass_type (gym_dropin, fitness_class, crossfit_dropin)
- price_paid
- purchase_date
- is_used (boolean)
- used_at (timestamp)
```

### Payments

```sql
payments
- id (crypto.randomUUID())
- member_id (foreign key, nullable for day passes)
- day_pass_id (foreign key, nullable for memberships)
- amount
- gym_share (percentage for combo plans)
- crossfit_share (percentage for combo plans)
- payment_date
- payment_method (cash, card)
- payment_type (membership, day_pass, shop_item)
- service_type (gym, crossfit, fitness_class)
```

### Shop Items

```sql
shop_items
- id (crypto.randomUUID())
- name
- price
- stock_quantity
- category (protein, apparel, accessories)
- is_active (boolean)
- created_at
```

### Shop Sales

```sql
shop_sales
- id (crypto.randomUUID())
- item_id (foreign key)
- quantity
- unit_price
- total_amount
- sale_date
- sold_by_user_id (foreign key to admin_users)
```

## Pricing Structure

### Memberships

| Duration | Gym/Steam/Ice-bath | Fitness Classes | Group Training | Open-Gym | Group Training + Open-Gym |
| -------- | ------------------ | --------------- | -------------- | -------- | ------------------------- |
| Drop-in  | 300฿               | 300฿            | 600฿           | 450฿     | -                         |
| 5-pass   | 1,250฿             | 1,250฿          | 2,250฿         | -        | -                         |
| 1-month  | 1,900฿             | 2,800฿          | 4,200฿         | 3,000฿   | 5,000฿                    |
| 3-month  | 5,100฿             | -               | 11,400฿        | -        | 13,500฿                   |
| 6-month  | 9,000฿             | -               | 21,600฿        | -        | 25,800฿                   |
| 12-month | 16,000฿            | -               | -              | -        | -                         |

**Notes:**

- 5-pass validity: 1 month, non-shareable
- Combo plans: 80% to CrossFit, 20% to Gym
- Memberships can be paused (max 90 days, max 2 times per membership)

## User Roles & Permissions

### Role Hierarchy

- **Owner**: Full access (you + crossfit partner)
- **Manager**: All operations except user management
- **Staff**: Reception duties only

### Permission Matrix

```
                     Owner  Manager  Staff
Member Management      ✓      ✓      ✓
Day Pass Sales         ✓      ✓      ✓
Member Check-in        ✓      ✓      ✓
Shop Management        ✓      ✓      ✗
Revenue Reports        ✓      ✓      ✗
User Management        ✓      ✗      ✗
System Settings        ✓      ✗      ✗
```

## System Features

### Admin Dashboard Pages

```
/admin/dashboard - Overview + stats
/admin/members - Add/search/manage members
/admin/checkin - Quick member validation and check-in
/admin/day-passes - Sell and manage day passes
/admin/shop - Inventory management and sales
/admin/reports - Revenue analytics and reporting
/admin/users - User management (Owner only)
/admin/settings - System settings (Owner only)
```

### Member Management

- **Registration**: Manual entry with passport/email
- **Plans**: All membership types from pricing table
- **Pause/Resume**: Track remaining days accurately
- **Status Tracking**: Active, paused, expired
- **Check-in History**: Facility usage tracking
- **Search**: By passport ID or email

### Day Pass System

- **Quick Sale**: Fast checkout for walk-ins
- **Types**: Gym (300฿), Fitness Class (300฿), CrossFit (600฿), Open-Gym (450฿)
- **Optional Info**: Name/passport for tracking
- **Usage Tracking**: Mark as used when customer checks in

### Revenue Tracking

- **Automatic Splits**: Combo memberships (80% CrossFit, 20% Gym)
- **Daily Reports**: All revenue streams
- **Analytics**: Popular plans, peak times, conversion rates
- **Export**: CSV/PDF reports for accounting

### Shop Management

- **Inventory**: Track stock levels
- **Categories**: Protein, apparel, accessories
- **Sales**: Point-of-sale integration
- **Low Stock**: Automatic alerts

### Pause/Freeze System

- **Flexible Pausing**: Any time during membership
- **Remaining Time**: Accurate day calculation
- **History Tracking**: All pause periods logged
- **Business Rules**:
  - Minimum pause: 7 days
  - Maximum pause: 90 days per occurrence
  - Maximum pauses: 2 per membership
  - 5-pass plans: Cannot be paused

## Authentication & Security

### NextAuth.js Setup

```javascript
// Environment Variables
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://yourdomain.com

// NextAuth Configuration
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
]
callbacks: {
  signIn: async ({ user, account }) => {
    const adminUser = await checkIfAuthorized(user.email)
    return adminUser ? true : false
  }
}
```

### User Creation Process

1. Owner deploys app with initial Gmail as first user
2. Owner can invite new users via admin panel
3. Invitation sent to Gmail address
4. User authenticates with Gmail OAuth
5. Access granted based on role

## Key Workflows

### Member Check-in Flow

1. Customer arrives at reception
2. Staff searches by passport/email
3. System shows:
   - Active member → Allow entry + log check-in
   - Expired member → Offer renewal
   - Not found → Offer day pass or membership
   - Paused member → Show pause status

### Day Pass Sales Flow

1. Customer wants single visit
2. Staff selects pass type and price
3. Payment collected (cash/card)
4. System logs sale and creates pass
5. Customer checks in using pass

### Membership Pause Example

```
1-month membership (30 days total)
- Start: Jan 1
- Original end: Jan 31
- Day 14 (Jan 14): Member requests pause
- Pause logged: 16 days remaining
- Member returns: March 15 (60 days later)
- Resume: March 15
- New end date: March 31 (March 15 + 16 days)
```

## Implementation Priority

1. **Database setup** (Neon + Drizzle schema)
2. **Authentication system** (NextAuth + Gmail)
3. **Member management** (core revenue generator)
4. **Day pass system** (walk-in revenue)
5. **Check-in validation** (daily operations)
6. **Revenue tracking** (business analytics)
7. **Shop management** (additional revenue)
8. **Advanced features** (reporting, analytics)

## Technical Notes

- All monetary amounts stored in Thai Baht (฿)
- Timestamps in UTC, display in local timezone
- Responsive design for tablet use at reception
- Offline capability for basic check-ins
- Data export for accounting software integration
- Backup and restore functionality
- Multi-language support (Thai/English) - future enhancement

## Business Rules Summary

- Gym-only memberships: 100% to gym revenue
- Combo memberships: 80% CrossFit, 20% gym
- 5-pass plans: 1-month validity, non-shareable, non-pausable
- Day passes: Single-use, same-day validity
- Membership pauses: Max 90 days, max 2 times per membership
- Shop sales: 100% to gym revenue
- Access control: Plan-specific facility access
