'use server';
/**
 * @fileOverview Generates an individualized lesson plan for a student based on their grade and subject.
 *
 * - generateIndividualizedLessonPlan - A function that generates a lesson plan.
 * - GenerateIndividualizedLessonPlanInput - The input type for the generateIndividualizedLessonPlan function.
 * - GenerateIndividualizedLessonPlanOutput - The return type for the generateIndividualizedLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIndividualizedLessonPlanInputSchema = z.object({
  grade: z.number().describe('The current grade of the student.'),
  subject: z.string().describe('The subject for which to generate the lesson plan.'),
  topic: z.string().describe('The current topic being studied.'),
});
export type GenerateIndividualizedLessonPlanInput = z.infer<
  typeof GenerateIndividualizedLessonPlanInputSchema
>;

const GenerateIndividualizedLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('The individualized lesson plan for the student.'),
});
export type GenerateIndividualizedLessonPlanOutput = z.infer<
  typeof GenerateIndividualizedLessonPlanOutputSchema
>;

export async function generateIndividualizedLessonPlan(
  input: GenerateIndividualizedLessonPlanInput
): Promise<GenerateIndividualizedLessonPlanOutput> {
  return generateIndividualizedLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIndividualizedLessonPlanPrompt',
  input: {schema: GenerateIndividualizedLessonPlanInputSchema},
  output: {schema: GenerateIndividualizedLessonPlanOutputSchema},
  prompt: `You are an expert teacher, skilled at creating individualized lesson plans for students.

  Based on the student's grade, subject, and current topic, generate a detailed and engaging lesson plan.

  Grade: {{{grade}}}
  Subject: {{{subject}}}
  Topic: {{{topic}}}

  Lesson Plan:`,
});

const generateIndividualizedLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateIndividualizedLessonPlanFlow',
    inputSchema: GenerateIndividualizedLessonPlanInputSchema,
    outputSchema: GenerateIndividualizedLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
