-- Test Data for Owner Presentation
-- This script creates realistic test scenarios to demonstrate key business rules

-- Create test members with different plan types
INSERT INTO member (
  id, passport_id, email, name, phone, plan_type, plan_duration,
  start_date, original_end_date, current_end_date, is_active,
  is_paused, pause_count, remaining_visits, created_at, updated_at
) VALUES

-- CrossFit Member (should have gym access + 20/80 payment split)
('test-crossfit-1', 'CF001', 'crossfit.member@example.com', 'John CrossFit', '+1234567890',
 'crossfit_only', 12, '2024-01-01', '2024-12-31', '2024-12-31', true,
 false, 0, null, NOW(), NOW()),

-- Gym Only Member (100% gym allocation)
('test-gym-1', 'GYM001', 'gym.member@example.com', 'Jane Gym', '+1234567891',
 'gym_only', 12, '2024-01-01', '2024-12-31', '2024-12-31', true,
 false, 0, null, NOW(), NOW()),

-- Combo Member (50/50 split)
('test-combo-1', 'COMBO001', 'combo.member@example.com', 'Bob Combo', '+1234567892',
 'gym_crossfit', 12, '2024-01-01', '2024-12-31', '2024-12-31', true,
 false, 0, null, NOW(), NOW()),

-- 5-Pass CrossFit Member (limited visits + gym access)
('test-cf5pass-1', 'CF5001', '5pass.crossfit@example.com', 'Alice 5Pass CF', '+1234567893',
 'crossfit_5pass', 1, '2024-01-01', '2024-01-31', '2024-01-31', true,
 false, 0, 3, NOW(), NOW()),

-- 5-Pass Gym Member (limited visits)
('test-gym5pass-1', 'GYM5001', '5pass.member@example.com', 'Charlie 5Pass Gym', '+1234567894',
 'gym_5pass', 1, '2024-01-01', '2024-01-31', '2024-01-31', true,
 false, 0, 5, NOW(), NOW()),

-- Member with no visits remaining (should be denied)
('test-novisits-1', 'NO001', 'novisits.member@example.com', 'Dana No Visits', '+1234567895',
 'gym_5pass', 1, '2024-01-01', '2024-01-31', '2024-01-31', true,
 false, 0, 0, NOW(), NOW()),

-- Inactive member (should be denied)
('test-inactive-1', 'INACTIVE001', 'inactive.member@example.com', 'Eve Inactive', '+1234567896',
 'gym_only', 12, '2024-01-01', '2024-12-31', '2024-12-31', false,
 false, 0, null, NOW(), NOW()),

-- Expired member (should be denied)
('test-expired-1', 'EXP001', 'expired.member@example.com', 'Frank Expired', '+1234567897',
 'gym_only', 12, '2023-01-01', '2023-12-31', '2023-12-31', true,
 false, 0, null, NOW(), NOW()),

-- Paused member (should be denied)
('test-paused-1', 'PAUSE001', 'paused.member@example.com', 'Grace Paused', '+1234567898',
 'crossfit_only', 12, '2024-01-01', '2024-12-31', '2024-12-31', true,
 true, 1, null, NOW(), NOW());

-- Create sample payments to demonstrate revenue distribution
INSERT INTO payment (
  id, member_id, amount, gym_share, crossfit_share, payment_date,
  payment_method, payment_type, service_type
) VALUES

-- CrossFit payments (20% gym, 80% crossfit)
('pay-cf-1', 'test-crossfit-1', 1000.00, 20.00, 80.00, '2024-01-15', 'card', 'membership', 'crossfit'),
('pay-cf-2', 'test-crossfit-1', 1500.00, 20.00, 80.00, '2024-02-15', 'cash', 'membership', 'crossfit'),

-- Gym payments (100% gym)
('pay-gym-1', 'test-gym-1', 800.00, 100.00, 0.00, '2024-01-15', 'card', 'membership', 'gym'),
('pay-gym-2', 'test-gym-1', 900.00, 100.00, 0.00, '2024-02-15', 'card', 'membership', 'gym'),

-- Combo payments (50/50 split)
('pay-combo-1', 'test-combo-1', 1800.00, 50.00, 50.00, '2024-01-15', 'card', 'membership', 'gym'),
('pay-combo-2', 'test-combo-1', 2000.00, 50.00, 50.00, '2024-02-15', 'cash', 'membership', 'crossfit'),

-- 5-Pass payments
('pay-cf5-1', 'test-cf5pass-1', 400.00, 20.00, 80.00, '2024-01-10', 'card', 'membership', 'crossfit'),
('pay-gym5-1', 'test-gym5pass-1', 300.00, 100.00, 0.00, '2024-01-10', 'cash', 'membership', 'gym');

-- Create sample check-ins to demonstrate access control
INSERT INTO check_in (
  id, member_id, facility_type, check_in_time, created_at, updated_at
) VALUES

-- CrossFit member checking into both gym and crossfit (should be allowed)
('checkin-cf-gym-1', 'test-crossfit-1', 'gym', '2024-01-16 08:00:00', NOW(), NOW()),
('checkin-cf-cf-1', 'test-crossfit-1', 'crossfit', '2024-01-17 18:00:00', NOW(), NOW()),
('checkin-cf-gym-2', 'test-crossfit-1', 'gym', '2024-01-18 07:30:00', NOW(), NOW()),

-- Gym member checking into gym only
('checkin-gym-1', 'test-gym-1', 'gym', '2024-01-16 09:00:00', NOW(), NOW()),
('checkin-gym-2', 'test-gym-1', 'gym', '2024-01-17 08:15:00', NOW(), NOW()),

-- Combo member accessing all facilities
('checkin-combo-gym-1', 'test-combo-1', 'gym', '2024-01-16 10:00:00', NOW(), NOW()),
('checkin-combo-cf-1', 'test-combo-1', 'crossfit', '2024-01-17 17:00:00', NOW(), NOW()),
('checkin-combo-fitness-1', 'test-combo-1', 'fitness_class', '2024-01-18 19:00:00', NOW(), NOW()),

-- 5-Pass member check-ins (decreasing remaining visits)
('checkin-cf5-gym-1', 'test-cf5pass-1', 'gym', '2024-01-16 08:30:00', NOW(), NOW()),
('checkin-cf5-cf-1', 'test-cf5pass-1', 'crossfit', '2024-01-17 18:30:00', NOW(), NOW()),

('checkin-gym5-1', 'test-gym5pass-1', 'gym', '2024-01-16 09:30:00', NOW(), NOW()),
('checkin-gym5-2', 'test-gym5pass-1', 'gym', '2024-01-17 08:45:00', NOW(), NOW());

-- Create admin user for testing
INSERT INTO admin_user (
  id, email, name, role, is_active, created_at, updated_at
) VALUES
('admin-test-1', 'admin@gym.com', 'Test Admin', 'owner', true, NOW(), NOW());