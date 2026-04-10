import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  clearAuthToken,
  decodeAuthToken,
  getAuthToken,
  isTokenExpired,
} from "@/api/http";
import Index from "./pages/Index.tsx";
import MyStudents from "./pages/MyStudents.tsx";
import StudentProgressList from "./pages/StudentProgressList.tsx";
import StudentProgress from "./pages/StudentProgress.tsx";
import SOPReviewList from "./pages/SOPReviewList.tsx";
import SOPReviewDetail from "./pages/SOPReviewDetail.tsx";
import Notifications from "./pages/Notifications.tsx";
import UniversitySearch from "./pages/UniversitySearch.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const RequireCounselorAuth = () => {
  const location = useLocation();
  const token = getAuthToken();
  const payload = decodeAuthToken(token);

  const hasCounselorRole =
    String(payload?.role || "").toLowerCase() === "counselor";
  const expired = isTokenExpired(payload);

  if (!token || !payload || !hasCounselorRole || expired) {
    clearAuthToken();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireCounselorAuth />}>
            <Route path="/" element={<Index />} />
            <Route path="/my-students" element={<MyStudents />} />
            <Route path="/student-progress" element={<StudentProgressList />} />
            <Route
              path="/dashboard/student-progress/:studentId"
              element={<StudentProgress />}
            />
            <Route path="/sop-review" element={<SOPReviewList />} />
            <Route
              path="/dashboard/sop-review/:sopId"
              element={<SOPReviewDetail />}
            />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/university-search" element={<UniversitySearch />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
