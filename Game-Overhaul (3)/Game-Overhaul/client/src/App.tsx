import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Play from "@/pages/Play";
import Seeds from "@/pages/Seeds";
import SeedDetails from "@/pages/SeedDetails";
import Guide from "@/pages/Guide";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/play" component={Play} />
      <Route path="/seeds" component={Seeds} />
      <Route path="/seeds/:id" component={SeedDetails} />
      <Route path="/guide" component={Guide} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/profile" component={Profile} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
