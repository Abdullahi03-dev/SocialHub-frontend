import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {  LogOut } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}
const Header = ({ isAuthenticated = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();


  const logout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/logout", {}, { withCredentials: true });
      localStorage.removeItem('email')
      toast.success("Logged out successfully");
      setTimeout(()=>{
        navigate(0)
      },1000)
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // const handleLogout = () => {
  //   if (onLogout) {
  //     onLogout();
  //   }
  //   navigate('/');
  // };

  const isLandingPage = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
          <span className="font-heading text-xl font-bold">SocialHub</span>
        </Link>

        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>



              {/* <Link to="/users">
                <Button variant="ghost" size="sm">
                  Users
                </Button>
              </Link> */}
              {/* <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link> */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4 mr-2"/>
                Logout
              </Button>
            </>
          ) : (
            <>
              {!isLandingPage && (
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    Home
                  </Button>
                </Link>
              )}
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="sm" className="btn-hero">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;