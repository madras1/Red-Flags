import { GoogleGenerativeAI } from "@google/generative-ai"

const GENERIC_RED_FLAGS = [
    { title: "Inconsistency", description: "Actions don't match words." },
    { title: "Lack of Communication", description: "Avoiding difficult conversations." },
    { title: "Love Bombing", description: "Too much intensity too soon." },
    { title: "Disrespecting Boundaries", description: "Pushing past your comfort zone." },
    { title: "Vague Answers", description: "Not giving straight answers to simple questions." }
]

const GENERIC_GREEN_FLAGS = [
    { title: "Consistent Effort", description: "Making time for you regularly." },
    { title: "Open Communication", description: "Willing to discuss feelings and future." },
    { title: "Respects Boundaries", description: "Accepts 'no' without pressure." },
    { title: "Shared Values", description: "Aligns with your core beliefs." },
    { title: "Emotional Maturity", description: "Handles conflict without exploding." }
]

export async function analyzeScenario(text, apiKey) {
    // Try Gemini API first
    try {
        if (!apiKey) throw new Error("No API Key")

        const genAI = new GoogleGenerativeAI(apiKey)
        // Using gemini-2.0-flash as confirmed by user's available model list
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

        const prompt = `
    Analyze the following scenario and identify "Green Flags" (positive signs) and "Red Flags" (negative signs).
    Return the result strictly as a JSON object with this structure:
    {
      "greenFlags": [{ "title": "...", "description": "..." }],
      "redFlags": [{ "title": "...", "description": "..." }]
    }
    
    Scenario: "${text}"
    `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const responseText = response.text()

        const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/)

        if (!jsonMatch) throw new Error("Invalid JSON response")

        const data = JSON.parse(jsonMatch[0])

        return [
            ...(data.greenFlags || []).map(f => ({ ...f, type: 'green' })),
            ...(data.redFlags || []).map(f => ({ ...f, type: 'red' }))
        ]

    } catch (error) {
        console.warn("Gemini API failed, switching to simulation:", error)

        // Fallback Simulation Logic
        await new Promise(resolve => setTimeout(resolve, 1000)) // Fake delay

        const flags = []
        const lowerText = text.toLowerCase()

        // Simple keyword matching
        if (lowerText.includes("cancel") || lowerText.includes("late")) {
            flags.push({ type: 'red', title: "Unreliable Behavior", description: "Canceling plans or being late shows lack of respect." })
        }
        if (lowerText.includes("text") || lowerText.includes("call")) {
            if (!lowerText.includes("stop") && !lowerText.includes("annoy")) {
                flags.push({ type: 'green', title: "Communication", description: "Keeping in touch is a good sign." })
            }
        }

        // Add random generics
        const numRed = Math.floor(Math.random() * 2) + 1
        const numGreen = Math.floor(Math.random() * 2) + 1

        for (let i = 0; i < numRed; i++) {
            const flag = GENERIC_RED_FLAGS[Math.floor(Math.random() * GENERIC_RED_FLAGS.length)]
            if (!flags.find(f => f.title === flag.title)) flags.push({ ...flag, type: 'red' })
        }
        for (let i = 0; i < numGreen; i++) {
            const flag = GENERIC_GREEN_FLAGS[Math.floor(Math.random() * GENERIC_GREEN_FLAGS.length)]
            if (!flags.find(f => f.title === flag.title)) flags.push({ ...flag, type: 'green' })
        }

        // Add a system flag to indicate simulation
        flags.push({
            type: 'red',
            title: "System: Simulation Mode",
            description: `API Error (${error.message}). Using simulated analysis.`
        })

        return flags
    }
}
