import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Linkedin, Github, Mail, Download, ArrowUpRight, 
  Cpu, Thermometer, Box, Zap, FileText, BookOpen, ArrowLeft, 
  Clock, ChevronRight, Send, Settings, Ruler, GitCommit,
  Moon, Sun, Loader, GraduationCap, Facebook, Instagram, Twitter, 
  MessageCircle, Globe, Code, Terminal, PenTool, Database, Layers, Wrench, Server, Briefcase, Building2, ArrowUp, Award
} from 'lucide-react';

// --- Configuration ---
// Ensure this matches your Flask local address
const API_BASE_URL = 'https://adnan-backend-eyxe.onrender.com/api'; 
// const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Local Flask API

// --- Styles & Fonts ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&display=swap');
  /* Import Devicon for colored tech icons */
  @import url("https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css");

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
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.2));
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
          <GitCommit size={14} className={isDark ? 'text-zinc-700' : 'text-zinc-400'} /> {item.name || item}
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
  
  // --- Data State ---
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [thesisData, setThesisData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Fetch API Data ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [aboutRes, skillsRes, eduRes, projectsRes, expRes, thesisRes, achievementsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/about`),
          fetch(`${API_BASE_URL}/skills`),
          fetch(`${API_BASE_URL}/education`),
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/experience`),
          fetch(`${API_BASE_URL}/thesis`),
          fetch(`${API_BASE_URL}/achievements`)
        ]);

        if (aboutRes.ok) setAboutData(await aboutRes.json());
        if (skillsRes.ok) setSkillsData(await skillsRes.json());
        if (eduRes.ok) setEducationData(await eduRes.json());
        if (projectsRes.ok) setProjectsData(await projectsRes.json());
        if (expRes.ok) setExperienceData(await expRes.json());
        if (thesisRes.ok) setThesisData(await thesisRes.json());
        if (achievementsRes.ok) setAchievementsData(await achievementsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Scroll Listener ---
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['home', 'about', 'skills', 'education', 'projects', 'achievements', 'experience', 'thesis', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
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

  // --- Helper to build contact links list dynamically ---
  const getContactLinks = () => {
    if (!aboutData) return [];
    
    const links = [];
    
    // Check specific fields from your models.py About class
    if (aboutData.email) links.push({ icon: Mail, text: aboutData.email, href: `mailto:${aboutData.email}` });
    if (aboutData.website) links.push({ icon: Globe, text: 'Website', href: aboutData.website });
    if (aboutData.github) links.push({ icon: Github, text: 'GitHub', href: aboutData.github });
    if (aboutData.linkedin) links.push({ icon: Linkedin, text: 'LinkedIn', href: aboutData.linkedin });
    if (aboutData.facebook) links.push({ icon: Facebook, text: 'Facebook', href: aboutData.facebook });
    if (aboutData.instagram) links.push({ icon: Instagram, text: 'Instagram', href: aboutData.instagram });
    if (aboutData.twitter) links.push({ icon: Twitter, text: 'Twitter', href: aboutData.twitter });
    
    // WhatsApp logic - ensure it handles just numbers or full links
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

  // --- Helper to get Skill Asset (Devicon > Simple Icons > Lucide) ---
  const getSkillAsset = (skillName) => {
    const lower = skillName.toLowerCase();
    
    // 1. Devicon Mapping (Preferred for Dev Tools - Colored)
    const deviconMap = [
        { term: 'python', class: 'devicon-python-plain colored' },
        { term: 'java', class: 'devicon-java-plain colored' }, 
        { term: 'js', class: 'devicon-javascript-plain colored' },
        { term: 'javascript', class: 'devicon-javascript-plain colored' },
        { term: 'react', class: 'devicon-react-original colored' },
        { term: 'html', class: 'devicon-html5-plain colored' },
        { term: 'css', class: 'devicon-css3-plain colored' },
        { term: 'c++', class: 'devicon-cplusplus-plain colored' },
        { term: 'cpp', class: 'devicon-cplusplus-plain colored' },
        { term: 'c#', class: 'devicon-csharp-plain colored' },
        { term: 'git', class: 'devicon-git-plain colored' },
        { term: 'docker', class: 'devicon-docker-plain colored' },
        { term: 'flask', class: 'devicon-flask-original colored' },
        { term: 'matlab', class: 'devicon-matlab-plain colored' },
        { term: 'arduino', class: 'devicon-arduino-plain colored' },
        { term: 'latex', class: 'devicon-latex-original colored' },
        { term: 'linux', class: 'devicon-linux-plain colored' },
        { term: 'ubuntu', class: 'devicon-ubuntu-plain colored' },
        { term: 'blender', class: 'devicon-blender-original colored' },
        { term: 'photoshop', class: 'devicon-photoshop-plain colored' },
        { term: 'illustrator', class: 'devicon-illustrator-plain colored' },
        { term: 'figma', class: 'devicon-figma-plain colored' },
        { term: 'node', class: 'devicon-nodejs-plain colored' },
        { term: 'tailwind', class: 'devicon-tailwindcss-original colored' },
    ];

    const deviconMatch = deviconMap.find(m => lower.includes(m.term));
    if (deviconMatch) {
        return { type: 'devicon', className: deviconMatch.class };
    }

    // 2. Simple Icons (Preferred for Engineering/CAD Brands missing in Devicon)
    const brandMap = [
      { term: 'solidworks', slug: 'dassaultsystemes' },
      { term: 'ansys', slug: 'ansys' },
      { term: 'autocad', slug: 'autodesk' },
      { term: 'fusion', slug: 'autodesk' },
      { term: 'microsoft office', slug: 'microsoft' }, 
      { term: 'office', slug: 'microsoft365' }, 
      { term: 'word', slug: 'microsoftword' },
      { term: 'excel', slug: 'microsoftexcel' },
      { term: 'powerpoint', slug: 'microsoftpowerpoint' },
    ];

    const brandMatch = brandMap.find(brand => lower.includes(brand.term));
    if (brandMatch) {
      return { 
        type: 'image', 
        src: `https://cdn.simpleicons.org/${brandMatch.slug}` 
      };
    }

    // 3. Lucide Fallbacks (Generic)
    if (lower.includes('script') || lower.includes('code')) return { type: 'icon', component: Terminal };
    if (lower.includes('design') || lower.includes('cad')) return { type: 'icon', component: PenTool };
    if (lower.includes('analysis') || lower.includes('fea')) return { type: 'icon', component: Thermometer };
    if (lower.includes('circuit') || lower.includes('electronic') || lower.includes('pcb')) return { type: 'icon', component: Zap };
    if (lower.includes('database') || lower.includes('sql') || lower.includes('mongo')) return { type: 'icon', component: Database };
    if (lower.includes('sys') || lower.includes('server')) return { type: 'icon', component: Server };
    if (lower.includes('mech') || lower.includes('robot') || lower.includes('engineer')) return { type: 'icon', component: Wrench };
    if (lower.includes('manage') || lower.includes('lead')) return { type: 'icon', component: Layers };
    
    return { type: 'icon', component: Cpu }; // Default
  };

  // --- Theme Colors Helper ---
  const themeClasses = {
    bg: isDark ? 'bg-zinc-950' : 'bg-stone-50',
    text: isDark ? 'text-white' : 'text-zinc-900', // Changed to pure white for better contrast
    textMuted: isDark ? 'text-zinc-300' : 'text-zinc-500', // Lighter grey for better readability
    textSubtle: isDark ? 'text-zinc-400' : 'text-zinc-400', // Lighter subtle text
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
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
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} font-sans transition-colors duration-500 overflow-x-hidden relative`}>
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

      {/* --- Floating Pill Navigation --- */}
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className={`
          rounded-full px-2 py-2 flex items-center border ${themeClasses.navBorder}
          transition-all duration-500 ease-out
          ${scrollY > 50 
            ? `${themeClasses.navBg} backdrop-blur-xl shadow-2xl` 
            : `${isDark ? 'bg-zinc-950/80' : 'bg-stone-50/80'} backdrop-blur-sm shadow-xl`}
        `}>
          <div className={`pl-4 md:pl-6 pr-4 md:pr-8 font-serif font-bold text-lg md:text-xl tracking-tighter cursor-pointer flex items-center gap-2 ${themeClasses.text}`} onClick={() => scrollToSection('home')}>
            <Settings size={18} className={themeClasses.textSubtle} />
            <span>M.E.</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {['Home', 'About', 'Skills', 'Education', 'Projects', 'Achievements', 'Experience', 'Thesis'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 ${activeSection === item.toLowerCase() ? `${isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'} shadow-sm` : `${themeClasses.textMuted} hover:${themeClasses.text}`}`}
              >
                {item}
              </button>
            ))}
            
            <button 
               onClick={() => scrollToSection('contact')}
               className={`ml-2 px-4 py-2 rounded-full text-xs lg:text-sm font-medium border ${themeClasses.border} hover:bg-zinc-500/10 transition-colors`}
            >
              Contact
            </button>

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
          {['Home', 'About', 'Skills', 'Education', 'Projects', 'Achievements', 'Experience', 'Thesis', 'Contact'].map((item) => (
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

      {/* === MAIN PORTFOLIO === */}
      
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
                <p className={`text-base md:text-lg ${themeClasses.textMuted} leading-relaxed font-normal`}> {/* Removed font-light */}
                  {aboutData?.short_bio || "Mechanical Engineer focused on bridging the gap between rigorous analysis and functional aesthetics."}
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
                <div className={`space-y-6 text-lg ${themeClasses.textMuted} leading-relaxed font-normal whitespace-pre-wrap mb-10`}> {/* Removed font-light */}
                  {aboutData?.long_bio || "I believe that great engineering is indistinguishable from art. Whether it's optimizing a thermal system or designing a chassis, the goal is always elegance in efficiency."}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                    {[
                        { label: "Birthday", value: aboutData?.birthday },
                        { label: "Website", value: aboutData?.website },
                        { label: "Phone", value: aboutData?.phone },
                        { label: "City", value: aboutData?.city },
                        { label: "Degree", value: aboutData?.degree },
                        { label: "Email", value: aboutData?.email },
                        { label: "Freelance", value: aboutData?.freelance_status },
                    ].map((info, i) => (
                        info.value && (
                            <div key={i}>
                                <span className={`block text-xs uppercase tracking-widest ${themeClasses.textMuted} mb-1 font-mono opacity-70`}>{info.label}:</span>
                                <span className={`${themeClasses.text} font-medium break-all`}>{info.value}</span>
                            </div>
                        )
                    ))}
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

      {/* Skills Section */}
      <section id="skills" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
        <div className="container mx-auto max-w-6xl">
          <RevealOnScroll>
            <div className="flex items-center gap-4 mb-12 md:mb-16">
               <Cpu className={themeClasses.textMuted} size={24} />
               <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Technical Proficiency</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
               {skillsData.length > 0 ? skillsData.map((skill, index) => {
                  const asset = getSkillAsset(skill.name);
                  
                  return (
                    <div key={skill.id || index} className={`p-4 md:p-6 border ${themeClasses.border} rounded-sm flex flex-col items-center justify-center gap-4 group hover:bg-zinc-500/5 transition-colors`}>
                        {asset.type === 'devicon' ? (
                            <i className={`${asset.className} text-3xl md:text-4xl transition-transform group-hover:scale-110`}></i>
                        ) : asset.type === 'image' ? (
                            <img 
                                src={asset.src} 
                                alt={skill.name} 
                                className={`w-8 h-8 object-contain transition-transform group-hover:scale-110 ${isDark ? 'dark-icon-glow' : ''}`} 
                            />
                        ) : (
                            <asset.component 
                                size={32} 
                                className={`${themeClasses.textSubtle} group-hover:${themeClasses.text} transition-colors group-hover:scale-110`} 
                            />
                        )}
                        <span className={`font-mono text-xs md:text-sm uppercase tracking-wide text-center ${themeClasses.text}`}>
                          {skill.name}
                        </span>
                    </div>
                  );
               }) : (
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
                  
                  {/* Updated Layout for Education Item */}
                  <div className="grid md:grid-cols-4 gap-4 items-start">
                      {/* Left Column: University Logo Placeholder - Adjusted for mobile */}
                      <div className={`md:col-span-1 flex justify-start`}>
                          <div className={`w-32 h-32 md:w-32 md:h-32 rounded-xl border dark-logo-glow ${themeClasses.border} ${isDark ? 'bg-zinc-800/50' : 'bg-white'} flex items-center justify-center  overflow-hidden shrink-0`}>
                             {edu.logo_url ? (
                                <img src={edu.logo_url} alt={edu.institution} className="w-full h-full object-contain" />
                             ) : (
                                <Building2 size={24} className={`md:w-8 md:h-8 ${themeClasses.textSubtle}`} />
                             )}
                          </div>
                      </div>
                      
                      {/* Right Column: Content */}
                      <div className="md:col-span-3">
                        <h4 className={`text-xl md:text-2xl font-medium ${themeClasses.text} group-hover:${themeClasses.textMuted} transition-colors`}>{edu.degree}</h4>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-2 gap-1">
                            <div className={`${themeClasses.textSubtle} font-serif italic`}>{edu.institution}</div>
                            <span className={`font-mono text-sm ${themeClasses.textMuted} whitespace-nowrap`}>{edu.year_range}</span>
                        </div>
                        
                        <p className={`${themeClasses.textMuted} text-sm max-w-lg`}>{edu.description}</p>
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

      {/* Projects - Masonry Grid */}
      <section id="projects" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
        <div className="container mx-auto max-w-6xl">
          <RevealOnScroll>
            {/* Standardized Header */}
            <div className="flex items-center gap-4 mb-12 md:mb-16">
               <Briefcase className={themeClasses.textMuted} size={24} />
               <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Portfolio</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-x-16">
              {projectsData.length > 0 ? projectsData.map((project, index) => (
                <RevealOnScroll key={project.id} className={index % 2 !== 0 ? "md:pt-32" : ""}>
                  <div className="group cursor-pointer mb-12 md:mb-0">
                    <div className={`aspect-[4/3] ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'} rounded-sm overflow-hidden mb-6 relative transition-all duration-500 group-hover:opacity-90 border ${themeClasses.border}`}>
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
                        <p className={`${themeClasses.textMuted} max-w-sm text-sm md:text-base font-mono`}>{project.category}</p>
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
                      {/* Assuming 'year' or 'date' is present in your backend response for achievements */}
                      {(achievement.year || achievement.date) && (
                        <span className={`font-mono text-xs ${themeClasses.textMuted} border ${themeClasses.border} px-2 py-1 rounded-full shrink-0 ml-2`}>{achievement.year || achievement.date}</span>
                      )}
                   </div>
                   {/* Assuming 'organization' or similar field exists */}
                   {achievement.organization && (
                     <p className={`${themeClasses.textSubtle} font-medium mb-2`}>{achievement.organization}</p>
                   )}
                   <p className={`${themeClasses.textMuted} text-sm leading-relaxed`}>{achievement.description}</p>
                </div>
              )) : (
                <div className={`col-span-2 text-center py-10 ${themeClasses.textMuted}`}>No achievements loaded.</div>
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
                        <p className={`${themeClasses.textMuted} text-sm max-w-lg`}>{job.description}</p>
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

      {/* Thesis Section */}
      <section id="thesis" className={`py-16 md:py-32 px-6 ${themeClasses.sectionBg} relative z-10 border-b ${themeClasses.border}`}>
        <div className="container mx-auto max-w-6xl">
          <RevealOnScroll>
            <div className="flex items-center gap-4 mb-12 md:mb-16 justify-end text-right">
                <div>
                  <h2 className={`text-3xl md:text-5xl font-serif ${themeClasses.text}`}>Research & Publications</h2>
                  <span className={`font-mono text-xs ${themeClasses.textMuted}`}>ACADEMIC ARCHIVE</span>
                </div>
                <BookOpen className={themeClasses.textMuted} size={24} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {thesisData.length > 0 ? thesisData.map((paper) => (
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
      <section id="contact" className={`pt-16 pb-8 md:pt-32 md:pb-10 px-6 ${themeClasses.sectionBg} relative z-10`}>
        <div className="container mx-auto max-w-6xl">
          <RevealOnScroll>
            <div className="grid md:grid-cols-2 gap-12 md:gap-20">
              <div>
                <h2 className={`text-4xl md:text-6xl font-serif mb-6 ${themeClasses.text}`}>Let's start a project.</h2>
                <p className={`text-lg ${themeClasses.textMuted} mb-12`}>
                  {aboutData?.freelance_status || "Available for freelance design engineering projects, consulting, and robotic systems development."}
                </p>
                <div className="space-y-6">
                  {/* Dynamic Contact Links - Only showing 8 specific types */}
                  {contactLinks.map((link, i) => (
                    <a key={i} href={link.href || '#'} target={link.href && link.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className={`flex items-center gap-4 ${themeClasses.textSubtle} hover:${themeClasses.text} transition-colors group`}>
                      <link.icon size={20} className="group-hover:scale-110 transition-transform"/>
                      <span>{link.href}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className={`${themeClasses.cardBg} p-6 md:p-8 rounded-sm border ${themeClasses.border}`}>
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['name', 'email'].map((field) => (
                      <div key={field} className="space-y-2">
                        <label className={`text-xs uppercase tracking-wider ${themeClasses.textMuted} font-mono`}>{field}</label>
                        <input 
                            type={field === 'email' ? 'email' : 'text'} 
                            name={field}
                            value={contactForm[field]}
                            onChange={handleContactChange}
                            required
                            className={`w-full ${themeClasses.inputBg} border ${themeClasses.border} rounded-sm p-3 ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors font-sans`} 
                            placeholder={field === 'email' ? 'jane@example.com' : 'Jane Doe'} 
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
                        className={`w-full ${themeClasses.inputBg} border ${themeClasses.border} rounded-sm p-3 ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors font-sans`} 
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
                        className={`w-full ${themeClasses.inputBg} border ${themeClasses.border} rounded-sm p-3 ${themeClasses.text} focus:outline-none focus:border-zinc-500 transition-colors resize-none font-sans`} 
                        placeholder="Tell me about your project needs..."
                    ></textarea>
                  </div>
                  <button 
                    disabled={sending}
                    className={`w-full ${isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'} font-medium py-4 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-widest disabled:opacity-50`}
                  >
                    {sending ? 'Sending...' : sentSuccess ? 'Message Sent!' : 'Send Message'} <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
            
            <div className={`mt-10 pt-8 border-t ${themeClasses.border} flex flex-col md:flex-row justify-between text-sm ${themeClasses.textSubtle} font-mono gap-4 items-center`}>
              <span>© {new Date().getFullYear()} {aboutData?.name || "Alex Engineer"}</span>
              <span>Made with React & Flask</span>
            </div>
          </RevealOnScroll>
        </div>
      </section>
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
          scrollY > 500 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        } ${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default App;