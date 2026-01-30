import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Loader2, Maximize2, Volume2, VolumeX, HelpCircle, Keyboard, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const QUICK_TIPS = [
  { key: "WASD", desc: "Movement" },
  { key: "Space", desc: "Jump" },
  { key: "Shift", desc: "Sneak" },
  { key: "E", desc: "Inventory" },
  { key: "Esc", desc: "Menu" },
];

export default function Play() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const gameUrl = "/game/Eaglercraft_1.12.2_WASM_Offline_Download.html";

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
      const timer = setTimeout(() => setShowSplash(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const toggleFullscreen = () => {
    const iframe = document.getElementById("game-frame");
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 h-[calc(100vh-140px)]">
        {/* Control Bar */}
        <div className="flex flex-wrap justify-between items-center gap-2 bg-card/60 border border-white/10 p-3 rounded-t-lg backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-sm text-green-500 font-bold uppercase tracking-wider">Connection Stable</span>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              Eaglercraft 1.12.2
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Quick Controls */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-white/20 hover:bg-white/10"
                  data-testid="button-controls"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel">
                <DialogHeader>
                  <DialogTitle className="font-display uppercase">Quick Controls</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {QUICK_TIPS.map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-black/20 rounded border border-white/5">
                      <Badge variant="outline" className="font-mono text-xs">{tip.key}</Badge>
                      <span className="text-sm text-muted-foreground">{tip.desc}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="border-white/20 hover:bg-white/10"
              data-testid="button-mute"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleFullscreen}
              className="border-primary/30 text-primary hover:bg-primary/10 font-mono text-xs uppercase"
              data-testid="button-fullscreen"
            >
              <Maximize2 className="mr-2 h-3 w-3" />
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Game Container */}
        <div className="relative flex-1 bg-black rounded-b-lg overflow-hidden border border-white/10 shadow-2xl">
          {/* TerraForge Splash Screen - Covers Eaglercraft branding */}
          {showSplash && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-950 to-black z-20">
              {/* Animated background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
              </div>

              {/* Logo */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse scale-150" />
                  <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/20 to-transparent border border-primary/30">
                    <Flame className="h-20 w-20 text-primary drop-shadow-[0_0_20px_rgba(255,95,31,0.5)]" />
                  </div>
                </div>
                
                <h1 className="font-display text-5xl md:text-6xl font-black text-white tracking-tighter mb-2">
                  TERRA<span className="text-primary">FORGE</span>
                </h1>
                <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase mb-8">
                  Initializing Game Engine
                </p>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>{loadingProgress < 100 ? 'Loading assets...' : 'Ready to play!'}</span>
                </div>
              </div>

              {/* Bottom branding */}
              <div className="absolute bottom-8 text-center">
                <p className="text-xs text-white/20 font-mono">Powered by TerraForge Engine</p>
              </div>
            </div>
          )}
          
          <iframe
            id="game-frame"
            src={gameUrl}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            allowFullScreen={true}
            title="TerraForge Game Client"
          />
        </div>

        {/* Tips Section */}
        <Card className="glass-panel">
          <CardContent className="py-3">
            <div className="flex items-center gap-4 overflow-x-auto">
              <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                Tip: Press F11 for browser fullscreen mode for the best experience
              </span>
              <span className="text-white/20">|</span>
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                Use a seed from our database for unique worlds
              </span>
              <span className="text-white/20">|</span>
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                Check the Guide page for controls and tips
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
