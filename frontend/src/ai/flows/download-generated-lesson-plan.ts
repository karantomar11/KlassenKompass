'use server';

/**
 * @fileOverview Generates and provides a PDF lesson plan for a student.
 *
 * - downloadGeneratedLessonPlan - A function that generates a lesson plan PDF.
 * - DownloadGeneratedLessonPlanInput - The input type for the lesson plan generation.
 * - DownloadGeneratedLessonPlanOutput - The return type, providing a PDF data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import jsPDF from 'jspdf';

const DownloadGeneratedLessonPlanInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  grade: z.string().describe('The current grade of the student.'),
  subject: z.string().describe('The subject for the lesson plan.'),
  currentTopic: z.string().describe('The current topic being studied.'),
});
export type DownloadGeneratedLessonPlanInput = z.infer<
  typeof DownloadGeneratedLessonPlanInputSchema
>;

const DownloadGeneratedLessonPlanOutputSchema = z.object({
  pdfDataUri: z.string().describe('The lesson plan PDF as a data URI.'),
});
export type DownloadGeneratedLessonPlanOutput = z.infer<
  typeof DownloadGeneratedLessonPlanOutputSchema
>;

export async function downloadGeneratedLessonPlan(
  input: DownloadGeneratedLessonPlanInput
): Promise<DownloadGeneratedLessonPlanOutput> {
  return downloadGeneratedLessonPlanFlow(input);
}

const lessonPlanPrompt = ai.definePrompt({
  name: 'lessonPlanPrompt',
  input: {schema: DownloadGeneratedLessonPlanInputSchema},
  output: {schema: z.string()},
  prompt: `You are an experienced teacher creating a personalized lesson plan for {{studentName}}.

  Student Grade: {{grade}}
  Subject: {{subject}}
  Current Topic: {{currentTopic}}

  Create a detailed and engaging lesson plan.
  Respond in markdown format.
  Length: 500 words.
  `,
});

const downloadGeneratedLessonPlanFlow = ai.defineFlow(
  {
    name: 'downloadGeneratedLessonPlanFlow',
    inputSchema: DownloadGeneratedLessonPlanInputSchema,
    outputSchema: DownloadGeneratedLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await lessonPlanPrompt(input);

    if (!output) {
      throw new Error('No lesson plan generated.');
    }

    // Generate PDF from the lesson plan
    const pdf = new jsPDF();
    pdf.text(output, 10, 10);
    const pdfDataUri = pdf.output('datauristring');

    return {pdfDataUri};
  }
);
