"use client";
import Dashboard from "./dashboard";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Dashboard>
        <main className="flex-grow container mx-auto px-4">{children}</main>
      </Dashboard>
    </div>
  );
}
