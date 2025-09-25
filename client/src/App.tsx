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
import BookingSuccess from "@/pages/booking-success";
import OrderCheckout from "@/pages/order-checkout";
import OrderSuccess from "@/pages/order-success";
import Checkout from "@/pages/checkout";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Navbar from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";

function Router() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Switch>
        {/* Authentication routes without navbar */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

        {/* Protected routes with navbar */}
        <Route
          path="/"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/dashboard"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/search"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <PropertySearch />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/property-search"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <PropertySearch />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/design"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <DesignRoom />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/design-room"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <DesignRoom />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/ai"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <AiAssistant />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/ai-assistant"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <AiAssistant />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/booking"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <BookConsultation />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/book-consultation"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <BookConsultation />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/booking-success"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <BookingSuccess />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/order-checkout"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <OrderCheckout />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/order-success"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <OrderSuccess />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/checkout"
          component={() => (
            <ProtectedRoute>
              <Navbar />
              <Checkout />
            </ProtectedRoute>
          )}
        />
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
