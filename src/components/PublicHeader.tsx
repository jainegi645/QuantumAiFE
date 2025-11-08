import { Link } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { NavDropdown } from "@/components/ui/navDropdown";
import { SearchBar } from "@/components/ui/search-bar";
import logo2 from '@/assets/logo12.png';

export const PublicHeader = () => {
  const context = useContext(AppContext);
  const user = context?.user;
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const ddRef = useRef<HTMLDivElement | null>(null);
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

  const userInitial = user?.name ? user.name.split(" ").map((n: string) => n[0]).slice(0,2).join("") : 'G';
  console.log('PublicHeader user:', user);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-header-bg text-header-foreground">
      <div className="container flex h-16 items-center justify-between relative">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded" onClick={() => setShowSidebar(true)} aria-label="open sidebar">
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="justify-left items-left space-x-2">
              <div className="items-left justify-left">
                <img 
                  src={logo2} 
                  alt="Logo" 
                  className="h-auto w-auto" 
                  style={{
                    filter: 'contrast(1.1) brightness(1.05)',
                    objectFit: 'contain',
                    maxHeight: '56px'
                  }}
                />
              </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {/* <Link to="/" className="transition-colors hover:text-accent">Learn</Link> */}
          
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
          <Link to="/courses" className="transition-colors hover:text-accent">Catalogue</Link>
          <span className="transition-colors hover:text-accent cursor-pointer">Individuals</span>
          <span className="transition-colors hover:text-accent cursor-pointer">Business</span>
          <span className="transition-colors hover:text-accent cursor-pointer">Government</span>
          <span className="transition-colors hover:text-accent cursor-pointer">Universities</span>
          {/* <span className="transition-colors hover:text-accent cursor-pointer">Resources</span> */}
        </nav>

        {/* Search and Auth */}
        <div className="flex items-center gap-3">
          {/* <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="What do you want to learn today" className="w-64 pl-9" /> */}
          <div className="hidden md:block">
            <SearchBar
              onSearch={(value) => {
                console.log('Selected:', value);
                // Handle search here (e.g., redirect to search results)
              }}
            />
          </div>

          {showSidebar && (
            <Sidebar mobile onClose={() => setShowSidebar(false)} />
          )}

          {context?.isAuthenticated ? (
            <div className="relative" ref={ddRef}>
              <button onClick={() => setShowProfile(v => !v)} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user?.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <div className="hidden md:block text-sm">
                  <div className="font-medium">{user?.name ?? 'Guest'}</div>
                  {/* <div className="text-xs text-muted-foreground">{user?.role ?? ''}</div> */}
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-40 bg-primary/95 border rounded shadow-md z-50">
                  <Link to="/dashboard" className="block px-3 py-2 hover:bg-primary/20">Dashboard</Link>
                  <Link to="/profile" className="block px-3 py-2 hover:bg-primary/20">Profile</Link>
                  {/* <Link to="/profile" className="block px-3 py-2 text-header-foreground-10 hover:bg-header-button/10">Profile</Link> */}
                  <Link to="/settings" className="block px-3 py-2 hover:bg-primary/20">Settings</Link>
                  <button onClick={() => context.logout()} className="w-full text-left px-3 py-2 hover:bg-primary/20">Logout</button>
                </div>
              )}
            </div>
          ) : (
            // <div className="flex gap-2">
            //   <Button asChild variant="outline">
            //     <Link to="/auth">Log In</Link>
            //   </Button>
            //   <Button asChild>
            //     <Link to="/auth?tab=register">Sign Up</Link>
            //   </Button>
            // </div>
            <div className="flex gap-2">
              <Button className="bg-header-button/10 text-header hover:bg-header-button/10"><Link to="/auth">Sign In</Link></Button>
              <Button className="bg-header-button hover:bg-header-button/90"><Link to="/auth?tab=register">Start for Free</Link></Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
