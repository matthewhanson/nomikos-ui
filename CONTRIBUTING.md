# Contributing to Nomikos UI

Thank you for your interest in contributing! This document provides guidelines for development, testing, and submitting contributions.

## Development Setup

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

### Initial Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nomikos-ui.git
   cd nomikos-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the API endpoint:**
   
   Create a `.env.local` file for local development:
   ```bash
   # Option 1: Local API server
   echo "VITE_API_URL=http://localhost:8000" > .env.local
   
   # Option 2: Deployed API
   echo "VITE_API_URL=https://your-api-endpoint.com/prod" > .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at http://localhost:3000

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with hot reload enabled

3. **Test your changes** (see Testing section below)

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` new features
   - `fix:` bug fixes
   - `docs:` documentation changes
   - `style:` code style changes (formatting, etc.)
   - `refactor:` code refactoring
   - `test:` adding or updating tests
   - `chore:` maintenance tasks

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

## Testing

### Manual Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test both modes:**
   - **Chat Mode**: Click example queries, type custom questions, verify responses
   - **Search Mode**: Test search functionality, check result formatting

3. **Test interactions:**
   - Click title to return to landing page
   - Switch between Chat/Search modes
   - Test responsive layout (resize browser window)
   - Test markdown rendering in responses

4. **Test edge cases:**
   - Empty queries
   - API errors (disconnect network)
   - Long responses
   - Special characters in queries

### Production Build Testing

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

Visit http://localhost:4173 to test the production build.

### Cross-browser Testing

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest, if available)
- Mobile browsers (Chrome/Safari on iOS/Android)

## Code Quality

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Use **semicolons** (or consistent no-semicolon style)
- Follow existing code patterns in the project

### React Best Practices

- Use functional components and hooks
- Keep components focused and reusable
- Use meaningful variable and function names
- Add comments for complex logic

### CSS Guidelines

- Use CSS variables for colors and common values
- Follow the existing fantasy theme
- Ensure responsive design (mobile-first approach)
- Test on different screen sizes

## Project Structure

```
nomikos-ui/
├── src/
│   ├── App.jsx              # Main React component
│   ├── App.css              # Component styles
│   ├── exampleQueries.js    # Curated example queries
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── .github/workflows/       # GitHub Actions
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## Adding Features

### Adding Example Queries

Edit `src/exampleQueries.js`:

```javascript
export const CHAT_EXAMPLES = [
  // Add new chat questions here
  "Your new question?",
];

export const SEARCH_EXAMPLES = [
  // Add new search terms here
  "new search term",
];
```

### Modifying Styles

1. **Global styles**: Edit `src/index.css`
2. **Component styles**: Edit `src/App.css`
3. **Theme colors**: Update CSS variables in `src/index.css`:
   ```css
   :root {
     --bg-primary: #0f0c29;
     --accent-gold: #fbbf24;
     --accent-purple: #8b5cf6;
   }
   ```

### API Integration

The API base URL is configured in `src/App.jsx`:

```javascript
const API_BASE = import.meta.env.VITE_API_URL || '/api'
```

Endpoints:
- `/search` - POST with `{query, limit}`
- `/chat` - POST with `{messages, model, temperature, max_tokens}`

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows existing style and conventions
- [ ] All features work in development mode
- [ ] Production build succeeds (`npm run build`)
- [ ] Production build works (`npm run preview`)
- [ ] Tested in multiple browsers
- [ ] No console errors or warnings
- [ ] Commit messages follow Conventional Commits format

### PR Description

Include:
1. **What** - Brief description of changes
2. **Why** - Reason for the changes
3. **How** - Implementation approach
4. **Testing** - How you tested the changes
5. **Screenshots** - For UI changes

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your changes will be deployed automatically via GitHub Actions

## Reporting Issues

### Bug Reports

Include:
1. **Description** - Clear description of the bug
2. **Steps to reproduce** - Exact steps to trigger the bug
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Environment** - Browser, OS, Node version
6. **Screenshots** - If applicable

### Feature Requests

Include:
1. **Description** - What feature you'd like to see
2. **Use case** - Why this feature would be valuable
3. **Alternatives** - Other solutions you've considered
4. **Implementation ideas** - (Optional) How it might work

## Questions?

- Open an issue for questions about contributing
- Check existing issues and PRs for similar questions
- Review the main [README.md](README.md) for usage documentation

## Code of Conduct

Please be respectful and constructive in all interactions. This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
