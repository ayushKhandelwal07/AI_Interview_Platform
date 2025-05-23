// pages/api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const INTERVIEW_CONTEXT = `You are an experienced software engineering interviewer with deep technical knowledge and excellent communication skills. Your role is to:

1. Conduct a natural, conversational interview that feels like talking to a human interviewer
2. Start with a friendly introduction and ask about the candidate's background
3. Ask relevant technical questions based on the candidate's experience level
4. Provide constructive feedback and encouragement
5. Ask follow-up questions to dive deeper into interesting points
6. Maintain a professional yet friendly tone throughout
7. Adapt your questions based on the candidate's responses
8. Include both theoretical and practical questions
9. Cover important topics like:
   - System Design
   - Data Structures & Algorithms
   - Software Architecture
   - Problem Solving
   - Best Practices
   - Real-world scenarios

Remember to:
- Be conversational and natural in your responses
- Show empathy and understanding
- Give the candidate time to think
- Provide helpful hints when needed
- Keep the conversation flowing naturally

Start with a friendly greeting and ask about the candidate's background and experience.`;

// Helper function to format messages for Gemini API
function formatMessagesForGemini(messages) {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}

export async function POST(req) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY_TEST;
    
    if (!apiKey) {
      console.error("Gemini API key is not configured");
      return NextResponse.json(
        { 
          error: "API key not configured",
          details: "Please set NEXT_PUBLIC_GEMINI_API_KEY_TEST in your environment variables."
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { 
          error: "Invalid request",
          details: "messages array is required"
        },
        { status: 400 }
      );
    }

    console.log("Initializing Gemini AI with API key:", apiKey.substring(0, 5) + "...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Add interview context if this is the first message
    const enhancedMessages = messages.length === 1 
      ? [{ role: "system", content: INTERVIEW_CONTEXT }, ...messages]
      : messages;

    // Format messages for Gemini API
    const formattedMessages = formatMessagesForGemini(enhancedMessages);
    console.log("Formatted messages:", JSON.stringify(formattedMessages, null, 2));

    const chat = model.startChat({ 
      history: formattedMessages.slice(0, -1),
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      }
    });
    
    const lastMessage = formattedMessages[formattedMessages.length - 1];
    console.log("Sending message to Gemini:", lastMessage.parts[0].text);
    
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const text = result.response.text();
    console.log("Received response from Gemini:", text.substring(0, 100) + "...");

    return NextResponse.json({ response: text });
  } catch (err) {
    console.error("Detailed Gemini API error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      status: err.status,
      details: err.details
    });
    
    // More detailed error response
    const errorMessage = err.message || "Unknown error occurred";
    const statusCode = err.status || 500;
    
    return NextResponse.json(
      { 
        error: "Failed to get response from AI",
        details: errorMessage,
        type: err.name || "UnknownError"
      },
      { status: statusCode }
    );
  }
}
