# Zuberia Rais — Psychology Portfolio

A monochrome, editorial-style, responsive academic portfolio built with Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, and Lucide icons.

## Run locally

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

## Deploy from GitHub

Push the source to a GitHub repository and connect it to a Node web service with a persistent disk. GitHub Pages serves static files, while the editor and upload routes require a running Next.js server.

For a Render web service connected to the GitHub repository, use Node 24, the build command npm ci && npm run build, and the start command npm start. Attach a persistent disk at /var/data and set PORTFOLIO_DATA_FILE to /var/data/portfolio.json. Set PORTFOLIO_ADMIN_PASSWORD as a secret in the hosting dashboard. The provider supplies the PORT environment variable.

To bring existing edits and uploads to the hosted site, copy the local portfolio.json and its sibling images directory onto the mounted disk. Keep the .env file and .data directory out of source control.

## Customize

- `components/portfolio.tsx`: profile details, navigation, research concepts, education, skills, internships, certifications, contact links.
- `app/globals.css`: monochrome palette, typography and global styles.
- `app/layout.tsx`: SEO metadata and fonts.

**Important:** All research/project entries are explicitly labeled sample concepts, and no internships or certifications are fabricated. Replace placeholder email, LinkedIn URL, university, graduation date, skills and academic details with verified information before publishing. Contact uses a `mailto:` link and requires no backend.

## Portfolio admin

1. Create .env.local in the project directory and set PORTFOLIO_ADMIN_PASSWORD to a long, unique password of at least 16 characters. Restart the server after changing it.
2. Run npm run dev and open http://localhost:3000/admin. The public portfolio remains available at /.
3. Edit the content, navigation, appearance, or section order. Add text, quote, or image sections under Custom blocks. Upload images in Hero or in an image block. Select Publish changes to update the public site.

Edits are stored in .data/portfolio.json. For deployment, run a single Next.js server instance with HTTPS and a persistent writable disk. Set PORTFOLIO_DATA_FILE to an absolute path on that disk if the project directory is read-only or replaced during deployment. Uploaded images live in the images directory beside the JSON file. Back up the JSON file and its images directory to preserve published changes.
