const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Handle CORS preflight requests from SillyTavern
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // OpenCode Zen endpoint
    const targetUrl = 'https://opencode.ai/zen/v1/responses';

    // Forward the Authorization header (or fall back to a Vercel Environment Variable)
    const authHeader = req.headers['authorization'] || `Bearer ${process.env.ZEN_API_KEY}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Proxy Error', details: error.message });
  }
};
