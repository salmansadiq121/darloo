# Static Build Guide

This guide explains how to create a static build of the Next.js application.

## Quick Start

To create a static export, run:

```bash
npm run build:static
# or
npm run build:export
```

This will generate a static site in the `out/` directory that can be deployed to any static hosting service.

## Build Scripts

- `npm run build` - Standard Next.js build (with server-side features)
- `npm run build:static` - Static export build (generates static HTML/CSS/JS)
- `npm run build:export` - Alias for `build:static`

## Important Notes

### ⚠️ Limitations of Static Export

1. **API Routes**: API routes (`src/pages/api/*`) will NOT work with static export. These need a Node.js server.
   - If you have API routes, you'll need to host them separately or use serverless functions.

2. **Dynamic Routes**: All routes must be pre-rendered at build time.
   - Use `generateStaticParams()` for dynamic routes in the App Router.
   - Use `getStaticPaths()` for dynamic routes in the Pages Router.

3. **Server-Side Features**: These features won't work:
   - `getServerSideProps()` (Pages Router)
   - Server Components with server-only APIs
   - Middleware
   - Image Optimization (already disabled with `unoptimized: true`)

4. **Environment Variables**: 
   - Only `NEXT_PUBLIC_*` variables are embedded in the client bundle
   - Server-side environment variables won't be available

### ✅ What Works

- All client-side rendering
- Static pages
- Client Components
- Static Generation with `generateStaticParams()` or `getStaticPaths()`
- Client-side API calls to external services
- Images (with `unoptimized: true`)

## Deployment

The static build generates files in the `out/` directory. You can deploy this to:

- **Netlify**: Drag and drop the `out/` folder
- **Vercel**: Use static export option in project settings
- **GitHub Pages**: Push the `out/` folder to `gh-pages` branch
- **AWS S3 + CloudFront**: Upload `out/` folder to S3 bucket
- **Any static hosting service**: Upload the `out/` folder contents

## Custom Configuration

The static export is controlled by the `NEXT_EXPORT` environment variable in `next.config.mjs`:

```javascript
output: process.env.NEXT_EXPORT === 'true' ? 'export' : undefined
```

To enable it permanently, you can set it to `'export'` directly, but using the environment variable allows you to switch between static and server builds easily.

