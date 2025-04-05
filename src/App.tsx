
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ExplorePlants from "./pages/ExplorePlants";
import PlantDetailPage from "./pages/PlantDetailPage";
import AISkinAnalyzer from "./pages/AISkinAnalyzer";
import Chatbot from "./pages/Chatbot";
import HomeRemedies from "./pages/HomeRemedies";
import RemedyDetail from "./pages/RemedyDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExplorePlants />} />
          <Route path="/plant/:id" element={<PlantDetailPage />} />
          <Route path="/analyzer" element={<AISkinAnalyzer />} />
          <Route path="/remedies" element={<HomeRemedies />} />
          <Route path="/remedies/:id" element={<RemedyDetail />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/get-started" element={<Placeholder />} />
          <Route path="/search" element={<Placeholder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
