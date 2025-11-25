import { useState, useEffect } from 'react'
import DecisionInput from './components/DecisionInput'
import FlagDisplay from './components/FlagDisplay'
import ApiKeyInput from './components/ApiKeyInput'
import { analyzeScenario } from './utils/analyzer'

function App() {
  const [flags, setFlags] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '')

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey)
    }
  }, [apiKey])

  const handleAnalyze = async (text) => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeScenario(text, apiKey)
      setFlags(result)
    } catch (error) {
      console.error("Analysis failed", error)
      alert(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const checkConnection = async () => {
    if (!apiKey) return alert("Enter an API key first")
    try {
      // Direct REST call to list models to see exactly what is available
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const availableModels = (data.models || [])
        .map(m => m.name.replace('models/', ''))
        .filter(name => name.includes('gemini'))
        .join(',\n')

      alert(`API Connection OK!\n\nAvailable Models:\n${availableModels}\n\nWe will use the first one found.`)
      console.log("Available models:", data.models)
    } catch (e) {
      alert(`Connection Failed:\n${e.message}\n\nCheck your API Key and Internet Connection.`)
    }
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>
        <h1 className="title">The Red Flag App</h1>
        <p className="text-muted">AI-powered reality check for your life decisions.</p>
        {apiKey && (
          <button
            onClick={() => {
              localStorage.removeItem('gemini_api_key')
              setApiKey('')
              setFlags(null)
            }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Change API Key
          </button>
        )}
      </header>

      <main>
        {!apiKey ? (
          <ApiKeyInput onSave={setApiKey} />
        ) : !flags ? (
          <>
            <DecisionInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={checkConnection}
                style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Debug Connection
              </button>
            </div>
          </>
        ) : (
          <FlagDisplay flags={flags} onReset={() => setFlags(null)} />
        )}
      </main>
    </div>
  )
}

export default App
