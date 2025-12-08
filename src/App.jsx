import { useState, useRef, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'
import { CHAT_EXAMPLES, SEARCH_EXAMPLES, getRandomExamples } from './exampleQueries'

const API_BASE = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : '/api'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('chat') // 'chat' or 'search'
  const messagesEndRef = useRef(null)

  // Get random examples based on mode (regenerate when mode changes or messages cleared)
  const currentExamples = useMemo(() => {
    const source = mode === 'chat' ? CHAT_EXAMPLES : SEARCH_EXAMPLES;
    return getRandomExamples(source, 4);
  }, [mode, messages.length === 0]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleExampleClick = (query) => {
    setInput(query)
    // Trigger submit after a brief delay to show the input
    setTimeout(() => {
      const submitEvent = new Event('submit', { cancelable: true, bubbles: true })
      document.querySelector('.input-form')?.dispatchEvent(submitEvent)
    }, 50)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      if (mode === 'search') {
        await handleSearch(currentInput)
      } else {
        await handleChat(currentInput)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error: ' + error.message,
        error: true
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    const response = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit: 10 })  // Increased for more comprehensive RAG context
    })

    if (!response.ok) throw new Error('Search failed: ' + response.status)

    const data = await response.json()
    const results = data.data || []
    
    if (results.length === 0) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'No results found.',
        results: []
      }])
      return
    }

    // Format search results as markdown
    let content = `Found ${results.length} relevant passages:\n\n`
    results.forEach((result, i) => {
      content += `### Result ${i + 1}\n\n${result.content}\n\n`
      if (result.metadata?.path) {
        content += `*Source: ${result.metadata.path}*`
        if (result.metadata?.score) {
          content += ` (score: ${result.metadata.score.toFixed(2)})`
        }
        content += '\n\n---\n\n'
      }
    })
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content,
      results
    }])
  }

  const handleChat = async (query) => {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: query }],
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 2048  // Increased for longer, more detailed responses
      })
    })

    if (!response.ok) throw new Error('Chat failed: ' + response.status)

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'No answer found.'
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: answer
    }])
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-logo">
            <img src="/images/nomikos-library.png" alt="Nomikos Library" className="library-image" />
          </div>
          <div className="header-text">
            <h1 onClick={() => setMessages([])} style={{ cursor: 'pointer' }}>Nomikos</h1>
            <p className="subtitle">You stand within the greatest library on Kulthea.</p>
          </div>
        </div>
        
        <div className="mode-selector">
          <button 
            className={mode === 'chat' ? 'active' : ''}
            onClick={() => {
              setMode('chat');
              setInput('');
              setMessages([]);
            }}
            title="AI-powered chat with context"
          >
            💬 Chat
          </button>
          <button 
            className={mode === 'search' ? 'active' : ''}
            onClick={() => {
              setMode('search');
              setInput('');
              setMessages([]);
            }}
            title="Search the archive"
          >
            🔍 Search
          </button>
        </div>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <div className="welcome-icon">📜</div>
              <h2>Welcome to the Halls of Nomikos.</h2>
              <p className="welcome-desc">
                {mode === 'chat' 
                  ? 'Ask — and the scribes will consult their records, offering what lore they may, with notes from the canon itself.'
                  : 'Search the canonical documentation to find relevant passages and sources.'}
              </p>
              <div className="examples">
                <p className="examples-title">Try these examples:</p>
                <ul>
                  {currentExamples.map((query, idx) => (
                    <li key={idx} onClick={() => handleExampleClick(query)}>
                      {mode === 'chat' ? `"${query}"` : `"${query}"`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role} ${msg.error ? 'error' : ''}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '❓' : '📖'}
              </div>
              <div className="message-bubble">
                <div className="message-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant loading">
              <div className="message-avatar">📖</div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'chat' 
              ? "Ask a question about The Shadow World" 
              : "Search the archive..."}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {mode === 'chat' ? '💬' : '🔍'} Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
