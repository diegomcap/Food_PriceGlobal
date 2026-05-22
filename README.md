# FoodPrice Global

`FoodPriceGlobal` is a Next.js 16 application for food-price monitoring, market analysis, and regional landing pages for Brazil, Global, LATAM, and Military divisions.

## Local Verification

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Important routes:

- `/`
- `/login`
- `/brasil`
- `/brasil/dashboard`
- `/global`
- `/global/dashboard`
- `/latam`
- `/latam/dashboard`
- `/military`
- `/military/dashboard`
- `/market-analysis/calendar`
- `/market-analysis/correlations`
- `/market-analysis/indicators`
- `/market-analysis/reports`

Run the production validation build before deploying:

```bash
npm run build
```

The current repository passes `npm run build`.

## Staging Deployment

Recommended target: Vercel.

### Vercel Setup

1. Import the GitHub repository into Vercel.
2. Set the project root to `.`.
3. Let Vercel detect the framework as `Next.js`.
4. Use the default install command or set `npm ci`.
5. Use `npm run build` as the build command.
6. Use the default output settings for a standard Next.js app.
7. Create a staging project or a staging branch deployment, such as `staging`.

### Environment Variables

No required runtime environment variables were identified during the verified local build.

If you add secrets later:

1. Store them in Vercel Project Settings.
2. Scope them to `Preview` for staging first.
3. Promote them to `Production` only after validation.

### Suggested Staging Flow

1. Push the current repository state to GitHub.
2. Create or update a staging branch.
3. Let Vercel generate a Preview deployment for that branch.
4. Smoke-test the key routes listed above.
5. Validate static assets, especially videos under `public/videos/`.
6. Promote the same commit to production only after staging approval.

### Post-Deploy Checks

Verify the following in staging:

- Landing pages load without translation errors.
- Division dashboards render correctly.
- Market analysis pages pre-render successfully.
- Static video assets load with acceptable performance.
- Browser console stays free of obvious runtime errors.

## Notes

- The app depends on repository-level translation files in `translations/`.
- A local-only warning may appear if Next.js detects multiple lockfiles outside this repo. This did not block the production build.
- `public/videos/farm-harvest.mp4` is large enough to merit monitoring for bandwidth and repository growth.
