'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createAndDownloadPlan } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

type Student = {
  id: number;
  name: string;
};

type StudentCardProps = {
  student: Student;
};

export default function StudentCard({ student }: StudentCardProps) {
  const [topic, setTopic] = useState('');
  const [examGrade, setExamGrade] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic) {
      toast({
        title: 'Error',
        description: 'Please enter a topic.',
        variant: 'destructive',
      });
      return;
    }

    setIsPending(true);
    try {
      const result = await createAndDownloadPlan({
        studentName: student.name,
        grade: '10',
        subject: 'Math',
        currentTopic: topic,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.pdfDataUri) {
        const link = document.createElement('a');
        link.href = result.pdfDataUri;
        link.download = `lesson-plan-${student.name.toLowerCase()}-${topic.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: 'Success!',
          description: `Lesson plan for ${student.name} is downloading.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Failed to create plan',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="flex h-full flex-col shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{student.name}</CardTitle>
        <CardDescription>Class 10b</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`topic-${student.id}`}>Current Topic</Label>
              <Input
                id={`topic-${student.id}`}
                placeholder="e.g. Algebra"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`grade-${student.id}`}>Note der letzten Klausur</Label>
              <Input
                id={`grade-${student.id}`}
                placeholder="e.g. 1.7"
                value={examGrade}
                onChange={(e) => setExamGrade(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full shadow-md hover:shadow-lg" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Create Lesson Plan'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
