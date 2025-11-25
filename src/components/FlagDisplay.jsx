export default function FlagDisplay({ flags, onReset }) {
    const redFlags = flags.filter(f => f.type === 'red')
    const greenFlags = flags.filter(f => f.type === 'green')

    return (
        <div className="grid gap-4">
            <div className="card">
                <h2 style={{ color: 'var(--color-red-flag)', marginBottom: '1rem' }}>🚩 Red Flags ({redFlags.length})</h2>
                {redFlags.length === 0 && <p className="text-muted">No red flags detected. Looks safe?</p>}
                {redFlags.map((flag, i) => (
                    <div key={i} className="flag-card flag-red">
                        <span style={{ fontSize: '1.5rem' }}>🚩</span>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{flag.title}</div>
                            <div className="text-muted" style={{ fontSize: '0.9rem' }}>{flag.description}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2 style={{ color: 'var(--color-green-flag)', marginBottom: '1rem' }}>🟢 Green Flags ({greenFlags.length})</h2>
                {greenFlags.length === 0 && <p className="text-muted">No green flags detected.</p>}
                {greenFlags.map((flag, i) => (
                    <div key={i} className="flag-card flag-green">
                        <span style={{ fontSize: '1.5rem' }}>🟢</span>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{flag.title}</div>
                            <div className="text-muted" style={{ fontSize: '0.9rem' }}>{flag.description}</div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn" onClick={onReset} style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Analyze Another Scenario
            </button>
        </div>
    )
}
