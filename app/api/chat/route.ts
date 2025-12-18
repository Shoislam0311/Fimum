import { NextRequest } from 'next/server';
import { getModelForMode } from '@/lib/models';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { messages, mode } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const models = getModelForMode(mode || 'normal');
    const isMultiModel = Array.isArray(models);

    if (isMultiModel) {
      return handleMultiModelRequest(messages, models as string[]);
    } else {
      return handleSingleModelRequest(messages, models as string);
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

interface Message {
  role: string;
  content: string;
}

async function handleSingleModelRequest(messages: Message[], model: string) {
  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fimum.ai',
        'X-Title': 'Fimum AI Assistant',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      let errorMessage = 'Failed to get response from AI model';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorData.error || errorMessage;
      } catch {
        console.error('Could not parse error response');
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Request error:', error);
    return new Response(
      JSON.stringify({ error: 'Network error. Please check your connection and try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleMultiModelRequest(messages: Message[], models: string[]) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (const model of models) {
          try {
            const response = await fetch(OPENROUTER_BASE_URL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://fimum.ai',
                'X-Title': 'Fimum AI Assistant',
              },
              body: JSON.stringify({
                model,
                messages,
                stream: false,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              const content = data.choices?.[0]?.message?.content || '';
              
              if (content) {
                const chunkData = {
                  id: data.id,
                  object: 'chat.completion.chunk',
                  created: data.created,
                  model: data.model,
                  choices: [{
                    index: 0,
                    delta: { content },
                    finish_reason: null,
                  }],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunkData)}\n\n`));
              }
            } else {
              const errorText = await response.text();
              console.error(`Error from model ${model}:`, errorText);
            }
          } catch (modelError) {
            console.error(`Error processing model ${model}:`, modelError);
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('Multi-model streaming error:', error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
