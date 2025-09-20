'use client';
import StudentCard from '@/components/dashboard/student-card';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type DashboardClientProps = {
  selectedClass: string | null;
  handleSelectClass: (className: string | null) => void;
};

export default function DashboardClient({ selectedClass }: DashboardClientProps) {
  const isClass10bSelected = selectedClass === '10b';

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isClass10bSelected) { // Only fetch if the correct class is selected
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://127.0.0.1:8000/dashboard-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch data from the backend.');
                }
                const data = await response.json();
                setStudents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }
}, [isClass10bSelected]); // This useEffect runs whenever the selected class changes



  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          Willkommen, Herr Thompson!
        </h2>
        <p className="text-muted-foreground">
          Wählen Sie eine Klasse aus, um Schüler anzuzeigen und Unterrichtspläne zu erstellen.
        </p>
      </div>

      <div className="flex-1">
        {!selectedClass && (
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-card/50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground">
                Keine Klasse ausgewählt
              </h3>
              <p className="text-sm text-muted-foreground">
                Bitte wählen Sie eine Klasse aus der Seitenleiste.
              </p>
            </div>
          </div>
        )}

        {selectedClass && !isClass10bSelected && (
            <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-card/50">
            <div className="text-center">
                <h3 className="text-lg font-medium text-foreground">
                Klasse {selectedClass}
                </h3>
                <p className="text-sm text-muted-foreground">
                Für diese Klasse wurden keine Schüler gefunden. Versuchen Sie Klasse 10b!
                </p>
            </div>
            </div>
        )}

        {isClass10bSelected && (
          <div>
            <h3 className="font-headline text-2xl font-semibold mb-4">Schüler der Klasse 10b</h3>
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
                <StudentCard student={student} />
            </motion.div>
            ))}
        </AnimatePresence> 
        </div>
            )}
          </div>
        )}
      </div> 
    </div>  
    
  );
}
