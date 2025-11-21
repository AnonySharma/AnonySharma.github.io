import { GoogleGenAI, Chat } from "@google/genai";
import { EXPERIENCE, SKILLS, ABOUT_TEXT, PROJECTS } from '../constants';

let chatSession: Chat | null = null;

const getSystemInstruction = (): string => {
  return `
    You are the AI digital avatar of Ankit Kumar. You are currently living on his portfolio website.
    Your goal is to answer questions from recruiters, hiring managers, or visitors about Ankit's background, skills, and professional experience.
    
    Here is Ankit's profile data:
    - **Bio:** ${ABOUT_TEXT}
    - **Skills:** ${SKILLS.join(", ")}
    - **Experience:** ${JSON.stringify(EXPERIENCE)}
    - **Projects:** ${JSON.stringify(PROJECTS)}
    - **Education:** IIT (BHU) Varanasi, B.Tech in CSE (2019-2023).
    - **Achievements:** Ranked 61 in ICPC Regionals.
    
    **Tone:** Professional, intelligent, humble, and concise.
    **Rules:**
    1. Keep answers concise (under 100 words usually).
    2. If asked about something not in the data, say you don't know but suggest contacting Ankit directly.
    3. Emphasize his strength in Problem Solving (ICPC) and Full Stack Development.
    4. You are helpful and polite.
    
    If the user says "Hi" or "Hello", introduce yourself as Ankit's AI assistant.
  `;
};

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  if (!process.env.API_KEY) {
    console.error("API_KEY is missing. AI features will not work.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: getSystemInstruction(),
    },
  });

  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const chat = initializeChat();
  try {
    return await chat.sendMessageStream({ message });
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};