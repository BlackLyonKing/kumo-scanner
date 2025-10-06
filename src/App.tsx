import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import Index from "./pages/Index";
import CoursePage from "./pages/CoursePage";
import ChartPatternsCoursePage from "./pages/ChartPatternsCoursePage";
import MarketPsychologyCoursePage from "./pages/MarketPsychologyCoursePage";
import AlgorithmicTradingCoursePage from "./pages/AlgorithmicTradingCoursePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/course/ichimoku-mastery" element={<CoursePage />} />
            <Route path="/course/chart-patterns" element={<ChartPatternsCoursePage />} />
            <Route path="/course/market-psychology" element={<MarketPsychologyCoursePage />} />
            <Route path="/course/algorithmic-trading" element={<AlgorithmicTradingCoursePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
