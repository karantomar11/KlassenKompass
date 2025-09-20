import { SidebarTrigger } from '@/components/ui/sidebar';
import Logo from '@/components/icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Logo />
        <h1 className="font-headline text-xl font-semibold text-foreground">
          Teacherboard
        </h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center gap-3 rounded-full p-1 transition-colors hover:bg-muted">
            <span className="hidden text-sm font-medium sm:inline">
              Mr. Thompson
            </span>
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="https://picsum.photos/seed/teacher/100/100"
                alt="User avatar"
                data-ai-hint="teacher avatar"
              />
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
