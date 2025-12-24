
import OpenAI from 'openai';
import { Question, Difficulty, StudyMaterial } from "./types";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true // Since it's client-side
});

export async function generateAssessment(material: StudyMaterial, count: number, level: Difficulty): Promise<Question[]> {
  try {
    const contentText = material.text || 'General knowledge topics.';
    const systemPrompt = `You are a professional educational assessment designer.

MATERIAL TO ANALYZE:
${contentText}

Create exactly ${count} multiple-choice questions (MCQs) based EXCLUSIVELY on the above material. Do not use any external knowledge or general facts not present in the material.

Rules:
1. Each question must have exactly 4 distinct options.
2. The questions must align with the ${level} difficulty level.
3. Provide a clear, detailed explanation for the correct answer, citing specific evidence from the material.
4. Focus on core concepts, definitions, and application of knowledge from the provided material only.
5. Questions must be directly based on the content provided - do not make up information.
6. Ensure the correct answer is accurate and can be verified from the material.
7. Make options plausible but clearly distinguishable, with only one correct answer.
8. If the material is insufficient to create ${count} questions, create as many as possible.
9. Return ONLY a valid JSON array of objects with the following exact structure:
   [
     {
       "text": "Question text here",
       "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
       "correctAnswer": "Option 1",
       "difficulty": "${level}",
       "topic": "Relevant topic",
       "explanation": "Detailed explanation citing the material"
     }
   ]
Do not include any other text, markdown, or formatting. Just the JSON array.`;

    const userPrompt = `Generate the questions now based on the material provided in the system prompt.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const output = response.choices[0]?.message?.content?.trim();
    if (!output) throw new Error('No response from API');

    // Clean the output to ensure it's valid JSON
    const cleanedOutput = output.replace(/```json\n?|\n?```/g, '').trim();
    const rawQuestions = JSON.parse(cleanedOutput);

    if (!Array.isArray(rawQuestions)) throw new Error('Invalid response format');

    return rawQuestions.map((item: any, idx: number) => ({
      ...item,
      id: `q-${idx}-${Date.now()}`
    }));
  } catch (error) {
    console.error('Assessment generation failed:', error);
    throw new Error('Failed to generate assessment. Please check your API key and try again.');
  }
}
