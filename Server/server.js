import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";
import Tesseract from "tesseract.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
connectDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "https://fyp-zakriya-2ulv.vercel.app/"
}));
app.use(express.json());
app.use('/api/auth', authRoutes);

import os from "os";

// Create uploads directory if it doesn't exist
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
const uploadsDir = isVercel ? path.join(os.tmpdir(), "uploads") : path.join(__dirname, "uploads");
try {
  await fs.mkdir(uploadsDir, { recursive: true });
} catch {
  console.log("Uploads directory exists or couldn't be created");
}

const upload = multer({ dest: uploadsDir });

async function extractImageText(filePath) {
  const result = await Tesseract.recognize(filePath, "eng");
  return result.data.text || "";
}

const groqApiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

if (!groqApiKey) {
  console.warn("Warning: Missing GROQ_API_KEY environment variable. Server will start but AI features will fail without a valid key.");
}

const openai = new OpenAI({
  apiKey: groqApiKey || "missing_key",
  baseURL: "https://api.groq.com/openai/v1"
});

let storedText = ""; // temporary memory
let uploadedFileName = "";

// ✅ 1. Upload File (PDF / DOCX / TXT)
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the server!" });
});
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let text = "";
    uploadedFileName = file.originalname;

    if (file.mimetype === "application/pdf") {
      const dataBuffer = await fs.readFile(file.path);
      const data = await pdf(dataBuffer);
      text = data.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        path: file.path
      });
      text = result.value;
    } else if (file.mimetype === "text/plain") {
      text = await fs.readFile(file.path, "utf-8");
    } else if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      text = await extractImageText(file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    storedText = text;

    // Clean up the temp file
    await fs.unlink(file.path);

    res.json({
      message: "File uploaded and text extracted successfully",
      fileName: uploadedFileName,
      length: text.length,
      preview: text.substring(0, 200) + "..."
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 2. Ask Questions (AI Recommendation System)
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !storedText) {
      return res.status(400).json({ error: "Question or document missing" });
    }

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional document assistant. Provide detailed, actionable recommendations based on the document. Format your response clearly with sections and bullet points."
        },
        {
          role: "user",
          content: `Document:\n${storedText}\n\nQuestion/Request:\n${question}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    res.json({
      answer: response.choices[0].message.content
    });
  } catch (err) {
    console.error("Ask error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 3. Get document status
app.get("/api/status", (req, res) => {
  res.json({
    hasDocument: storedText.length > 0,
    fileName: uploadedFileName,
    documentLength: storedText.length
  });
});

const START_PORT = Number(process.env.PORT || 5000);

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    console.error('Server failed to start:', error);
    process.exit(1);
  });

  return server;
}

startServer(START_PORT);

