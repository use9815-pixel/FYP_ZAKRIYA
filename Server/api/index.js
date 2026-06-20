// Vercel Serverless Function for /api endpoint
export default function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Handle GET /api
    if (req.method === 'GET') {
      return res.status(200).json({
        message: 'Hello from Vercel serverless API!',
        timestamp: new Date().toISOString(),
        status: 'ok'
      });
    }

    // Handle other methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
