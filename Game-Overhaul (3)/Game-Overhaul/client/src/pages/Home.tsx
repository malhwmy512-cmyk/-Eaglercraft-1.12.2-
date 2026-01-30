import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Play, ChevronRight, Zap, Database, Users, Star, Trophy, Gamepad2 } from "lucide-react";
import { useFeaturedSeeds } from "@/hooks/use-seeds";
import { SeedCard } from "@/components/SeedCard";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: featuredSeeds, isLoading } = useFeaturedSeeds();
  
  const { data: stats } = useQuery<{ totalSeeds: number; totalUsers: number; totalRatings: number }>({
    queryKey: ['/api/stats'],
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 flex flex-col items-center text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Online
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 text-shadow">
            FORGE YOUR <br/>
            <span className="text-primary drop-shadow-[0_0_15px_rgba(255,95,31,0.5)]">OWN REALITY</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-10 leading-relaxed">
            TerraForge is the ultimate archive for procedural generation anomalies. 
            Discover, rate, and explore the most unique worlds ever generated.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/play">
              <Button size="lg" className="cyber-button h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest" data-testid="button-play-hero">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Initialize Game
              </Button>
            </Link>
            
            <Link href="/seeds">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/20 hover:bg-white/5 uppercase tracking-widest" data-testid="button-seeds-hero">
                Explore Database
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-panel text-center" data-testid="card-stat-seeds">
              <CardContent className="pt-6">
                <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-black font-display text-foreground">{stats?.totalSeeds || 0}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Seeds</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-panel text-center" data-testid="card-stat-users">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-3xl font-black font-display text-foreground">{stats?.totalUsers || 0}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Explorers</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-panel text-center" data-testid="card-stat-ratings">
              <CardContent className="pt-6">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-3xl font-black font-display text-foreground">{stats?.totalRatings || 0}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Ratings</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-panel text-center" data-testid="card-stat-featured">
              <CardContent className="pt-6">
                <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-black font-display text-foreground">{featuredSeeds?.length || 0}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Featured</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/play">
            <Card className="glass-panel hover:border-primary/50 transition-all cursor-pointer group" data-testid="card-action-play">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-4 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Gamepad2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg uppercase">Play Now</h3>
                  <p className="text-sm text-muted-foreground">Launch game client</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/seeds">
            <Card className="glass-panel hover:border-cyan-500/50 transition-all cursor-pointer group" data-testid="card-action-seeds">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-4 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                  <Database className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg uppercase">Seed Bank</h3>
                  <p className="text-sm text-muted-foreground">Browse all seeds</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/achievements">
            <Card className="glass-panel hover:border-purple-500/50 transition-all cursor-pointer group" data-testid="card-action-achievements">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-4 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <Trophy className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg uppercase">Achievements</h3>
                  <p className="text-sm text-muted-foreground">Track your progress</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-display font-bold uppercase tracking-wider">Top Rated Anomalies</h2>
          </div>
          <Link href="/seeds">
            <Button variant="ghost" className="text-primary hover:text-primary/80" data-testid="button-view-all">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSeeds?.slice(0, 6).map((seed, i) => (
              <motion.div
                key={seed.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <SeedCard seed={seed} />
              </motion.div>
            ))}
            {(!featuredSeeds || featuredSeeds.length === 0) && (
              <div className="col-span-3 text-center py-20 border border-dashed border-white/10 rounded-xl bg-black/20">
                <p className="text-muted-foreground font-mono">No anomalies recorded in the database yet.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}
