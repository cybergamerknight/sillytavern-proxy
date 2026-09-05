// Remove 'node-fetch' since the native global fetch API is built-in 
// when using Vercel's Edge/Web-style Functions.

// Define standard CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// Handle the primary POST request
export async function POST(req) {
  try {
    const targetUrl = 'https://opencode.ai/zen/v1/responses';
    
    // Forward the Authorization header
    const authHeader = req.headers.get('authorization') || `Bearer ${process.env.OPENAI_API_KEY}`;
    
    // Read the incoming request body
    const bodyText = await req.text();
    
    // Use the native global fetch API
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
      { error: error.message || 'Internal Server Error' }, 
      { status: 500, headers: corsHeaders }
    );
  }
}
