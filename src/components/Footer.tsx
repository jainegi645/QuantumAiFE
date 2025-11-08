import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from '@/assets/logo12.png';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="items-left justify-left">
                              <img 
                                src={logo} 
                                alt="Logo" 
                                className="h-auto w-auto" 
                                style={{
                                  filter: 'contrast(1.1) brightness(1.05)',
                                  objectFit: 'contain',
                                  maxHeight: '56px'
                                }}
                              />
                            </div>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Master skills with our expert-curated courses, advance your career, and achieve your professional goals with flexible, accessible learning.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {/* <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li> */}
              <li><Link to="/" className="hover:text-accent transition-colors">About us</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Contact us</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Privacy policy</Link></li>
            </ul>
          </div>

          {/* EdTech Schools */}
          <div>
            <h3 className="font-semibold mb-4">EdTech Schools</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-accent transition-colors">Data Science</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Business</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">DevOps</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Cloud Computing</Link></li>
            </ul>
          </div>

          {/* Featured Programs */}
          <div>
            <h3 className="font-semibold mb-4">Featured Programs</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-accent transition-colors">Business Analytics</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Product Management</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Python Programming</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Web Development</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Subscribe to our newsletter</h3>
            <p className="text-sm text-primary-foreground/70 mb-4">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button className="bg-accent hover:bg-accent/90">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-primary-foreground/20">
          <p className="text-sm text-primary-foreground/60">
            Copyright 2024 © EdTech. All Right reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Facebook className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
            <Twitter className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
            <Instagram className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
            <Linkedin className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};
