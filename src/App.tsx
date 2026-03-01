import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import Rewards from "./pages/Rewards";
import Transactions from "./pages/Transactions";
import Jobs from "./pages/Jobs";
import LiveFeed from "./pages/LiveFeed";
import Auth from "./pages/Auth";
import Track from "./pages/Track";
import Capture from "./pages/Capture";
import Spend from "./pages/Spend";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/:id" element={<MemberProfile />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/feed" element={<LiveFeed />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/track" element={<Track />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/spend" element={<Spend />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
