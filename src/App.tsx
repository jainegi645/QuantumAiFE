import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { AuthCallback } from "./components/auth/AuthCallback";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Auth from "./pages/Auth";
import CourseDetail from "./pages/CourseDetail";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/Dashboard.tsx";
import AddCourse from "./pages/AddCourse.tsx";
import MyCourses from "./pages/MyCourses";
import Students from "./pages/Students";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/students" element={<Students />} />
            {/* <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["educator"]}><Dashboard /></ProtectedRoute>} /> */}
            {/* <Route path="/add-course" element={<ProtectedRoute allowedRoles={["educator"]}><AddCourse /></ProtectedRoute>} />
            <Route path="/my-courses" element={<ProtectedRoute allowedRoles={["educator"]}><MyCourses /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute allowedRoles={["educator"]}><Students /></ProtectedRoute>} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
