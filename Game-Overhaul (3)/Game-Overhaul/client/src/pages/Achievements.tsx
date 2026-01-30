import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Compass, 
  Star, 
  MessageSquare, 
  Sprout, 
  Flame,
  Map,
  Crown,
  Lock
} from "lucide-react";
import type { Achievement } from "@shared/schema";

const ICON_MAP: Record<string, any> = {
  Compass,
  Star,
  MessageSquare,
  Sprout,
  Flame,
  Map,
  Trophy,
  Crown
};

const TYPE_COLORS: Record<string, string> = {
  explorer: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  collector: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  builder: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  warrior: "bg-red-500/20 text-red-400 border-red-500/30",
  social: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  legendary: "bg-primary/20 text-primary border-primary/30",
};

export default function Achievements() {
  const { isAuthenticated, user } = useAuth();

  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
    queryFn: async () => {
      const res = await fetch('/api/achievements');
      if (!res.ok) throw new Error('Failed to fetch achievements');
      return res.json();
    },
  });

  const { data: userAchievements } = useQuery({
    queryKey: ['/api/achievements/user'],
    queryFn: async () => {
      const res = await fetch('/api/achievements/user', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const unlockedIds = new Set(userAchievements?.map((ua: any) => ua.achievementId) || []);
  const totalPoints = achievements?.reduce((sum, a) => sum + (a.points || 0), 0) || 0;
  const earnedPoints = userAchievements?.reduce((sum: number, ua: any) => sum + (ua.achievement?.points || 0), 0) || 0;

  return (
    <Layout>
      <div className="flex flex-col gap-8 min-h-screen pb-20">
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-wider">
              Achievements
            </h1>
          </div>
          <p className="text-muted-foreground font-mono">
            Complete challenges and earn rewards for your exploration.
          </p>
        </div>

        {/* Progress Overview */}
        {isAuthenticated && (
          <Card className="glass-panel">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-display font-bold">Your Progress</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {unlockedIds.size} / {achievements?.length || 0} achievements unlocked
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black font-display text-primary">{earnedPoints}</div>
                  <div className="text-xs text-muted-foreground font-mono">/ {totalPoints} points</div>
                </div>
              </div>
              <Progress value={(earnedPoints / totalPoints) * 100} className="h-3" />
            </CardContent>
          </Card>
        )}

        {!isAuthenticated && (
          <Card className="glass-panel border-dashed">
            <CardContent className="pt-6 text-center">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-display font-bold mb-2">Login to Track Progress</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in to unlock achievements and track your exploration journey.
              </p>
              <a href="/api/login">
                <Button className="bg-primary font-bold uppercase">
                  Initialize Session
                </Button>
              </a>
            </CardContent>
          </Card>
        )}

        {/* Achievements Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.map((achievement, i) => {
              const isUnlocked = unlockedIds.has(achievement.id);
              const IconComponent = ICON_MAP[achievement.icon || 'Trophy'] || Trophy;
              const typeClass = TYPE_COLORS[achievement.type || 'explorer'] || TYPE_COLORS.explorer;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    className={`glass-panel transition-all duration-300 ${
                      isUnlocked 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'opacity-60 grayscale'
                    }`}
                    data-testid={`card-achievement-${achievement.id}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-primary/20' : 'bg-white/10'}`}>
                            <IconComponent className={`h-6 w-6 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-display uppercase">
                              {achievement.name}
                            </CardTitle>
                            <Badge className={`${typeClass} text-xs border mt-1`}>
                              {achievement.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold font-display ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                            +{achievement.points}
                          </div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {isUnlocked && (
                        <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                          Unlocked
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
