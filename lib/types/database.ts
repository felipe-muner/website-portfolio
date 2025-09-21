import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  authenticators,
  adminUsers,
  members,
  membershipPauses,
  checkIns,
  dayPasses,
  payments,
  plans,
  shopItems,
  shopSales,
  nationalities,
} from '@/lib/db/schema'

// Auth types
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Account = InferSelectModel<typeof accounts>
export type NewAccount = InferInsertModel<typeof accounts>

export type Session = InferSelectModel<typeof sessions>
export type NewSession = InferInsertModel<typeof sessions>

export type VerificationToken = InferSelectModel<typeof verificationTokens>
export type NewVerificationToken = InferInsertModel<typeof verificationTokens>

export type Authenticator = InferSelectModel<typeof authenticators>
export type NewAuthenticator = InferInsertModel<typeof authenticators>

// Gym management types
export type AdminUser = InferSelectModel<typeof adminUsers>
export type NewAdminUser = InferInsertModel<typeof adminUsers>

export type Member = InferSelectModel<typeof members>
export type NewMember = InferInsertModel<typeof members>

export type MembershipPause = InferSelectModel<typeof membershipPauses>
export type NewMembershipPause = InferInsertModel<typeof membershipPauses>

export type CheckIn = InferSelectModel<typeof checkIns>
export type NewCheckIn = InferInsertModel<typeof checkIns>

export type DayPass = InferSelectModel<typeof dayPasses>
export type NewDayPass = InferInsertModel<typeof dayPasses>

export type Payment = InferSelectModel<typeof payments>
export type NewPayment = InferInsertModel<typeof payments>

export type Plan = InferSelectModel<typeof plans>
export type NewPlan = InferInsertModel<typeof plans>

export type ShopItem = InferSelectModel<typeof shopItems>
export type NewShopItem = InferInsertModel<typeof shopItems>

export type ShopSale = InferSelectModel<typeof shopSales>
export type NewShopSale = InferInsertModel<typeof shopSales>

export type Nationality = InferSelectModel<typeof nationalities>
export type NewNationality = InferInsertModel<typeof nationalities>

// Additional utility types
export type MemberWithCheckIns = Member & {
  checkIns: CheckIn[]
}

export type MemberLookupResult = Pick<Member,
  | 'id'
  | 'name'
  | 'email'
  | 'passportId'
  | 'phone'
  | 'planType'
  | 'isActive'
  | 'isPaused'
  | 'remainingVisits'
  | 'currentEndDate'
>

export type CheckInRequest = {
  memberId: string
  facilityType: 'gym' | 'crossfit' | 'fitness_class'
}

export type CheckInResponse = {
  success: boolean
  checkIn: CheckIn
  remainingVisits: number | null
}