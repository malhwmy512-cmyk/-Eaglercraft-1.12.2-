import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,95,31,0.1)_0%,transparent_70%)]" />
      
      <div className="relative z-10 text-center max-w-md border border-white/10 bg-card/80 backdrop-blur-xl p-12 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/30 animate-pulse">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-6xl font-black font-display text-white mb-2 tracking-widest">404</h1>
        <h2 className="text-xl font-bold text-primary uppercase tracking-wider mb-4">Signal Lost</h2>
        
        <p className="text-muted-foreground font-mono mb-8">
          The coordinates you requested do not exist in this sector. The chunk may have been corrupted or deleted.
        </p>
        
        <Link href="/">
          <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider">
            Return to Hub
          </Button>
        </Link>
      </div>
    </div>
  );
}
