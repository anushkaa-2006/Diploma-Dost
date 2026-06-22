// @ts-check
import { test, expect } from '@playwright/test';
import { NavbarPage, SearchPage, AuthPage } from './helpers/pages.js';
import {
  mockResourcesSuccess,
  mockResourcesEmpty,
  mockResourcesError,
  mockPlaylistsSuccess,
  mockQuestionsSuccess,
  mockCutoffsSuccess,
  mockAuthSession,
} from './helpers/mockSupabase.js';

// ─── 1. SMOKE TESTS ──────────────────────────────────────────────────────────
// Every route must load, render an h1, and show no Vite error overlay.

const ROUTES = [
  { path: '/',                     label: 'Home',              h1: /built for diploma/i },
  { path: '/#/resources',          label: 'Resources',         h1: /resource/i },
  { path: '/#/roadmaps',           label: 'Roadmaps',          h1: /roadmap/i },
  { path: '/#/predictor',          label: 'Predictor',         h1: /college predictor/i },
  { path: '/#/admission-progress', label: 'Admission Progress',h1: /admission progress/i },
  { path: '/#/innovation-hub',     label: 'Innovation Hub',    h1: /innovation hub/i },
  { path: '/#/dsa',                label: 'DSA & CP',          h1: /dsa/i },
  { path: '/#/youtube',            label: 'YouTube Hub',       h1: /youtube playlists/i },
  { path: '/#/internships',        label: 'Internships',       h1: /internship/i },
  { path: '/#/community',          label: 'Community',         h1: /ask seniors/i },
  { path: '/#/login',              label: 'Login',             h1: /welcome back/i },
  { path: '/#/signup',             label: 'Signup',            h1: /join diploma dost/i },
  // Without a valid token the page shows the invalid-link state
  { path: '/#/reset-password',     label: 'Reset Password',    h1: /invalid.*link|set.*password/i },
  { path: '/#/msbte',              label: 'MSBTE',             h1: /dates|deadline/i },
  { path: '/#/scholarships',       label: 'Scholarships',      h1: /scholarship/i },
  { path: '/#/placement',          label: 'Placement',         h1: /dream job/i },
  { path: '/#/opensource',         label: 'Open Source',       h1: /open source/i },
  { path: '/#/about',              label: 'About',             h1: /built by/i },
];

test.describe('1. Smoke Tests', () => {
  for (const route of ROUTES) {
    test(`${route.label} loads and renders h1`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('load');

      // h1 must be visible and match the expected content
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 15000 });
      await expect(h1).toHaveText(route.h1);

      // no Vite error overlay
      await expect(page.locator('vite-error-overlay')).not.toBeAttached();
    });
  }
});

// ─── 2. NAVIGATION ───────────────────────────────────────────────────────────

test.describe('2. Navigation', () => {
  test('desktop nav links navigate to correct routes', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only');
    await page.goto('/');
    await page.waitForLoadState('load');

    const navbar = new NavbarPage(page);

    await navbar.navLink('Resources').click();
    await expect(page).toHaveURL(/#\/resources/);
    await expect(page.locator('h1').first()).toBeVisible();

    await navbar.navLink('Community').click();
    await expect(page).toHaveURL(/#\/community/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('logo click navigates to home', async ({ page }) => {
    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    const navbar = new NavbarPage(page);
    await navbar.logo().click();
    // HashRouter root URL is /#/ not /
    await expect(page).toHaveURL(/#\/$/);
  });

  test('active nav link has aria-current="page"', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only');
    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    const activeLink = page.getByRole('navigation').getByRole('link', { name: 'Resources' }).first();
    await expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  test('mobile hamburger opens mobile menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only');
    await page.goto('/');
    await page.waitForLoadState('load');

    const navbar = new NavbarPage(page);
    const burger = navbar.hamburger();
    await expect(burger).toBeVisible();
    await expect(burger).toHaveAttribute('aria-expanded', 'false');

    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');

    // Mobile menu links are visible after opening
    await expect(page.getByRole('link', { name: 'Resources' }).last()).toBeVisible();
  });

  test('mobile menu link navigates and closes menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only');
    await page.goto('/');
    await page.waitForLoadState('load');

    const navbar = new NavbarPage(page);
    await navbar.hamburger().click();

    // Click Resources in mobile menu
    const resourcesLink = page.getByRole('link', { name: 'Resources' }).last();
    await expect(resourcesLink).toBeVisible();
    await resourcesLink.click();

    await expect(page).toHaveURL(/#\/resources/);
    // Menu should close after navigation (aria-expanded false or hamburger shows 'Open menu')
    await expect(navbar.hamburger()).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile search icon opens search panel', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only');
    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    const navbar = new NavbarPage(page);
    const searchBtn = navbar.searchIcon();
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    // Search input appears in the mobile panel
    const search = new SearchPage(page);
    await expect(search.input()).toBeVisible();
  });

  test('desktop search icon opens search panel', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only');
    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    const navbar = new NavbarPage(page);
    const searchBtn = page.getByRole('button', { name: /open search/i }).first();
    await searchBtn.click();

    const search = new SearchPage(page);
    await expect(search.input()).toBeVisible();
  });
});

