import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import AgeGate from "./pages/AgeGate";
import FaceVerify from "./pages/FaceVerify";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ProfileSetup from "./pages/ProfileSetup";
import TestPanel from "./pages/TestPanel";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Splash} />
      <Route path={"/login"} component={Login} />
      <Route path={"/age-gate"} component={AgeGate} />
      <Route path={"/face-verify"} component={FaceVerify} />
      <Route path={"/home"} component={Home} />
      <Route path={"/chat/:matchId"} component={Chat} />
      <Route path={"/profile-setup"} component={ProfileSetup} />
      <Route path={"/test-panel"} component={TestPanel} />
      <Route path={"/subscription/success"} component={SubscriptionSuccess} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "oklch(0.14 0.05 280)",
                border: "1px solid oklch(0.30 0.08 285 / 0.5)",
                color: "oklch(0.95 0.01 280)",
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
