export async function extractTextFromImage(imageBase64: string): Promise<string> {
  try {
    // Remove the data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    const response = await fetch('https://api.mistral.ai/v1/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-ocr-latest",
        document: {
          type: "image_url",
          image_url: `data:image/jpeg;base64,${base64Data}`
        },
        include_image_base64: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mistral API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to extract text from image');
    }

    const data = await response.json();
    
    // Extract OCR results from pages
    if (data.pages && Array.isArray(data.pages)) {
      const resultText = data.pages
        .map((page: any) => page.markdown)
        .filter(Boolean)
        .join('\n\n');
      
      if (!resultText) {
        throw new Error('No text was extracted from the image');
      }
      
      return resultText.trim();
    } else {
      throw new Error('Invalid response format from Mistral API');
    }
  } catch (error) {
    console.error('Error in extractTextFromImage:', error);
    throw error;
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  try {
    if (file.type.startsWith('image/')) {
      // Convert image file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      return await extractTextFromImage(base64);
    } else {
      throw new Error('Unsupported file type. Please upload an image file.');
    }
  } catch (error) {
    console.error('Error in extractTextFromFile:', error);
    throw error;
  }
} 