import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Menu, X, Linkedin, Github, Mail, Download, ArrowUpRight, 
  Settings, Ruler, GitCommit,
  Moon, Sun, GraduationCap, Facebook, Instagram, Twitter, 
  MessageCircle, Globe, Briefcase, Building2, ArrowUp, Award,
  Clock, BookOpen, FileText, Send, ArrowLeft, PenTool, Calendar, MapPin,
  Bell
} from 'lucide-react';

// --- Configuration ---
// Ensure this matches your Flask local address
const API_BASE_URL = 'https://adnan-backend-eyxe.onrender.com/api'; 
// const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Local Flask API
const PLACEHOLDER_BLOG_IMG = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800";

// --- Styles & Fonts ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&display=swap');
  
  /* --- Global Resets to Fix Scrollbars --- */
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh; /* Lock body height */
    overflow: hidden; /* Disable scrolling on body */
  }
  
  #root {
    width: 100%;
    height: 100%; /* Ensure root fills body */
  }

  .font-serif { font-family: 'Playfair Display', serif; }
  .font-sans { font-family: 'Inter', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  .animate-marquee {
    animation: marquee 60s linear infinite;
  }
  
  /* Filter for dark mode icons to make black icons visible */
  .dark-icon-glow {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.9));
  }
  .dark-logo-glow {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6));
  }
  
  .bg-grid-dark {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  }
  .bg-grid-light {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  }

  /* Typography for Blog Content */
  .prose p { margin-bottom: 1.5em; line-height: 1.8; }
  .prose h3 { font-family: 'Playfair Display', serif; font-size: 1.5em; margin-top: 2em; margin-bottom: 1em; }
  .prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }

  /* Custom Scrollbar for Daily Updates */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(155, 155, 155, 0.7);
  }