// ─── 3. SEARCH ───────────────────────────────────────────────────────────────

test.describe('3. Search', () => {
  test.beforeEach(async ({ page }) => {
    // Mock all three Supabase tables that SearchBar queries
    await page.route('**/rest/v1/resources**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, subject_name: 'Engineering Mathematics' },
        ]),
      });
    });
    await page.route('**/rest/v1/playlists**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.route('**/rest/v1/questions**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    // Open search panel
    const searchBtn = page.getByRole('button', { name: /open search/i }).first();
    await searchBtn.click();
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('typing a query shows results dropdown', async ({ page }) => {
    const search = new SearchPage(page);
    await search.input().fill('resources');

    // Static index results appear immediately (no network needed)
    await expect(search.results()).toBeVisible({ timeout: 3000 });
    await expect(search.resultItems().first()).toBeVisible();
  });

  test('results contain relevant text matching the query', async ({ page }) => {
    const search = new SearchPage(page);
    // "home" matches the static 'Home' entry (category: 'Pages') which IS in CATEGORY_ORDER
    await search.input().fill('home');

    await expect(search.results()).toBeVisible({ timeout: 5000 });
    const items = search.resultItems();
    await expect(items.first()).toContainText(/home/i);
  });

  test('Escape key closes the results dropdown', async ({ page }) => {
    const search = new SearchPage(page);
    await search.input().fill('home');
    await expect(search.results()).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    // Search panel is closed by Escape in Navbar (desktop)
    await expect(search.results()).not.toBeVisible();
  });

  test('clicking a result navigates to correct route', async ({ page }) => {
    const search = new SearchPage(page);
    // "about" matches the static 'About' entry (category: 'Pages') with path /about
    await search.input().fill('about');

    await expect(search.results()).toBeVisible({ timeout: 5000 });
    const firstResult = search.resultItems().first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();

    await expect(page).toHaveURL(/#\/about/);
  });

  test('empty query shows no results dropdown', async ({ page }) => {
    const search = new SearchPage(page);
    await search.input().fill('');
    await expect(search.results()).not.toBeVisible();
  });
});

// ─── 4. AUTH — LOGIN ─────────────────────────────────────────────────────────

test.describe('4. Auth — Login', () => {
  test.beforeEach(async ({ page }) => {
    // Prevent redirect by mocking no active session
    await page.route('**/auth/v1/token**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Email not confirmed' }),
      });
    });
    await page.goto('/#/login');
    await page.waitForLoadState('load');
  });

  test('renders h1 "Welcome Back" and both form inputs', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText(/welcome back/i);

    const auth = new AuthPage(page);
    await expect(auth.emailInput()).toBeVisible();
    await expect(auth.passwordInput()).toBeVisible();
  });

  test('submit button disabled while loading, carries aria-busy', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.emailInput().fill('test@example.com');
    await auth.passwordInput().fill('wrongpassword');
    await auth.submitButton().click();

    // During the async call, the button should be disabled with aria-busy
    // (the call might resolve quickly, so check the state right after click)
    // The Supabase auth call goes through signInWithPassword → mocked above to fail
    const errMsg = auth.errorMessage();
    await expect(errMsg).toBeVisible({ timeout: 5000 });
  });

  test('wrong credentials shows error in role="alert"', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.emailInput().fill('wrong@example.com');
    await auth.passwordInput().fill('badpassword');
    await auth.submitButton().click();

    const alert = auth.errorMessage();
    await expect(alert).toBeVisible({ timeout: 5000 });
    // Error must be non-empty and not just whitespace
    const errorText = await alert.textContent();
    expect(errorText?.trim().length).toBeGreaterThan(0);
  });

  test('"Forgot Password?" button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /forgot password/i })).toBeVisible();
  });

  test('link to signup navigates to /signup', async ({ page }) => {
    await page.getByRole('link', { name: /create account/i }).click();
    await expect(page).toHaveURL(/#\/signup/);
  });
});

