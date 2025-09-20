'use server';

import {
  downloadGeneratedLessonPlan,
  type DownloadGeneratedLessonPlanInput,
} from '@/ai/flows/download-generated-lesson-plan';

type ActionResult = {
  pdfDataUri?: string;
  error?: string;
};

export async function createAndDownloadPlan(
  input: DownloadGeneratedLessonPlanInput
): Promise<ActionResult> {
  try {
    const result = await downloadGeneratedLessonPlan(input);
    if (result.pdfDataUri) {
      return { pdfDataUri: result.pdfDataUri };
    } else {
      return { error: 'Failed to generate PDF. The data URI was empty.' };
    }
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unexpected error occurred while generating the lesson plan.' };
  }
}
