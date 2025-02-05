import { test, expect } from '@playwright/test';

test.describe('End-to-End Tests', () => {
  test('User Registration and Login', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });

  test('Geolocation Verification', async ({ page }) => {
    await page.goto('http://localhost:3000/location-setup');
    await page.click('button:has-text("Update Current Location")');
    await expect(page).toHaveText('Location verified successfully');
  });

  test('Creating a Neighborhood', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.fill('input[name="name"]', 'Test Neighborhood');
    await page.fill('textarea[name="description"]', 'A test neighborhood');
    await page.click('button:has-text("Create Neighborhood")');
    await expect(page).toHaveText('Neighborhood created successfully');
  });

  test('Creating an Event', async ({ page }) => {
    await page.goto('http://localhost:3000/events');
    await page.fill('input[name="title"]', 'Test Event');
    await page.fill('textarea[name="description"]', 'A test event');
    await page.click('button:has-text("Create Event")');
    await expect(page).toHaveText('Event created successfully');
  });

  test('Sending a Message', async ({ page }) => {
    await page.goto('http://localhost:3000/messages');
    await page.fill('textarea[name="message"]', 'Hello, this is a test message');
    await page.click('button:has-text("Send")');
    await expect(page).toHaveText('Message sent successfully');
  });
});
