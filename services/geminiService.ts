
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const enhanceImage = async (base64ImageData: string, mimeType: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: 'Upscale this image to a higher resolution. Enhance the details, sharpness, and overall clarity without adding artifacts. Make it look like a high-quality photograph.',
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const enhancedBase64 = part.inlineData.data;
        const enhancedMimeType = part.inlineData.mimeType;
        return `data:${enhancedMimeType};base64,${enhancedBase64}`;
      }
    }

    // Handle cases where the model might refuse or return only text
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.text) {
          throw new Error(`Model response: ${part.text}`);
        }
      }

    return null;
  } catch (error) {
    console.error("Error enhancing image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("Failed to enhance image. An unknown error occurred.");
  }
};
