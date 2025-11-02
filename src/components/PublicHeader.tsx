import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavDropdown } from "@/components/ui/navDropdown";
import { SearchBar } from "@/components/ui/search-bar";

export const PublicHeader = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const learnDropdownSections = [
    {
      title: "Schools",
      items: [
        { text: "Animation and Game Development", icon: "🎮" },
        { text: "Artificial Intelligence", icon: "🤖" },
        { text: "Autonomous Systems", icon: "🚗" },
        { text: "Business", icon: "💼" },
        { text: "Career Resources", icon: "📚" },
        { text: "Cloud Computing", icon: "☁️" },
        { text: "Cybersecurity", icon: "🔒" },
        { text: "Data Science", icon: "📊" },
        { text: "DevOps", icon: "⚙️" },
        { text: "Executive Leadership", icon: "👔" },
        { text: "Product Management", icon: "📱" },
        { text: "Programming", icon: "💻" },
      ],
    },
    {
      title: "Popular",
      items: [
        { text: "Generative AI" },
        { text: "Data Scientist" },
        { text: "Data Analyst" },
        { text: "Data Engineering with AWS" },
        { text: "AI Programming with Python" },
      ],
    },
    {
      title: "Intro Courses",
      items: [
        { text: "Introduction to Python" },
        { text: "Introduction to Programming" },
        { text: "Introduction to SQL" },
        { text: "Programming for Data Science with Python" },
        { text: "Business Analytics" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-header-bg text-header-foreground">
      <div className="container flex h-16 items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">Q·AI</span>
          </div>
          <span className="text-sm font-semibold">QUANTUM AI</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('learn')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center gap-1 cursor-pointer py-2 group">
              <span className="transition-colors group-hover:text-blue-600">Learn</span>
              <div className={`transition-transform duration-200 ${activeDropdown === 'learn' ? 'rotate-180' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <NavDropdown
              sections={learnDropdownSections}
              isOpen={activeDropdown === 'learn'}
              // isOpen={true}
            />
          </div>
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
          <div className="hidden md:block">
            <SearchBar
              onSearch={(value) => {
                console.log('Selected:', value);
                // Handle search here (e.g., redirect to search results)
              }}
            />
          </div>
          <Button variant="outline" className="border-header-foreground text-header-foreground hover:bg-header-foreground/10">Sign In</Button>
          <Button className="bg-header-button hover:bg-header-button/90">Get Started</Button>
        </div>
      </div>
    </header>
  );
};
