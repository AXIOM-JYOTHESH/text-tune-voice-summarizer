export async function generateMistralSummary(text: string, options: {
  summaryType: string;
  readabilityLevel: string;
  language: string;
  summaryLength: number;
  tone: string;
}) {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          {
            role: "system",
            content: `You are a text summarizer. Create a ${options.summaryType} summary of the provided text.
            The summary should be:
            - Written for ${options.readabilityLevel} readers
            - In ${options.language} language
            - Approximately ${options.summaryLength} words
            - With a ${options.tone} tone
            - Focus on the main points and key information`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate summary');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating Mistral summary:', error);
    throw error;
  }
} 