`;

// --- Components ---

const RevealOnScroll = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      {children}
    </div>
  );
};

const Marquee = ({ items, isDark }) => (
  <div className={`relative flex overflow-hidden py-4 border-y ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-stone-100 border-zinc-200'}`}>
    <div className="animate-marquee whitespace-nowrap flex gap-8 md:gap-16 items-center">
      {(items.length > 0 ? items.concat(items).concat(items) : [{name: 'Loading Skills...'}]).map((item, i) => (
        <span key={i} className={`text-lg md:text-2xl font-mono mx-2 md:mx-4 flex items-center gap-3 md:gap-4 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt="" 
              className={`w-6 h-6 object-contain ${isDark ? 'grayscale opacity-70' : 'opacity-50'}`} 
            />
          ) : (
            <GitCommit size={14} className={isDark ? 'text-zinc-700' : 'text-zinc-400'} /> 
          )}
          {item.name || item}
        </span>
      ))}
    </div>
  </div>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState('dark');
  
  // View State
  const [currentView, setCurrentView] = useState('home'); // 'home', 'all-blogs', 'single-blog', 'journey', 'daily-updates'
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Create a ref for the main scrollable container
  const mainScrollRef = useRef(null);
  
  // --- Data State ---
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [researchData, setResearchData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  const [blogsData, setBlogsData] = useState([]); 
  const [dailyUpdatesData, setDailyUpdatesData] = useState([]);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // --- Auto Scroll Refs for Daily Updates ---
  const dailyUpdatesScrollRef = useRef(null);
  const isUpdatesHovered = useRef(false);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToTop = () => {
    if (mainScrollRef.current) {
        mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- Fetch API Data ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [aboutRes, skillsRes, eduRes, projectsRes, expRes, researchRes, achievementsRes, blogsRes, updatesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/about`),
          fetch(`${API_BASE_URL}/skills`),
          fetch(`${API_BASE_URL}/education`),
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/experience`),
          fetch(`${API_BASE_URL}/research`),
          fetch(`${API_BASE_URL}/achievements`),
          fetch(`${API_BASE_URL}/blogs`),
          fetch(`${API_BASE_URL}/daily_updates`)
        ]);

        if (aboutRes.ok) setAboutData(await aboutRes.json());
        if (skillsRes.ok) setSkillsData(await skillsRes.json());
        if (eduRes.ok) setEducationData(await eduRes.json());
        if (projectsRes.ok) setProjectsData(await projectsRes.json());
        if (expRes.ok) setExperienceData(await expRes.json());
        if (researchRes.ok) setResearchData(await researchRes.json());
        if (achievementsRes.ok) setAchievementsData(await achievementsRes.json());
        if (blogsRes.ok) setBlogsData(await blogsRes.json());
        if (updatesRes.ok) setDailyUpdatesData(await updatesRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Scroll Listener for Main Window ---
  useEffect(() => {
    const handleScroll = () => {
      if (!mainScrollRef.current) return;
      
      const currentScrollY = mainScrollRef.current.scrollTop;
      setScrollY(currentScrollY);
      
      // Only track sections if we are in 'home' view
      if (currentView === 'home') {
        const sections = ['home', 'about', 'skills', 'education', 'experience', 'projects', 'blogs', 'achievements', 'research', 'contact'];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
              setActiveSection(section);
            }
          }
        }
      }
    };

    const scrollContainer = mainScrollRef.current;
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
        if (scrollContainer) {
            scrollContainer.removeEventListener('scroll', handleScroll);
        }
    };
  }, [loading, currentView]);

  // --- Daily Updates Auto-Scroll Effect ---
  useEffect(() => {
    let animationFrameId;
    
    const animateScroll = () => {
      if (currentView === 'daily-updates' && dailyUpdatesScrollRef.current && !isUpdatesHovered.current) {
        const element = dailyUpdatesScrollRef.current;
        
        // Only scroll if there's content overflowing
        if (element.scrollHeight > element.clientHeight) {
            // Adjust the 0.5 value to change scroll speed
            element.scrollTop += 0.5;
            
            // Loop back to top when reaching bottom
            // Using a small buffer (1px) for float comparisons
            if (element.scrollTop + element.clientHeight >= element.scrollHeight - 1) {
                element.scrollTop = 0;
            }
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    if (currentView === 'daily-updates') {
      animationFrameId = requestAnimationFrame(animateScroll);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [currentView, dailyUpdatesData]);


  const scrollToSection = (id) => {
    if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // --- Navigation Helpers ---
  const handleViewAllBlogs = () => {
    setCurrentView('all-blogs');
    scrollToTop();
  };

  const handleReadBlog = (blog) => {
    setSelectedBlog(blog);
    setCurrentView('single-blog');
    scrollToTop();
  };

  const handleViewJourney = () => {
    setCurrentView('journey');
    scrollToTop();
  }

  const handleViewDailyUpdates = () => {
    setCurrentView('daily-updates');
    scrollToTop();
  }

  const handleBackToHome = () => {
    setCurrentView('home');
    // Scroll to top of home or just reset
    setTimeout(() => {
         if (mainScrollRef.current) mainScrollRef.current.scrollTo({ top: 0 });
    }, 100);
  };

  const handleBackToAllBlogs = () => {
    setCurrentView('all-blogs');
    scrollToTop();
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (response.ok) {
        setSentSuccess(true);
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSentSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // --- Data Merging for Journey ---
  const journeyTimeline = useMemo(() => {
    // 1. Normalize Education Data
    const edu = educationData.map(e => ({
        id: `edu-${e.id}`,
        type: 'education',
        title: e.degree,
        subtitle: e.institution,
        year_range: e.year_range,
        description: e.description,
        image_url: e.logo_url,
        // Helper for sorting: Extract first 4 digit number
        sortYear: parseInt(e.year_range?.match(/\d{4}/)?.[0] || "0")
    }));

    // 2. Normalize Experience Data
    const exp = experienceData.map(e => ({
        id: `exp-${e.id}`,
        type: 'work',
        title: e.role,
        subtitle: e.company,
        year_range: e.year_range,
        description: e.description,
        image_url: e.logo_url,
        sortYear: parseInt(e.year_range?.match(/\d{4}/)?.[0] || "0")
    }));

    // 3. Combine and Sort (Ascending: Oldest first)
    // Note: Video suggests chronological flow from 2011 -> 2025
    return [...edu, ...exp].sort((a, b) => a.sortYear - b.sortYear);
  }, [educationData, experienceData]);

  // --- Helper to build contact links list dynamically ---
  const getContactLinks = () => {
    if (!aboutData) return [];
    
    const links = [];
    
    if (aboutData.email) links.push({ icon: Mail, text: aboutData.email, href: `mailto:${aboutData.email}` });
    if (aboutData.website) links.push({ icon: Globe, text: 'Website', href: aboutData.website });
    if (aboutData.github) links.push({ icon: Github, text: 'GitHub', href: aboutData.github });
    if (aboutData.linkedin) links.push({ icon: Linkedin, text: 'LinkedIn', href: aboutData.linkedin });
    if (aboutData.facebook) links.push({ icon: Facebook, text: 'Facebook', href: aboutData.facebook });
    if (aboutData.instagram) links.push({ icon: Instagram, text: 'Instagram', href: aboutData.instagram });
    if (aboutData.twitter) links.push({ icon: Twitter, text: 'Twitter', href: aboutData.twitter });
    
    if (aboutData.whatsapp) {
        let waLink = aboutData.whatsapp;
        if (!waLink.startsWith('http')) {
            waLink = `https://wa.me/${aboutData.whatsapp.replace(/[^0-9]/g, '')}`;
        }
        links.push({ icon: MessageCircle, text: 'WhatsApp', href: waLink });
    }

    return links;
  };

  const contactLinks = getContactLinks();

  // --- Theme Colors Helper ---
  const themeClasses = {
    bg: isDark ? 'bg-zinc-950' : 'bg-stone-50',
    text: isDark ? 'text-white' : 'text-zinc-900', 
    textMuted: isDark ? 'text-zinc-300' : 'text-zinc-500',
    textSubtle: isDark ? 'text-zinc-400' : 'text-zinc-400', 
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
    borderContact: isDark ? 'border-zinc-700' : 'border-zinc-300',
    cardBg: isDark ? 'bg-zinc-900' : 'bg-white',
    navBg: isDark ? 'bg-zinc-900/80' : 'bg-white/80',
    navBorder: isDark ? 'border-zinc-800' : 'border-zinc-200',
    inputBg: isDark ? 'bg-zinc-900' : 'bg-zinc-100',
    grid: isDark ? 'bg-grid-dark' : 'bg-grid-light',
    sectionBg: isDark ? 'bg-zinc-950' : 'bg-stone-50',
    sectionAltBg: isDark ? 'bg-black' : 'bg-zinc-100',
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="flex flex-col items-center gap-4">
          <Settings className={`animate-spin w-12 h-12 ${themeClasses.text}`} />
          <p className={`${themeClasses.textMuted} font-mono animate-pulse`}>INITIALIZING SYSTEM...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
        ref={mainScrollRef}
        className={`h-screen w-full ${themeClasses.bg} ${themeClasses.text} font-sans transition-colors duration-500 overflow-y-auto overflow-x-hidden relative scroll-smooth`}
    >
      <style>{styles}</style>

      {/* --- Parallax Background Grid --- */}
      <div 
        className={`fixed inset-0 ${themeClasses.grid} pointer-events-none z-0 opacity-40`}
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      
      {/* --- Decorative Floating Gears --- */}
      <div 
        className={`fixed top-20 right-[-100px] opacity-5 pointer-events-none z-0 hidden md:block ${isDark ? 'text-white' : 'text-black'}`}
        style={{ transform: `rotate(${scrollY * 0.2}deg)` }}
      >
        <Settings size={400} strokeWidth={0.5} />
      </div>

      {/* --- Fixed Top Left Profile Image --- */}
      <div className="fixed top-7 left-7 z-50 hidden md:block">
         <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${themeClasses.border} shadow-xl transition-transform hover:scale-105 duration-300`}>
            {aboutData?.mini_profile_image ? (
                <img src={aboutData.mini_profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                    <Settings size={20} className={themeClasses.textSubtle} />
                </div>
            )}
         </div>
      </div>

      {/* --- Floating Pill Navigation (Visible on Home Only) --- */}
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className={`
          rounded-full px-2 py-2 flex items-center border ${themeClasses.navBorder}
          transition-all duration-500 ease-out
          ${scrollY > 50 
            ? `${themeClasses.navBg} backdrop-blur-xl shadow-2xl` 
            : `${isDark ? 'bg-zinc-950/80' : 'bg-stone-50/80'} backdrop-blur-sm shadow-xl`}
        `}>
          <div className={`pl-4 md:pl-2 pr-4 md:pr-8 font-serif font-bold text-lg md:text-xl tracking-tighter cursor-pointer flex items-center gap-3 ${themeClasses.text}`} onClick={() => scrollToSection('home')}>
             <div className="p-2 rounded-full overflow-hidden border border-zinc-500/20 relative flex-shrink-0 flex items-center justify-center">
                <Settings 
                    size={20} 
                    className={`${themeClasses.text}`} 
                    style={{ transform: `rotate(${scrollY * 0.4}deg)` }}
                />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {currentView === 'home' ? (
                // Home Navigation Links
                ['Home', 'About', 'Skills', 'Education', 'Experience', 'Projects', 'Blogs', 'Achievements', 'Research'].map((item) => (
                <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 ${activeSection === item.toLowerCase() ? `${isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'} shadow-sm` : `${themeClasses.textMuted} hover:${themeClasses.text}`}`}
                >
                    {item}
                </button>
                ))
            ) : (
                // Navigation when inside Sub Pages
                <div className="flex items-center gap-1">
                    <button onClick={handleBackToHome} className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium ${themeClasses.textMuted} hover:${themeClasses.text}`}>
                        Home
                    </button>
                    <span className={themeClasses.textMuted}>/</span>
                    <span className={`px-4 py-2 text-xs lg:text-sm font-medium ${themeClasses.text}`}>
                        {currentView === 'all-blogs' ? 'All Blogs' : currentView === 'journey' ? 'Journey' : currentView === 'daily-updates' ? 'Updates' : 'Reading'}
                    </span>
                </div>
            )}
            
            {currentView === 'home' && (
                <button 
                onClick={() => scrollToSection('contact')}
                className={`ml-2 px-4 py-2 rounded-full text-xs lg:text-sm font-medium border ${activeSection === 'contact' ? `${isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'} ${themeClasses.border} shadow-sm` : `${themeClasses.border} ${themeClasses.textMuted} hover:${themeClasses.text}`}`}
                >
                Contact
                </button>
            )}

            {/* Dynamic Resume Link */}
            {aboutData?.resume_link && (
                <a 
                href={aboutData.resume_link} 
                target="_blank"
                rel="noopener noreferrer"
                className={`ml-2 px-4 py-2 rounded-full text-xs lg:text-sm font-medium border ${themeClasses.border} hover:bg-zinc-500/10 transition-all flex items-center gap-2 ${themeClasses.textSubtle} hover:${themeClasses.text}`}
                >
                Resume <Download size={14} />
                </a>
            )}

            <button 
              onClick={toggleTheme}
              className={`ml-2 p-2 rounded-full border ${themeClasses.border} hover:bg-zinc-500/10 transition-colors ${themeClasses.text}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="flex items-center md:hidden">
             <button 
              onClick={toggleTheme}
              className={`mr-2 p-2 rounded-full border ${themeClasses.border} hover:bg-zinc-500/10 transition-colors ${themeClasses.text}`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className={`p-2 ${themeClasses.text}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 ${themeClasses.bg} z-40 pt-28 px-6 md:hidden transition-all duration-500 transform ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col gap-6 text-center h-full overflow-y-auto pb-10">
          {['Home', 'About', 'Skills', 'Education', 'Projects', 'Blogs', 'Achievements', 'Experience', 'Research', 'Contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className={`text-3xl font-serif ${themeClasses.text} hover:${themeClasses.textMuted} transition-colors`}
            >
              {item}
            </button>
          ))}
          <div className="flex justify-center gap-4 mt-4 pb-10">
             {aboutData?.resume_link && (
                 <a href={aboutData.resume_link} target="_blank" rel="noopener noreferrer" className={`text-xl font-serif italic ${themeClasses.textMuted} hover:${themeClasses.text} flex items-center gap-2`}>
                    Resume <Download size={20} />
                 </a>
             )}
          </div>
        </div>
      </div>

      {/* ================================================================================== */}
      {/* ============================== VIEW CONTROLLER =================================== */}
      {/* ================================================================================== */}

      {/* 1. HOME VIEW */}
      {currentView === 'home' && (
        <>
            {/* Hero Section */}
            <section id="home" className="min-h-screen pt-32 md:pt-40 pb-20 px-6 flex flex-col justify-between relative z-10">
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="flex items-center gap-4 mb-6 opacity-60">
                        <Ruler size={16} className={themeClasses.textMuted} />
                        <span className={`font-mono text-xs uppercase tracking-[0.2em] ${themeClasses.textMuted}`}>System.Architecture.Design</span>
                        <div className={`h-px w-24 ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`}></div>
                    </div>
                    <h1 className={`text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-medium leading-[1.1] md:leading-[0.9] tracking-tight mb-8 ${themeClasses.text} relative`}>
                    {aboutData?.name ? aboutData.name.split(' ')[0] : 'Design'} <br/>
                    <span className={`italic ${themeClasses.textSubtle} ml-0 md:ml-24 relative z-10`}>
                        {aboutData?.name ? aboutData.name.split(' ').slice(1).join(' ') : 'Precision.'}
                    </span>
                    <div className={`absolute bottom-2 left-0 md:left-24 w-32 h-1 ${isDark ? 'bg-zinc-800' : 'bg-zinc-300'} -z-10 skew-x-12`}></div>
                    </h1>
                </RevealOnScroll>
                
                <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-end mt-12">
                    <div className={`md:col-span-1 border-l ${themeClasses.border} pl-6`}>
                        <p className={`text-base md:text-lg ${themeClasses.textMuted} leading-relaxed font-normal`}> 
                        {aboutData?.short_bio || "Mechanical Engineer focused on bridging the gap between rigorous analysis and functional aesthetics."}
                        </p>
                    </div>
                    <div className="md:col-span-2 flex flex-col sm:flex-row justify-start md:justify-end gap-4">
                    {/* UPDATED: Changed 'View Work' to 'Journey' */}
                    <button onClick={handleViewJourney} className={`${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'} px-8 py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg`}>
                        My Journey <MapPin size={18} />
                    </button>
                    <button onClick={() => scrollToSection('contact')} className={`bg-transparent border ${isDark ? 'border-zinc-700 text-white hover:bg-zinc-900' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-100'} px-8 py-4 rounded-full font-medium transition-colors w-full sm:w-auto`}>
                        Get in Touch
                    </button>
                    </div>
                </div>
                </div>
            </section>

            {/* Marquee Skills */}
            <Marquee isDark={isDark} items={skillsData} />

            {/* About Section */}
            <section id="about" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div>
                        <span className={`font-mono text-xs uppercase tracking-widest ${themeClasses.textMuted} mb-4 block flex items-center gap-2`}>
                            <span className={`w-2 h-2 ${isDark ? 'bg-zinc-500' : 'bg-zinc-400'} rounded-full`}></span> About Me
                        </span>
                        <h2 className={`text-3xl md:text-5xl font-serif mb-8 leading-tight ${themeClasses.text}`}>
                        Applying <span className={`italic ${themeClasses.textMuted}`}>first principles</span> to solve complex physical problems.
                        </h2>
                        <div className={`space-y-6 text-lg ${themeClasses.textMuted} leading-relaxed font-normal whitespace-pre-wrap mb-10`}> 
                        {aboutData?.long_bio || "I believe that great engineering is indistinguishable from art. Whether it's optimizing a thermal system or designing a chassis, the goal is always elegance in efficiency."}
                        </div>
                        
                        {/* Daily Update Button */}
                        <div className="mt-8">
                             <button 
                                onClick={handleViewDailyUpdates}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full border ${themeClasses.border} ${themeClasses.text} hover:${themeClasses.cardBg} hover:shadow-md transition-all group`}
                            >
                                <Bell size={18} className="group-hover:text-yellow-500 transition-colors" />
                                <span className="font-mono text-sm uppercase tracking-wider">View Daily Updates</span>
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div 
                            className={`aspect-square max-w-md mx-auto ${themeClasses.cardBg} rounded-full overflow-hidden border ${themeClasses.border} relative shadow-2xl`}
                            style={{ transform: `translateY(${scrollY * -0.05}px)` }} 
                        >
                            <div className={`absolute inset-4 border ${isDark ? 'border-zinc-700/50' : 'border-zinc-300/50'} rounded-full`}></div>
                            
                            {aboutData?.profile_image ? (
                                <img src={aboutData.profile_image} alt="Profile" className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 hover:grayscale-0 duration-300 transition-opacity" />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center ${themeClasses.textSubtle} font-mono`}>
                                IMG_PORTRAIT.RAW
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </RevealOnScroll>
                </div>
            </section>
            
            {/* REMOVED DAILY UPDATE MARQUEE */}

            {/* Skills Section */}
            <section id="skills" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                    <Settings className={themeClasses.textMuted} size={24} />
                    <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Technical Proficiency</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {skillsData.length > 0 ? skillsData.map((skill, index) => (
                            <div key={skill.id || index} className={`p-4 md:p-6 border ${themeClasses.border} rounded-sm flex flex-col items-center justify-center gap-4 group hover:bg-zinc-500/5 transition-colors`}>
                                <img 
                                    src={skill.image_url} 
                                    alt={skill.name} 
                                    className={`w-12 h-12 object-contain transition-transform group-hover:scale-110 ${isDark ? 'dark-icon-glow' : ''}`} 
                                />
                                <span className={`font-mono text-xs md:text-sm uppercase tracking-wide text-center ${themeClasses.text}`}>
                                {skill.name}
                                </span>
                            </div>
                        )) : (
                        <div className={`col-span-full text-center py-10 ${themeClasses.textMuted}`}>No skills loaded.</div>
                    )}
                    </div>
                </RevealOnScroll>
                </div>
            </section>

            {/* Education Section */}
            <section id="education" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                    <GraduationCap className={themeClasses.textMuted} size={24} />
                    <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Education</h2>
                    </div>

                    <div className={`relative border-l ${themeClasses.border} ml-3 md:ml-0 space-y-12 md:space-y-16`}>
                    {educationData.length > 0 ? educationData.map((edu) => (
                        <div key={edu.id} className="relative pl-8 md:pl-12 group">
                        <div className={`absolute -left-[5px] top-2 w-[9px] h-[9px] ${themeClasses.bg} border ${isDark ? 'border-zinc-500' : 'border-zinc-400'} rounded-full group-hover:${isDark ? 'bg-white' : 'bg-zinc-900'} transition-colors`}></div>
                        
                        <div className="grid md:grid-cols-4 gap-4 items-start">
                            <div className={`md:col-span-1 flex justify-start`}>
                                <div className={`w-32 h-32 md:w-32 md:h-32 rounded-xl border ${themeClasses.border} ${isDark ? 'bg-zinc-800/50' : 'bg-white'} flex items-center justify-center dark-logo-glow overflow-hidden shrink-0`}>
                                    {edu.logo_url ? (
                                        <img src={edu.logo_url} alt={edu.institution} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 size={24} className={`md:w-8 md:h-8 ${themeClasses.textSubtle}`} />
                                    )}
                                </div>
                            </div>
                            
                            <div className="md:col-span-3">
                                <h4 className={`text-xl md:text-2xl font-medium ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors`}>{edu.degree}</h4>
                                
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-2 gap-1">
                                    <div className={`${themeClasses.textSubtle} font-serif italic`}>{edu.institution}</div>
                                    <span className={`font-mono text-sm ${themeClasses.textMuted} whitespace-nowrap`}>{edu.year_range}</span>
                                </div>
                                
                                <p className={`${themeClasses.textMuted} text-sm max-w-lg whitespace-pre-line`}>{edu.description}</p>
                            </div>
                        </div>
                        </div>
                    )) : (
                        <p className={`pl-8 ${themeClasses.textMuted}`}>Loading education history...</p>
                    )}
                    </div>
                </RevealOnScroll>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                        <Clock className={themeClasses.textMuted} size={24} />
                        <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Professional History</h2>
                    </div>

                    <div className={`relative border-l ${themeClasses.border} ml-3 md:ml-0 space-y-12 md:space-y-16`}>
                    {experienceData.length > 0 ? experienceData.map((job) => (
                        <div key={job.id} className="relative pl-8 md:pl-12 group">
                        <div className={`absolute -left-[5px] top-2 w-[9px] h-[9px] ${themeClasses.bg} border ${isDark ? 'border-zinc-500' : 'border-zinc-400'} rounded-full group-hover:${isDark ? 'bg-white' : 'bg-zinc-900'} transition-colors`}></div>
                        
                        <div className="grid md:grid-cols-4 gap-4 items-baseline">
                            <span className={`font-mono text-sm ${themeClasses.textMuted} md:col-span-1`}>{job.year_range}</span>
                            <div className="md:col-span-3">
                                <h4 className={`text-xl md:text-2xl font-medium ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors`}>{job.role}</h4>
                                <div className={`${themeClasses.textSubtle} font-serif italic mb-2`}>{job.company}</div>
                                <p className={`${themeClasses.textMuted} text-sm max-w-lg whitespace-pre-line`}>{job.description}</p>
                            </div>
                        </div>
                        </div>
                    )) : (
                        <p className={`pl-8 ${themeClasses.textMuted}`}>Loading experience...</p>
                    )}
                    </div>
                </RevealOnScroll>
                </div>
            </section>

            {/* Projects - Masonry Grid */}
            <section id="projects" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                    <Briefcase className={themeClasses.textMuted} size={24} />
                    <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Portfolio</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-x-16">
                    {projectsData.length > 0 ? projectsData.map((project, index) => (
                        <RevealOnScroll key={project.id} className={index % 2 !== 0 ? "md:pt-32" : ""}>
                        <div className="group cursor-pointer mb-12 md:mb-0">
                            <div className={`aspect-[4/3] ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'} rounded-sm overflow-hidden mb-6 relative transition-all duration-500 group-hover:opacity-99 border ${themeClasses.border}`}>
                            <div className={`absolute top-4 right-4 font-mono text-[10px] ${themeClasses.textMuted} bg-black/10 px-2 py-1 backdrop-blur-sm rounded`}>PRJ-{project.id}</div>
                            
                            {project.image_url ? (
                                <img src={project.image_url} alt={project.title} className="w-full h-full grayscale hover:grayscale-0 duration-300 transition-opacity object-cover" />
                            ) : (
                                <div className={`absolute inset-0 flex items-center justify-center font-serif text-2xl italic opacity-60 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                    {project.category}
                                </div>
                            )}
                            
                            <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none"></div>
                            </div>
                            <div className={`flex justify-between items-start border-t ${themeClasses.border} pt-4`}>
                            <div>
                                <h3 className={`text-2xl md:text-3xl font-serif mb-2 ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors`}>{project.title}</h3>
                                <p className={`${themeClasses.textMuted} max-w-sm text-sm md:text-base font-mono whitespace-pre-line`}>{project.category}</p>
                            </div>
                            {project.project_link && (
                                <a href={project.project_link} target="_blank" rel="noopener noreferrer">
                                    <ArrowUpRight className={`opacity-0 group-hover:opacity-100 transition-opacity ${themeClasses.text}`} />
                                </a>
                            )}
                            </div>
                        </div>
                        </RevealOnScroll>
                    )) : (
                        <div className={`col-span-2 text-center py-20 ${themeClasses.textMuted}`}>No projects loaded.</div>
                    )}
                    </div>
                </RevealOnScroll>
                </div>
            </section>

            {/* ---------------- BLOG SECTION ---------------- */}
            <section id="blogs" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
                <div className="container mx-auto max-w-6xl">
                    <RevealOnScroll>
                        <div className="flex justify-between items-end mb-12 md:mb-16">
                            <div className="flex items-center gap-4">
                                <PenTool className={themeClasses.textMuted} size={24} />
                                <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Latest Writings</h2>
                            </div>
                            <button 
                                onClick={handleViewAllBlogs}
                                className={`hidden md:flex items-center gap-2 text-sm font-mono uppercase tracking-widest ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}
                            >
                                Read All Articles <ArrowUpRight size={16} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {blogsData && blogsData.length > 0 ? (
                                blogsData.slice(0, 2).map((blog) => ( // Only show latest 2
                                    <div 
                                        key={blog.id} 
                                        onClick={() => handleReadBlog(blog)}
                                        className={`group cursor-pointer ${themeClasses.cardBg} border ${themeClasses.border} p-0 hover:border-zinc-500 transition-all duration-300 flex flex-col h-full`}
                                    >
                                        <div className="aspect-[16/9] w-full overflow-hidden border-b border-zinc-800">
                                            {/* UPDATED: Image Fallback */}
                                            <img 
                                                src={blog.image_url || blog.cover_image || PLACEHOLDER_BLOG_IMG} 
                                                alt={blog.title} 
                                                onError={(e) => e.target.src = PLACEHOLDER_BLOG_IMG}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`px-2 py-1 text-[10px] font-mono uppercase border ${themeClasses.border} rounded text-zinc-500`}>
                                                    {blog.tags || 'Engineering'}
                                                </span>
                                                <span className={`text-xs font-mono ${themeClasses.textMuted} flex items-center gap-1`}>
                                                    <Calendar size={12} /> {blog.date || 'Recent'}
                                                </span>
                                            </div>
                                            <h3 className={`text-xl md:text-2xl font-serif ${themeClasses.text} mb-3 group-hover:${themeClasses.textMuted} transition-colors`}>
                                                {blog.title}
                                            </h3>
                                            <p className={`text-sm ${themeClasses.textMuted} line-clamp-3 mb-6 flex-grow`}>
                                                {blog.summary || blog.content?.substring(0, 150) + '...'}
                                            </p>
                                            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${themeClasses.text} opacity-60 group-hover:opacity-100 transition-all`}>
                                                Read Article <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={`col-span-2 py-12 text-center border ${themeClasses.border} border-dashed rounded`}>
                                    <p className={themeClasses.textMuted}>No articles published yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 md:hidden flex justify-center">
                             <button 
                                onClick={handleViewAllBlogs}
                                className={`flex items-center gap-2 text-sm font-mono uppercase tracking-widest ${themeClasses.text} border ${themeClasses.border} px-6 py-3 rounded-full`}
                            >
                                Read All Articles <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Achievements Section */}
            <section id="achievements" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                        <Award className={themeClasses.textMuted} size={24} />
                        <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Achievements</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                    {achievementsData.length > 0 ? achievementsData.map((achievement) => (
                        <div key={achievement.id} className={`group ${themeClasses.cardBg} p-6 md:p-8 rounded-sm border ${themeClasses.border} hover:${isDark ? 'border-zinc-600' : 'border-zinc-400'} transition-all hover:-translate-y-1 relative`}>
                        <div className="flex justify-between items-start mb-4">
                            <h4 className={`text-lg md:text-xl font-serif ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors`}>{achievement.title}</h4>
                            {(achievement.year || achievement.date) && (
                                <span className={`font-mono text-xs ${themeClasses.textMuted} border ${themeClasses.border} px-2 py-1 rounded-full shrink-0 ml-2`}>{achievement.year || achievement.date}</span>
                            )}
                        </div>
                        {achievement.organization && (
                            <p className={`${themeClasses.textSubtle} font-medium mb-2`}>{achievement.organization}</p>
                        )}
                        <p className={`${themeClasses.textMuted} text-sm leading-relaxed whitespace-pre-line`}>{achievement.description}</p>
                        </div>
                    )) : (
                        <div className={`col-span-2 text-center py-10 ${themeClasses.textMuted}`}>No achievements loaded.</div>
                    )}
                    </div>
                </RevealOnScroll>
                </div>
            </section>

            {/* Research Section */}
            <section id="research" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                        <BookOpen className={themeClasses.textMuted} size={24} />
                        <div>
                        <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Research & Publications</h2>
                        <span className={`font-mono text-xs ${themeClasses.textMuted}`}>ACADEMIC ARCHIVE</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {researchData.length > 0 ? researchData.map((paper) => (
                        <div key={paper.id} className={`group ${themeClasses.cardBg} p-6 md:p-8 rounded-sm border ${themeClasses.border} hover:${isDark ? 'border-zinc-600' : 'border-zinc-400'} transition-all hover:-translate-y-1 relative overflow-hidden shadow-sm`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FileText size={40} />
                            </div>
                            <div className={`font-mono text-xs ${themeClasses.textSubtle} mb-6`}>DOC-{paper.id} // {paper.publication_date}</div>
                            <h4 className={`text-xl font-serif ${themeClasses.text} mb-2`}>{paper.title}</h4>
                            <p className={`text-sm ${themeClasses.textMuted} font-mono mb-8 line-clamp-3`}>{paper.description}</p>
                            
                            {paper.link && (
                                <a href={paper.link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${themeClasses.textMuted} group-hover:${themeClasses.text} transition-colors`}>
                                Access Document <Download size={14} />
                                </a>
                            )}
                        </div>
                        )) : (
                            <div className={`col-span-3 text-center ${themeClasses.textMuted}`}>No research papers found.</div>
                        )}
                    </div>
                </RevealOnScroll>
                </div>
            </section>

            {/* Contact / Footer */}
            <section id="contact" className={`pt-16 pb-8 md:pt-32 md:pb-10 px-4 md:px-6 ${themeClasses.sectionBg} relative z-10`}>
                <div className="container mx-auto max-w-6xl">
                <RevealOnScroll>
                    <div className="grid md:grid-cols-2 gap-10 md:gap-20">
                    <div className="mb-10 md:mb-0">
                        <h2 className={`text-3xl sm:text-4xl md:text-6xl font-serif mb-6 ${themeClasses.text}`}>Let's start a project.</h2>
                        <p className={`text-base md:text-lg ${themeClasses.textMuted} mb-8 md:mb-12`}>
                        {aboutData?.freelance_status || "Available for freelance design engineering projects, consulting, and robotic systems development."}
                        </p>
                        <div className="space-y-4 md:space-y-6">
                        {contactLinks.map((link, i) => (
                            <a key={i} href={link.href || '#'} target={link.href && link.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className={`flex items-center gap-4 ${themeClasses.textSubtle} hover:${themeClasses.text} transition-colors group`}>
                            <link.icon size={20} className="group-hover:scale-110 transition-transform"/>
                            <span className="text-sm md:text-base">{link.text}</span>
                            </a>
                        ))}
                        </div>
                    </div>

                    <div className={`${themeClasses.cardBg} p-5 md:p-8 rounded-sm border ${themeClasses.border}`}>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleContactSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {['name', 'email'].map((field) => (
                            <div key={field} className="space-y-2">
                                <label className={`text-xs uppercase tracking-wider ${themeClasses.textMuted} font-mono`}>{field}</label>
                                <input 
                                    type={field === 'email' ? 'email' : 'text'} 
                                    name={field}
                                    value={contactForm[field]}
                                    onChange={handleContactChange}
                                    required
                                    className={`w-full ${themeClasses.inputBg} border-2 ${themeClasses.borderContact} rounded-sm p-3 text-sm md:text-base ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors font-sans`} 
                                    placeholder={field === 'email' ? 'Your Email' : 'Your Name'} 
                                />
                            </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs uppercase tracking-wider ${themeClasses.textMuted} font-mono`}>Subject</label>
                            <input 
                                type="text" 
                                name="subject"
                                value={contactForm.subject}
                                onChange={handleContactChange}
                                className={`w-full ${themeClasses.inputBg} border-2 ${themeClasses.borderContact} rounded-sm p-3 text-sm md:text-base ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors font-sans`} 
                                placeholder="Project Inquiry" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs uppercase tracking-wider ${themeClasses.textMuted} font-mono`}>Message</label>
                            <textarea 
                                name="message"
                                value={contactForm.message}
                                onChange={handleContactChange}
                                required
                                rows="4" 
                                className={`w-full ${themeClasses.inputBg} border-2 ${themeClasses.borderContact} rounded-sm p-3 text-sm md:text-base ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors resize-none font-sans`} 
                                placeholder="Tell me about your project needs..."
                            ></textarea>
                        </div>
                        <button 
                            disabled={sending}
                            className={`w-full ${isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'} font-medium py-3 md:py-4 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-widest disabled:opacity-50`}
                        >
                            {sending ? 'Sending...' : sentSuccess ? 'Message Sent!' : 'Send Message'} <Send size={16} />
                        </button>
                        </form>
                    </div>
                    </div>
                    
                    <div className={`mt-10 pt-8 border-t ${themeClasses.border} flex flex-col md:flex-row justify-between text-xs md:text-sm ${themeClasses.textSubtle} font-mono gap-4 items-center text-center md:text-left`}>
                    <span>© {new Date().getFullYear()} {aboutData?.name || "Md. Adnan Ahmed"}</span>
                    </div>
                </RevealOnScroll>
                </div>
            </section>
        </>
      )}

      {/* 2. ALL BLOGS VIEW */}
      {currentView === 'all-blogs' && (
        <section className={`min-h-screen pt-32 pb-20 px-6 ${themeClasses.sectionBg} relative z-10`}>
             <div className="container mx-auto max-w-6xl">
                <div className="mb-12">
                    <button 
                        onClick={handleBackToHome}
                        className={`mb-6 flex items-center gap-2 text-sm font-mono ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <h1 className={`text-4xl md:text-6xl font-serif ${themeClasses.text} mb-4`}>All Writings</h1>
                    <p className={`${themeClasses.textMuted} text-lg`}>Thoughts on engineering, design, and systems.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogsData.map((blog) => (
                        <div 
                            key={blog.id} 
                            onClick={() => handleReadBlog(blog)}
                            className={`group cursor-pointer ${themeClasses.cardBg} border ${themeClasses.border} p-0 hover:border-zinc-500 transition-all duration-300 flex flex-col`}
                        >
                            <div className="aspect-[16/9] w-full overflow-hidden border-b border-zinc-800">
                                {/* UPDATED: Image Fallback */}
                                <img 
                                    src={blog.image_url || blog.cover_image || PLACEHOLDER_BLOG_IMG} 
                                    alt={blog.title} 
                                    onError={(e) => e.target.src = PLACEHOLDER_BLOG_IMG}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-2 py-1 text-[10px] font-mono uppercase border ${themeClasses.border} rounded text-zinc-500`}>
                                        {blog.tags || 'Engineering'}
                                    </span>
                                    <span className={`text-xs font-mono ${themeClasses.textMuted} flex items-center gap-1`}>
                                        <Calendar size={12} /> {blog.date}
                                    </span>
                                </div>
                                <h3 className={`text-xl font-serif ${themeClasses.text} mb-3 group-hover:${themeClasses.textMuted} transition-colors`}>
                                    {blog.title}
                                </h3>
                                <p className={`text-sm ${themeClasses.textMuted} line-clamp-3 mb-4 flex-grow`}>
                                    {blog.summary || blog.content?.substring(0, 150) + '...'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </section>
      )}

      {/* 3. SINGLE BLOG VIEW */}
      {currentView === 'single-blog' && selectedBlog && (
        <section className={`min-h-screen pt-32 pb-20 px-6 ${themeClasses.sectionBg} relative z-10`}>
            <div className="container mx-auto max-w-3xl">
                <button 
                    onClick={handleBackToAllBlogs}
                    className={`mb-8 flex items-center gap-2 text-sm font-mono ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}
                >
                    <ArrowLeft size={16} /> Back to Articles
                </button>

                <div className="aspect-[21/9] w-full overflow-hidden rounded-sm mb-10 border border-zinc-800">
                     {/* UPDATED: Image Fallback */}
                     <img 
                        src={selectedBlog.image_url || selectedBlog.cover_image || PLACEHOLDER_BLOG_IMG} 
                        onError={(e) => e.target.src = PLACEHOLDER_BLOG_IMG}
                        alt={selectedBlog.title} 
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex items-center gap-4 mb-6">
                     <span className={`px-2 py-1 text-xs font-mono uppercase border ${themeClasses.border} rounded ${themeClasses.textMuted}`}>
                        {selectedBlog.category || 'Article'}
                    </span>
                    <span className={`text-sm font-mono ${themeClasses.textMuted} flex items-center gap-2`}>
                        <Calendar size={14} /> {selectedBlog.date}
                    </span>
                </div>

                <h1 className={`text-3xl md:text-5xl font-serif ${themeClasses.text} mb-8 leading-tight`}>
                    {selectedBlog.title}
                </h1>

                {/* Content Rendering */}
                <div className={`prose prose-lg ${isDark ? 'prose-invert' : ''} ${themeClasses.textMuted}`}>
                     {/* If your API returns HTML, use dangerouslySetInnerHTML. 
                        If it returns plain text with newlines, we map paragraphs.
                     */}
                     {selectedBlog.content ? (
                        selectedBlog.content.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))
                     ) : (
                         <p>Content not available.</p>
                     )}
                </div>

                {/* Bottom Navigation */}
                <div className={`mt-20 pt-10 border-t ${themeClasses.border} flex justify-between`}>
                    <button onClick={handleBackToAllBlogs} className={`${themeClasses.text} hover:${themeClasses.textMuted}`}>
                        ← Back to List
                    </button>
                    <button onClick={handleBackToHome} className={`${themeClasses.text} hover:${themeClasses.textMuted}`}>
                        Back Home →
                    </button>
                </div>
            </div>
        </section>
      )}

      {/* 4. NEW JOURNEY VIEW */}
      {currentView === 'journey' && (
        <section className={`min-h-screen pt-32 pb-20 px-4 md:px-6 ${themeClasses.sectionBg} relative z-10`}>
             <div className="container mx-auto max-w-4xl">
                 {/* Header */}
                 <div className="mb-16 text-center">
                    <button 
                        onClick={handleBackToHome}
                        className={`mb-6 inline-flex items-center gap-2 text-sm font-mono ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors border ${themeClasses.border} px-4 py-2 rounded-full`}
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <h1 className={`text-4xl md:text-6xl font-serif ${themeClasses.text} mb-4`}>My Journey</h1>
                    <p className={`${themeClasses.textMuted} text-lg font-mono`}>Timeline of Education & Experience</p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Center Line */}
                    <div className={`absolute left-1/2 top-0 bottom-16 w-px -translate-x-1/2 ${isDark ? 'bg-zinc-800' : 'bg-zinc-300'}`}></div>

                    <div className="space-y-24 relative pb-32">
                        {journeyTimeline.map((item, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={item.id} className={`flex items-center justify-between w-full relative ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                                    {/* Content Side */}
                                    <div className={`w-[42%] ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                        <div className={`font-mono text-sm ${themeClasses.textSubtle} mb-1 uppercase tracking-wider`}>
                                            {item.year_range}
                                        </div>
                                        <h3 className={`text-xl md:text-2xl font-serif ${themeClasses.text} mb-1`}>
                                            {item.title}
                                        </h3>
                                        <div className={`text-base font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'} mb-3`}>
                                            {item.subtitle}
                                        </div>
                                        <p className={`text-sm ${themeClasses.textMuted} leading-relaxed hidden md:block`}>
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Center Node (Logo) */}
                                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                                        <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${isDark ? 'border-zinc-950 bg-zinc-900' : 'border-stone-50 bg-white'} shadow-xl overflow-hidden flex items-center justify-center relative z-10 transition-transform hover:scale-110 duration-300 group`}>
                                             {item.image_url ? (
                                                 <img src={item.image_url} alt={item.subtitle} className="w-full h-full object-contain p-2" />
                                             ) : (
                                                 <div className={themeClasses.textSubtle}>
                                                     {item.type === 'education' ? <GraduationCap size={24}/> : <Briefcase size={24}/>}
                                                 </div>
                                             )}
                                             
                                             {/* Hover tooltip for small devices if needed */}
                                        </div>
                                    </div>

                                    {/* Empty Side for layout balance */}
                                    <div className="w-[42%]"></div>
                                </div>
                            );
                        })}

                        {/* End Circle "More to come!" */}
                        <div className="flex flex-col items-center justify-center relative pt-8">
                             <div className={`w-24 h-24 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'} flex items-center justify-center text-center font-mono text-xs p-4 shadow-inner relative z-10`}>
                                 MORE<br/>TO<br/>COME!
                             </div>
                        </div>
                    </div>
                </div>
             </div>
        </section>
      )}

      {/* 5. NEW DAILY UPDATES VIEW */}
      {currentView === 'daily-updates' && (
        <section className={`min-h-screen pt-32 pb-20 px-6 ${themeClasses.sectionBg} relative z-10`}>
             <div className="container mx-auto max-w-4xl">
                 <div className="mb-12">
                     <button 
                        onClick={handleBackToHome}
                        className={`mb-6 flex items-center gap-2 text-sm font-mono ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <div className="flex items-center gap-4">
                        <Bell className={themeClasses.textMuted} size={28} />
                        <h1 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Daily Updates</h1>
                    </div>
                 </div>

                 <div 
                    ref={dailyUpdatesScrollRef}
                    className={`h-[60vh] overflow-y-auto custom-scrollbar pr-4`}
                    onMouseEnter={() => isUpdatesHovered.current = true}
                    onMouseLeave={() => isUpdatesHovered.current = false}
                 >
                    <div className={`relative border-l ${themeClasses.border} ml-4 space-y-12`}>
                        {dailyUpdatesData && dailyUpdatesData.length > 0 ? (
                            dailyUpdatesData.map((update, index) => (
                                <div key={index} className="relative pl-8 md:pl-12 group">
                                    <div className={`absolute -left-[5px] top-2 w-[9px] h-[9px] ${themeClasses.bg} border ${isDark ? 'border-zinc-500' : 'border-zinc-400'} rounded-full group-hover:${isDark ? 'bg-white' : 'bg-zinc-900'} transition-colors`}></div>
                                    
                                    <span className={`font-mono text-xs ${themeClasses.textMuted} block mb-3 opacity-70`}>
                                        {update.date || new Date().toLocaleDateString()}
                                    </span>
                                    
                                    <div className={`${themeClasses.cardBg} p-6 border ${themeClasses.border} rounded-sm shadow-sm hover:border-zinc-500 transition-colors`}>
                                        <h3 className={`text-xl md:text-2xl font-serif ${themeClasses.text} mb-3`}>
                                            {update.title || "Update"}
                                        </h3>
                                        <p className={`${themeClasses.textMuted} text-base leading-relaxed whitespace-pre-line`}>
                                            {update.description || "No description available."}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="pl-8 py-12">
                                <p className={`${themeClasses.textMuted} text-lg font-mono`}>No updates published yet.</p>
                            </div>
                        )}
                    </div>
                 </div>
             </div>
        </section>
      )}
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 px-5 py-3 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2 font-medium text-sm uppercase tracking-wide ${
          scrollY > 500 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        } ${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
        aria-label="Scroll to top"
      >
        Top <ArrowUp size={16} />
      </button>
    </div>
  );
};

export default App;