// frontend/src/components/dashboard/student-card.tsx
'use client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// This is the data structure we expect from our Python backend.
type Student = {
    id: number;
    name: string;
    grade: number;
    planUrl: string | null;
    tests: { marks: number; subject: string }[];
}

// These are the "instructions" the card receives from its parent (DashboardClient).
type StudentCardProps = {
    student: Student;
    onGeneratePlan: (studentId: number) => void; // A function to call when the button is clicked.
    isGenerating: boolean; // A flag to know if any plan is currently being generated.
};

export default function StudentCard({ student, onGeneratePlan, isGenerating }: StudentCardProps) {
  // Logic to find the most recent test score to display.
  const latestTest = student.tests.length > 0 ? student.tests[student.tests.length - 1] : null;

  return (
    <Card className="flex h-full flex-col shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{student.name}</CardTitle>
        <CardDescription>Class {student.grade}b</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {latestTest ? (
          <p>Latest Test ({latestTest.subject}): <strong>{latestTest.marks}%</strong></p>
        ) : (
          <p className="text-sm text-muted-foreground">No test data available.</p>
        )}
      </CardContent>
      <CardFooter>
        {/* --- DYNAMIC BUTTON LOGIC --- */}
        {/* If a planUrl exists in the data from our backend, show the "View Plan" button. */}
        {student.planUrl ? (
          <Button asChild className="w-full">
            <a href={student.planUrl} target="_blank" rel="noopener noreferrer">
              View Plan
            </a>
          </Button>
        ) : (
          /* Otherwise, show the "Create Lesson Plan" button. */
          <Button 
            onClick={() => onGeneratePlan(student.id)} 
            className="w-full shadow-md hover:shadow-lg"
            disabled={isGenerating} // The button is disabled if any plan is currently generating.
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Create Lesson Plan'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}