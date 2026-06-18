## Goal
Finish the Bluewave Academy rebrand: fix invisible/low-contrast text site-wide, ship a dark/light toggle in nav + dashboards, send branded result emails on quiz/exam completion, finish the Mbuya Zivai AI assistant rebrand, and audit the digital exam flow end-to-end.

## 1. Theme toggle (dark / light / system)
- Add a reusable `ThemeToggle` component (sun/moon/system, dropdown) wired to the existing `ThemeProvider`.
- Mount it in:
  - `Navbar` (desktop + mobile sheet)
  - `StudentDashboard` header bar
  - `AdminPortal` / admin dashboard header
- Persist choice via the existing provider; default `system`.

## 2. Site-wide invisible-text sweep
Audit and fix:
- Hard-coded `text-white`, `text-black`, `text-gray-*` on backgrounds that flip in dark mode → replace with semantic tokens (`text-foreground`, `text-muted-foreground`, `text-primary-foreground`).
- Cards/buttons with `bg-white` + light text, or `bg-primary` + uncontrasted text.
- `MotionToggle` (currently fixed `text-white` on translucent black) → switch to semantic tokens or hide on light bg.
- Hero/CTA/badge gradients that lose text in light mode.
- Run a `rg` sweep across `src/**` for `text-white|bg-white|text-black|text-gray-` and patch each hit to a token. Verify against both themes in preview.

## 3. Quiz + exam completion emails (no SMS)
- Create one branded React Email template `quiz-result` in `supabase/functions/_shared/transactional-email-templates/` (Bluewave Academy header, score, category, study tip CTA).
- Extend the existing `send-exam-grade-email` template / create `exam-result` template to match the same Bluewave Academy brand (logo color block, Mbuya Zivai sign-off, link back to dashboard).
- On quiz finish in `QuizComponent` → call `supabase.functions.invoke('send-transactional-email', { templateName: 'quiz-result', recipientEmail, templateData })` with idempotency key `quiz-${userId}-${quizId}-${attemptTs}`.
- Skip silently for anonymous/guest quiz users (no profile email).
- Exam completion: ensure `grade-exam` (or post-grade trigger) fires `exam-result` email once results are released.

## 4. Email rebrand
- Replace any remaining "CS Experts" / Groq / placeholder copy in:
  - `send-exam-grade-email`
  - `send-contact-email`
  - `send-payment-reminders`
  - `exam-reminder-emails`
  - any auth email templates if scaffolded
- Unified header: Bluewave Academy logo block (inline SVG/PNG), primary color `#`-token equivalent of `--primary`, Mbuya Zivai friendly sign-off, footer "Bluewave Academy · Powered by Bluewave Technologies".
- Subject lines normalized: `[Bluewave Academy] …`.

## 5. Mbuya Zivai AI assistant — finish rebrand & fixes
- Tighten the system prompt in `enhanced-ai` edge function: identity = "Mbuya Zivai, AI tutor for Bluewave Academy", warm Zimbabwean-grandmother tone, A Level CS focus, never mentions Groq/OpenAI/Gemini, encourages guests to sign up only when helpful.
- Replace remaining `Bot`/`Sparkles` brand marks in chat surfaces with `<BluewaveLogo />` where still lingering (verify `ChatHeader`, empty state, floating button, promo cards).
- Fix typing-indicator + greeting copy to say "Mbuya Zivai · Bluewave Academy".
- Confirm image upload + guest session works end-to-end (already wired); add user-facing error toast for 429/402 from the gateway.
- Update `MbuyaZivaiPromo` / `MbuyaZivaiEnhanced` copy + CTAs to match.

## 6. Digital exam audit
- Walk through student flow: list → start → answer (MCQ / short / coding / image upload) → submit → grading → results → email.
- Fix anything broken or off-brand found during the walk, specifically checking:
  - Exam list visibility logic (class enrollment + payment status).
  - Timer, auto-submit on `end_time`, tab-prevention toasts use semantic tokens.
  - `grade-exam` uses Lovable AI (`google/gemini-3-flash-preview` for text, `google/gemini-2.5-pro` for vision) and respects min-mark policy.
  - Result page shows correct vs student answers with semantic success/destructive tokens (no raw green/red hexes).
  - PDF report still branded Bluewave Academy.
  - Email fires once on result release, idempotent.

## Technical details
- Theme toggle uses `next-themes`-style API already in `ThemeProvider`; component is a `DropdownMenu` with Sun/Moon/Monitor icons.
- All emails go through existing `send-transactional-email` infra (Resend connector already configured); add templates + register in `registry.ts`, then deploy `send-transactional-email`.
- New template file: `supabase/functions/_shared/transactional-email-templates/quiz-result.tsx` and `exam-result.tsx`.
- Edge functions to redeploy: `send-transactional-email`, `enhanced-ai`, `grade-exam`.
- No schema changes expected; quiz emails read `profiles.email` for the signed-in user.
- Verification: load `/`, `/student-dashboard`, `/admin-portal-secret`, `/exams` in both light + dark; submit a quiz as a logged-in student; submit a short exam; check inbox + Edge Function logs.

## Out of scope
- Marketing/bulk emails.
- SMS / WhatsApp result notifications (explicitly skipped).
- New exam features beyond bug/brand fixes uncovered in the audit.