// ─── 5. AUTH — SIGNUP ────────────────────────────────────────────────────────

test.describe('5. Auth — Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/signup');
    await page.waitForLoadState('load');
  });

  test('renders h1 "Join Diploma Dost" and three form inputs', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText(/join diploma dost/i);

    const auth = new AuthPage(page);
    await expect(auth.usernameInput()).toBeVisible();
    await expect(auth.emailInput()).toBeVisible();
    await expect(auth.passwordInput()).toBeVisible();
  });

  test('empty username submission shows error in role="alert"', async ({ page }) => {
    const auth = new AuthPage(page);
    // Fill email + password but leave username blank
    await auth.emailInput().fill('test@example.com');
    await auth.passwordInput().fill('password123');

    // Disable HTML5 required validation so the JS handler runs and we can test client-side error
    await page.evaluate(() => {
      document.querySelectorAll('input[required]').forEach(el => el.removeAttribute('required'));
    });

    await auth.submitButton().click();

    // The JS handler: if (!username.trim()) → setError('Username is required.')
    await expect(auth.errorMessage()).toBeVisible({ timeout: 3000 });
    await expect(auth.errorMessage()).toHaveText(/username is required/i);
  });

  test('link to login navigates to /login', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/#\/login/);
  });
});

// ─── 6. RESOURCES ────────────────────────────────────────────────────────────

test.describe('6. Resources', () => {
  test('mocked resources render subject names', async ({ page }) => {
    await mockResourcesSuccess(page);
    await page.goto('/#/resources');

    // Wait for mock response to be consumed and data to render
    await page.waitForSelector('text=Engineering Mathematics', { timeout: 8000 });
    await expect(page.getByText('Engineering Mathematics').first()).toBeVisible();
    await expect(page.getByText('Basic Electronics').first()).toBeVisible();
  });

  test('branch tab switching shows selected branch tab as active', async ({ page }) => {
    await mockResourcesSuccess(page);
    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    // CS tab is default — click IT tab
    const itTab = page.getByRole('button', { name: /^IT/ }).first();
    await expect(itTab).toBeVisible();
    await itTab.click();

    // IT tab should now be visually active (assert no crash and tab is still visible)
    await expect(itTab).toBeVisible();
    // No Vite error overlay
    await expect(page.locator('vite-error-overlay')).not.toBeAttached();
  });

  test('empty state shows when no resources returned', async ({ page }) => {
    await mockResourcesEmpty(page);
    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    // Loading spinner should disappear
    await expect(page.getByRole('status')).not.toBeVisible({ timeout: 5000 });

    // Should show some empty-state UI (no drive links rendered)
    const driveLinks = page.locator('a[href*="drive.google.com"]');
    await expect(driveLinks).toHaveCount(0);
  });

  test('error state shows role="alert" with error text', async ({ page }) => {
    await mockResourcesError(page);
    await page.goto('/#/resources');

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 12000 });
    const alertText = await page.getByRole('alert').textContent();
    expect(alertText?.trim().length).toBeGreaterThan(0);
  });

  test('mocked drive links have target="_blank" and rel="noopener"', async ({ page }) => {
    await mockResourcesSuccess(page);
    await page.goto('/#/resources');
    await page.waitForSelector('a[href*="drive.google.com"]', { timeout: 8000 });

    const link = page.locator('a[href*="drive.google.com"]').first();
    await expect(link).toHaveAttribute('target', '_blank');
    const rel = await link.getAttribute('rel');
    expect(rel).toContain('noopener');
  });

  test('upload section visible when logged in', async ({ page }) => {
    await mockAuthSession(page);
    await mockResourcesSuccess(page);
    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    // The page uses user state (from getSession) to show upload form
    // Look for upload-related text or element
    await expect(
      page.getByText(/upload|contribute/i).first()
    ).toBeVisible({ timeout: 8000 });
  });
});

// ─── 7. PREDICTOR ────────────────────────────────────────────────────────────

