import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // TODO: Replace with actual newsletter API call

    setTimeout(() => {
      setIsSubscribed(true);
      setEmail('');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`
          }} />
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-sky-400/10 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-lg">E</span>
                </div>
                <h3 className="text-2xl font-black text-white">EVENTIFY</h3>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Your gateway to campus community. Connect, discover, and participate in amazing events that shape your university experience.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <SocialLink href="#" icon={<TwitterIcon />} />
                <SocialLink href="#" icon={<FacebookIcon />} />
                <SocialLink href="#" icon={<InstagramIcon />} />
                <SocialLink href="#" icon={<LinkedInIcon />} />
                <SocialLink href="#" icon={<YouTubeIcon />} />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <FooterLink href="/events">Browse Events</FooterLink>
                <FooterLink href="/clubs">Join Clubs</FooterLink>
                <FooterLink href="/dashboard">My Dashboard</FooterLink>
                <FooterLink href="/profile">Profile</FooterLink>
                <FooterLink href="/calendar">Event Calendar</FooterLink>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Support</h4>
              <ul className="space-y-4">
                <FooterLink href="/help">Help Center</FooterLink>
                <FooterLink href="/contact">Contact Us</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
                <FooterLink href="/guidelines">Community Guidelines</FooterLink>
                <FooterLink href="/feedback">Send Feedback</FooterLink>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Stay Updated</h4>
              <p className="text-slate-400 mb-6">
                Get notified about upcoming events, new features, and campus announcements.
              </p>
              
              {isSubscribed ? (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <CheckCircleIcon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-400 font-semibold">Successfully subscribed!</p>
                  <p className="text-emerald-300/80 text-sm mt-1">Welcome to our community.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      isLoading || !email
                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 hover:scale-[1.02] shadow-lg hover:shadow-sky-500/25'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner className="h-4 w-4" />
                        Subscribing...
                      </div>
                    ) : (
                      'Subscribe to Newsletter'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/30">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Copyright */}
              <div className="flex items-center gap-6 text-slate-400 text-sm">
                <p>&copy; 2024 Eventify. All rights reserved.</p>
                <div className="hidden md:flex items-center gap-1">
                  <span>Made with</span>
                  <HeartIcon className="h-4 w-4 text-red-500 animate-pulse" />
                  <span>for students</span>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-6 text-slate-400 text-sm">
                <a href="/privacy" className="hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-white transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="/cookies" className="hover:text-white transition-colors duration-300">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-8 right-8 p-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full shadow-lg hover:from-sky-400 hover:to-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-sky-500/25"
          aria-label="Back to top"
        >
          <ChevronUpIcon className="h-5 w-5" />
        </button>
      </div>
    </footer>
  );
};

// Social Link Component
const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border-sky-500/50 hover:scale-110 transition-all duration-300 group"
  >
    <div className="group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
  </a>
);

// Footer Link Component
const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-300 block"
    >
      {children}
    </a>
  </li>
);

// Icon Components
const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988c6.62 0 11.987-5.367 11.987-11.988C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.503 0-4.531-2.028-4.531-4.531s2.028-4.531 4.531-4.531 4.531 2.028 4.531 4.531-2.028 4.531-4.531 4.531zm7.138 0c-2.503 0-4.531-2.028-4.531-4.531s2.028-4.531 4.531-4.531 4.531 2.028 4.531 4.531-2.028 4.531-4.531 4.531z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const LoadingSpinner = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="animate-spin" {...props}>
    <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
    <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"/>
  </svg>
);

const HeartIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const ChevronUpIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
  </svg>
);

export default Footer;