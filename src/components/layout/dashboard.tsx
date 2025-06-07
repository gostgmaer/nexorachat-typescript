"use client";

// import { useNotifications } from '@/hooks/useAppContext'
// import { ThemeToggle } from '@/components/ThemeToggle'
// import { UserStatus } from '@/components/UserStatus'
// import { NotificationCenter } from '@/components/NotificationCenter'
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./sidebar";
import { ThemeSwitch } from "../elements/theme-switch";
import { UserStatus } from "../elements/userpopover";
import { Header } from "./header";
// import { Sidebar } from '@/components/Sidebar'
interface DashboardProps {
  children: React.ReactNode;
}
export default function Dashboard({ children }: DashboardProps) {
  //   const { addNotification } = useNotifications()

  return (
    <>
      <Header />
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col">
        <div className="flex-grow container mx-auto px-4">{children}</div>
      </div>

      {/* <NotificationCenter /> */}
    </div>
    </>
  );
}
