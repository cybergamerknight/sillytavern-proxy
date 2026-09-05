const fetch = require('node-fetch');

module.exports = async (req) => {
  // Define standard CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle CORS preflight requests from SillyTavern
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405, headers: corsHeaders });
  }

  try {
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
    
    // Return standard response with CORS headers
    return Response.json(data, { 
      status: response.status, 
      headers: corsHeaders 
    });

  } catch (error) {
    // Return error response with CORS headers
    return Response.json(
      { error: 'Proxy Error', details: error.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
};