# Deployment Notes (Vercel)

1. SPA Rewrites: `vercel.json` rewrites all routes to `/` so Angular handles routing.
2. Assets: `angular.json` now includes `src/assets` + `public` + favicon.
3. Removed jQuery/Popper (Bootstrap 5 bundle only) to reduce bundle size.
4. Hero redesigned with in-component navbar; root navbar hidden on home to prevent duplication.
5. To build locally: `npm ci` then `npm run build` (output: `dist/d2-d-front`).
6. Recommended next optimizations:
   - Add lazy loaded routes for admin, driver, customer, technician dashboards.
   - Compress large images in `public/assets`.
   - Consider extracting shared large CSS into global styles.
