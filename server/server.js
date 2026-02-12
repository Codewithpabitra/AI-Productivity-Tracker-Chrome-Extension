import express from "express";
import dotenv from "dotenv"
import axios from "axios"
import cors from "cors"
dotenv.config();
const app = express();

// middlewares 
app.use(cors());
app.use(express.json());

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
  process.env.GEMINI_API_KEY;

// Classify the website -> productive or not and others categories.
app.post("/classify", async (req, res) => {
  try {
    const { title, url } = req.body;

    if(!title || !url) {
        return res.status(409).json({
            message : "title and url are required."
        })
    }

    const prompt = `
    Classify this website into:
    Work, Study, Social Media, Entertainment, Shopping, Other.
    
    Title: ${title}
    URL: ${url}
    
    Return only category name.
    `;

    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const text =
      response.data.candidates[0].content.parts[0].text.trim();

    res.status(200).json({ category: text });
  } catch (error) {
    console.error("Error in category website", error);
    res.status(500).json({ category: "Other" });
  }
});


// Analyze the summary and give AI Insights
app.post("/analyze", async (req, res) => {
  try {
    const { summary } = req.body;

    if(!summary) {
        return res.status(409).json({
            message : "summary is required."
        })
    }

    const prompt = `
    You are a productivity coach.
    Analyze this daily summary and give insights and improvement suggestions:
    
    ${summary}
    `;

    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const text =
      response.data.candidates[0].content.parts[0].text;

    res.status(200).json({ result: text });
  } catch (error) {
    console.error("Error in AI Analysis", error);
    res.status(500).json({ result: "AI analysis failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up on PORT : ${PORT}`)
});