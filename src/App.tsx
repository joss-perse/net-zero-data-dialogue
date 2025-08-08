import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TenantSurvey from "./pages/surveys/TenantSurvey";
import LandlordSurvey from "./pages/surveys/LandlordSurvey";
import AdvisorSurvey from "./pages/surveys/AdvisorSurvey";
import InvestorSurvey from "./pages/surveys/InvestorSurvey";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/surveys/tenant" element={<TenantSurvey />} />
            <Route path="/surveys/landlord" element={<LandlordSurvey />} />
            <Route path="/surveys/advisor" element={<AdvisorSurvey />} />
            <Route path="/surveys/investors" element={<InvestorSurvey />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
