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
  const authHeader = req.headers.get('authorization') || `Bearer ${process.env.OPENAI_API_KEY}`;
  
  // Read the body correctly for Web APIs
  const bodyText = await req.text();

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: bodyText
  });
  
  const data = await response.json();
  
  // FIX: Use standard Response.json
  return Response.json(data, { status: response.status });

} catch (error) {
  // FIX: Use standard Response.json
  return Response.json(
    { error: 'Proxy Error', details: error.message }, 
    { status: 500 }
  );
}
