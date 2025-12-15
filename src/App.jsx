import { useState, useRef, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'
import { CHAT_EXAMPLES, ANSWER_EXAMPLES, SEARCH_EXAMPLES, getRandomExamples } from './exampleQueries'

// Helper to construct public asset URLs with proper base path
const publicUrl = (path) => {
  const base = import.meta.env.BASE_URL || '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return base + cleanPath
}

const API_BASE = (import.meta.env.VITE_NOMIKOS_URL 
  ? import.meta.env.VITE_NOMIKOS_URL 
  : '/api').replace(/\/$/, '')  // Remove trailing slash to prevent double slashes

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('chat') // 'chat', 'answer', or 'search'
  const [expandedMetrics, setExpandedMetrics] = useState(null) // Track which message's metrics are expanded
  const messagesEndRef = useRef(null)

  // Get random examples based on mode (regenerate when mode changes or messages cleared)
  const currentExamples = useMemo(() => {
    const source = mode === 'chat' ? CHAT_EXAMPLES 
                 : mode === 'answer' ? ANSWER_EXAMPLES
                 : SEARCH_EXAMPLES;
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
      } else if (mode === 'answer') {
        await handleAnswer(currentInput)
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

  const handleAnswer = async (query) => {
    // Answer mode: single request, no conversation history
    const response = await fetch(`${API_BASE}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: query }],  // Only current query, no history
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 2048
      })
    })

    if (!response.ok) throw new Error('Answer failed: ' + response.status)

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'No answer found.'
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: answer
    }])
  }

  const handleChat = async (query) => {
    // Build full conversation history for the API
    // Include all previous messages to maintain context
    const conversationHistory = messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    
    // Add the current user message
    conversationHistory.push({ role: 'user', content: query })
    
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: conversationHistory,  // Send full conversation history
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 2048  // Increased for longer, more detailed responses
      })
    })

    if (!response.ok) throw new Error('Chat failed: ' + response.status)

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'No answer found.'
    const toolCallsMade = data.tool_calls_made || 0
    const toolCalls = data.tool_calls || []  // Capture actual tool call details
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: answer,
      toolCallsMade,  // Track how many searches the LLM made
      toolCalls  // Store the actual search queries and details
    }])
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-logo">
            <img src={publicUrl('/images/nomikos-library.png')} alt="Nomikos Library" className="library-image" />
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
            title="Interactive chat with multi-search - remembers conversation"
          >
            💬 Chat
          </button>
          <button 
            className={mode === 'answer' ? 'active' : ''}
            onClick={() => {
              setMode('answer');
              setInput('');
              setMessages([]);
            }}
            title="Quick single-search answer - no memory"
          >
            � Answer
          </button>
          <button 
            className={mode === 'search' ? 'active' : ''}
            onClick={() => {
              setMode('search');
              setInput('');
              setMessages([]);
            }}
            title="Raw search results - no AI processing"
          >
            � Search
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
                  ? 'Ask — and the scribes will consult their records multiple times, offering comprehensive lore with context from the canon itself.'
                  : mode === 'answer'
                  ? 'Ask — and receive a direct answer drawn from a single search of the archives.'
                  : 'Search the canonical documentation to find relevant passages and sources.'}
              </p>
              <div className="examples">
                <p className="examples-title">Try these examples:</p>
                <ul>
                  {currentExamples.map((query, idx) => (
                    <li key={idx} onClick={() => handleExampleClick(query)}>
                      "{query}"
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
                {msg.toolCallsMade > 0 && (
                  <div className="tool-calls-container">
                    <div 
                      className="tool-calls-badge"
                      onClick={() => setExpandedMetrics(expandedMetrics === idx ? null : idx)}
                      title="Click for search details"
                    >
                      🔍 Searched {msg.toolCallsMade} time{msg.toolCallsMade > 1 ? 's' : ''}
                      <span className="expand-arrow">{expandedMetrics === idx ? ' ▼' : ' ▶'}</span>
                    </div>
                    {expandedMetrics === idx && msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div className="tool-calls-details">
                        <div className="details-header">Search Queries Used:</div>
                        {msg.toolCalls.map((call, callIdx) => (
                          <div key={callIdx} className="tool-call-item">
                            <div className="tool-call-number">#{callIdx + 1}</div>
                            <div className="tool-call-query">
                              {call.function?.arguments ? 
                                (() => {
                                  try {
                                    const args = JSON.parse(call.function.arguments);
                                    return args.query || call.function.name;
                                  } catch {
                                    return call.function.name;
                                  }
                                })()
                                : call.function?.name || 'Search'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
            placeholder={
              mode === 'chat' ? "Ask a question about The Shadow World" 
              : mode === 'answer' ? "Ask a quick question..."
              : "Search the archive..."
            }
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {mode === 'chat' ? '💬' : mode === 'answer' ? '📝' : '🔍'} Send
          </button>
        </form>
        
        {messages.length > 0 && (
          <div className="clear-container">
            <button 
              className="clear-button"
              onClick={() => setMessages([])}
              title="Clear all messages and start fresh"
            >
              🗑️ Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
