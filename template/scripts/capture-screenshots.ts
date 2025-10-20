/**
 * Automated Screenshot Capture Script
 *
 * This script uses Playwright to automatically capture screenshots
 * of all key pages in the application.
 *
 * Usage:
 *   pnpm screenshots:capture
 *
 * Prerequisites:
 *   - Development server running (pnpm dev)
 *   - Playwright installed (pnpm add -D @playwright/test)
 *   - Demo environment set up with test data
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = join(process.cwd(), 'docs', 'screenshots');

// Demo credentials (must match your demo user)
const DEMO_USER = {
  email: 'demo@example.com',
  password: 'DemoPass123!',
};

interface Screenshot {
  path: string;
  filename: string;
  url: string;
  waitFor?: string; // CSS selector to wait for
  fullPage?: boolean;
  viewport?: { width: number; height: number };
  action?: (page: any) => Promise<void>; // Custom action before screenshot
}

const screenshots: Screenshot[] = [
  // Setup Wizard Screenshots
  {
    path: 'setup',
    filename: '01-welcome.png',
    url: '/setup',
    waitFor: 'h1',
    fullPage: true,
  },
  {
    path: 'setup',
    filename: '02-environment.png',
    url: '/setup/environment',
    waitFor: 'form',
    fullPage: true,
  },
  {
    path: 'setup',
    filename: '03-database.png',
    url: '/setup/database',
    waitFor: 'button',
    fullPage: true,
  },
  {
    path: 'setup',
    filename: '04-prompts.png',
    url: '/setup/prompts',
    waitFor: 'form',
    fullPage: true,
  },
  {
    path: 'setup',
    filename: '05-stripe.png',
    url: '/setup/stripe',
    waitFor: 'button',
    fullPage: true,
  },
  {
    path: 'setup',
    filename: '06-finalize.png',
    url: '/setup/finalize',
    waitFor: 'h1',
    fullPage: true,
  },

  // Auth Screenshots (must be captured before login)
  {
    path: 'auth',
    filename: 'sign-in.png',
    url: '/auth/sign-in',
    waitFor: 'form',
    fullPage: false,
  },
  {
    path: 'auth',
    filename: 'sign-up.png',
    url: '/auth/sign-up',
    waitFor: 'form',
    fullPage: false,
  },
  {
    path: 'auth',
    filename: 'forgot-password.png',
    url: '/auth/forgot-password',
    waitFor: 'form',
    fullPage: false,
  },

  // Dashboard Screenshots (require authentication)
  {
    path: 'dashboard',
    filename: 'dashboard-overview.png',
    url: '/dashboard',
    waitFor: 'h1',
    fullPage: true,
  },
  {
    path: 'dashboard',
    filename: 'chat-interface.png',
    url: '/dashboard/chat',
    waitFor: 'canvas', // Wait for 3D Orb to load
    fullPage: true,
    action: async (page) => {
      // Wait for Orb animation to load
      await page.waitForTimeout(2000);
    },
  },
  {
    path: 'dashboard',
    filename: 'account-settings.png',
    url: '/dashboard/account',
    waitFor: 'h1',
    fullPage: true,
  },
  {
    path: 'dashboard',
    filename: 'mobile-dashboard.png',
    url: '/dashboard',
    waitFor: 'h1',
    fullPage: true,
    viewport: { width: 390, height: 844 }, // iPhone 12 Pro
  },
  {
    path: 'dashboard',
    filename: 'dark-mode.png',
    url: '/dashboard',
    waitFor: 'h1',
    fullPage: true,
    action: async (page) => {
      // Toggle dark mode
      await page.click('button[aria-label="Toggle theme"]');
      await page.waitForTimeout(500);
    },
  },

  // Landing Page Screenshots
  {
    path: 'landing',
    filename: 'homepage-hero.png',
    url: '/',
    waitFor: 'h1',
    fullPage: false,
  },
  {
    path: 'landing',
    filename: 'homepage-full.png',
    url: '/',
    waitFor: 'h1',
    fullPage: true,
  },
];

async function ensureDirectories() {
  const dirs = ['setup', 'auth', 'dashboard', 'landing'];
  for (const dir of dirs) {
    await mkdir(join(SCREENSHOTS_DIR, dir), { recursive: true });
  }
}

async function login(page: any) {
  console.log('Logging in as demo user...');

  await page.goto(`${BASE_URL}/auth/sign-in`);
  await page.waitForSelector('form');

  await page.fill('input[name="email"]', DEMO_USER.email);
  await page.fill('input[name="password"]', DEMO_USER.password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard');
  console.log('Login successful!');
}

async function captureScreenshot(page: any, screenshot: Screenshot) {
  console.log(`Capturing: ${screenshot.path}/${screenshot.filename}`);

  try {
    // Set viewport if specified
    if (screenshot.viewport) {
      await page.setViewportSize(screenshot.viewport);
    } else {
      // Default desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
    }

    // Navigate to page
    await page.goto(`${BASE_URL}${screenshot.url}`, {
      waitUntil: 'networkidle',
    });

    // Wait for specific element if specified
    if (screenshot.waitFor) {
      await page.waitForSelector(screenshot.waitFor);
    }

    // Wait a bit for animations and lazy loading
    await page.waitForTimeout(1000);

    // Execute custom action if specified
    if (screenshot.action) {
      await screenshot.action(page);
    }

    // Capture screenshot
    const screenshotPath = join(
      SCREENSHOTS_DIR,
      screenshot.path,
      screenshot.filename
    );

    await page.screenshot({
      path: screenshotPath,
      fullPage: screenshot.fullPage,
    });

    console.log(`✓ Saved: ${screenshot.path}/${screenshot.filename}`);
  } catch (error) {
    console.error(`✗ Failed to capture ${screenshot.filename}:`, error);
  }
}

async function main() {
  console.log('Starting screenshot capture...\n');

  // Ensure directories exist
  await ensureDirectories();

  // Launch browser
  const browser = await chromium.launch({
    headless: true, // Set to false to see the browser
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Separate screenshots into auth and non-auth
  const authScreenshots = screenshots.filter((s) => s.path === 'auth');
  const setupScreenshots = screenshots.filter((s) => s.path === 'setup');
  const landingScreenshots = screenshots.filter((s) => s.path === 'landing');
  const dashboardScreenshots = screenshots.filter((s) => s.path === 'dashboard');

  // Capture auth pages first (before login)
  console.log('\n📸 Capturing authentication pages...');
  for (const screenshot of authScreenshots) {
    await captureScreenshot(page, screenshot);
  }

  // Capture landing pages (no auth needed)
  console.log('\n📸 Capturing landing pages...');
  for (const screenshot of landingScreenshots) {
    await captureScreenshot(page, screenshot);
  }

  // Capture setup pages (development only)
  console.log('\n📸 Capturing setup wizard pages...');
  for (const screenshot of setupScreenshots) {
    await captureScreenshot(page, screenshot);
  }

  // Login for dashboard screenshots
  await login(page);

  // Capture dashboard pages (after login)
  console.log('\n📸 Capturing dashboard pages...');
  for (const screenshot of dashboardScreenshots) {
    await captureScreenshot(page, screenshot);
  }

  // Close browser
  await browser.close();

  console.log('\n✅ Screenshot capture complete!');
  console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review screenshots in docs/screenshots/');
  console.log('2. Optimize with TinyPNG (https://tinypng.com/)');
  console.log('3. Update README.md with screenshot references');
}

// Run script
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
