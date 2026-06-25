// Page Object Models for Diploma Dost

export class NavbarPage {
  constructor(page) {
    this.page = page;
  }

  hamburger() {
    // aria-label toggles between "Open menu" and "Close menu" — match either state
    return this.page.getByRole('button', { name: /menu$/i });
  }

  searchIcon() {
    return this.page.getByRole('button', { name: 'Open search' });
  }

  // label must match exact navLinks text: 'Resources', 'Roadmaps', 'CAP Updates', etc.
  // Scoped to 'Main navigation' to exclude footer <nav> elements.
  navLink(label) {
    return this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: label });
  }

  logo() {
    // The logo Link wraps the img alt="Diploma Dost"
    return this.page.getByRole('link', { name: /diploma dost/i }).first();
  }

  logoutButton() {
    return this.page.getByRole('button', { name: /logout/i });
  }
}

export class SearchPage {
  constructor(page) {
    this.page = page;
  }

  input() {
    return this.page.getByPlaceholder(/search/i);
  }

  results() {
    return this.page.getByRole('listbox');
  }

  resultItems() {
    return this.page.getByRole('option');
  }
}

export class AuthPage {
  constructor(page) {
    this.page = page;
  }

  emailInput() {
    return this.page.locator('#email');
  }

  passwordInput() {
    return this.page.locator('#password');
  }

  usernameInput() {
    return this.page.locator('#username');
  }

  // Sign In / Sign up button
  submitButton() {
    return this.page.getByRole('button', { name: /sign in|sign up/i });
  }

  errorMessage() {
    return this.page.getByRole('alert');
  }

  successMessage() {
    return this.page.getByRole('status');
  }
}
