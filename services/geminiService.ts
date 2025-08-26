
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    diagnosis: {
      type: Type.STRING,
      description: "A concise, primary diagnostic impression based on the scan. Limit to 1-2 sentences."
    },
    report: {
      type: Type.STRING,
      description: "A detailed, structured breakdown of the findings. Use clear medical terminology. Describe normal and abnormal findings methodically."
    },
    actionPlan: {
      type: Type.STRING,
      description: "Recommended next steps for the patient and clinician, presented as a list of actionable items (e.g., further imaging, lab tests, specialist referrals)."
    }
  },
  required: ["diagnosis", "report", "actionPlan"]
};

export async function analyzeMedicalScan(
  base64Image: string,
  mimeType: string,
  clinicalNotes: string
): Promise<AnalysisResult> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const textPart = {
      text: `Analyze the attached medical scan. Clinical Context/User Query: "${clinicalNotes}"`,
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: `You are an expert radiologist AI assistant. Your role is to analyze medical imaging scans and provide a professional, structured report. Your analysis must be based solely on the provided image and clinical notes. IMPORTANT: Your output MUST be a valid JSON object that conforms to the provided schema. Do not include any text before or after the JSON object, including markdown code fences.`,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });
    
    const jsonString = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonString);

    return result;

  } catch (error) {
    console.error("Error analyzing medical scan:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get analysis from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred during scan analysis.");
  }
}
