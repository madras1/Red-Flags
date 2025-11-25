import { useState, useEffect } from 'react'
import DecisionInput from './components/DecisionInput'
import FlagDisplay from './components/FlagDisplay'
import ApiKeyInput from './components/ApiKeyInput'
import { analyzeScenario } from './utils/analyzer'

function App() {
  const [flags, setFlags] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  // Prioritize environment variable, then local storage
  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || ''
  })

  useEffect(() => {
    if (apiKey && !import.meta.env.VITE_GEMINI_API_KEY) {
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



  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>
        <h1 className="title">The Red Flag App</h1>
        <p className="text-muted">AI-powered reality check for your life decisions.</p>

      </header>

      <main>
        {!apiKey ? (
          <ApiKeyInput onSave={setApiKey} />
        ) : !flags ? (
          <>
            <DecisionInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
