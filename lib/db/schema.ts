import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

// auth tables
export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

// gym management tables
export const nationalities = pgTable('nationality', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  code: text('code').notNull().unique(), // ISO 3166-1 alpha-2 country code
  flag: text('flag').notNull(), // Unicode flag emoji
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('nationalities_name_idx').on(t.name),
  index('nationalities_code_idx').on(t.code),
])

export const adminUsers = pgTable('admin_user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').$type<'owner' | 'manager' | 'staff'>().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  deletedAt: timestamp('deleted_at'),
  lastLogin: timestamp('last_login'),
}, (t) => [
  index('admin_users_email_idx').on(t.email),
])

export const members = pgTable('member', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  passportId: text('passport_id').unique(),
  email: text('email').unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  nationalityId: text('nationality_id')
    .references(() => nationalities.id, { onDelete: 'set null' }),
  planType: text('plan_type').$type<'gym_only' | 'gym_crossfit' | 'gym_5pass' | 'fitness_5pass' | 'crossfit_5pass'>(),
  planDuration: integer('plan_duration'), // 1,3,6,12 months
  startDate: timestamp('start_date').notNull(),
  originalEndDate: timestamp('original_end_date').notNull(),
  currentEndDate: timestamp('current_end_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  isPaused: boolean('is_paused').default(false).notNull(),
  pauseCount: integer('pause_count').default(0).notNull(),
  remainingVisits: integer('remaining_visits'), // for 5-pass plans
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  deletedAt: timestamp('deleted_at'),
}, (t) => [
  index('members_passport_id_idx').on(t.passportId),
  index('members_email_idx').on(t.email),
  index('members_is_active_idx').on(t.isActive),
  index('members_nationality_id_idx').on(t.nationalityId),
])

export const membershipPauses = pgTable('membership_pause', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  memberId: text('member_id')
    .notNull()
    .references(() => members.id, { onDelete: 'cascade' }),
  pauseStartDate: timestamp('pause_start_date').notNull(),
  pauseEndDate: timestamp('pause_end_date'),
  pauseReason: text('pause_reason'),
  pausedByAdminId: text('paused_by_admin_id')
    .references(() => adminUsers.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  deletedAt: timestamp('deleted_at'),
}, (t) => [
  index('membership_pauses_member_id_idx').on(t.memberId),
])

export const checkIns = pgTable('check_in', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  memberId: text('member_id')
    .references(() => members.id, { onDelete: 'cascade' }),
  facilityType: text('facility_type').$type<'gym' | 'crossfit' | 'fitness_class'>().notNull(),
  checkInTime: timestamp('check_in_time').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  deletedAt: timestamp('deleted_at'),
}, (t) => [
  index('check_ins_member_id_idx').on(t.memberId),
  index('check_ins_check_in_time_idx').on(t.checkInTime),
])

export const dayPasses = pgTable('day_pass', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerName: text('customer_name'),
  passportId: text('passport_id'),
  email: text('email'),
  passType: text('pass_type').$type<'gym_dropin' | 'fitness_class' | 'crossfit_dropin' | 'open_gym'>().notNull(),
  pricePaid: decimal('price_paid', { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp('purchase_date').defaultNow().notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  usedAt: timestamp('used_at'),
}, (t) => [
  index('day_passes_purchase_date_idx').on(t.purchaseDate),
  index('day_passes_is_used_idx').on(t.isUsed),
])

export const payments = pgTable('payment', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  memberId: text('member_id')
    .references(() => members.id, { onDelete: 'set null' }),
  dayPassId: text('day_pass_id')
    .references(() => dayPasses.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  gymShare: decimal('gym_share', { precision: 5, scale: 2 }), // percentage for combo plans
  crossfitShare: decimal('crossfit_share', { precision: 5, scale: 2 }), // percentage for combo plans
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  paymentMethod: text('payment_method').$type<'cash' | 'card'>().notNull(),
  paymentType: text('payment_type').$type<'membership' | 'day_pass' | 'shop_item'>().notNull(),
  serviceType: text('service_type').$type<'gym' | 'crossfit' | 'fitness_class'>(),
}, (t) => [
  index('payments_member_id_idx').on(t.memberId),
  index('payments_payment_date_idx').on(t.paymentDate),
])

export const shopItems = pgTable('shop_item', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  category: text('category').$type<'protein' | 'apparel' | 'accessories'>().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('shop_items_category_idx').on(t.category),
  index('shop_items_is_active_idx').on(t.isActive),
])

export const shopSales = pgTable('shop_sale', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  itemId: text('item_id')
    .notNull()
    .references(() => shopItems.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  saleDate: timestamp('sale_date').defaultNow().notNull(),
  soldByUserId: text('sold_by_user_id')
    .references(() => adminUsers.id, { onDelete: 'set null' }),
}, (t) => [
  index('shop_sales_item_id_idx').on(t.itemId),
  index('shop_sales_sale_date_idx').on(t.saleDate),
])