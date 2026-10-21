# TalentForge

Landing page for TalentForge, an AI-powered recruitment platform. Built with Vite, React, Tailwind CSS v4, React Router and Lucide icons.

## Requirements

Node.js 20.19+ or 22.12+ (https://nodejs.org)

## Run

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint     # lint
```

## Routes

| Route        | Page                                                    |
| ------------ | ------------------------------------------------------- |
| `/`          | Landing page                                            |
| `/login`     | Sign in (`?role=student` or `?role=recruiter`)          |
| `/signup`    | Create account (`?role=student` or `?role=recruiter`)   |
| `/dashboard` | Signed-in welcome page (protected)                      |

## Demo credentials

| Role      | Email                        | Password        |
| --------- | ---------------------------- | --------------- |
| Student   | `student@talentforge.demo`   | `Student@123`   |
| Recruiter | `recruiter@talentforge.demo` | `Recruiter@123` |

Credentials are checked against the role selected in the Student / Recruiter
toggle, so the student account won't sign in on the Recruiter tab. The login
page also has a collapsible "Demo credentials" hint with a "Use these" button.

### Demo auth limitations

Authentication is simulated entirely in the browser (`src/utils/mockAuth.js`) —
it is **not secure** and must be replaced by a real backend (hashed passwords,
server sessions) before production.

- The signed-in user (name, email, role — never the password) is kept in
  `sessionStorage`, so it survives a reload but ends when the tab closes.
- Accounts created on `/signup` live in memory only and disappear on page reload.
  The two demo accounts are always available.

## Structure

```
src/
  components/   Landing: Navbar, HeroSection, TrustIndicators, FeaturesSection,
                FeatureCard, CTASection, Footer
                Auth: BrandingPanel, RoleSelector, FormInput, FormAlert,
                SubmitButton, AuthHeading, AuthSwitchLink, DemoCredentials,
                ProtectedRoute
                Shared: BrandLogo, Button, Container
  pages/        Home, LoginPage, SignupPage, Dashboard, NotFound
  layouts/      MainLayout (landing shell), AuthLayout (split screen + role toggle)
  context/      AuthProvider + authContext
  hooks/        useAuth, useCompleteAuth
  data/         landing.js — feature cards and trust indicators
  utils/        mockAuth.js, validation.js, cn.js
  index.css     Tailwind import + design tokens (colors, font)
```

Font: Inter via Google Fonts, falling back to the system sans-serif.
