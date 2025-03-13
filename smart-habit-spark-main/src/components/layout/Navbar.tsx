
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Home, PlusCircle, Settings, UserCircle } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
    { path: "/add-habit", icon: PlusCircle, label: "Add" },
    { path: "/profile", icon: UserCircle, label: "Profile" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <header className={`fixed bottom-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled ? "shadow-lg" : ""} md:top-0 md:bottom-auto`}>
      <div className="glass px-2 pb-2 pt-2 md:px-4 md:py-3">
        <nav className="mx-auto max-w-7xl">
          <ul className="flex items-center justify-around md:justify-center md:gap-12">
            {navItems.map((item) => (
              <li key={item.path} className="relative">
                <Link
                  to={item.path}
                  className="flex flex-col items-center justify-center p-2 text-foreground/70 transition-colors hover:text-foreground"
                >
                  <item.icon className="h-6 w-6" />
                  <span className="mt-1 text-xs font-medium md:hidden">{item.label}</span>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary md:top-0 md:bottom-auto md:h-1 md:rounded-b-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
