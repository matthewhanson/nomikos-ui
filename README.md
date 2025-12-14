# Nomikos UI# Nomikos UI



A fantasy-themed web interface for exploring the Shadow World RPG documentation through AI-powered chat and semantic search.Fantasy-themed chat interface for the Nomikos RPG documentation knowledge base.



[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/nomikos-ui/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/nomikos-ui/actions/workflows/deploy.yml)## Features



## Overview- 🎨 **Fantasy-themed UI** with purple/gold gradients and sword motifs

- 💬 **Chat Mode**: AI-powered Q&A with GPT-4o-mini and RAG context

Nomikos UI provides an elegant, browser-based interface to query and explore canonical Shadow World RPG documentation. It offers two modes of interaction:- 🔍 **Search Mode**: Direct search of the knowledge base with formatted results

- 📱 **Responsive Design**: Works on desktop and mobile

- **💬 Chat Mode**: Ask natural language questions and receive AI-generated answers with source citations- ✨ **Markdown Rendering**: Rich formatting for answers and search results

- **🔍 Search Mode**: Perform semantic search to find relevant passages from the documentation

## Running Locally

## Features

### Against Local API

- **Fantasy-themed design** with purple/gold gradients and library aesthetics

- **Dual interaction modes** (chat and search) with 100+ curated example queries1. Start the Nomikos MCP server locally:

- **Markdown rendering** for rich, formatted responses   ```bash

- **Responsive layout** works on desktop and mobile devices   cd ../nomikos

- **Configurable API backend** (local or deployed)   docker compose up

- **Zero backend required** for static deployment (uses external API)   ```



## Demo2. In a new terminal, start the UI:

   ```bash

Visit the live demo at: `https://YOUR_USERNAME.github.io/nomikos-ui`   npm install

   npm run dev

## Quick Start   ```



### Prerequisites3. Open http://localhost:3000



- Node.js 18 or later### Against Deployed API

- npm 9 or later

1. Create `.env.local` file:

### Installation   ```bash

   echo "NOMIKOS_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod" > .env.local

```bash   ```

# Clone the repository

git clone https://github.com/YOUR_USERNAME/nomikos-ui.git2. Start the UI:

cd nomikos-ui   ```bash

   npm run dev

# Install dependencies   ```

npm install

```3. Open http://localhost:3000



### Running Locally## Configuration



#### Option 1: Using Local API Server- **`NOMIKOS_URL`**: API endpoint

  - Default: `/api` (proxies to `http://localhost:8000`)

1. Start the Nomikos API server (see [nomikos](https://github.com/YOUR_USERNAME/nomikos)):  - Deployed: `https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod`

   ```bash

   # In the nomikos directory## Technology

   docker compose up

   ```- React 18 + Vite

- react-markdown

2. Start the UI development server:- Fantasy theme (purple/gold gradients)

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

The UI will proxy API requests to `http://localhost:8000` by default.

#### Option 2: Using Deployed API

1. Create a `.env.local` file:
   ```bash
   echo "NOMIKOS_URL=https://your-api-endpoint.com/prod" > .env.local
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

## Configuration

Environment variables (create `.env.local` to override):

| Variable | Description | Default |
|----------|-------------|---------|
| `NOMIKOS_URL` | Backend API endpoint URL | `/api` (proxies to localhost:8000) |

### Example Configurations

**Local development:**
```bash
# .env.local
NOMIKOS_URL=http://localhost:8000
```

**Deployed API:**
```bash
# .env.local
NOMIKOS_URL=https://your-lambda-api.amazonaws.com/prod
```

## Building for Production

```bash
# Build the static site
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory, ready for static hosting.

## Deployment

### GitHub Pages

This project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on push to `main`.

1. Enable GitHub Pages in your repository settings (Settings → Pages → Source: GitHub Actions)
2. Push to the `main` branch
3. The site will be available at `https://YOUR_USERNAME.github.io/nomikos-ui`

See [DEPLOYMENT.md](DEPLOYMENT.md) for manual deployment instructions and other hosting options.

## Usage

### Chat Mode

1. Click the **💬 Chat** button
2. Type a question about Shadow World lore, or click an example query
3. Receive an AI-generated answer with relevant context from the documentation

Example questions:
- "What were the major events of the Unlife Wars?"
- "Describe the powers and abilities of the Lords of Essænce"
- "Tell me about dragons and their characteristics"

### Search Mode

1. Click the **🔍 Search** button
2. Enter search terms or click an example query
3. View ranked passages from the documentation with source attribution

Example searches:
- "Lords of Essænce"
- "Wars of Dominion"
- "dragons"

### Navigation

- Click the **📚 Nomikos** title to return to the landing page
- Switch between Chat and Search modes at any time (clears current session)

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Custom CSS with CSS variables (fantasy theme)
- **Markdown**: react-markdown for rich text rendering
- **API**: REST API (configurable endpoint)

## Project Structure

```
nomikos-ui/
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Fantasy-themed styles
│   ├── exampleQueries.js    # 100+ curated example queries
│   ├── index.css            # Global styles and CSS variables
│   └── main.jsx             # Application entry point
├── public/                  # Static assets (if any)
├── dist/                    # Production build output (gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages deployment
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing, and contribution guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related Projects

- [nomikos](https://github.com/YOUR_USERNAME/nomikos) - Backend API server with RPG documentation index
- [athenaeum](https://github.com/YOUR_USERNAME/athenaeum) - Core RAG library and MCP server

## Acknowledgments

- **Shadow World** RPG setting and lore
- Built with React and Vite
- Styled with custom fantasy-themed CSS
