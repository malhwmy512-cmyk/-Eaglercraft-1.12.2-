import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SeedCard } from "@/components/SeedCard";
import { 
  User, 
  Trophy, 
  Star, 
  Heart, 
  Sprout,
  TrendingUp,
  Award,
  LogIn
} from "lucide-react";
import type { SeedResponse } from "@shared/schema";

export default function Profile() {
  const { isAuthenticated, user } = useAuth();

  const { data: userStats } = useQuery<{ seedsCreated: number; ratingsGiven: number; favoritesCount: number; totalPoints: number }>({
    queryKey: ['/api/stats/user'],
    enabled: isAuthenticated,
  });

  const { data: favorites, isLoading: loadingFavorites } = useQuery<SeedResponse[]>({
    queryKey: ['/api/favorites'],
    enabled: isAuthenticated,
  });

  const { data: userAchievements } = useQuery({
    queryKey: ['/api/achievements/user'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="p-6 rounded-full bg-primary/10 mb-6">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold uppercase mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Sign in to view your profile, track your achievements, and manage your favorite seeds.
          </p>
          <a href="/api/login">
            <Button className="bg-primary font-bold uppercase" data-testid="button-login">
              Initialize Session
            </Button>
          </a>
        </div>
      </Layout>
    );
  }

  const unlockedCount = (userAchievements as any[])?.length || 0;

  return (
    <Layout>
      <div className="flex flex-col gap-8 min-h-screen pb-20">
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">
                {user?.firstName || 'Explorer'}
              </h1>
              <p className="text-muted-foreground font-mono text-sm">
                TerraForge Member
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-panel" data-testid="card-user-points">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-black font-display text-primary">{userStats?.totalPoints || 0}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Total Points</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-panel" data-testid="card-user-seeds">
              <CardContent className="pt-6 text-center">
                <Sprout className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-black font-display text-foreground">{userStats?.seedsCreated || 0}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Seeds Created</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-panel" data-testid="card-user-ratings">
              <CardContent className="pt-6 text-center">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-3xl font-black font-display text-foreground">{userStats?.ratingsGiven || 0}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Ratings Given</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-panel" data-testid="card-user-favorites">
              <CardContent className="pt-6 text-center">
                <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-3xl font-black font-display text-foreground">{userStats?.favoritesCount || 0}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Favorites</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievements Progress */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display uppercase">
              <Award className="h-5 w-5 text-primary" />
              Achievements Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-mono">{unlockedCount} / 8 achievements unlocked</span>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {Math.round((unlockedCount / 8) * 100)}%
              </Badge>
            </div>
            <Progress value={(unlockedCount / 8) * 100} className="h-2" />
            <a href="/achievements" className="block mt-4">
              <Button variant="outline" className="w-full font-mono text-sm" data-testid="button-view-achievements">
                <TrendingUp className="mr-2 h-4 w-4" />
                View All Achievements
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Favorites Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="h-6 w-6 text-red-400" />
            <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Your Favorites</h2>
          </div>

          {loadingFavorites ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favorites.map((seed, i) => (
                <motion.div
                  key={seed.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <SeedCard seed={seed} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="glass-panel border-dashed">
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">No Favorites Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse seeds and add them to your favorites collection.
                </p>
                <a href="/seeds">
                  <Button variant="outline" data-testid="button-browse-seeds">Browse Seeds</Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