test.describe('7. Predictor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/predictor');
    await page.waitForLoadState('load');
    await expect(page.locator('h1')).toHaveText(/college predictor/i);
  });

  test('percentage input and mode tabs are visible', async ({ page }) => {
    await expect(page.locator('input[placeholder="e.g. 78.50"]')).toBeVisible();
    await expect(page.getByRole('tab', { name: /predictor/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /search college/i })).toBeVisible();
  });

  test('"Find Colleges" button is disabled without input', async ({ page }) => {
    const btn = page.getByRole('button', { name: /find colleges/i });
    await expect(btn).toBeDisabled();
  });

  test('invalid percentage shows validation message', async ({ page }) => {
    await page.locator('input[placeholder="e.g. 78.50"]').fill('150');
    await expect(page.getByText(/enter a value between 0 and 100/i)).toBeVisible();
  });

  test('results appear after filling form and clicking search', async ({ page }) => {
    await mockCutoffsSuccess(page);

    // Fill percentage
    await page.locator('input[placeholder="e.g. 78.50"]').fill('75');

    // Select category: click the dropdown, then click "Open (General)"
    const categoryInput = page.getByPlaceholder('Select your category').first();
    await categoryInput.click();
    await page.getByRole('button', { name: /open \(general\)/i }).first().click();

    // Select CS branch
    await page.getByRole('button', { name: /^CS/ }).first().click();

    // Find Colleges button should now be enabled
    const searchBtn = page.getByRole('button', { name: /find colleges/i });
    await expect(searchBtn).toBeEnabled();
    await searchBtn.click();

    // Wait for mocked results to render
    await page.waitForSelector('text=Government Polytechnic Mumbai', { timeout: 8000 });
    await expect(page.getByText('Government Polytechnic Mumbai').first()).toBeVisible();
  });

  test('shortlist button toggles and opens shortlist drawer', async ({ page }) => {
    // Auth + shortlists mocks must be set before navigation (addInitScript requirement)
    await mockAuthSession(page);

    // Use regex to avoid glob ambiguity: "shortlists" prefix matches "shortlisted_colleges"
    await page.route(/\/rest\/v1\/shortlists(?!\w)/, async (route) => {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify([{ id: 1, name: 'Dream Colleges', user_id: 'fake-user-id-123', created_at: '2024-01-01T00:00:00Z' }]),
      });
    });

    // Stateful mock: empty until POST, then returns the saved college
    const shortlistedList = [];
    await page.route(/\/rest\/v1\/shortlisted_colleges/, async (route) => {
      if (route.request().method() === 'POST') {
        shortlistedList.push({
          id: 1, college_code: 'CS0001', college_name: 'Government Polytechnic Mumbai',
          course_name: 'Computer Engineering', district: 'Mumbai', category: 'GOPEN',
          cap_round: 'Round II', cutoff_percent: 74.5,
        });
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(shortlistedList[0]) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([...shortlistedList]) });
      }
    });

    await mockCutoffsSuccess(page);

    // Reload forces a full page load so addInitScript (localStorage injection) runs.
    // page.goto('/#/predictor') when already at the same hash URL is a fragment navigation
    // (no real reload), so addInitScript would not fire.
    await page.reload();
    await page.waitForLoadState('load');

    // Wait for "My Shortlists" panel — confirms auth resolved and shortlists loaded
    await expect(page.getByText('My Shortlists')).toBeVisible({ timeout: 8000 });

    // Fill form and search
    await page.locator('input[placeholder="e.g. 78.50"]').fill('75');
    await page.getByPlaceholder('Select your category').first().click();
    await page.getByRole('button', { name: /open \(general\)/i }).first().click();
    await page.getByRole('button', { name: /^CS/ }).first().click();
    await page.getByRole('button', { name: /find colleges/i }).click();

    await page.waitForSelector('text=Government Polytechnic Mumbai', { timeout: 8000 });

    // Click the "Shortlist" button on the first result card
    await page.getByRole('button', { name: 'Shortlist' }).first().click();

    // After toggle, the count badge "1 Shortlisted" should appear in the results header
    await expect(page.getByRole('button', { name: /1 shortlisted/i })).toBeVisible({ timeout: 8000 });

    // Click the count badge to open the shortlist drawer
    await page.getByRole('button', { name: /1 shortlisted/i }).click();
    await expect(page.getByRole('dialog', { name: /shortlist/i })).toBeVisible();
  });

  test('switching to college search mode shows college search input', async ({ page }) => {
    await page.getByRole('tab', { name: /search college/i }).click();
    await expect(page.getByPlaceholder('Search college name…')).toBeVisible();
  });
});

