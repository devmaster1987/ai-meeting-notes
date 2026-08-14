const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
    res.json({
        message: "MeetMind AI server is running"
    });
});

app.post("/api/analyze", async (req, res) => {
    try {
        const { transcript } = req.body;

        if (!transcript || !transcript.trim()) {
            return res.status(400).json({
                error: "Transcript is required"
            });
        }

        const response = await client.responses.create({
            model: "gpt-5.5",
            instructions: `
You are a meeting analysis assistant.

Analyze the meeting transcript and return ONLY valid JSON.

Use this exact structure:

{
  "summary": "string",
  "keyTopics": ["string"],
  "decisions": ["string"],
  "actionItems": [
    {
      "task": "string",
      "owner": "string",
      "deadline": "string"
    }
  ],
  "owners": ["string"],
  "deadlines": ["string"],
  "followUpQuestions": ["string"],
  "risks": ["string"]
}

Rules:
- Do not invent facts.
- If information is not available, use an empty array or "Unassigned".
- Keep the summary concise.
- Return JSON only.
            `,
            input: transcript
        });

        const text = response.output_text;

        let analysis;

        try {
            analysis = JSON.parse(text);
        } catch (parseError) {
            return res.status(502).json({
                error: "AI returned an invalid response format"
            });
        }

        res.json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error("OpenAI error:", error);

        res.status(500).json({
            error: "Failed to analyze meeting"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.error("OpenAI error:", error);