import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import MyStudents from "./pages/MyStudents.tsx";
import StudentProgressList from "./pages/StudentProgressList.tsx";
import StudentProgress from "./pages/StudentProgress.tsx";
import SOPReviewList from "./pages/SOPReviewList.tsx";
import SOPReviewDetail from "./pages/SOPReviewDetail.tsx";
import Notifications from "./pages/Notifications.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/my-students" element={<MyStudents />} />
          <Route path="/student-progress" element={<StudentProgressList />} />
          <Route path="/dashboard/student-progress/:studentId" element={<StudentProgress />} />
          <Route path="/sop-review" element={<SOPReviewList />} />
          <Route path="/dashboard/sop-review/:studentId" element={<SOPReviewDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
