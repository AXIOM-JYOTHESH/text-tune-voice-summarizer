import { pipeline } from '@xenova/transformers';

let summarizer: any = null;

export async function initializeSummarizer() {
  if (!summarizer) {
    try {
      summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
    } catch (error) {
      console.error('Error initializing summarizer:', error);
      throw new Error('Failed to initialize summarizer');
    }
  }
  return summarizer;
}

export async function generateSummary(text: string): Promise<string> {
  try {
    const model = await initializeSummarizer();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }

    // Split text into chunks if it's too long (BERT has a max length)
    const maxChunkLength = 1024;
    const chunks = text.match(new RegExp(`.{1,${maxChunkLength}}`, 'g')) || [];
    
    let fullSummary = '';
    
    for (const chunk of chunks) {
      const result = await model(chunk, {
        max_length: 150,
        min_length: 40
      });
      
      if (result && result[0] && result[0].summary_text) {
        fullSummary += result[0].summary_text + ' ';
      }
    }
    
    return fullSummary.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
} 