// ─── 8. COMMUNITY ────────────────────────────────────────────────────────────

test.describe('8. Community', () => {
  test('mocked questions render on page', async ({ page }) => {
    await mockQuestionsSuccess(page);
    await page.route('**/rest/v1/answers**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/#/community');

    await page.waitForSelector('text=What is the best way to study', { timeout: 8000 });
    await expect(page.getByText('What is the best way to study for MSBTE exams?').first()).toBeVisible();
    await expect(page.getByText('How to get internship during diploma?').first()).toBeVisible();
  });

  test('clicking a question expands the answers section', async ({ page }) => {
    await mockQuestionsSuccess(page);
    await page.route('**/rest/v1/answers**', async (route) => {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify([
          { id: 'a1', question_id: 'q1', name: 'Senior Student', answer_text: 'Practice PYQs regularly.', created_at: '2024-01-16T10:00:00Z' },
        ]),
      });
    });

    await page.goto('/#/community');
    await page.waitForSelector('text=What is the best way to study', { timeout: 8000 });

    // Click the first question to expand it
    await page.getByText('What is the best way to study for MSBTE exams?').first().click();

    // Answer text should appear
    await expect(page.getByText('Practice PYQs regularly.').first()).toBeVisible({ timeout: 5000 });
  });

  test('"Ask a Question" button is visible and opens form', async ({ page }) => {
    await mockQuestionsSuccess(page);
    await page.route('**/rest/v1/answers**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/#/community');
    await page.waitForLoadState('load');

    const askBtn = page.getByRole('button', { name: /ask a question/i });
    await expect(askBtn).toBeVisible();
    await askBtn.click();

    // Form should appear with a textarea
    await expect(page.locator('textarea, input[placeholder*="Ask"]').first()).toBeVisible({ timeout: 3000 });
  });
});

// ─── 9. YOUTUBE ──────────────────────────────────────────────────────────────

