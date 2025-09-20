import { describe, it, expect } from '@jest/globals'

// Business logic functions for testing
export class GymBusinessLogic {
  /**
   * Calculate payment distribution for combo plans
   * CrossFit members can access gym and get 20% allocated to gym
   */
  static calculatePaymentDistribution(planType: string, totalAmount: number) {
    const distributions = {
      'gym_only': { gym: 100, crossfit: 0 },
      'crossfit_only': { gym: 20, crossfit: 80 }, // CrossFit gets gym access
      'gym_crossfit': { gym: 50, crossfit: 50 },
      'gym_5pass': { gym: 100, crossfit: 0 },
      'crossfit_5pass': { gym: 20, crossfit: 80 },
      'fitness_5pass': { gym: 100, crossfit: 0 },
    }

    const distribution = distributions[planType as keyof typeof distributions] || { gym: 100, crossfit: 0 }

    return {
      gymShare: (totalAmount * distribution.gym) / 100,
      crossfitShare: (totalAmount * distribution.crossfit) / 100,
      gymPercentage: distribution.gym,
      crossfitPercentage: distribution.crossfit,
    }
  }

  /**
   * Check what facilities a member can access based on their plan
   */
  static getMemberAccess(planType: string) {
    const accessRights = {
      'gym_only': ['gym'],
      'crossfit_only': ['gym', 'crossfit'], // CrossFit includes gym access
      'gym_crossfit': ['gym', 'crossfit', 'fitness_class'],
      'gym_5pass': ['gym'],
      'crossfit_5pass': ['gym', 'crossfit'],
      'fitness_5pass': ['fitness_class'],
    }

    return accessRights[planType as keyof typeof accessRights] || []
  }

  /**
   * Validate check-in permissions
   */
  static canAccessFacility(planType: string, facilityType: string): boolean {
    const allowedFacilities = this.getMemberAccess(planType)
    return allowedFacilities.includes(facilityType)
  }

  /**
   * Calculate remaining visits for 5-pass plans
   */
  static updateRemainingVisits(planType: string, currentVisits: number | null): number | null {
    if (!planType.includes('5pass')) {
      return null // Unlimited plans
    }

    if (currentVisits === null || currentVisits <= 0) {
      throw new Error('No remaining visits')
    }

    return currentVisits - 1
  }

  /**
   * Check if membership is valid for check-in
   */
  static validateMembership(member: {
    isActive: boolean
    isPaused: boolean
    currentEndDate: string
    remainingVisits: number | null
    planType: string
  }): { isValid: boolean; reason?: string } {
    if (!member.isActive) {
      return { isValid: false, reason: 'Membership is inactive' }
    }

    if (member.isPaused) {
      return { isValid: false, reason: 'Membership is currently paused' }
    }

    const currentDate = new Date()
    const endDate = new Date(member.currentEndDate)
    if (currentDate > endDate) {
      return { isValid: false, reason: 'Membership has expired' }
    }

    // Check 5-pass plans
    if (member.planType.includes('5pass')) {
      if (!member.remainingVisits || member.remainingVisits <= 0) {
        return { isValid: false, reason: 'No remaining visits on your 5-pass plan' }
      }
    }

    return { isValid: true }
  }
}

