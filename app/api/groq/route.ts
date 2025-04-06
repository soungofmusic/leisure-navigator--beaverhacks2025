import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { placeName, address, description } = await request.json();
    
    if (!placeName) {
      return NextResponse.json(
        { error: 'Missing required field: placeName' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error('⚠️ GROQ_API_KEY is missing in environment variables');
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }
    
    // Create a prompt that will generate enhanced information about the place
    const prompt = `
      Generate an engaging and detailed description for the following place:
      
      Name: ${placeName}
      ${address ? `Address: ${address}` : ''}
      ${description ? `Current Description: ${description}` : ''}
      
      Provide the following sections:
      1. Introduction - An engaging opening paragraph about the place (2-3 sentences)
      2. Highlights - List 3-4 key features or attractions of this place
      3. Experience - What visitors can expect when visiting (2-3 sentences)
      4. Historical Context - Brief interesting historical facts (if applicable)
      5. Tips - 2-3 practical tips for visitors
      
      Format the response as clean, well-structured JSON with the following schema:
      {
        "introduction": "string",
        "highlights": ["string", "string", "string"],
        "experience": "string",
        "historicalContext": "string",
        "tips": ["string", "string", "string"]
      }
      
      Keep the tone friendly and informative. Do not include any markdown formatting in the actual text.
    `;
    
    // Make a direct request to the Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',  // Using Llama 3 70B model for high-quality results
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable travel assistant who provides accurate, concise, and engaging information about places and attractions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Parse the response from Groq API
    const enhancedInfo = JSON.parse(response.data.choices[0].message.content);
    
    return NextResponse.json({
      enhancedInfo,
      isAIGenerated: true
    });
    
  } catch (error) {
    console.error('Error generating place information with Groq:', error);
    return NextResponse.json(
      { error: 'Failed to generate place information' },
      { status: 500 }
    );
  }
}
