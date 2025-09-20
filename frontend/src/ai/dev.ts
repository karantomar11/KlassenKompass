import { config } from 'dotenv';
config();

import '@/ai/flows/generate-individualized-lesson-plan.ts';
import '@/ai/flows/download-generated-lesson-plan.ts';