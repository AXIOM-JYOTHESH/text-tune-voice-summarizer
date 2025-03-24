import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    
    switch (file.type) {
      case 'application/pdf':
        try {
          // For PDFs, we'll use a simpler approach for now
          // We'll show a message that PDF support is coming soon
          throw new Error('PDF support is coming soon. Please use Word documents or text files for now.');
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          throw new Error(`PDF parsing failed: ${pdfError.message}`);
        }
        
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: buffer });
          if (!result || !result.value) {
            console.error('No text content found in Word document');
            throw new Error('No text content found in Word document');
          }
          return result.value;
        } catch (wordError) {
          console.error('Word document parsing error:', wordError);
          throw new Error(`Word document parsing failed: ${wordError.message}`);
        }
        
      case 'text/plain':
        try {
          const text = new TextDecoder().decode(buffer);
          if (!text) {
            console.error('No text content found in text file');
            throw new Error('No text content found in text file');
          }
          return text;
        } catch (textError) {
          console.error('Text file parsing error:', textError);
          throw new Error(`Text file parsing failed: ${textError.message}`);
        }
        
      default:
        throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error) {
    console.error('Error in extractTextFromFile:', error);
    throw error;
  }
} 