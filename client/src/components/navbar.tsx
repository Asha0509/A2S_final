import { Link, useLocation } from "wouter";
import { 
  Home, 
  Search, 
  Palette, 
  Bot, 
  Calendar,
  Bell,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home, color: "text-teal-600" },
    { path: "/search", label: "Search Properties", icon: Search, color: "text-teal-600" },
    { path: "/design", label: "Design My Space", icon: Palette, color: "text-purple-600" },
    { path: "/ai", label: "AI Assistant", icon: Bot, color: "text-blue-600" },
    { path: "/booking", label: "Book Consultation", icon: Calendar, color: "text-emerald-600" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    return location === path;
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-4 cursor-pointer">
                <div className="bg-gradient-to-r from-teal-600 to-purple-600 text-white p-2 rounded-lg">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">A2S</h1>
                  <p className="text-xs text-slate-500">Aesthetics to Spaces</p>
                </div>
              </div>
            </Link>

            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant="ghost"
                      className={`nav-link ${
                        isActive(item.path)
                          ? item.color
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="icon" className="bg-slate-100 hover:bg-slate-200">
                  <Bell className="w-5 h-5 text-slate-600" />
                </Button>
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                >
                  3
                </Badge>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-purple-500 text-white text-sm font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:hidden z-50">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 ${
                    isActive(item.path) ? item.color : "text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label.split(' ')[0]}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
