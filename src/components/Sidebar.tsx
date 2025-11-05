import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  User, 
  // Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
  // { name: "Settings", href: "/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300",
        "md:relative md:top-0 md:h-screen",
        // Mobile = small, Desktop = full
        "w-16 md:w-64"
      )}
    >
      {/* Navigation */}
      <nav className="px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary text-primary-foreground shadow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                // Center icons on mobile
                "justify-center md:justify-start"
              )}
            >
              <item.icon className={cn("h-5 w-5", "md:mr-3")} />
              {/* Show text only on desktop */}
              <span className="hidden md:inline">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
