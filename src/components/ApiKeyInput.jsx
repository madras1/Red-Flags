import { useState } from 'react'

export default function ApiKeyInput({ onSave }) {
    const [key, setKey] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (key.trim()) {
            onSave(key.trim())
        }
    }

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Unlock Real AI Analysis</h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>
                To use the advanced analysis engine, please enter your Gemini API Key.
                It will be saved locally on your device.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    className="input-area"
                    style={{ minHeight: 'auto', marginBottom: '1rem' }}
                    placeholder="Enter your Gemini API Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    required
                />
                <button type="submit" className="btn">
                    Save Key & Continue
                </button>
            </form>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
                Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--color-green-flag)' }}>Get one here</a>.
            </p>
        </div>
    )
}
