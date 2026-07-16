const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const generateProjectBacklog = async (projectIdea) => {
    try {
        if (!OPENROUTER_API_KEY) {
            throw new Error("VITE_OPENROUTER_API_KEY is missing from your .env file!");
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": window.location.origin,
                "X-Title": "Kanban Flow AI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert agile product manager. Analyze the user's project idea and return a clean, structured backlog of exactly 5 core developer tasks. 
            
            You must output ONLY a raw JSON array. No conversational text, no markdown code blocks (do not wrap in \`\`\`json).
            
            Each object in the array must strictly have:
            - "code": Unique ID starting with "PROJ-" (e.g., "PROJ-101")
            - "title": Concise actionable developer title
            - "status": Must be either "todo" or "progress"
            - "priority": Must be "high", "medium", or "low"
            - "assignee": Random 2-letter initials (e.g., "AK")`
                    },
                    {
                        role: "user",
                        content: `Project Idea: "${projectIdea}"`
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API responded with status ${response.status}`);
        }

        const data = await response.json();
        let contentText = data.choices[0].message.content.trim();

        if (contentText.startsWith("```")) {
            contentText = contentText.replace(/^```json|```$/g, "").trim();
        }

        return JSON.parse(contentText);

    } catch (error) {
        console.error("OpenRouter API Error:", error);
        throw new Error(error.message || "Failed to construct backlog.");
    }
};