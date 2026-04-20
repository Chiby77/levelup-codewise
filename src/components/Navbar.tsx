import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BluewaveLogo } from "@/components/BluewaveLogo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Digital Exams", path: "/exams" },
    { name: "Downloads", path: "/downloads" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-xl py-3 fixed w-full top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 z-50 relative group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity" />
              <BluewaveLogo className="relative h-9 w-9 rounded-lg" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-foreground text-lg font-extrabold tracking-tight">Bluewave</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">Academy</span>
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
