import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function askGemini(regulation: string, question: string) {
  const prompt = `
    Eres un asistente experto en normas de convivencia, reglamentos escolares, clubs y actividades extracurriculares. 
    Basándote ÚNICAMENTE en el contenido sumado de los siguientes documentos oficiales:
    
    --- DOCUMENTOS (CONTEXTO) ---
    ${regulation}
    --- FIN DOCUMENTOS ---
    
    Responde a la siguiente pregunta del usuario de forma clara, amable y profesional. 
    Si la respuesta no se encuentra en el reglamento, indícalo educadamente.
    
    Pregunta: ${question}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const errStr = error?.message?.toLowerCase() || '';
    if (errStr.includes("503") || errStr.includes("demand") || errStr.includes("unavailable")) {
       throw new Error("Alta demanda en la IA. Por favor, intenta en unos segundos.");
    }
    throw new Error("No se pudo obtener una respuesta de la IA.");
  }
}
