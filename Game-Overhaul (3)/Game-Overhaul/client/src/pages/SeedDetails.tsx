import { Layout } from "@/components/Layout";
import { useRoute } from "wouter";
import { useSeed, useRatings } from "@/hooks/use-seeds";
import { useAuth } from "@/hooks/use-auth";
import { AddRatingForm } from "@/components/AddRatingForm";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, User, Calendar, ArrowLeft, Loader2, Flame, Eye, Play } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

const DIFFICULTY_LABELS = ["", "Easy", "Normal", "Medium", "Hard", "Extreme"];
const DIFFICULTY_COLORS = ["", "text-green-400", "text-lime-400", "text-yellow-400", "text-orange-400", "text-red-400"];

export default function SeedDetails() {
  const [, params] = useRoute("/seeds/:id");
  const id = Number(params?.id);
  const { data: seed, isLoading: seedLoading } = useSeed(id);
  const { data: ratings, isLoading: ratingsLoading } = useRatings(id);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (seedLoading || !seed) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(seed.seedValue);
    toast({
      title: "Copied to Clipboard",
      description: "Seed value ready for injection.",
      className: "bg-primary text-primary-foreground",
    });
  };

  const features = seed.features ? JSON.parse(seed.features) : [];
  const categoryClass = CATEGORY_COLORS[seed.category || 'survival'] || CATEGORY_COLORS.survival;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-20">
        <Link href="/seeds">
          <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-primary mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Database
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
              {seed.imageUrl ? (
                <img src={seed.imageUrl} alt={seed.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="font-display text-4xl text-white/5 font-bold uppercase">No Visual Data</span>
                </div>
              )}
              
              {/* Top badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {seed.isFeatured && (
                  <Badge className="bg-primary/90 text-primary-foreground border-0">
                    <Flame className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                )}
                {seed.category && (
                  <Badge className={`${categoryClass} border uppercase`}>
                    {seed.category}
                  </Badge>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-20">
                <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-wider mb-2">
                  {seed.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-300 font-mono flex-wrap">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>{seed.authorName || "UNKNOWN"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{seed.createdAt ? format(new Date(seed.createdAt), 'MMM d, yyyy') : 'Unknown Date'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span>{seed.viewCount || 0} views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty and Features */}
            <div className="flex flex-wrap gap-4">
              {seed.difficulty && (
                <div className="glass-panel p-4 rounded-xl flex-1 min-w-[200px]">
                  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-2">Difficulty</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${DIFFICULTY_COLORS[seed.difficulty]}`}>
                      {DIFFICULTY_LABELS[seed.difficulty]}
                    </span>
                    <span className={`text-sm ${DIFFICULTY_COLORS[seed.difficulty]}`}>
                      {"■".repeat(seed.difficulty)}{"□".repeat(5 - seed.difficulty)}
                    </span>
                  </div>
                </div>
              )}
              
              {features.length > 0 && (
                <div className="glass-panel p-4 rounded-xl flex-[2] min-w-[200px]">
                  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-2">Features</h4>
                  <div className="flex gap-2 flex-wrap">
                    {features.map((feature: string, i: number) => (
                      <Badge key={i} variant="outline" className="border-white/20">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-display font-bold text-primary mb-4 uppercase flex items-center gap-2">
                <span className="w-1 h-6 bg-primary block" />
                Terrain Analysis
              </h3>
              <p className="text-gray-300 leading-relaxed font-mono">
                {seed.description || "No detailed analysis provided for this sector."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold uppercase">Field Reports ({ratings?.length || 0})</h3>
              </div>
              
              <div className="space-y-4">
                {ratingsLoading ? (
                  <div className="h-20 bg-white/5 animate-pulse rounded" />
                ) : ratings && ratings.length > 0 ? (
                  ratings.map((rating: any) => (
                    <div key={rating.id} className="bg-card/40 border border-white/5 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-sm text-primary">{rating.username || "Anonymous"}</div>
                          <span className="text-xs text-muted-foreground">• {rating.createdAt ? format(new Date(rating.createdAt), 'MMM d, yyyy') : ''}</span>
                        </div>
                        <RatingStars rating={rating.score} size="sm" readonly />
                      </div>
                      <p className="text-sm text-gray-400 font-mono">{rating.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm font-mono italic">No field reports submitted yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seed Value Card */}
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2 font-mono">Generation Seed</h3>
              <div className="flex items-center gap-2 bg-black/40 p-3 rounded border border-primary/20 mb-4">
                <code className="text-xl font-mono text-primary flex-1 truncate">{seed.seedValue}</code>
              </div>
              <div className="space-y-2">
                <Button onClick={copyToClipboard} className="w-full cyber-button bg-primary font-bold uppercase" data-testid="button-copy-seed">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Sequence
                </Button>
                <Link href="/play">
                  <Button variant="outline" className="w-full font-bold uppercase border-white/20" data-testid="button-play">
                    <Play className="mr-2 h-4 w-4" />
                    Launch Game
                  </Button>
                </Link>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 font-mono">Community Score</h3>
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-6xl font-black font-display text-white">
                  {Number(seed.averageRating || 0).toFixed(1)}
                </span>
                <div className="flex flex-col gap-1">
                  <RatingStars rating={Math.round(Number(seed.averageRating || 0))} size="md" readonly />
                  <span className="text-xs text-muted-foreground font-mono">{seed.ratingsCount || 0} Votes</span>
                </div>
              </div>
            </div>

            {/* Add Rating */}
            {isAuthenticated ? (
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 font-mono">Submit Report</h3>
                <AddRatingForm seedId={id} />
              </div>
            ) : (
              <div className="bg-white/5 border border-dashed border-white/10 p-6 rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-4">Login required to submit field reports.</p>
                <a href="/api/login">
                  <Button variant="outline" className="w-full" data-testid="button-login">Initialize Session</Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
