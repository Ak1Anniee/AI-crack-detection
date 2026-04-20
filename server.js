import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from the .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Allow the frontend to talk to this backend
app.use(cors());
app.use(express.json());

// Set up multer to keep uploaded files in memory temporarily
const upload = multer({ storage: multer.memoryStorage() });

// Initialize the Google Gemini client using your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create the API route that the frontend will call
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    // Check if an image was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Convert the image buffer into the format Gemini requires
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype
      }
    };

    // Configure the new Gemini 2.5 Flash model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      // This is a special Gemini feature that forces it to reply in perfect JSON!
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are a structural engineering AI. Analyze this building image for cracks. Respond ONLY with these exact JSON keys:
{
  "crack_detected": boolean,
  "crack_type": string,
  "severity": "Low" | "Medium" | "High" | "Critical",
  "location": string,
  "confidence_score": number between 0 and 1,
  "recommendation": string,
  "notes": string
}
If no crack is found, set crack_detected to false and severity to Low.`;

    // Send the image and prompt to Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const aiText = response.text();

    // Convert the text into a readable JSON object and send it back to the frontend
    const resultJson = JSON.parse(aiText);
    res.json(resultJson);

  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: 'Failed to analyze the image. Please try again.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
