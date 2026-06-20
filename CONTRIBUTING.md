<div align="center">

# Contributing to Diploma Dost

**Thank you for being here.** This platform exists to help diploma students who have no senior to ask, no organised resources, and no clear path forward. Every contribution — code, content, or a single typo fix — makes it better for thousands of students.

[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-4d9ef0?style=flat-square)](https://github.com/piush365/Diploma-Dost/pulls)
[![Good First Issues](https://img.shields.io/github/issues/piush365/Diploma-Dost/good%20first%20issue?style=flat-square&color=c8f04d&label=Good%20First%20Issues)](https://github.com/piush365/Diploma-Dost/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
[![Open Issues](https://img.shields.io/github/issues/piush365/Diploma-Dost?style=flat-square&color=e8453c)](https://github.com/piush365/Diploma-Dost/issues)

</div>

---

## Before You Start

1. **Read the [README](README.md)** to understand the project — what it is, who it's for, and how it's structured.
2. **Browse [open issues](https://github.com/piush365/Diploma-Dost/issues)** — find something unassigned that interests you.
3. **Comment on the issue** to say you're working on it. This prevents two people duplicating effort.
4. **Wait for assignment** before you start writing code.

> Don't open a PR for something that isn't tracked in an issue. If you have a new idea, open the issue first and discuss scope.

---

## What You Can Contribute

You don't have to write code to contribute. Here's everything we need:

| Type | Examples | Skill needed |
|---|---|---|
| 🖥️ **Frontend** | New page, bug fix, mobile layout improvements | React, Tailwind CSS |
| ⚙️ **Backend** | Supabase tables, RLS policies, queries | SQL, Supabase |
| 📝 **Content** | PYQ links, YouTube playlists, guide text | None — just accuracy |
| 🗺️ **Roadmap data** | Add / improve nodes in `src/data/roadmaps.js` | JSON editing |
| 🐛 **Bug reports** | Found something broken? Open an issue | None |
| 🎨 **Design** | Better UI, spacing, typography, accessibility | Eye for detail |
| 🐍 **Scripts** | Data cleaning for college predictor CSVs | Python |
| 📖 **Docs** | Improve README, CONTRIBUTING, code comments | Writing |

---

## Workflow

### 1. Fork & clone

```bash
# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/Diploma-Dost.git
cd Diploma-Dost

# Add the upstream remote so you can pull future changes
git remote add upstream https://github.com/piush365/Diploma-Dost.git
```

### 2. Create a branch

**Never commit directly to `main`.** Always branch off it.

```bash
git checkout main
git pull upstream main          # stay in sync first
git checkout -b type/short-description
```

**Branch naming format:** `type/short-description`

| Prefix | Use for |
|---|---|
| `feature/` | New page or feature |
| `fix/` | Bug fix |
| `content/` | Content changes — no logic |
| `style/` | CSS / UI only — no logic |
| `docs/` | Documentation only |

Examples:
```
feature/dsa-tracker-page
fix/navbar-mobile-close
content/sem4-youtube-playlists
style/resources-card-spacing
docs/update-setup-steps
```

### 3. Make your changes

Keep changes focused. One PR should do one thing.

```bash
# Check the build passes before you commit anything
npm run build
```

### 4. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type: short description in present tense
```

| Prefix | When |
|---|---|
| `feat:` | Adding something new |
| `fix:` | Fixing a bug |
| `content:` | Adding or editing content |
| `style:` | CSS / UI tweaks |
| `docs:` | Documentation |
| `refactor:` | Code cleanup, no behaviour change |
| `chore:` | Config, tooling, deps |

```bash
# Good
git commit -m "feat: add DSA topic progress tracker"
git commit -m "fix: mobile menu not closing on route change"
git commit -m "content: add Sem 4 Mech YouTube playlists"

# Bad
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "changes"
```

### 5. Push & open a PR

```bash
git push origin your-branch-name
```

Then open a Pull Request on GitHub targeting `piush365/Diploma-Dost → main`. The PR template will pre-fill — complete every item in the checklist honestly.

---

## Code Conventions

These aren't suggestions. PRs that violate them will be asked to fix before merge.

### React

- **Functional components only** — no class components
- **One component per file** — no multi-export files
- Pages → `src/pages/` · Reusable components → `src/components/`
- New routes must be registered in `src/App.jsx`
- Remove all `console.log` before raising a PR

### Styling

- **CSS variables only** — never write a hex value in a component

  ```jsx
  // ✅ Correct
  className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"

  // ❌ Wrong
  className="bg-[#141414] border border-[#2a2a2a] text-[#f0ede6]"
  ```

- **Error / destructive** states → `var(--accent)` (`#e8453c`)
- **Success** states → `var(--accent-lime)` (`#c8f04d`) via `style={{ color: 'var(--accent-lime)' }}`
- Use `btn-primary` / `btn-ghost` for buttons, `.glass` for cards
- **Mobile-first always** — design at 375px, then scale up

### Design system reference

```css
--bg:           #0d0e0f    /* Page background     */
--surface:      #141414    /* Cards, panels       */
--surface2:     #1a1a1a    /* Nested surfaces     */
--border:       #2a2a2a    /* All borders         */
--text:         #f0ede6    /* Primary text        */
--text-muted:   #888888    /* Secondary text      */
--accent:       #e8453c    /* Red — primary/error */
--accent-lime:  #c8f04d    /* Lime — success      */
--accent-blue:  #4d9ef0    /* Blue — info         */
```

---

## Content Contributions (No Code Required)

If you're adding YouTube playlists, PYQ links, roadmap nodes, or guide text — you don't need to be a developer.

**Roadmap nodes** — edit `src/data/roadmaps.js`. Each node looks like this:

```js
{
  id: "unique-id",
  label: "Topic Name",
  phase: "Foundation",       // Foundation | Intermediate | Advanced
  type: "core",              // core | optional
  time: "3–5 days",
  description: "What this topic is and why it matters.",
  why: "Why developers need to know this.",
  resources: [
    { type: "yt",  label: "Video title", url: "https://youtube.com/..." },
    { type: "doc", label: "Docs title",  url: "https://..." },
  ],
}
```

**Resources / PYQs** — upload directly via the Resources page on the live site (login required). No code needed.

**If you're unsure where content goes**, open an issue and ask.

---

## Pull Request Checklist

The PR template will guide you, but here's what reviewers look for:

- [ ] Branch is **not** `main`
- [ ] `npm run build` passes with zero errors or warnings
- [ ] No hardcoded hex values — CSS variables used throughout
- [ ] No off-palette Tailwind colours (`red-500`, `green-400`, etc.)
- [ ] Tested on a small screen (375px)
- [ ] New routes added to `App.jsx`
- [ ] No `console.log` left in the code
- [ ] PR description clearly explains what changed and why

---

## Reporting Bugs

Open an issue with:

1. **What you expected** to happen
2. **What actually happened** — include screenshots if it's visual
3. **Steps to reproduce** — exact steps, not "it just broke"
4. **Device / browser** — especially for layout bugs

---

## Code of Conduct

This is a project by students, for students. Everyone here is learning at different speeds.

- Be helpful in reviews, not harsh — suggest the fix, don't just flag the problem
- Answer "basic" questions properly — you were there once too
- Credit people for their work
- No gatekeeping — a content contribution is as valid as a code contribution

Persistent bad behaviour gets you removed from the project. No warnings.

---

## Need Help?

- **Stuck on the codebase?** Drop a comment on your issue — we'll respond
- **Have an idea that's not an issue yet?** [Open a Discussion](https://github.com/piush365/Diploma-Dost/discussions) or raise it as an issue
- **Found a security problem?** Do **not** open a public issue — contact [@piush365](https://github.com/piush365) directly

---

<div align="center">

*This started as one person's ITR project. It can become something every diploma student in Maharashtra relies on — but only if people like you help build it.*

**Welcome to the team.**

</div>
