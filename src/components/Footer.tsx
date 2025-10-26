import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="text-lg font-bold text-accent-foreground">Q·AI</span>
              </div>
              <span className="text-sm font-semibold">EdTech</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">About us</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Contact us</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Privacy policy</Link></li>
            </ul>
          </div>

          {/* EdTech Schools */}
          <div>
            <h3 className="font-semibold mb-4">EdTech Schools</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">About us</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Contact us</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Privacy policy</Link></li>
            </ul>
          </div>

          {/* Featured Programs */}
          <div>
            <h3 className="font-semibold mb-4">Featured Programs</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-accent transition-colors">Business Analytics</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Business Analytics</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Business Analytics</Link></li>
              <li><Link to="/" className="hover:text-accent transition-colors">Business Analytics</Link></li>
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
