import { Layout } from "@/components/Layout";
import { useSeeds, useCategories } from "@/hooks/use-seeds";
import { SeedCard } from "@/components/SeedCard";
import { CreateSeedModal } from "@/components/CreateSeedModal";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X, Flame, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SeedsQueryParams, SeedCategory } from "@shared/schema";

const CATEGORY_ICONS: Record<string, string> = {
  survival: "Survival",
  adventure: "Adventure",
  building: "Building",
  exploration: "Exploration",
  challenge: "Challenge",
  resource: "Resource",
  village: "Village",
  spawn: "Spawn"
};

const DIFFICULTY_LABELS = ["", "Easy", "Normal", "Medium", "Hard", "Extreme"];

export default function Seeds() {
  const { isAuthenticated } = useAuth();
  const { data: categories } = useCategories();
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SeedCategory | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const params: SeedsQueryParams = {
    search: search || undefined,
    category: selectedCategory,
    difficulty: selectedDifficulty,
    sortBy,
  };

  const { data: seeds, isLoading } = useSeeds(params);

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedDifficulty(undefined);
    setSortBy('newest');
    setSearch("");
  };

  const hasActiveFilters = selectedCategory || selectedDifficulty || sortBy !== 'newest' || search;

  return (
    <Layout>
      <div className="flex flex-col gap-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-wider mb-2">Seed Database</h1>
            <p className="text-muted-foreground font-mono">
              Access code: {seeds?.length || 0} entries found.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="SEARCH DATABASE..." 
                className="pl-9 bg-black/20 border-white/10 focus:border-primary/50 font-mono text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Button 
              variant={showFilters ? "default" : "outline"} 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary" : "border-white/10"}
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            {isAuthenticated && <CreateSeedModal />}
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-panel p-4 space-y-4">
                {/* Sort By */}
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block">Sort By</label>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant={sortBy === 'newest' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSortBy('newest')}
                      className="font-mono text-xs"
                      data-testid="button-sort-newest"
                    >
                      <Clock className="h-3 w-3 mr-1" /> Newest
                    </Button>
                    <Button 
                      variant={sortBy === 'popular' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSortBy('popular')}
                      className="font-mono text-xs"
                      data-testid="button-sort-popular"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" /> Popular
                    </Button>
                    <Button 
                      variant={sortBy === 'rating' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSortBy('rating')}
                      className="font-mono text-xs"
                      data-testid="button-sort-rating"
                    >
                      <Flame className="h-3 w-3 mr-1" /> Top Rated
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block">Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {categories?.map((cat) => (
                      <Badge 
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        className="cursor-pointer uppercase text-xs"
                        onClick={() => setSelectedCategory(selectedCategory === cat ? undefined : cat)}
                        data-testid={`badge-category-${cat}`}
                      >
                        {CATEGORY_ICONS[cat] || cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block">Difficulty</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Button
                        key={level}
                        variant={selectedDifficulty === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDifficulty(selectedDifficulty === level ? undefined : level)}
                        className="font-mono text-xs"
                        data-testid={`button-difficulty-${level}`}
                      >
                        {DIFFICULTY_LABELS[level]}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-destructive hover:text-destructive"
                    data-testid="button-clear-filters"
                  >
                    <X className="h-3 w-3 mr-1" /> Clear All Filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {hasActiveFilters && !showFilters && (
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-muted-foreground font-mono">Active filters:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="text-xs">
                {CATEGORY_ICONS[selectedCategory]}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory(undefined)} />
              </Badge>
            )}
            {selectedDifficulty && (
              <Badge variant="secondary" className="text-xs">
                {DIFFICULTY_LABELS[selectedDifficulty]}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedDifficulty(undefined)} />
              </Badge>
            )}
            {sortBy !== 'newest' && (
              <Badge variant="secondary" className="text-xs">
                Sort: {sortBy}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSortBy('newest')} />
              </Badge>
            )}
          </div>
        )}

        {/* Seeds Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {seeds?.map((seed, i) => (
              <motion.div
                key={seed.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <SeedCard seed={seed} />
              </motion.div>
            ))}
            
            {seeds?.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-xl bg-black/20">
                <h3 className="text-xl font-display font-bold text-muted-foreground mb-2">NO MATCHES FOUND</h3>
                <p className="text-sm text-muted-foreground/60 font-mono">Adjust search parameters or log a new discovery.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
