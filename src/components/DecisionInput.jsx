export default function DecisionInput({ onAnalyze, isAnalyzing }) {
    const handleSubmit = (e) => {
        e.preventDefault()
        const text = e.target.elements.scenario.value
        if (text.trim()) {
            onAnalyze(text)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>What's on your mind?</h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>
                Describe a relationship, a job offer, or any situation. We'll spot the flags.
            </p>
            <textarea
                name="scenario"
                className="input-area"
                placeholder="e.g. He texts me every day but cancels plans last minute..."
                required
            />
            <button
                type="submit"
                className="btn"
                style={{ marginTop: '1rem' }}
                disabled={isAnalyzing}
            >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Flags'}
            </button>
        </form>
    )
}
