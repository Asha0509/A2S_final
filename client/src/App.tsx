import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import PropertySearch from "@/pages/property-search";
import DesignRoom from "@/pages/design-room";
import AiAssistant from "@/pages/ai-assistant";
import BookConsultation from "@/pages/book-consultation";
import Navbar from "@/components/navbar";

function Router() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/search" component={PropertySearch} />
        <Route path="/design" component={DesignRoom} />
        <Route path="/ai" component={AiAssistant} />
        <Route path="/booking" component={BookConsultation} />
        <Route component={NotFound} />
      </Switch>
    </div>
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
