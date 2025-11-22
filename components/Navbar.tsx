import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAchievements } from '../contexts/AchievementContext';

interface NavbarProps {
  onOpenTerminal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const { trackEvent } = useAchievements();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    trackEvent('logo_clicks');
    
    if (newCount === 5) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
    } else if (newCount === 10) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
    
    // Reset after 3 seconds if not clicking
    setTimeout(() => {
      setLogoClickCount(prev => {
        if (prev === newCount) {
          return 0;
        }
        return prev;
      });
    }, 2000);
    
    // Always open terminal
    onOpenTerminal();
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Code', href: '#code-snippets' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <button 
            type="button"
            onClick={handleLogoClick}
            className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
            title="Enter Terminal Mode"
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg group-hover:from-green-600 group-hover:to-green-400 transition-all duration-500">
              <span className="text-white font-bold text-xl font-serif font-mono">AK</span>
            </div>
            <span className="text-xl font-bold hidden sm:block group-hover:text-green-400 transition-colors">Ankit Kumar</span>
          </button>
          
          {showEasterEgg && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg animate-bounce">
              {logoClickCount === 5 ? "🎉 You really like clicking things!" : "🤯 Are you okay? That's a lot of clicks!"}
            </div>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-white hover:text-primary transition-colors text-sm font-medium uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;