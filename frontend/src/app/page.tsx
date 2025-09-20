'use client';
import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import AppHeader from '@/components/layout/app-header';
import DashboardClient from '@/components/dashboard/dashboard-client';

export default function Home() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handleSelectClass = (className: string) => {
    setSelectedClass(prevClass => (prevClass === className ? null : className));
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar onSelectClass={handleSelectClass} selectedClass={selectedClass} />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <DashboardClient selectedClass={selectedClass} handleSelectClass={handleSelectClass} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
