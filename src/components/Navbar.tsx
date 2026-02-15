import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Analysis", path: "/analysis" },
  { label: "Trends", path: "/trends" },
  { label: "AI Generator", path: "/generator" },
  { label: "Roadmap", path: "/roadmap" },
  { label: "Pricing", path: "/pricing" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === "/";
  const { user, signOut } = useAuth();

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md ${isLanding ? "gradient-warm" : "bg-primary/95"}`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-xl font-bold text-primary-foreground">TrendPilot AI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-secondary/20 text-secondary"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-xs text-primary-foreground/60">{user.email}</span>
              <Button variant="secondary" size="sm" className="gap-2 font-semibold" onClick={signOut}>
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="secondary" size="sm" className="font-semibold">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        <button className="text-primary-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-secondary/20 px-6 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Button variant="secondary" size="sm" className="mt-2 w-full gap-2 font-semibold" onClick={() => { signOut(); setMobileOpen(false); }}>
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" size="sm" className="mt-2 w-full font-semibold">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
