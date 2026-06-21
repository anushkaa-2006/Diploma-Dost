// Network mocking helpers for Supabase REST API
// Uses page.route() to intercept calls matching **/rest/v1/<table>**
// Must be called BEFORE page.goto() so the route handler is registered first.

// Supabase project ref — used for localStorage auth key
const SUPABASE_PROJECT_REF = 'aujimkqsmxjaeusspxtp';

export async function mockResourcesSuccess(page) {
  await page.route('**/rest/v1/resources**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Content-Range': '0-2/3' },
      body: JSON.stringify([
        {
          id: 1, subject_name: 'Engineering Mathematics', course_code: 'MA001',
          semester: 1, branch: 'CS', type: 'PYQ', session: 'Winter 2024',
          drive_link: 'https://drive.google.com/file/d/test1',
        },
        {
          id: 2, subject_name: 'Engineering Mathematics', course_code: 'MA001',
          semester: 1, branch: 'CS', type: 'Notes', session: 'Summer 2024',
          drive_link: 'https://drive.google.com/file/d/test2',
        },
        {
          id: 3, subject_name: 'Basic Electronics', course_code: 'BE001',
          semester: 1, branch: 'CS', type: 'Model Answer', session: 'Winter 2024',
          drive_link: 'https://drive.google.com/file/d/test3',
        },
      ]),
    });
  });
}

export async function mockResourcesEmpty(page) {
  await page.route('**/rest/v1/resources**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
}

export async function mockResourcesError(page) {
  await page.route('**/rest/v1/resources**', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ code: 'PGRST301', message: 'Service unavailable' }),
    });
  });
}

export async function mockPlaylistsSuccess(page) {
  await page.route('**/rest/v1/playlists**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1, branch: 'CS', semester: 1, subject: 'Engineering Mathematics',
          channel_name: 'Math Tutorials', playlist_url: 'https://youtube.com/playlist?list=TEST1',
          thumbnail_url: null,
        },
        {
          id: 2, branch: 'CS', semester: 2, subject: 'Basic Electronics',
          channel_name: 'Electronics Hub', playlist_url: 'https://youtube.com/playlist?list=TEST2',
          thumbnail_url: null,
        },
      ]),
    });
  });
}

export async function mockQuestionsSuccess(page) {
  await page.route('**/rest/v1/questions**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'q1', name: 'Rahul Sharma', branch: 'CS', semester: 3,
          question_text: 'What is the best way to study for MSBTE exams?',
          created_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'q2', name: 'Priya Patel', branch: 'IT', semester: 2,
          question_text: 'How to get internship during diploma?',
          created_at: '2024-01-14T09:00:00Z',
        },
      ]),
    });
  });
}

export async function mockCutoffsSuccess(page) {
  await page.route('**/rest/v1/cutoffs**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          college_code: 'CS0001', college_name: 'Government Polytechnic Mumbai',
          district: 'Mumbai', course_name: 'Computer Engineering',
          category: 'GOPEN', cap_round: 'Round II', year: 2025,
          cutoff_open: 450, cutoff_percent: 74.5,
        },
        {
          college_code: 'CS0002', college_name: 'Veermata Jijabai Technological Institute',
          district: 'Mumbai', course_name: 'Computer Engineering',
          category: 'GOPEN', cap_round: 'Round II', year: 2025,
          cutoff_open: 380, cutoff_percent: 72.0,
        },
      ]),
    });
  });
}

export async function mockAuthSession(page) {
  // Inject a fake session into localStorage before page loads.
  // Supabase v2 reads from localStorage first before making network calls.
  await page.addInitScript((projectRef) => {
    const fakeSession = {
      access_token: 'fake-access-token-for-testing',
      refresh_token: 'fake-refresh-token',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'fake-user-id-123',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'test@example.com',
        app_metadata: { provider: 'email' },
        user_metadata: { username: 'testuser' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    };
    localStorage.setItem(
      `sb-${projectRef}-auth-token`,
      JSON.stringify(fakeSession)
    );
  }, SUPABASE_PROJECT_REF);

  // Mock the getUser() network call so Supabase doesn't invalidate the token
  await page.route('**/auth/v1/user**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'fake-user-id-123',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'test@example.com',
        app_metadata: { provider: 'email' },
        user_metadata: { username: 'testuser' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }),
    });
  });
}
