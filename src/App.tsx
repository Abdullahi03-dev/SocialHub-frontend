// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/protectedRoute";
import NotFound from "./pages/NotFound";
import {Toaster} from 'react-hot-toast'
import Single_page_user from './pages/single_page_user'


// const queryClient = new QueryClient();

const App = () => (
  <>
  <Toaster position='top-left'/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
               <Profile />
            </ProtectedRoute>
         
          }
          />
          <Route path="/singlepage/:id" element={
            <ProtectedRoute>
              <Single_page_user />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </>
  // <QueryClientProvider client={queryClient}>
    // <TooltipProvider>
      // <Toaster />
      // <Sonner />
      
    // {/* </TooltipProvider> */}
  // </QueryClientProvider>
);

export default App;
