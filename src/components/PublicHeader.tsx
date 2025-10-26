import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">Q·AI</span>
          </div>
          <span className="text-sm font-semibold">QUANTUM AI</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-accent">
            Learn
          </Link>
          <Link to="/courses" className="transition-colors hover:text-accent">
            Catalogue
          </Link>
          <span className="transition-colors hover:text-accent cursor-pointer">Individuals</span>
          <span className="transition-colors hover:text-accent cursor-pointer">Business</span>
          <span className="transition-colors hover:text-accent cursor-pointer">Government</span>
          <span className="transition-colors hover:text-accent cursor-pointer">Universities</span>
          <span className="transition-colors hover:text-accent cursor-pointer">Resources</span>
        </nav>

        {/* Search and Auth */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What do you want to learn today"
              className="w-64 pl-9"
            />
          </div>
          <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
};
