import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px]" />
      </div>

      <Navbar />
      
      <main className="flex-1 relative z-10 container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-mono">
          <div>
            &copy; {new Date().getFullYear()} TERRAFORGE SYSTEMS.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">STATUS: ONLINE</span>
            <span className="hover:text-primary cursor-pointer transition-colors">VERSION: 2.0.1</span>
            <span className="hover:text-primary cursor-pointer transition-colors">PRIVACY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
