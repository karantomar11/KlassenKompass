'use client';
import { useState, useEffect } from 'react';
import StudentCard from '@/components/dashboard/student-card';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

type Student = {
    id: number;
    name: string;
    grade: number;
    planUrl: string | null;
    tests: { marks: number; subject: string }[];
}

export default function DashboardClient({ selectedClass }: { selectedClass: string | null }) {
  const isClass10bSelected = selectedClass === '10b';
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false); // New state for the loader

  const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
          const response = await fetch('http://127.0.0.1:8000/dashboard-data');
          if (!response.ok) throw new Error('Failed to fetch data from the backend.');
          const data = await response.json();
          setStudents(data);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setIsLoading(false);
      }
  };
  
  useEffect(() => {
      if (isClass10bSelected) fetchDashboardData();
  }, [isClass10bSelected]);

  const handleGeneratePlan = async (studentId: number) => {
      setIsGenerating(true); // Start the loader
      try {
          const response = await fetch(`http://127.0.0.1:8000/generate-plan/${studentId}`, { method: 'POST' });
          if (!response.ok) throw new Error('Backend failed to start the plan generation.');
          const result = await response.json();
          alert(`${result.status}. Please refresh in a moment to see the plan link.`);
      } catch (err: any) {
          alert(`Error: ${err.message}`);
      } finally {
          setIsGenerating(false); // Stop the loader
      }
  };

  return (
    <div className="flex h-full flex-col">
        <div className="mb-6">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Willkommen, Herr Thompson!</h2>
            <p className="text-muted-foreground">Wählen Sie eine Klasse aus, um Schüler anzuzeigen und Unterrichtspläne zu erstellen.</p>
        </div>
        <div className="flex-1">
            {isClass10bSelected && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-headline text-2xl font-semibold">Schüler der Klasse 10b</h3>
                        <Button onClick={fetchDashboardData} variant="outline">Refresh Data</Button>
                    </div>
                    {isLoading && <p>Loading students...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <AnimatePresence>
                            {students.map((student, index) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <StudentCard 
                                    student={student} 
                                    onGeneratePlan={handleGeneratePlan}
                                    isGenerating={isGenerating} 
                                />
                            </motion.div>
                            ))}
                        </AnimatePresence>
                        </div>
                    )}
                </div>
            )}
            {/* ... (Code for when a class is NOT selected) ... */}
        </div>
    </div>
  );
}