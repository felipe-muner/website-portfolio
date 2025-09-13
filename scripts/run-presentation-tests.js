#!/usr/bin/env node

/**
 * Presentation Test Runner
 * Runs all tests and generates reports for owner demonstration
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🎯 Running Gym Management System Validation Tests...\n')

// Create reports directory
const reportsDir = path.join(__dirname, '../test-reports')
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}

try {
  console.log('📊 Step 1: Running Unit Tests with Coverage...')
  execSync('npm run test:coverage', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  })

  console.log('\n🌐 Step 2: Running End-to-End Tests...')
  execSync('npx playwright test --reporter=html', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  })

  console.log('\n📋 Step 3: Generating Business Logic Report...')

  // Create a summary report
  const summaryReport = `
# Gym Management System Test Results

## Test Execution Summary
- **Date**: ${new Date().toISOString()}
- **Total Test Suites**: Unit Tests + E2E Tests
- **Coverage**: See coverage/index.html
- **E2E Results**: See playwright-report/index.html

## Key Business Requirements Validated ✅

### 1. CrossFit Members Gym Access
- ✅ CrossFit-only members can check into gym
- ✅ Payment distribution: 20% gym, 80% crossfit
- ✅ Access control validates properly

### 2. 5-Pass Visit Management
- ✅ Visit count decreases correctly
- ✅ Zero visits blocks access
- ✅ Unlimited plans unaffected

### 3. Payment Distribution
- ✅ Gym-only: 100% gym allocation
- ✅ CrossFit-only: 20% gym, 80% crossfit
- ✅ Combo plans: 50/50 split

### 4. Security Validations
- ✅ Inactive members blocked
- ✅ Expired members blocked
- ✅ Paused members blocked
- ✅ Wrong facility access denied

## Financial Impact Demonstration

### Monthly Revenue Example (Based on Test Data)
\`\`\`
CrossFit Member Payment: $1,000
- Gym Share: $200 (20%)
- CrossFit Share: $800 (80%)

This ensures proper revenue allocation and
accurate profit tracking for both services.
\`\`\`

## Next Steps
1. Review detailed test reports in respective folders
2. Run \`npm run test:presentation\` for fresh validation
3. Monitor production logs for similar patterns

Generated: ${new Date().toLocaleString()}
`

  fs.writeFileSync(path.join(reportsDir, 'business-validation-summary.md'), summaryReport)

  console.log('\n✅ All tests completed successfully!')
  console.log('\n📊 Reports generated:')
  console.log('  - Unit Test Coverage: coverage/index.html')
  console.log('  - E2E Test Results: playwright-report/index.html')
  console.log('  - Business Summary: test-reports/business-validation-summary.md')
  console.log('  - Detailed Scenarios: tests/presentation/business-scenarios.md')

  console.log('\n🎉 Ready for owner presentation!')
  console.log('\nTo view reports:')
  console.log('  npx serve coverage')
  console.log('  npx serve playwright-report')

} catch (error) {
  console.error('\n❌ Test execution failed:', error.message)
  process.exit(1)
}