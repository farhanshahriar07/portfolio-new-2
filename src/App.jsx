import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Linkedin, Github, Mail, Download, ArrowUpRight, 
  Cpu, Thermometer, Box, Zap, FileText, BookOpen, ArrowLeft, 
  Clock, ChevronRight, Send, Settings, Ruler, GitCommit,
  Moon, Sun
} from 'lucide-react';

// --- Styles & Fonts ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&display=swap');
  
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
    animation: marquee 30s linear infinite;
  }
  
  /* Dynamic Grid based on CSS variables would be ideal, but hardcoding for React portability */
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
    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
      {items.concat(items).map((item, i) => (
        <span key={i} className={`text-xl md:text-2xl font-mono mx-4 flex items-center gap-4 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          <GitCommit size={14} className={isDark ? 'text-zinc-700' : 'text-zinc-400'} /> {item}
        </span>
      ))}
    </div>
  </div>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState('dark');

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Scroll Spy & Parallax Hook
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (!showAllBlogs) {
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'thesis', 'blogs', 'contact'];
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAllBlogs]);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    if (showAllBlogs) {
      setShowAllBlogs(false);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAllBlogs = () => {
    setShowAllBlogs(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Theme Colors Helper ---
  const themeClasses = {
    bg: isDark ? 'bg-zinc-950' : 'bg-stone-50',
    text: isDark ? 'text-zinc-100' : 'text-zinc-900',
    textMuted: isDark ? 'text-zinc-400' : 'text-zinc-500',
    textSubtle: isDark ? 'text-zinc-600' : 'text-zinc-400',
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
    cardBg: isDark ? 'bg-zinc-900' : 'bg-white',
    navBg: isDark ? 'bg-zinc-900/80' : 'bg-white/80',
    navBorder: isDark ? 'border-zinc-800' : 'border-zinc-200',
    inputBg: isDark ? 'bg-zinc-900' : 'bg-zinc-100',
    grid: isDark ? 'bg-grid-dark' : 'bg-grid-light',
    sectionBg: isDark ? 'bg-zinc-950' : 'bg-stone-50',
    sectionAltBg: isDark ? 'bg-black' : 'bg-zinc-100',
  };

  // --- Data ---
  const projects = [
    {
      title: "6-DOF Robotic Arm",
      category: "Mechatronics",
      id: "PRJ-001",
      description: "Designed and fabricated a 6-degree-of-freedom robotic arm for assembly line automation.",
      imageColor: isDark ? "bg-orange-900/10" : "bg-orange-100",
      textColor: isDark ? "text-orange-200" : "text-orange-800"
    },
    {
      title: "EV Battery System",
      category: "Thermal Analysis",
      id: "PRJ-002",
      description: "CFD simulation and optimization of liquid cooling channels for a 400V battery pack.",
      imageColor: isDark ? "bg-blue-900/10" : "bg-blue-100",
      textColor: isDark ? "text-blue-200" : "text-blue-800"
    },
    {
      title: "Mars Rover Chassis",
      category: "Automotive",
      id: "PRJ-003",
      description: "Structural design and FEA validation of a lightweight aluminum chassis.",
      imageColor: isDark ? "bg-stone-800/50" : "bg-stone-200",
      textColor: isDark ? "text-stone-300" : "text-stone-700"
    },
    {
      title: "Pneumatic Automation",
      category: "Industrial",
      id: "PRJ-004",
      description: "Retrofitting an industrial manual press with PLC-controlled pneumatics.",
      imageColor: isDark ? "bg-zinc-800/50" : "bg-zinc-200",
      textColor: isDark ? "text-zinc-300" : "text-zinc-700"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Generative Design in CAD",
      date: "Oct 15, 2023",
      category: "Trends",
      excerpt: "How AI is reshaping the way mechanical engineers approach topology optimization.",
      readTime: "5 min",
      color: isDark ? "bg-emerald-900/20" : "bg-emerald-100"
    },
    {
      id: 2,
      title: "Understanding GD&T Pitfalls",
      date: "Sep 28, 2023",
      category: "Tutorial",
      excerpt: "A deep dive into Geometric Dimensioning and Tolerancing modifiers.",
      readTime: "8 min",
      color: isDark ? "bg-amber-900/20" : "bg-amber-100"
    },
    {
      id: 3,
      title: "My Journey with 3D Printing Titanium",
      date: "Aug 10, 2023",
      category: "Log",
      excerpt: "Lessons learned from handling metal sintering powders.",
      readTime: "6 min",
      color: isDark ? "bg-rose-900/20" : "bg-rose-100"
    },
    {
      id: 4,
      title: "Thermodynamics in EV Batteries",
      date: "Jul 05, 2023",
      category: "Research",
      excerpt: "Analyzing trade-offs between liquid cooling and phase-change materials.",
      readTime: "12 min",
      color: isDark ? "bg-sky-900/20" : "bg-sky-100"
    }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} font-sans transition-colors duration-500 overflow-x-hidden relative`}>
      <style>{styles}</style>

      {/* --- Parallax Background Grid --- */}
      <div 
        className={`fixed inset-0 ${themeClasses.grid} pointer-events-none z-0 opacity-40`}
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      
      {/* --- Decorative Floating Gears/Elements --- */}
      <div 
        className={`fixed top-20 right-[-100px] opacity-5 pointer-events-none z-0 hidden md:block ${isDark ? 'text-white' : 'text-black'}`}
        style={{ transform: `rotate(${scrollY * 0.2}deg)` }}
      >
        <Settings size={400} strokeWidth={0.5} />
      </div>

      {/* --- Floating Pill Navigation --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className={`
          rounded-full px-2 py-2 flex items-center border ${themeClasses.navBorder}
          transition-all duration-500 ease-out
          ${scrollY > 50 
            ? `${themeClasses.navBg} backdrop-blur-xl shadow-2xl` 
            : `${isDark ? 'bg-zinc-950/80' : 'bg-stone-50/80'} backdrop-blur-sm shadow-xl`}
        `}>
          <div className={`pl-6 pr-6 md:pr-8 font-serif font-bold text-lg md:text-xl tracking-tighter cursor-pointer flex items-center gap-2 ${themeClasses.text}`} onClick={() => scrollToSection('home')}>
            <Settings size={20} className={themeClasses.textSubtle} />
            <span>M.E.</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {!showAllBlogs ? (
               ['Home', 'About', 'Projects', 'Experience', 'Thesis', 'Blogs'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === item.toLowerCase() ? `${isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'} shadow-sm` : `${themeClasses.textMuted} hover:${themeClasses.text}`}`}
                >
                  {item}
                </button>
              ))
            ) : (
              <button onClick={() => setShowAllBlogs(false)} className={`px-5 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'}`}>
                Back to Portfolio
              </button>
            )}
            
            <button 
               onClick={() => scrollToSection('contact')}
               className={`ml-2 px-5 py-2 rounded-full text-sm font-medium border ${themeClasses.border} hover:bg-zinc-500/10 transition-colors`}
            >
              Contact
            </button>

            {/* Resume Download Option */}
            <a 
              href="/resume.pdf" 
              download="Alex_Engineer_Resume.pdf"
              className={`ml-2 px-4 py-2 rounded-full text-sm font-medium border ${themeClasses.border} hover:bg-zinc-500/10 transition-all flex items-center gap-2 ${themeClasses.textSubtle} hover:${themeClasses.text}`}
            >
              Resume <Download size={14} />
            </a>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`ml-2 p-2 rounded-full border ${themeClasses.border} hover:bg-zinc-500/10 transition-colors ${themeClasses.text}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button className={`md:hidden p-2 ml-2 ${themeClasses.text}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 ${themeClasses.bg} z-40 pt-32 px-6 md:hidden transition-all duration-500 transform ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col gap-8 text-center">
          {['Home', 'About', 'Projects', 'Experience', 'Thesis', 'Blogs', 'Contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className={`text-4xl font-serif ${themeClasses.text} hover:${themeClasses.textMuted} transition-colors`}
            >
              {item}
            </button>
          ))}
          <div className="flex justify-center gap-4 mt-4">
             <a href="/resume.pdf" download className={`text-xl font-serif italic ${themeClasses.textMuted} hover:${themeClasses.text} flex items-center gap-2`}>
                Resume <Download size={20} />
             </a>
             <button onClick={toggleTheme} className={`text-xl font-serif italic ${themeClasses.textMuted} hover:${themeClasses.text} flex items-center gap-2`}>
                Theme {isDark ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </div>
        </div>
      </div>

      {showAllBlogs ? (
        // === BLOG PAGE ===
        <div className="pt-32 pb-20 container mx-auto px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
          <button onClick={() => setShowAllBlogs(false)} className={`group flex items-center gap-2 ${themeClasses.textMuted} hover:${themeClasses.text} mb-8 transition-colors`}>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Overview
          </button>
          
          <h1 className={`text-5xl md:text-8xl font-serif font-medium mb-12 md:mb-16 tracking-tight ${themeClasses.text}`}>
            Engineering <br/><span className={`italic ${themeClasses.textSubtle}`}>Chronicles</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {blogPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className={`aspect-[4/3] ${post.color} mb-6 rounded-sm overflow-hidden relative`}>
                   <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
                   <div className={`absolute top-4 left-4 ${isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'} border px-3 py-1 text-xs font-mono uppercase tracking-wider ${themeClasses.textSubtle}`}>{post.category}</div>
                </div>
                <div className={`flex items-center gap-4 text-xs font-mono ${themeClasses.textSubtle} mb-3 border-t ${themeClasses.border} pt-4`}>
                  <span>{post.date}</span>
                  <span>/</span>
                  <span>{post.readTime} Read</span>
                </div>
                <h2 className={`text-2xl md:text-3xl font-serif mb-3 ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors group-hover:underline decoration-1 underline-offset-4`}>{post.title}</h2>
                <p className={`${themeClasses.textMuted} leading-relaxed`}>{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // === MAIN PORTFOLIO ===
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
                <h1 className={`text-5xl sm:text-7xl md:text-9xl font-serif font-medium leading-[0.95] md:leading-[0.9] tracking-tight mb-8 ${themeClasses.text} relative`}>
                  Design with <br/>
                  <span className={`italic ${themeClasses.textSubtle} ml-2 md:ml-24 relative z-10`}>Precision.</span>
                  <div className={`absolute bottom-2 left-2 md:left-24 w-32 h-1 ${isDark ? 'bg-zinc-800' : 'bg-zinc-300'} -z-10 skew-x-12`}></div>
                </h1>
              </RevealOnScroll>
              
              <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-end mt-12">
                <div className={`md:col-span-1 border-l ${themeClasses.border} pl-6`}>
                   <p className={`text-base md:text-lg ${themeClasses.textMuted} leading-relaxed font-light`}>
                     Mechanical Engineer focused on bridging the gap between <span className={`${themeClasses.text} font-medium`}>rigorous analysis</span> and <span className={`${themeClasses.text} font-medium`}>functional aesthetics</span>.
                   </p>
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row justify-start md:justify-end gap-4">
                  <button onClick={() => scrollToSection('projects')} className={`${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'} px-8 py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg`}>
                    View Work <ArrowUpRight size={18} />
                  </button>
                  <button onClick={() => scrollToSection('contact')} className={`bg-transparent border ${isDark ? 'border-zinc-700 text-white hover:bg-zinc-900' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-100'} px-8 py-4 rounded-full font-medium transition-colors w-full sm:w-auto`}>
                    Get in Touch
                  </button>
                </div>
              </div>
            </div>

            <RevealOnScroll className="mt-12 md:mt-20">
               <div 
                  className={`w-full h-[300px] md:h-[500px] ${isDark ? 'bg-zinc-900' : 'bg-zinc-200'} rounded-sm overflow-hidden relative border ${themeClasses.border}`}
                  style={{ transform: `translateY(${scrollY * 0.05}px)` }} 
               >
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop" 
                    className={`w-full h-full object-cover grayscale ${isDark ? 'opacity-50 mix-blend-overlay' : 'opacity-70 mix-blend-multiply'}`}
                    alt="Mechanical Engineering"
                  />
                  {/* Technical Overlay */}
                  <div className={`absolute inset-0 ${themeClasses.grid} opacity-20`}></div>
                  <div className={`absolute bottom-4 right-4 font-mono text-xs ${themeClasses.textMuted}`}>FIG 1.0 // PROTOTYPING</div>
                  <div className={`absolute top-4 left-4 font-mono text-xs ${themeClasses.textMuted}`}>SCALE 1:1</div>
               </div>
            </RevealOnScroll>
          </section>

          {/* Marquee Skills */}
          <Marquee isDark={isDark} items={["CAD Design", "Thermodynamics", "Robotics", "FEA Analysis", "Prototyping", "Sustainable Design"]} />

          {/* About Section */}
          <section id="about" className={`py-20 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
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
                    <div className={`space-y-6 text-lg ${themeClasses.textMuted} leading-relaxed font-light`}>
                      <p>
                        I believe that great engineering is indistinguishable from art. Whether it's optimizing a thermal system or designing a chassis, the goal is always elegance in efficiency.
                      </p>
                      <p>
                        With a background in robotics and material science, I approach every project with a holistic view of the system's lifecycle.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                     <div 
                       className={`aspect-[3/4] ${themeClasses.cardBg} rounded-sm overflow-hidden border ${themeClasses.border} relative`}
                       style={{ transform: `translateY(${scrollY * -0.05}px)` }} 
                     >
                        <div className={`absolute inset-4 border ${isDark ? 'border-zinc-700/50' : 'border-zinc-300/50'}`}></div>
                        <div className={`absolute top-2 right-2 w-2 h-2 border-t border-r ${themeClasses.text}`}></div>
                        <div className={`absolute bottom-2 left-2 w-2 h-2 border-b border-l ${themeClasses.text}`}></div>
                        <div className={`w-full h-full flex items-center justify-center ${themeClasses.textSubtle} font-mono`}>
                          IMG_PORTRAIT.RAW
                        </div>
                     </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Projects - Masonry Grid */}
          <section id="projects" className={`py-20 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10`}>
            <div className="container mx-auto max-w-6xl">
              <div className={`flex justify-between items-end mb-12 md:mb-20 border-b ${themeClasses.border} pb-8`}>
                <div>
                   <span className={`font-mono text-xs ${themeClasses.textMuted} mb-2 block`}>SELECTED WORKS</span>
                   <h2 className={`text-4xl md:text-7xl font-serif ${themeClasses.text}`}>Portfolio</h2>
                </div>
                <span className={`font-mono ${themeClasses.textSubtle} hidden md:block text-xl`}>(04)</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-x-16">
                {projects.map((project, index) => (
                  <RevealOnScroll key={index} className={index % 2 !== 0 ? "md:pt-32" : ""}>
                    <div className="group cursor-pointer mb-12 md:mb-0">
                      <div className={`aspect-[4/3] ${project.imageColor} rounded-sm overflow-hidden mb-6 relative transition-all duration-500 group-hover:opacity-90 border ${themeClasses.border}`}>
                        <div className={`absolute top-4 right-4 font-mono text-[10px] ${themeClasses.textMuted} bg-black/10 px-2 py-1 backdrop-blur-sm rounded`}>{project.id}</div>
                        <div className={`absolute inset-0 flex items-center justify-center font-serif text-2xl italic opacity-60 ${project.textColor}`}>
                          {project.category}
                        </div>
                        <div className="absolute inset-0 border border-white/10 m-4"></div>
                      </div>
                      <div className={`flex justify-between items-start border-t ${themeClasses.border} pt-4`}>
                        <div>
                          <h3 className={`text-2xl md:text-3xl font-serif mb-2 ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors`}>{project.title}</h3>
                          <p className={`${themeClasses.textMuted} max-w-sm text-sm md:text-base font-mono`}>{project.description}</p>
                        </div>
                        <ArrowUpRight className={`opacity-0 group-hover:opacity-100 transition-opacity ${themeClasses.text}`} />
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className={`py-20 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-t ${themeClasses.border}`}>
            <div className="container mx-auto max-w-6xl">
              <RevealOnScroll>
                <div className="flex items-center gap-4 mb-16">
                   <Clock className={themeClasses.textMuted} size={24} />
                   <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Professional History</h2>
                </div>

                <div className={`relative border-l ${themeClasses.border} ml-3 md:ml-0 space-y-16`}>
                  {[
                    { role: "Senior Mechanical Engineer", company: "TechDynamics", year: "2021-Pres", desc: "Leading assembly fixture automation." },
                    { role: "Design Engineer", company: "Future Robotics", year: "2018-2021", desc: "End-effector design & FEA analysis." },
                    { role: "Intern", company: "AeroParts Inc", year: "2017-2018", desc: "Quality control & GD&T drafting." }
                  ].map((job, i) => (
                    <div key={i} className="relative pl-8 md:pl-12 group">
                      <div className={`absolute -left-[5px] top-2 w-[9px] h-[9px] ${themeClasses.bg} border ${isDark ? 'border-zinc-500' : 'border-zinc-400'} rounded-full group-hover:${isDark ? 'bg-white' : 'bg-zinc-900'} transition-colors`}></div>
                      
                      <div className="grid md:grid-cols-4 gap-4 items-baseline">
                         <span className={`font-mono text-sm ${themeClasses.textMuted} md:col-span-1`}>{job.year}</span>
                         <div className="md:col-span-3">
                           <h4 className={`text-xl md:text-2xl font-medium ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors`}>{job.role}</h4>
                           <div className={`${themeClasses.textSubtle} font-serif italic mb-2`}>{job.company}</div>
                           <p className={`${themeClasses.textMuted} text-sm max-w-lg`}>{job.desc}</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Thesis Section */}
          <section id="thesis" className={`py-20 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-t ${themeClasses.border}`}>
            <div className="container mx-auto max-w-6xl">
              <RevealOnScroll>
                <div className="flex items-center gap-4 mb-16 justify-end text-right">
                   <div>
                     <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Research & Publications</h2>
                     <span className={`font-mono text-xs ${themeClasses.textMuted}`}>ACADEMIC ARCHIVE</span>
                   </div>
                   <BookOpen className={themeClasses.textMuted} size={24} />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                   {[
                      { title: "Additive Mfg. Optimization", type: "Master's Thesis", year: "2023", id: "DOC-01" },
                      { title: "Hexapod Robot Kinematics", type: "Capstone", year: "2020", id: "DOC-02" },
                      { title: "Sustainable Composites", type: "Paper", year: "2021", id: "DOC-03" }
                    ].map((paper, i) => (
                      <div key={i} className={`group ${themeClasses.cardBg} p-8 rounded-sm border ${themeClasses.border} hover:${isDark ? 'border-zinc-600' : 'border-zinc-400'} transition-all hover:-translate-y-1 relative overflow-hidden shadow-sm`}>
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FileText size={40} />
                         </div>
                         <div className={`font-mono text-xs ${themeClasses.textSubtle} mb-6`}>{paper.id} // {paper.year}</div>
                         <h4 className={`text-xl font-serif ${themeClasses.text} mb-2`}>{paper.title}</h4>
                         <p className={`text-sm ${themeClasses.textMuted} font-mono mb-8`}>{paper.type}</p>
                         
                         <button className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${themeClasses.textMuted} group-hover:${themeClasses.text} transition-colors`}>
                            Download PDF <Download size={14} />
                         </button>
                      </div>
                    ))}
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Recent Blogs Preview */}
          <section id="blogs" className={`py-20 md:py-32 px-6 ${themeClasses.sectionAltBg} ${isDark ? 'text-white' : 'text-zinc-900'} relative z-10`}>
            <div className="container mx-auto max-w-6xl">
              <div className={`flex justify-between items-center mb-12 md:mb-16 border-b ${themeClasses.border} pb-6`}>
                <h2 className="text-3xl md:text-5xl font-serif">Recent Writing</h2>
                <button onClick={handleViewAllBlogs} className={`text-xs md:text-sm font-mono uppercase tracking-widest ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}>View All</button>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {blogPosts.slice(0, 2).map((post) => (
                  <div key={post.id} className="group cursor-pointer" onClick={handleViewAllBlogs}>
                    <div className={`flex items-center gap-3 text-sm ${themeClasses.textMuted} font-mono mb-4`}>
                      <span>{post.date}</span>
                      <span className={`w-1 h-1 ${isDark ? 'bg-zinc-700' : 'bg-zinc-400'} rounded-full`}></span>
                      <span className={themeClasses.textSubtle}>{post.category}</span>
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-serif mb-4 ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors`}>{post.title}</h3>
                    <p className={`${themeClasses.textMuted} leading-relaxed mb-6`}>{post.excerpt}</p>
                    <div className={`flex items-center gap-2 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 ${themeClasses.text}`}>
                      Read Article <ChevronRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact / Footer */}
          <section id="contact" className={`py-20 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10`}>
            <div className="container mx-auto max-w-6xl">
              <RevealOnScroll>
                <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                  <div>
                    <h2 className={`text-4xl md:text-6xl font-serif mb-6 ${themeClasses.text}`}>Let's start a project.</h2>
                    <p className={`text-lg ${themeClasses.textMuted} mb-12`}>
                      Available for freelance design engineering projects, consulting, and robotic systems development.
                    </p>
                    <div className="space-y-6">
                      {['contact@alexengineer.com', 'linkedin.com/in/alexeng', 'github.com/alexeng'].map((contact, i) => (
                        <div key={i} className={`flex items-center gap-4 ${themeClasses.textSubtle}`}>
                          {i === 0 ? <Mail size={20} /> : i === 1 ? <Linkedin size={20} /> : <Github size={20} />}
                          <span>{contact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${themeClasses.cardBg} p-6 md:p-8 rounded-sm border ${themeClasses.border}`}>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['Name', 'Email'].map((field) => (
                          <div key={field} className="space-y-2">
                            <label className={`text-xs uppercase tracking-wider ${themeClasses.textMuted} font-mono`}>{field}</label>
                            <input type={field === 'Email' ? 'email' : 'text'} className={`w-full ${themeClasses.inputBg} border ${themeClasses.border} rounded-sm p-3 ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors font-sans`} placeholder={field === 'Email' ? 'jane@example.com' : 'Jane Doe'} />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <label className={`text-xs uppercase tracking-wider ${themeClasses.textMuted} font-mono`}>Subject</label>
                        <input type="text" className={`w-full ${themeClasses.inputBg} border ${themeClasses.border} rounded-sm p-3 ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors font-sans`} placeholder="Project Inquiry" />
                      </div>
                      <div className="space-y-2">
                        <label className={`text-xs uppercase tracking-wider ${themeClasses.textMuted} font-mono`}>Message</label>
                        <textarea rows="4" className={`w-full ${themeClasses.inputBg} border ${themeClasses.border} rounded-sm p-3 ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors resize-none font-sans`} placeholder="Tell me about your project needs..."></textarea>
                      </div>
                      <button className={`w-full ${isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'} font-medium py-4 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-widest`}>
                        Send Message <Send size={18} />
                      </button>
                    </form>
                  </div>
                </div>
                
                <div className={`mt-20 pt-8 border-t ${themeClasses.border} flex flex-col md:flex-row justify-between text-sm ${themeClasses.textSubtle} font-mono gap-4 items-center`}>
                  <span>© 2024 Alex Engineer</span>
                  <span>Made with React & Tailwind</span>
                </div>
              </RevealOnScroll>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default App;