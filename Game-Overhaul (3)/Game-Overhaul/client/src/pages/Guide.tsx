import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Keyboard, 
  MousePointer, 
  Gamepad2, 
  Settings, 
  Pickaxe, 
  Heart, 
  Mountain,
  TreePine,
  Flame,
  Snowflake,
  Compass,
  Castle,
  Skull,
  Gem,
  Ship,
  Home
} from "lucide-react";

const CONTROLS = [
  { key: "W / A / S / D", action: "Move Forward / Left / Back / Right", category: "movement" },
  { key: "Space", action: "Jump", category: "movement" },
  { key: "Shift", action: "Sneak / Walk Slowly", category: "movement" },
  { key: "Ctrl", action: "Sprint", category: "movement" },
  { key: "Left Click", action: "Attack / Break Block", category: "action" },
  { key: "Right Click", action: "Use Item / Place Block", category: "action" },
  { key: "E", action: "Open Inventory", category: "action" },
  { key: "Q", action: "Drop Item", category: "action" },
  { key: "1-9", action: "Select Hotbar Slot", category: "action" },
  { key: "F", action: "Swap Item to Offhand", category: "action" },
  { key: "Esc", action: "Pause / Open Menu", category: "system" },
  { key: "F1", action: "Toggle HUD", category: "system" },
  { key: "F2", action: "Take Screenshot", category: "system" },
  { key: "F3", action: "Debug Screen", category: "system" },
  { key: "F5", action: "Change Camera View", category: "system" },
  { key: "F11", action: "Toggle Fullscreen", category: "system" },
  { key: "T", action: "Open Chat", category: "multiplayer" },
  { key: "/", action: "Open Command", category: "multiplayer" },
  { key: "Tab", action: "Player List", category: "multiplayer" },
];

const BIOMES = [
  { name: "Plains", icon: TreePine, color: "text-green-400", description: "Flat, grassy terrain. Great for building bases." },
  { name: "Forest", icon: TreePine, color: "text-emerald-400", description: "Dense trees, ideal for wood resources." },
  { name: "Desert", icon: Flame, color: "text-yellow-400", description: "Sandy, hot biome with cacti and temples." },
  { name: "Mountains", icon: Mountain, color: "text-gray-400", description: "High peaks with caves and emeralds." },
  { name: "Taiga", icon: Snowflake, color: "text-cyan-400", description: "Cold forest with spruce trees and wolves." },
  { name: "Ocean", icon: Compass, color: "text-blue-400", description: "Vast water with underwater temples." },
];

const STRUCTURES = [
  { 
    name: "Pillager Outpost", 
    icon: Castle, 
    color: "text-red-400", 
    description: "قلعة Pillagers الخطيرة. تحتوي على كنوز ثمينة وأعداء أقوياء.",
    tips: ["أحضر درع قوي وسلاح جيد", "احذر من Pillagers المسلحين بالأقواس", "الكنوز في الصناديق داخل القلعة"],
    loot: ["Crossbow", "Emeralds", "Enchanted Books", "Iron Ingots"]
  },
  { 
    name: "Stronghold", 
    icon: Skull, 
    color: "text-purple-400", 
    description: "القلعة الضخمة تحت الأرض. تحتوي على بوابة End Portal.",
    tips: ["استخدم Eye of Ender للعثور عليها", "احذر من Silverfish", "ابحث عن مكتبة للحصول على كتب ساحرة"],
    loot: ["End Portal Frames", "Books", "Iron", "Silverfish Spawner"]
  },
  { 
    name: "Village", 
    icon: Home, 
    color: "text-amber-400", 
    description: "قرية سكانية مع قرويين للتجارة وموارد مجانية.",
    tips: ["حافظ على القرويين من الزومبي", "تجار الأسلحة يعطون أفضل الصفقات", "ابحث عن الحداد للحصول على موارد"],
    loot: ["Food", "Beds", "Iron Tools", "Emeralds"]
  },
  { 
    name: "Ocean Monument", 
    icon: Ship, 
    color: "text-cyan-400", 
    description: "معبد تحت الماء يحرسه Guardians. غني بالذهب.",
    tips: ["أحضر جرعات Water Breathing", "احذر من Elder Guardians", "الذهب مخفي في الغرف الداخلية"],
    loot: ["Gold Blocks", "Prismarine", "Sea Lanterns", "Sponges"]
  },
  { 
    name: "Mineshaft", 
    icon: Pickaxe, 
    color: "text-gray-400", 
    description: "منجم مهجور مع سكك حديدية وعناكب سامة.",
    tips: ["أحضر مشاعل كثيرة", "احذر من Cave Spiders", "الصناديق تحتوي على موارد نادرة"],
    loot: ["Rails", "Coal", "Iron", "Diamonds"]
  },
  { 
    name: "Desert Temple", 
    icon: Gem, 
    color: "text-yellow-400", 
    description: "معبد صحراوي مع كنوز وفخ TNT.",
    tips: ["لا تقف على الضغط الأزرق!", "احفر حول الفخ للوصول للكنوز", "4 صناديق بالأسفل"],
    loot: ["Diamonds", "Gold", "Emeralds", "Enchanted Books"]
  },
];

const TIPS = [
  "Always carry a water bucket - it can save you from fall damage and lava.",
  "Craft a bed on your first night to skip the darkness and set your spawn point.",
  "Torches placed in a mine help you find your way back and prevent mob spawns.",
  "Never dig straight down - you might fall into lava or a cave.",
  "Iron tools are the best balance of durability and efficiency for early game.",
  "Keep your most important items in your hotbar for quick access.",
  "Use shift/sneak while building to avoid falling off edges.",
  "Creepers are scared of cats - tame an ocelot for protection.",
];

