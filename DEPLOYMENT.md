# Deployment Guide

This guide covers multiple deployment options for Nomikos UI.

## GitHub Pages (Recommended)

### Automatic Deployment

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

**Setup:**

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Configure base path in vite.config.js:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/nomikos-ui/', // Replace with your repository name
   })
   ```

3. **Push to main branch:**
   ```bash
   git add .
   git commit -m "chore: configure for GitHub Pages"
   git push origin main
   ```

4. **Access your site:**
   - The workflow will automatically build and deploy
   - Your site will be available at: `https://YOUR_USERNAME.github.io/nomikos-ui/`
   - Check the Actions tab for deployment status

### Manual GitHub Pages Deployment

If you prefer manual control:

```bash
# Install gh-pages package
npm install -D gh-pages

# Add deploy script to package.json
npm pkg set scripts.deploy="gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

## Custom Domain (GitHub Pages)

1. **Add CNAME file to public/ directory:**
   ```bash
   echo "your-domain.com" > public/CNAME
   ```

2. **Configure DNS:**
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`
   - Or A records pointing to GitHub Pages IPs

3. **Enable HTTPS in repository settings**

## Netlify

### Automatic Deployment

1. **Connect to GitHub:**
   - Log in to Netlify
   - Click "New site from Git"
   - Select your repository

2. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (leave empty)

3. **Add environment variables:**
   - Go to Site settings → Environment variables
   - Add `NOMIKOS_URL` with your API endpoint

4. **Deploy:**
   - Netlify will automatically deploy on push to main
   - Your site will be available at a netlify.app subdomain

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## Vercel

### Automatic Deployment

1. **Import project:**
   - Log in to Vercel
   - Click "New Project"
   - Import your GitHub repository

2. **Configure:**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Add environment variables:**
   - Add `NOMIKOS_URL` in project settings

4. **Deploy:**
   - Vercel will automatically deploy on push

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Build the project
npm run build

# Deploy
vercel --prod
```

## AWS S3 + CloudFront

### Setup

1. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://nomikos-ui
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://nomikos-ui --delete
   ```

4. **Configure bucket for static hosting:**
   ```bash
   aws s3 website s3://nomikos-ui --index-document index.html
   ```

5. **Set up CloudFront distribution** (optional but recommended for HTTPS)

6. **Update environment variables:**
   - Rebuild with production API URL:
   ```bash
   NOMIKOS_URL=https://your-api.com npm run build
   ```

## Docker

### Build Docker Image

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NOMIKOS_URL
ENV NOMIKOS_URL=$NOMIKOS_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

### Build and Run

```bash
# Build image
docker build --build-arg NOMIKOS_URL=https://your-api.com -t nomikos-ui .

# Run container
docker run -p 8080:80 nomikos-ui
```

## Environment Variables

All deployment methods require configuring the API endpoint:

| Variable | Description | Example |
|----------|-------------|---------|
| `NOMIKOS_URL` | Backend API base URL | `https://api.example.com/prod` |

**Setting environment variables:**

- **GitHub Pages:** Set in `.env.production` or hardcode in `vite.config.js`
- **Netlify/Vercel:** Set in web UI under Environment Variables
- **AWS:** Build with variable set before upload
- **Docker:** Pass as build argument

## Post-Deployment Checklist

After deploying, verify:

- [ ] Site loads without errors
- [ ] Chat mode works (connects to API)
- [ ] Search mode works (returns results)
- [ ] Example queries are clickable
- [ ] Mode switching works
- [ ] Title click returns to landing page
- [ ] Markdown renders correctly in responses
- [ ] No CORS errors in browser console
- [ ] Responsive design works on mobile
- [ ] Favicon loads (if configured)

## Troubleshooting

### Blank page after deployment

**Cause:** Incorrect base path in Vite config

**Solution:** Set `base` in `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
})
```

### API CORS errors

**Cause:** API doesn't allow your deployment domain

**Solution:** Configure CORS on backend to allow your domain

### 404 on page refresh

**Cause:** Server doesn't redirect all routes to index.html

**Solution:**
- **GitHub Pages:** Add `404.html` copying `index.html`
- **Nginx:** Configure `try_files` (see Docker section)
- **Netlify/Vercel:** Automatic (no action needed)

### Environment variables not working

**Cause:** Vite requires rebuild for env variable changes

**Solution:** Rebuild project after changing environment variables:
```bash
npm run build
```

## Continuous Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) provides:

- ✅ Automatic deployment on push to main
- ✅ Node.js environment setup
- ✅ Dependency caching for faster builds
- ✅ Build verification
- ✅ GitHub Pages deployment

**Workflow triggers:**
- Push to `main` branch
- Manual workflow dispatch (Actions tab)

## Monitoring

After deployment, monitor:

- **GitHub Actions:** Check workflow runs in Actions tab
- **Browser console:** Check for errors
- **Network tab:** Verify API calls succeed
- **Performance:** Use Lighthouse for optimization suggestions

## Rollback

If you need to rollback a deployment:

**GitHub Pages:**
```bash
git revert HEAD
git push origin main
```

**Netlify/Vercel:**
- Use web UI to rollback to previous deployment

**S3:**
```bash
# Re-deploy previous build
aws s3 sync old-dist/ s3://nomikos-ui --delete
```

## Security Considerations

- **API Keys:** Never commit API keys to the repository
- **Environment Variables:** Use `.env.local` for local development
- **HTTPS:** Always use HTTPS in production (automatic with GitHub Pages, Netlify, Vercel)
- **CORS:** Configure backend to only allow your domain (not `*` in production)

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/YOUR_USERNAME/nomikos-ui/issues)
- Review [GitHub Actions logs](https://github.com/YOUR_USERNAME/nomikos-ui/actions)
- See main [README.md](README.md) for project documentation
