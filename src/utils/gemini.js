// src/utils/gemini.js

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export const generateProjectBacklog = async (projectIdea, existingTasks = null) => {
    try {
        if (!DEEPSEEK_API_KEY) {
            throw new Error("VITE_DEEPSEEK_API_KEY is missing in your .env file!");
        }

        const isEditing = Boolean(existingTasks);

        const systemPrompt = `You are an expert Agile Product Manager and Systems Architect.
Analyze the user's project request and provide a detailed, structured implementation approach broken down into clear developer tasks across phases (e.g., Phase 1: Setup, Phase 2: Core Features, Phase 3: Testing & Polish).

CRITICAL INSTRUCTIONS:
- You must output ONLY a raw JSON array of task objects.
- Do NOT wrap in markdown code blocks (do not wrap in \`\`\`json).
- Each object must strictly follow this structure:
  {
    "code": "PROJ-101",
    "title": "[Phase X: Name] Short task title",
    "status": "todo" or "progress",
    "priority": "high", "medium", or "low",
    "assignee": "Two-letter initials (e.g., AK, NS)"
  }

${isEditing ? `EXISTING TASKS TO EDIT/UPDATE: ${JSON.stringify(existingTasks)}` : ''}`;

        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: isEditing
                            ? `Update/Refine the existing tasks based on this prompt: "${projectIdea}"`
                            : `Project Idea and Requirements: "${projectIdea}"`
                    }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API responded with status ${response.status}`);
        }

        const data = await response.json();
        let contentText = data.choices[0].message.content.trim();

        if (contentText.startsWith("```")) {
            contentText = contentText.replace(/^```json|```$/g, "").trim();
        }

        return JSON.parse(contentText);

    } catch (error) {
        console.error("DeepSeek API Error:", error);
        throw new Error(error.message || "Failed to generate backlog from DeepSeek.");
    }
};