describe('Gym Business Logic Tests', () => {
  describe('Payment Distribution', () => {
    it('should allocate 100% to gym for gym-only plans', () => {
      const result = GymBusinessLogic.calculatePaymentDistribution('gym_only', 1000)

      expect(result.gymShare).toBe(1000)
      expect(result.crossfitShare).toBe(0)
      expect(result.gymPercentage).toBe(100)
      expect(result.crossfitPercentage).toBe(0)
    })

    it('should allocate 20% to gym and 80% to crossfit for crossfit-only plans', () => {
      const result = GymBusinessLogic.calculatePaymentDistribution('crossfit_only', 1000)

      expect(result.gymShare).toBe(200) // 20%
      expect(result.crossfitShare).toBe(800) // 80%
      expect(result.gymPercentage).toBe(20)
      expect(result.crossfitPercentage).toBe(80)
    })

    it('should split 50/50 for combo plans', () => {
      const result = GymBusinessLogic.calculatePaymentDistribution('gym_crossfit', 1000)

      expect(result.gymShare).toBe(500)
      expect(result.crossfitShare).toBe(500)
      expect(result.gymPercentage).toBe(50)
      expect(result.crossfitPercentage).toBe(50)
    })

    it('should handle 5-pass crossfit plans with gym access', () => {
      const result = GymBusinessLogic.calculatePaymentDistribution('crossfit_5pass', 500)

      expect(result.gymShare).toBe(100) // 20%
      expect(result.crossfitShare).toBe(400) // 80%
    })
  })

  describe('Access Control', () => {
    it('should allow gym access for gym-only members', () => {
      const access = GymBusinessLogic.getMemberAccess('gym_only')

      expect(access).toContain('gym')
      expect(access).not.toContain('crossfit')
      expect(access).not.toContain('fitness_class')
    })

    it('should allow gym AND crossfit access for crossfit-only members', () => {
      const access = GymBusinessLogic.getMemberAccess('crossfit_only')

      expect(access).toContain('gym') // Key business rule!
      expect(access).toContain('crossfit')
    })

    it('should allow all facilities for combo members', () => {
      const access = GymBusinessLogic.getMemberAccess('gym_crossfit')

      expect(access).toContain('gym')
      expect(access).toContain('crossfit')
      expect(access).toContain('fitness_class')
    })

    it('should validate facility access correctly', () => {
      expect(GymBusinessLogic.canAccessFacility('crossfit_only', 'gym')).toBe(true)
      expect(GymBusinessLogic.canAccessFacility('crossfit_only', 'crossfit')).toBe(true)
      expect(GymBusinessLogic.canAccessFacility('gym_only', 'crossfit')).toBe(false)
      expect(GymBusinessLogic.canAccessFacility('fitness_5pass', 'gym')).toBe(false)
    })
  })

  describe('5-Pass Visit Management', () => {
    it('should decrease remaining visits for 5-pass plans', () => {
      const remaining = GymBusinessLogic.updateRemainingVisits('gym_5pass', 5)
      expect(remaining).toBe(4)
    })

    it('should return null for unlimited plans', () => {
      const remaining = GymBusinessLogic.updateRemainingVisits('gym_only', null)
      expect(remaining).toBeNull()
    })

    it('should throw error when no visits remaining', () => {
      expect(() => {
        GymBusinessLogic.updateRemainingVisits('gym_5pass', 0)
      }).toThrow('No remaining visits')
    })
  })

  describe('Membership Validation', () => {
    const validMember = {
      isActive: true,
      isPaused: false,
      currentEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days future
      remainingVisits: 5,
      planType: 'gym_5pass'
    }

    it('should validate active membership', () => {
      const result = GymBusinessLogic.validateMembership(validMember)
      expect(result.isValid).toBe(true)
    })

    it('should reject inactive membership', () => {
      const result = GymBusinessLogic.validateMembership({
        ...validMember,
        isActive: false
      })
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Membership is inactive')
    })

    it('should reject paused membership', () => {
      const result = GymBusinessLogic.validateMembership({
        ...validMember,
        isPaused: true
      })
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Membership is currently paused')
    })

    it('should reject expired membership', () => {
      const result = GymBusinessLogic.validateMembership({
        ...validMember,
        currentEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
      })
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('Membership has expired')
    })

    it('should reject 5-pass with no remaining visits', () => {
      const result = GymBusinessLogic.validateMembership({
        ...validMember,
        remainingVisits: 0
      })
      expect(result.isValid).toBe(false)
      expect(result.reason).toBe('No remaining visits on your 5-pass plan')
    })
  })

  describe('Membership Pause System', () => {
    const { validatePauseAction, shouldShowPauseButton } = require('../../lib/utils/membership')

    describe('Pause Validation Rules', () => {
      it('should allow pause for 1-month plan with 0 pauses', () => {
        const member = {
          planType: 'gym_only',
          planDuration: 1,
          isPaused: false,
          pauseCount: 0,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(true)
        expect(result.canUnpause).toBe(false)
        expect(result.maxPauses).toBe(1)
      })

      it('should reject pause for 1-month plan with 1 pause already used', () => {
        const member = {
          planType: 'gym_only',
          planDuration: 1,
          isPaused: false,
          pauseCount: 1,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(false)
        expect(result.canUnpause).toBe(false)
        expect(result.maxPauses).toBe(1)
        expect(result.reason).toBe('Maximum pause limit reached (1)')
      })

      it('should allow pause for 3-month plan with 1 pause used', () => {
        const member = {
          planType: 'gym_crossfit',
          planDuration: 3,
          isPaused: false,
          pauseCount: 1,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(true)
        expect(result.maxPauses).toBe(2)
      })

      it('should allow pause for 6-month plan with 2 pauses used', () => {
        const member = {
          planType: 'gym_only',
          planDuration: 6,
          isPaused: false,
          pauseCount: 2,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(true)
        expect(result.maxPauses).toBe(3)
      })

      it('should allow pause for 12-month plan with 3 pauses used', () => {
        const member = {
          planType: 'gym_crossfit',
          planDuration: 12,
          isPaused: false,
          pauseCount: 3,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(true)
        expect(result.maxPauses).toBe(4)
      })

      it('should reject pause for 12-month plan with 4 pauses used (limit reached)', () => {
        const member = {
          planType: 'gym_crossfit',
          planDuration: 12,
          isPaused: false,
          pauseCount: 4,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(false)
        expect(result.maxPauses).toBe(4)
        expect(result.reason).toBe('Maximum pause limit reached (4)')
      })

      it('should reject pause for 5-pass plans', () => {
        const member = {
          planType: 'gym_5pass',
          planDuration: null,
          isPaused: false,
          pauseCount: 0,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(false)
        expect(result.canUnpause).toBe(false)
        expect(result.reason).toBe('5-pass plans cannot be paused')
      })

      it('should allow unpause for currently paused membership', () => {
        const member = {
          planType: 'gym_only',
          planDuration: 6,
          isPaused: true,
          pauseCount: 2,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(false)
        expect(result.canUnpause).toBe(true)
        expect(result.reason).toBe('Membership is currently paused')
      })

      it('should reject pause for plans without duration', () => {
        const member = {
          planType: 'gym_only',
          planDuration: null,
          isPaused: false,
          pauseCount: 0,
        }

        const result = validatePauseAction(member)
        expect(result.canPause).toBe(false)
        expect(result.reason).toBe('Plan does not support pausing')
      })
    })

    describe('Pause Button Display Logic', () => {
      it('should show pause button for eligible plans that can pause', () => {
        const member = {
          planType: 'gym_only',
          planDuration: 3,
          isPaused: false,
          pauseCount: 0,
        }

        expect(shouldShowPauseButton(member)).toBe(true)
      })

      it('should show pause button for currently paused plans (to unpause)', () => {
        const member = {
          planType: 'gym_crossfit',
          planDuration: 6,
          isPaused: true,
          pauseCount: 1,
        }

        expect(shouldShowPauseButton(member)).toBe(true)
      })

      it('should not show pause button for 5-pass plans', () => {
        const member = {
          planType: 'crossfit_5pass',
          planDuration: null,
          isPaused: false,
          pauseCount: 0,
        }

        expect(shouldShowPauseButton(member)).toBe(false)
      })

      it('should not show pause button when pause limit reached', () => {
        const member = {
          planType: 'gym_only',
          planDuration: 1,
          isPaused: false,
          pauseCount: 1,
        }

        expect(shouldShowPauseButton(member)).toBe(false)
      })

      it('should not show pause button for plans without duration', () => {
        const member = {
          planType: 'gym_only',
          planDuration: null,
          isPaused: false,
          pauseCount: 0,
        }

        expect(shouldShowPauseButton(member)).toBe(false)
      })
    })

    describe('Pause Limit Rules', () => {
      const testCases = [
        { duration: 1, expectedMaxPauses: 1 },
        { duration: 3, expectedMaxPauses: 2 },
        { duration: 6, expectedMaxPauses: 3 },
        { duration: 12, expectedMaxPauses: 4 },
      ]

      testCases.forEach(({ duration, expectedMaxPauses }) => {
        it(`should set max pauses to ${expectedMaxPauses} for ${duration}-month plan`, () => {
          const member = {
            planType: 'gym_only',
            planDuration: duration,
            isPaused: false,
            pauseCount: 0,
          }

          const result = validatePauseAction(member)
          expect(result.maxPauses).toBe(expectedMaxPauses)
        })
      })
    })
  })
})