export default function Guide() {
  return (
    <Layout>
      <div className="flex flex-col gap-8 min-h-screen pb-20">
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-wider mb-2">
            Operator Manual
          </h1>
          <p className="text-muted-foreground font-mono">
            Essential knowledge for TerraForge exploration.
          </p>
        </div>

        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="w-full justify-start bg-black/20 border border-white/10 p-1 mb-6 flex-wrap gap-1">
            <TabsTrigger value="controls" className="font-mono text-xs uppercase" data-testid="tab-controls">
              <Keyboard className="w-4 h-4 mr-2" /> Controls
            </TabsTrigger>
            <TabsTrigger value="structures" className="font-mono text-xs uppercase" data-testid="tab-structures">
              <Castle className="w-4 h-4 mr-2" /> Structures
            </TabsTrigger>
            <TabsTrigger value="biomes" className="font-mono text-xs uppercase" data-testid="tab-biomes">
              <Mountain className="w-4 h-4 mr-2" /> Biomes
            </TabsTrigger>
            <TabsTrigger value="tips" className="font-mono text-xs uppercase" data-testid="tab-tips">
              <Heart className="w-4 h-4 mr-2" /> Tips
            </TabsTrigger>
            <TabsTrigger value="seeds" className="font-mono text-xs uppercase" data-testid="tab-seeds">
              <Compass className="w-4 h-4 mr-2" /> Seeds
            </TabsTrigger>
          </TabsList>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Movement */}
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-display uppercase text-lg">
                    <MousePointer className="w-5 h-5 text-primary" /> Movement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {CONTROLS.filter(c => c.category === 'movement').map((ctrl, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <Badge variant="outline" className="font-mono text-xs bg-black/30">{ctrl.key}</Badge>
                      <span className="text-sm text-muted-foreground">{ctrl.action}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-display uppercase text-lg">
                    <Pickaxe className="w-5 h-5 text-primary" /> Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {CONTROLS.filter(c => c.category === 'action').map((ctrl, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <Badge variant="outline" className="font-mono text-xs bg-black/30">{ctrl.key}</Badge>
                      <span className="text-sm text-muted-foreground">{ctrl.action}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System */}
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-display uppercase text-lg">
                    <Settings className="w-5 h-5 text-primary" /> System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {CONTROLS.filter(c => c.category === 'system').map((ctrl, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <Badge variant="outline" className="font-mono text-xs bg-black/30">{ctrl.key}</Badge>
                      <span className="text-sm text-muted-foreground">{ctrl.action}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Multiplayer */}
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-display uppercase text-lg">
                    <Gamepad2 className="w-5 h-5 text-primary" /> Multiplayer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {CONTROLS.filter(c => c.category === 'multiplayer').map((ctrl, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <Badge variant="outline" className="font-mono text-xs bg-black/30">{ctrl.key}</Badge>
                      <span className="text-sm text-muted-foreground">{ctrl.action}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Structures Tab */}
          <TabsContent value="structures">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {STRUCTURES.map((structure, i) => (
                <Card key={i} className="glass-panel">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-display uppercase text-lg">
                      <structure.icon className={`w-6 h-6 ${structure.color}`} />
                      {structure.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{structure.description}</p>
                    
                    <div>
                      <h4 className="text-xs font-mono text-primary uppercase mb-2">Tips</h4>
                      <ul className="space-y-1">
                        {structure.tips.map((tip, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-mono text-primary uppercase mb-2">Loot</h4>
                      <div className="flex gap-2 flex-wrap">
                        {structure.loot.map((item, j) => (
                          <Badge key={j} variant="outline" className="text-xs border-white/20">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Biomes Tab */}
          <TabsContent value="biomes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BIOMES.map((biome, i) => (
                <Card key={i} className="glass-panel hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-display uppercase text-lg">
                      <biome.icon className={`w-5 h-5 ${biome.color}`} />
                      {biome.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{biome.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIPS.map((tip, i) => (
                <Card key={i} className="glass-panel">
                  <CardContent className="pt-6 flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold font-mono">{i + 1}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Seeds Guide Tab */}
          <TabsContent value="seeds">
            <div className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="font-display uppercase text-lg">What are Seeds?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Seeds are special codes that determine how your world is generated. Each seed creates a unique world with specific terrain, biomes, structures, and resources.
                  </p>
                  <div className="bg-black/30 p-4 rounded border border-white/10">
                    <h4 className="font-mono text-sm text-primary mb-2">How to use a seed:</h4>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Click "Create New World" in the game</li>
                      <li>Click "More World Options"</li>
                      <li>Enter the seed code in the "Seed" field</li>
                      <li>Create your world and explore!</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="font-display uppercase text-lg">Seed Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-black/20 rounded border border-white/5">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">Survival</Badge>
                      <p className="text-xs text-muted-foreground">Balanced resources for survival mode</p>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded border border-white/5">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">Adventure</Badge>
                      <p className="text-xs text-muted-foreground">Interesting landscapes to explore</p>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded border border-white/5">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-2">Challenge</Badge>
                      <p className="text-xs text-muted-foreground">Difficult starting conditions</p>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded border border-white/5">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-2">Village</Badge>
                      <p className="text-xs text-muted-foreground">Villages near spawn point</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
