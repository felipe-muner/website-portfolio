# Denial Test Cases for Check-in Presentation

These members are designed to be **DENIED** during check-in to demonstrate rejection scenarios and renewal workflows.

All members have the prefix **"DENIED-"** in their name for easy searching.

## Quick Search Guide

Search for: **"DENIED-"** in the members list to find all denial test cases.

## Test Cases (15 Total)

### 1. DENIED-Expired1Month
- **Email:** denied.expired1month@test.com
- **Phone:** +66899990001
- **Plan:** Gym Only 1 Month (EXPIRED)
- **Scenario:** Member tries to check in with expired 1-month membership
- **Demo Flow:**
  1. Try check-in → Gets DENIED
  2. Add new 1-month plan & payment
  3. Try check-in again → SUCCESS ✅

### 2. DENIED-Expired3Month
- **Email:** denied.expired3month@test.com
- **Phone:** +66899990002
- **Plan:** Gym Only 3 Months (EXPIRED)
- **Scenario:** Expired 3-month membership
- **Demo Flow:** Renewal demo

### 3. DENIED-AllVisitsUsed5Pass
- **Email:** denied.allvisits5pass@test.com
- **Phone:** +66899990003
- **Plan:** Gym 5 Pass (ALL 5 VISITS USED)
- **Scenario:** Member used all 5 visits from pass
- **Demo Flow:**
  1. Check-in → DENIED (no visits remaining)
  2. Purchase new 5-pass
  3. Check-in → SUCCESS ✅

### 4. DENIED-AllVisitsUsed10Pass
- **Email:** denied.allvisits10pass@test.com
- **Phone:** +66899990004
- **Plan:** CrossFit 10 Pass (ALL 10 VISITS USED)
- **Scenario:** All visits exhausted
- **Demo Flow:** Renewal demo for 10-pass

### 5. DENIED-ExpiredCrossFit1Month
- **Email:** denied.expiredcrossfit1m@test.com
- **Phone:** +66899990005
- **Plan:** CrossFit 1 Month (EXPIRED)
- **Scenario:** Expired CrossFit membership
- **Demo Flow:** CrossFit renewal

### 6. DENIED-ExpiredFitness5Pass
- **Email:** denied.expiredfitness5@test.com
- **Phone:** +66899990006
- **Plan:** Fitness 5 Pass (ALL VISITS USED)
- **Scenario:** All fitness pass visits used
- **Demo Flow:** Fitness pass renewal

### 7. DENIED-Expired6MonthGym
- **Email:** denied.expired6month@test.com
- **Phone:** +66899990007
- **Plan:** Gym Only 6 Months (EXPIRED)
- **Scenario:** Long-term expired membership
- **Demo Flow:** 6-month renewal

### 8. DENIED-Expired12MonthGym
- **Email:** denied.expired12month@test.com
- **Phone:** +66899990008
- **Plan:** Gym Only 12 Months (EXPIRED)
- **Scenario:** Annual membership expired
- **Demo Flow:** Annual renewal

### 9. DENIED-CurrentlyPaused
- **Email:** denied.paused@test.com
- **Phone:** +66899990009
- **Plan:** Gym Only 3 Months (CURRENTLY PAUSED)
- **Scenario:** Member is on pause, cannot check in
- **Demo Flow:**
  1. Check-in → DENIED (membership paused)
  2. Unpause membership
  3. Check-in → SUCCESS ✅

### 10. DENIED-ExpiredGroupClasses
- **Email:** denied.expiredgroup@test.com
- **Phone:** +66899990010
- **Plan:** Group Classes 1 Month (EXPIRED)
- **Scenario:** Expired group classes membership
- **Demo Flow:** Group class renewal

### 11. DENIED-ExpiredCombo
- **Email:** denied.expiredcombo@test.com
- **Phone:** +66899990011
- **Plan:** Fitness + Gym Combo (EXPIRED)
- **Scenario:** Expired combo plan
- **Demo Flow:** Combo plan renewal

### 12. DENIED-ExpiredOpenGym
- **Email:** denied.expiredopengym@test.com
- **Phone:** +66899990012
- **Plan:** Open Gym 1 Month (EXPIRED)
- **Scenario:** Expired open gym membership
- **Demo Flow:** Open gym renewal

### 13. DENIED-ExpiredOpenGym5Pass
- **Email:** denied.expiredopengym5@test.com
- **Phone:** +66899990013
- **Plan:** Open Gym 5 Pass (ALL VISITS USED)
- **Scenario:** All open gym pass visits used
- **Demo Flow:** Open gym pass renewal

### 14. DENIED-ExpiredCrossFit1Week
- **Email:** denied.expiredcf1week@test.com
- **Phone:** +66899990014
- **Plan:** CrossFit 1 Week Trial (EXPIRED, ALL 7 VISITS USED)
- **Scenario:** Trial period ended
- **Demo Flow:** Convert to regular membership

### 15. DENIED-PausedCrossFit
- **Email:** denied.pausedcrossfit@test.com
- **Phone:** +66899990015
- **Plan:** CrossFit 3 Months (CURRENTLY PAUSED)
- **Scenario:** Paused CrossFit membership
- **Demo Flow:**
  1. Check-in → DENIED (paused)
  2. Unpause
  3. Check-in → SUCCESS ✅

---

## Recommended Demo Flow for Presentation

### Example 1: Expired Membership → Renewal
1. Search for "DENIED-Expired1Month"
2. Attempt check-in → System shows DENIED with reason "Membership Expired"
3. Go to member profile → Add new payment for 1-month plan
4. System updates end date automatically
5. Attempt check-in again → SUCCESS! Member can now enter

### Example 2: All Visits Used → New Pass
1. Search for "DENIED-AllVisitsUsed5Pass"
2. Attempt check-in → System shows DENIED with reason "All visits used (5/5)"
3. Add new 5-pass payment
4. System resets visit counter to 0/5
5. Check-in → SUCCESS! Visit counter becomes 1/5

### Example 3: Paused Member → Unpause
1. Search for "DENIED-CurrentlyPaused"
2. Attempt check-in → System shows DENIED with reason "Membership is paused"
3. Go to member profile → Click "Unpause Membership"
4. System extends end date by pause duration
5. Check-in → SUCCESS! Member active again

---

## Database Info

- **Total Members:** 1000
- **Denial Test Cases:** 15
- **Birthday Members:** 35
- **Active Members:** 450
- **Paused Members:** 80
- **Expired Members:** 120
- **Expiring Soon:** 100
- **Unpaid Members:** 150

All test data is seeded via: `npm run docker:up:db:clean:optimized`
