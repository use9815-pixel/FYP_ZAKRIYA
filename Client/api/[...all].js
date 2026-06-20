import fs from 'node:fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
}

function getPathname(req) {
  const raw = req.url || '/';
  return raw.split('?')[0].replace(/\/+$/, '') || '/';
}

async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024
    });

    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ fields, files });
    });
  });
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) {
    return {};
  }

  return JSON.parse(raw);
}

async function extractTextFromFile(file) {
  const filePath = file.filepath;
  const mimetype = file.mimetype || '';

  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text || '';
    }

    if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }

    if (mimetype === 'text/plain') {
      return await fs.readFile(filePath, 'utf8');
    }

    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pathname = getPathname(req);

  try {
    if (req.method === 'GET' && pathname === '/api') {
      return res.status(200).json({
        message: 'Hello from Vercel API',
        status: 'ok',
        routes: ['/api', '/api/upload', '/api/ask', '/api/status']
      });
    }

    if (req.method === 'GET' && pathname === '/api/status') {
      return res.status(200).json({
        status: 'ok',
        mode: 'serverless'
      });
    }

    if (req.method === 'POST' && pathname === '/api/upload') {
      const { files } = await parseMultipart(req);
      const rawFile = files.file;
      const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded. Use field name "file".' });
      }

      const text = await extractTextFromFile(file);

      return res.status(200).json({
        message: 'File uploaded and text extracted successfully',
        fileName: file.originalFilename || 'uploaded-file',
        length: text.length,
        preview: `${text.substring(0, 200)}...`,
        documentText: text
      });
    }

    if (req.method === 'POST' && pathname === '/api/ask') {
      const { question, documentText } = await readJsonBody(req);

      if (!question || !documentText) {
        return res.status(400).json({ error: 'Question and documentText are required.' });
      }

      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        return res.status(500).json({ error: 'Missing GROQ_API_KEY in Vercel environment variables.' });
      }

      const openai = new OpenAI({
        apiKey: groqApiKey,
        baseURL: 'https://api.groq.com/openai/v1'
      });

      const response = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a professional document assistant. Provide detailed, actionable recommendations based on the document. Format your response clearly with sections and bullet points.'
          },
          {
            role: 'user',
            content: `Document:\n${documentText}\n\nQuestion/Request:\n${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return res.status(200).json({
        answer: response.choices?.[0]?.message?.content || 'No response from model.'
      });
    }

    return res.status(404).json({ error: `Route not found: ${pathname}` });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}