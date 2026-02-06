# Deploying this static site to Koyeb

This repository contains a single-static HTML site.

What I added
- Dockerfile: serves the site with nginx so Koyeb will detect a Docker build.
- .dockerignore: keeps the image small.

Quick deploy steps
1. Commit and push these files to your Git repository root:

```bash
git add Dockerfile .dockerignore README.md
git commit -m "Add Dockerfile for Koyeb static site deployment"
git push
```

2. In Koyeb, create a new application from your repository. Koyeb will detect the `Dockerfile` and build the image.

Notes / alternatives
- For a simpler fix, rename your HTML file to `index.html` at the repo root — then you can use a static host or simpler Dockerfile.
- If you prefer not to use Docker, I can add a `package.json` + tiny Node static server so Koyeb detects Node instead.
