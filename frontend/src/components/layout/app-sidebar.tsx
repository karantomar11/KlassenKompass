'use client';
import type { Dispatch, SetStateAction } from 'react';
import { Book, Notebook } from 'lucide-react';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
} from '@/components/ui/sidebar';
import Logo from '@/components/icons/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

type AppSidebarProps = {
  onSelectClass?: Dispatch<SetStateAction<string | null>>;
  selectedClass?: string | null;
};

const classes = ['10b', '7a', '9c', '8d'];
const subjects = ['Mathe', 'Englisch'];

export default function AppSidebar({ onSelectClass, selectedClass }: AppSidebarProps) {
  return (
    <>
      <SidebarHeader className="hidden md:flex">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="font-headline text-xl font-semibold text-sidebar-foreground">
            Teacherboard
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <Accordion type="multiple" className="w-full" defaultValue={['Mathe']}>
              {subjects.map((subject) => (
                <AccordionItem key={subject} value={subject} className="border-none">
                  <AccordionTrigger className="w-full justify-start gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline [&[data-state=open]>svg]:text-sidebar-accent-foreground [&[data-state=open]]:bg-sidebar-accent [&[data-state=open]]:font-medium [&[data-state=open]]:text-sidebar-accent-foreground">
                    <Book />
                    <span className="truncate">{subject}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="flex flex-col gap-1 pl-8">
                      {classes.map((cls) => (
                        <Button
                          key={cls}
                          variant={selectedClass === cls ? 'secondary' : 'ghost'}
                          size="sm"
                          className="justify-start"
                          onClick={() => onSelectClass && onSelectClass(cls)}
                        >
                          <Notebook className="mr-2 h-4 w-4" />
                          Klasse {cls}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
