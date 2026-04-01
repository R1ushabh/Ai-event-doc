import dotenv from 'dotenv';
dotenv.config();

export const config = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
  MAX_TOKENS: parseInt(process.env.MAX_TOKENS || '4096', 10),
  TEMPERATURE: parseFloat(process.env.TEMPERATURE || '0.7'),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