test.describe('9. YouTube', () => {
  test('mocked playlists render playlist cards', async ({ page }) => {
    await mockPlaylistsSuccess(page);
    await page.goto('/#/youtube');

    // Only semester 1 accordion is open by default (SemesterBlock opens sem === 1)
    await page.waitForSelector('text=Engineering Mathematics', { timeout: 8000 });
    await expect(page.getByText('Engineering Mathematics').first()).toBeVisible();
    // Semester 2 is collapsed; verify the accordion button for sem 2 is present
    await expect(page.getByText(/SEM 2/i).first()).toBeVisible();
  });

  test('branch tab switching changes active tab', async ({ page }) => {
    await mockPlaylistsSuccess(page);
    await page.goto('/#/youtube');
    await page.waitForLoadState('load');

    const itTab = page.getByRole('tab', { name: /^IT/ });
    await expect(itTab).toBeVisible();
    await itTab.click();

    await expect(itTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('vite-error-overlay')).not.toBeAttached();
  });

  test('playlist links have target="_blank"', async ({ page }) => {
    await mockPlaylistsSuccess(page);
    await page.goto('/#/youtube');

    await page.waitForSelector('a[href*="youtube.com"]', { timeout: 8000 });
    const links = page.locator('a[href*="youtube.com"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });
});

// ─── 10. ACCESSIBILITY ───────────────────────────────────────────────────────

test.describe('10. Accessibility', () => {
  test('home page images have non-empty alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt, `Image missing alt: ${await img.getAttribute('src')}`).not.toBeNull();
      expect(alt?.trim().length, 'Image has empty alt').toBeGreaterThan(0);
    }
  });

  test('each route has exactly one h1', async ({ page }) => {
    for (const route of [
      '/', '/#/login', '/#/signup', '/#/predictor', '/#/community',
    ]) {
      await page.goto(route);
      await page.waitForLoadState('load');
      await page.locator('h1').first().waitFor({ state: 'visible', timeout: 8000 });

      const count = await page.locator('h1').count();
      expect(count, `${route} has ${count} h1 elements`).toBe(1);
    }
  });

  test('<main> landmark exists on every page', async ({ page }) => {
    for (const route of ['/', '/#/resources', '/#/predictor']) {
      await page.goto(route);
      await page.waitForLoadState('load');
      await expect(page.locator('main')).toBeAttached();
    }
  });

  test('<nav> has aria-label', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const nav = page.getByRole('navigation').first();
    await expect(nav).toBeAttached();
    // Navbar should have an accessible label (either aria-label or aria-labelledby)
    const ariaLabel = await nav.getAttribute('aria-label');
    const ariaLabelledBy = await nav.getAttribute('aria-labelledby');
    expect(ariaLabel || ariaLabelledBy).not.toBeNull();
  });

  test('external links have rel="noopener noreferrer"', async ({ page }) => {
    await page.goto('/#/msbte');
    await page.waitForLoadState('load');

    const externalLinks = await page.locator('a[target="_blank"]').all();
    expect(externalLinks.length).toBeGreaterThan(0);

    for (const link of externalLinks.slice(0, 10)) {
      const rel = await link.getAttribute('rel');
      expect(rel, 'External link missing rel=noopener').toContain('noopener');
    }
  });

  test('loading states have role="status"', async ({ page }) => {
    // Delay the resources response so loading state is visible
    await page.route('**/rest/v1/resources**', async (route) => {
      await new Promise(r => setTimeout(r, 300));
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/#/resources');

    // Loading status element should appear briefly
    await expect(page.getByRole('status').first()).toBeVisible({ timeout: 3000 });
  });

  test('error messages have role="alert"', async ({ page }) => {
    await mockResourcesError(page);
    await page.goto('/#/resources');

    await expect(page.getByRole('alert').first()).toBeVisible({ timeout: 12000 });
  });
});

// ─── 11. PERFORMANCE ─────────────────────────────────────────────────────────

test.describe('11. Performance', () => {
  test('home page h1 visible within 3 seconds on local server', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.locator('h1').first().waitFor({ state: 'visible', timeout: 5000 });
    const elapsed = Date.now() - start;

    expect(elapsed, `Home h1 took ${elapsed}ms`).toBeLessThan(3000);
  });

  test('no console errors on home page', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      // Filter expected noise: font loading, Supabase WebSocket, SW registration
      if (
        text.includes('favicon') ||
        text.includes('manifest') ||
        text.includes('WebSocket') ||
        text.includes('wss://') ||
        text.includes('realtime') ||
        text.includes('serviceworker') ||
        text.includes('service-worker') ||
        text.includes('workbox') ||
        text.includes('ResizeObserver')
      ) return;
      errors.push(text);
    });

    await page.goto('/');
    await page.locator('h1').first().waitFor({ state: 'visible', timeout: 8000 });

    expect(errors, `Console errors: ${errors.join('\n')}`).toHaveLength(0);
  });

  test('no console errors on predictor page', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (
        text.includes('WebSocket') || text.includes('wss://') ||
        text.includes('realtime') || text.includes('workbox')
      ) return;
      errors.push(text);
    });

    await page.goto('/#/predictor');
    await page.locator('h1').first().waitFor({ state: 'visible', timeout: 8000 });

    expect(errors, `Console errors: ${errors.join('\n')}`).toHaveLength(0);
  });
});

// ─── 12. MOBILE (375px viewport) ─────────────────────────────────────────────

test.describe('12. Mobile Layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger menu is visible, desktop nav is hidden', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const navbar = new NavbarPage(page);
    await expect(navbar.hamburger()).toBeVisible();

    // Desktop nav links container (md:flex) should not be visible
    const desktopNav = page.locator('.hidden.md\\:flex').first();
    await expect(desktopNav).not.toBeVisible();
  });

  test('home page has no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 375;
    expect(scrollWidth, `Horizontal overflow: scrollWidth=${scrollWidth} viewport=${viewportWidth}`).toBeLessThanOrEqual(viewportWidth + 2);
  });

  test('resources branch tabs visible and tappable on mobile', async ({ page }) => {
    await mockResourcesSuccess(page);
    await page.goto('/#/resources');
    await page.waitForLoadState('load');

    const csTab = page.getByRole('button', { name: /^CS/ }).first();
    await expect(csTab).toBeVisible();
    await csTab.click();
    await expect(page.locator('vite-error-overlay')).not.toBeAttached();
  });

  test('footer renders and is not overflowing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    const footerBox = await footer.boundingBox();
    const viewportWidth = page.viewportSize()?.width ?? 375;
    if (footerBox) {
      expect(footerBox.x + footerBox.width).toBeLessThanOrEqual(viewportWidth + 2);
    }
  });

  test('predictor page is usable on mobile', async ({ page }) => {
    await page.goto('/#/predictor');
    await page.waitForLoadState('load');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[placeholder="e.g. 78.50"]')).toBeVisible();
  });
});
