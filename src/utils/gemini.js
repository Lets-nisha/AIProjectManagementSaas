// src/utils/gemini.js

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const generateProjectBacklog = async (projectIdea) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                // OpenRouter requirements (Optional but good practice)
                "HTTP-Referer": window.location.origin,
                "X-Title": "Kanban Flow AI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash", // Use standard free/cheap Gemini model on OpenRouter
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
                ],
                // Ensuring the model returns strict JSON
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API responded with status ${response.status}`);
        }

        const data = await response.json();
        const contentText = data.choices[0].message.content;

        // Parse response into clean JS Array
        return JSON.parse(contentText);

    } catch (error) {
        console.error("OpenRouter API Error:", error);
        throw new Error("Failed to construct backlog. Verify your OpenRouter API key.");
    }
};