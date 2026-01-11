# Nomikos UI

*Fantasy-themed chat and search interface for the Nomikos RPG knowledge base - now with comprehensive debugging for RAG development.*

A React + Vite web application providing an elegant interface for AI-powered search and chat over RPG campaign documentation.

## Features

- 🎨 **Fantasy theme** - Purple/gold gradients with sword motifs and library aesthetics
- 💬 **Chat mode** - Interactive Q&A with multi-search capability (LLM autonomously searches as needed)
- 🔮 **Ask Andraax mode** - Alternative persona with different system prompt
- 📖 **Answer mode** - Simple RAG with single search for quick factual questions
- 🔍 **Search mode** - Direct semantic search of the knowledge base
- ✨ **Markdown rendering** - Rich formatting for responses
- 📱 **Responsive design** - Works on desktop and mobile
- 🎲 **Example queries** - 100+ curated questions to explore the knowledge base

### 🐛 Development & Debugging Features

Each chat response includes expandable debugging information:

- **Search count badge** - Shows how many tool calls the LLM made
- **Search details** - For each tool call shows:
  - Query text used by the LLM
  - Tool type: `📅 Timeline` or `📚 Knowledge Base`
  - Whether `🔗 Hybrid` search was used (BM25 + Vector)
  - Parameters: `limit`, `start_year`, `end_year`
- **Token usage** - Prompt, completion, and total tokens
- **Debug data** (collapsible) - Complete request payload and response JSON

This makes it easy to:
- See exactly what searches the LLM is performing
- Verify hybrid search is being used when appropriate
- Check if timeline searches are triggered for year-based queries
- Debug retrieval issues by inspecting full request/response cycles
- Monitor token usage and optimize prompts

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

The UI will proxy API requests to `http://localhost:8000` by default (requires local API server running).

## Configuration

Create a `.env.local` file to configure the API endpoint:

**Local development (with local API server):**
```bash
VITE_NOMIKOS_URL=http://localhost:8000
```

**Using deployed API:**
```bash
VITE_NOMIKOS_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
```

**Note:** Vite requires the `VITE_` prefix for environment variables to be accessible in client code.

## API Endpoints Used

The UI calls these endpoints on the configured API base URL:

- `POST /search` - Semantic search with `{query, limit}`
- `POST /answer` - Simple RAG with `{messages, model, temperature, max_tokens}`
- `POST /chat` - Interactive chat with tool calling (multi-search)
- `GET /models` - List available models

## Development

### Running Locally

**Option 1: With local API server**

```bash
# Terminal 1: Start the API server
cd ../nomikos
docker compose up

# Terminal 2: Start the UI
npm run dev
```

**Option 2: With deployed API**

```bash
# Create .env.local with deployed API URL
echo "VITE_NOMIKOS_URL=https://your-api-url.com" > .env.local

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build

```bash
npm run build
npm run preview
```

## Deployment

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on push to main branch.

### Setup GitHub Pages

1. Go to repository Settings → Pages
2. Set source to "GitHub Actions"
3. Add repository secret `NOMIKOS_URL` with your API endpoint
4. Push to main branch to trigger deployment

The deployed site will be available at: `https://YOUR_USERNAME.github.io/nomikos-ui/`

## Project Structure

```
nomikos-ui/
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Styles and theme
│   ├── exampleQueries.js    # Curated example questions
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── .github/workflows/       # GitHub Actions deployment
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **react-markdown** - Markdown rendering
- **CSS custom properties** - Theme variables

## Mode Comparison

| Mode | Best For | Searches | Speed | Cost |
|------|----------|----------|-------|------|
| **Search** | Exploring index, debugging | 1 (no LLM) | Fastest | Lowest |
| **Answer** | Simple factual questions | 1 | Fast | Low |
| **Chat** | Complex questions, multi-turn | 1-5 (autonomous) | Variable | Higher |

## License

MIT
