import type { SeedResponse } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Star, User, Eye, Flame, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SeedCardProps {
  seed: SeedResponse;
}

const CATEGORY_COLORS: Record<string, string> = {
  survival: "bg-green-500/20 text-green-400 border-green-500/30",
  adventure: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  building: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  exploration: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  challenge: "bg-red-500/20 text-red-400 border-red-500/30",
  resource: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  village: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  spawn: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const DIFFICULTY_COLORS = [
  "",
  "text-green-400",
  "text-lime-400",
  "text-yellow-400",
  "text-orange-400",
  "text-red-400"
];

export function SeedCard({ seed }: SeedCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: favoriteStatus } = useQuery<{ isFavorite: boolean }>({
    queryKey: ['/api/favorites', seed.id, 'check'],
    queryFn: async () => {
      const res = await fetch(`/api/favorites/${seed.id}/check`, { credentials: 'include' });
      if (!res.ok) return { isFavorite: false };
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorite) {
        await apiRequest('DELETE', `/api/favorites/${seed.id}`);
      } else {
        await apiRequest('POST', `/api/favorites/${seed.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: favoriteStatus?.isFavorite ? "Removed from Favorites" : "Added to Favorites",
        className: "bg-primary text-primary-foreground border-none",
      });
    },
  });

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast({ title: "Please login to add favorites", variant: "destructive" });
      return;
    }
    toggleFavorite.mutate();
  };

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(seed.seedValue);
    toast({
      title: "Seed Copied",
      description: "Paste it into the generator to play this world.",
      className: "bg-primary text-primary-foreground border-none",
    });
  };

  const features = seed.features ? JSON.parse(seed.features) : [];
  const categoryClass = CATEGORY_COLORS[seed.category || 'survival'] || CATEGORY_COLORS.survival;
  const isFavorite = favoriteStatus?.isFavorite;

  return (
    <Link href={`/seeds/${seed.id}`}>
      <div className="group h-full cursor-pointer" data-testid={`card-seed-${seed.id}`}>
        <Card className="h-full bg-card/40 border-white/10 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]">
          <div className="relative aspect-video bg-black/50 overflow-hidden">
            {seed.imageUrl ? (
              <img 
                src={seed.imageUrl} 
                alt={seed.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <span className="font-display text-4xl text-white/5 font-bold uppercase">No Signal</span>
              </div>
            )}
            
            {/* Top badges */}
            <div className="absolute top-2 left-2 flex gap-2">
              {seed.isFeatured && (
                <Badge className="bg-primary/90 text-primary-foreground border-0 text-xs">
                  <Flame className="w-3 h-3 mr-1" /> Featured
                </Badge>
              )}
              {seed.category && (
                <Badge className={`${categoryClass} border text-xs uppercase`}>
                  {seed.category}
                </Badge>
              )}
            </div>
            
            {/* Rating and Favorite */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className={`h-7 w-7 rounded bg-black/80 backdrop-blur-sm border border-white/10 ${isFavorite ? 'text-red-400' : 'text-white/60 hover:text-red-400'}`}
                onClick={handleFavorite}
                data-testid={`button-favorite-${seed.id}`}
              >
                <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <div className="bg-black/80 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/20 flex items-center gap-1 backdrop-blur-sm">
                <Star className="w-3 h-3 fill-primary" />
                {Number(seed.averageRating || 0).toFixed(1)}
              </div>
            </div>
            
            {/* Stats bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex justify-between items-center">
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {seed.viewCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> {seed.ratingsCount || 0}
                </span>
              </div>
              {seed.difficulty && (
                <div className={`text-xs font-bold ${DIFFICULTY_COLORS[seed.difficulty]}`}>
                  {"■".repeat(seed.difficulty)}{"□".repeat(5 - seed.difficulty)}
                </div>
              )}
            </div>
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-xl font-bold font-display uppercase tracking-wide truncate group-hover:text-primary transition-colors">
                {seed.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <User className="w-3 h-3" />
              <span className="truncate">FORGED BY {seed.authorName || "UNKNOWN"}</span>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {seed.description || "No description provided."}
            </p>
            {features.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {features.slice(0, 3).map((feature: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs border-white/10">
                    {feature}
                  </Badge>
                ))}
                {features.length > 3 && (
                  <Badge variant="outline" className="text-xs border-white/10">
                    +{features.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-0 mt-auto">
            <div className="w-full flex items-center gap-2 bg-black/20 p-2 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
              <code className="flex-1 font-mono text-xs text-primary truncate">
                {seed.seedValue}
              </code>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 hover:text-primary hover:bg-primary/10"
                onClick={copyToClipboard}
                data-testid={`button-copy-seed-${seed.id}`}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}
