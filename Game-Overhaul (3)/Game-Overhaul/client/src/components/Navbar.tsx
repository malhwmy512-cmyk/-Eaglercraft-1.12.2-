import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Hammer, 
  Gamepad2, 
  Sprout, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  BookOpen,
  Trophy
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const [path] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Hub", icon: Hammer },
    { href: "/play", label: "Play", icon: Gamepad2 },
    { href: "/seeds", label: "Seed Bank", icon: Sprout },
    { href: "/guide", label: "Guide", icon: BookOpen },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  const isActive = (href: string) => {
    if (href === "/" && path === "/") return true;
    if (href !== "/" && path.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-md opacity-20 group-hover:opacity-50 transition-opacity" />
              <Hammer className="h-8 w-8 text-primary relative z-10 transition-transform group-hover:rotate-12" />
            </div>
            <span className="text-xl font-bold tracking-widest text-foreground font-display group-hover:text-primary transition-colors">
              TERRA<span className="text-primary">FORGE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div 
                  className={`
                    px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-200 border-b-2
                    font-medium text-sm uppercase tracking-wide
                    ${isActive(link.href) 
                      ? "border-primary text-primary bg-primary/5" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-white/20"}
                  `}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-sm border border-white/10">
                  <img 
                    src={user?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                    alt="Profile"
                    className="h-8 w-8 rounded-full bg-background ring-1 ring-primary/50" 
                  />
                  <div className="text-sm">
                    <div className="font-bold text-foreground leading-none">{user?.firstName || "Operator"}</div>
                    <div className="text-xs text-muted-foreground">Level 1</div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <a href="/api/login">
                <Button className="cyber-button bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase rounded-none border border-primary/50">
                  Login Access
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-black/95 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <div className={`p-4 flex items-center gap-3 border-l-2 transition-colors ${isActive(link.href) ? "border-primary bg-primary/10 text-primary" : "border-transparent text-muted-foreground"}`}>
                    <link.icon className="h-5 w-5" />
                    <span className="font-bold uppercase">{link.label}</span>
                  </div>
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {isAuthenticated ? (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-md">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user?.profileImageUrl || ""} 
                      className="h-8 w-8 rounded-full" 
                    />
                    <span className="font-bold">{user?.firstName}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <a href="/api/login" className="w-full">
                  <Button className="w-full bg-primary font-bold uppercase">
                    Initialize Session
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
