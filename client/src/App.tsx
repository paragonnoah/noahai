import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProgramsPage from "./pages/ProgramsPage";
import ScopeManagerPage from "./pages/ScopeManagerPage";
import SessionProfilesPage from "./pages/SessionProfilesPage";
import FindingsPage from "./pages/FindingsPage";
import EvidencePage from "./pages/EvidencePage";
import ReportsPage from "./pages/ReportsPage";
import DashboardLayout from "./components/DashboardLayout";
import { useAuth } from "./_core/hooks/useAuth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!isAuthenticated) return <NotFound />;

  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/programs" component={() => <ProtectedRoute component={ProgramsPage} />} />
      <Route path="/programs/:programId/scopes" component={() => <ProtectedRoute component={ScopeManagerPage} />} />
      <Route path="/programs/:programId/sessions" component={() => <ProtectedRoute component={SessionProfilesPage} />} />
      <Route path="/programs/:programId/findings" component={() => <ProtectedRoute component={FindingsPage} />} />
      <Route path="/programs/:programId/evidence" component={() => <ProtectedRoute component={EvidencePage} />} />
      <Route path="/programs/:programId/reports" component={() => <ProtectedRoute component={ReportsPage} />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
