import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// AI Instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Routes / Endpoints
// Classify the website -> productive or not and others categories.
app.post("/classify", async (req, res) => {
//   console.log("🔥 /classify route hit");
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(409).json({
        message: "title and url are required.",
      });
    }

    const prompt = `
You must classify this website into exactly ONE of these categories:

Work
Study
Social Media
Entertainment
Shopping
Other

Rules:
- Return ONLY one word
- No explanation
- No sentence
- No punctuation
- Must match exactly one of the categories above

Title: ${title}
URL: ${url}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim().toLowerCase();
    console.log(response.text);

    const allowedCategories = {
      work: "Work",
      study: "Study",
      "social media": "Social Media",
      entertainment: "Entertainment",
      shopping: "Shopping",
      other: "Other",
    };

    if (allowedCategories[text]) {
      text = allowedCategories[text];
    } else {
      text = "Other";
    }

    res.status(200).json({ category: text });
  } catch (error) {
    // console.error("Error in classify:", error.message);
    if (error.status === 429) {
      return res.status(429).json({
        message: "AI rate limit exceeded. Try again later.",
      });
    }
    res.status(500).json({ category: "Other" });
  }
});

// Analyze the summary and give AI Insights
app.post("/analyze", async (req, res) => {
  try {
    const { summary } = req.body;

    const prompt = `
You are a productivity coach.

Based on this daily breakdown:
${summary}

Give exactly:

3 short insights
3 short improvement suggestions

Rules:
- Use plain text only
- Do NOT use markdown
- You can use bullet symbols while giving suggestions or insights
- Do NOT use *, #
- Keep it concise and human readable
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error) {
    // console.error("Gemini Error:", error.message);
    if (error.status === 429) {
      return res.status(429).json({
        message: "AI rate limit exceeded. Try again later.",
      });
    }
    res.status(500).json({ result: "AI analysis failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up on PORT : ${PORT}`);
});
