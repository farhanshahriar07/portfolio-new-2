import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Linkedin, Github, Mail, Download, ArrowUpRight, 
  Cpu, Thermometer, Box, Zap, FileText, BookOpen, ArrowLeft, 
  Clock, ChevronRight, Send, Settings, Ruler, GitCommit
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
  
  .bg-grid {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
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

const Marquee = ({ items }) => (
  <div className="relative flex overflow-hidden py-4 bg-zinc-950 border-y border-zinc-800">
    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
      {items.concat(items).map((item, i) => (
        <span key={i} className="text-xl md:text-2xl font-mono text-zinc-600 mx-4 flex items-center gap-4">
          <GitCommit size={14} className="text-zinc-700" /> {item}
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

  // --- Data ---
  const projects = [
    {
      title: "6-DOF Robotic Arm",
      category: "Mechatronics",
      id: "PRJ-001",
      description: "Designed and fabricated a 6-degree-of-freedom robotic arm for assembly line automation.",
      imageColor: "bg-orange-900/10",
      textColor: "text-orange-200"
    },
    {
      title: "EV Battery System",
      category: "Thermal Analysis",
      id: "PRJ-002",
      description: "CFD simulation and optimization of liquid cooling channels for a 400V battery pack.",
      imageColor: "bg-blue-900/10",
      textColor: "text-blue-200"
    },
    {
      title: "Mars Rover Chassis",
      category: "Automotive",
      id: "PRJ-003",
      description: "Structural design and FEA validation of a lightweight aluminum chassis.",
      imageColor: "bg-stone-800/50",
      textColor: "text-stone-300"
    },
    {
      title: "Pneumatic Automation",
      category: "Industrial",
      id: "PRJ-004",
      description: "Retrofitting an industrial manual press with PLC-controlled pneumatics.",
      imageColor: "bg-zinc-800/50",
      textColor: "text-zinc-300"
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
      color: "bg-emerald-900/20"
    },
    {
      id: 2,
      title: "Understanding GD&T Pitfalls",
      date: "Sep 28, 2023",
      category: "Tutorial",
      excerpt: "A deep dive into Geometric Dimensioning and Tolerancing modifiers.",
      readTime: "8 min",
      color: "bg-amber-900/20"
    },
    {
      id: 3,
      title: "My Journey with 3D Printing Titanium",
      date: "Aug 10, 2023",
      category: "Log",
      excerpt: "Lessons learned from handling metal sintering powders.",
      readTime: "6 min",
      color: "bg-rose-900/20"
    },
    {
      id: 4,
      title: "Thermodynamics in EV Batteries",
      date: "Jul 05, 2023",
      category: "Research",
      excerpt: "Analyzing trade-offs between liquid cooling and phase-change materials.",
      readTime: "12 min",
      color: "bg-sky-900/20"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white selection:text-zinc-900 overflow-x-hidden relative">
      <style>{styles}</style>

      {/* --- Parallax Background Grid --- */}
      <div 
        className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-40"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      
      {/* --- Decorative Floating Gears/Elements --- */}
      <div 
        className="fixed top-20 right-[-100px] opacity-5 text-white pointer-events-none z-0 hidden md:block"
        style={{ transform: `rotate(${scrollY * 0.2}deg)` }}
      >
        <Settings size={400} strokeWidth={0.5} />
      </div>

      {/* --- Floating Pill Navigation (Video Style) --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className={`
          rounded-full px-2 py-2 flex items-center border border-zinc-800
          text-zinc-100 transition-all duration-500 ease-out
          ${scrollY > 50 
            ? 'bg-zinc-900/80 backdrop-blur-xl shadow-2xl' 
            : 'bg-zinc-950/80 backdrop-blur-sm shadow-xl'}
        `}>
          <div className="pl-6 pr-6 md:pr-8 font-serif font-bold text-lg md:text-xl tracking-tighter cursor-pointer text-white flex items-center gap-2" onClick={() => scrollToSection('home')}>
            <Settings size={20} className="text-zinc-400" />
            <span>M.E.</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {!showAllBlogs ? (
               ['Home', 'About', 'Projects', 'Experience', 'Thesis', 'Blogs'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === item.toLowerCase() ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                >
                  {item}
                </button>
              ))
            ) : (
              <button onClick={() => setShowAllBlogs(false)} className="px-5 py-2 rounded-full text-sm font-medium bg-white text-zinc-900">
                Back to Portfolio
              </button>
            )}
            
            <button 
               onClick={() => scrollToSection('contact')}
               className="ml-2 px-5 py-2 rounded-full text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-colors"
            >
              Contact
            </button>

            {/* Resume Download Option */}
            <a 
              href="/resume.pdf" 
              download="Alex_Engineer_Resume.pdf"
              className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              Resume <Download size={14} />
            </a>
          </div>

          <button className="md:hidden p-2 text-white ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-zinc-950/95 z-40 pt-32 px-6 md:hidden transition-all duration-500 transform ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col gap-8 text-center">
          {['Home', 'About', 'Projects', 'Experience', 'Thesis', 'Blogs', 'Contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-4xl font-serif text-white hover:text-zinc-400 active:text-zinc-600 transition-colors"
            >
              {item}
            </button>
          ))}
          {/* Mobile Resume Link */}
          <a href="/resume.pdf" download className="text-2xl font-serif italic text-zinc-500 hover:text-white flex items-center justify-center gap-2 mt-4">
            Download Resume <Download size={20} />
          </a>
        </div>
      </div>

      {showAllBlogs ? (
        // === BLOG PAGE ===
        <div className="pt-32 pb-20 container mx-auto px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
          <button onClick={() => setShowAllBlogs(false)} className="group flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Overview
          </button>
          
          <h1 className="text-5xl md:text-8xl font-serif font-medium mb-12 md:mb-16 tracking-tight text-white">
            Engineering <br/><span className="italic text-zinc-500">Chronicles</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {blogPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className={`aspect-[4/3] ${post.color} mb-6 rounded-sm overflow-hidden relative`}>
                   <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
                   <div className="absolute top-4 left-4 bg-zinc-900/90 border border-zinc-800 px-3 py-1 text-xs font-mono uppercase tracking-wider text-zinc-300">{post.category}</div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mb-3 border-t border-zinc-800 pt-4">
                  <span>{post.date}</span>
                  <span>/</span>
                  <span>{post.readTime} Read</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif mb-3 text-zinc-100 group-hover:text-zinc-400 transition-colors group-hover:underline decoration-1 underline-offset-4">{post.title}</h2>
                <p className="text-zinc-400 leading-relaxed">{post.excerpt}</p>
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
                   <Ruler size={16} className="text-zinc-400" />
                   <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">System.Architecture.Design</span>
                   <div className="h-px w-24 bg-zinc-700"></div>
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif font-medium leading-[0.95] md:leading-[0.9] tracking-tight mb-8 text-white relative">
                  Design with <br/>
                  <span className="italic text-zinc-600 ml-2 md:ml-24 relative z-10">Precision.</span>
                  {/* Decorative Underline */}
                  <div className="absolute bottom-2 left-2 md:left-24 w-32 h-1 bg-zinc-800 -z-10 skew-x-12"></div>
                </h1>
              </RevealOnScroll>
              
              <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-end mt-12">
                <div className="md:col-span-1 border-l border-zinc-800 pl-6">
                   <p className="text-base md:text-lg text-zinc-400 leading-relaxed font-light">
                     Mechanical Engineer focused on bridging the gap between <span className="text-white font-medium">rigorous analysis</span> and <span className="text-white font-medium">functional aesthetics</span>.
                   </p>
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row justify-start md:justify-end gap-4">
                  <button onClick={() => scrollToSection('projects')} className="bg-white text-zinc-900 px-8 py-4 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    View Work <ArrowUpRight size={18} />
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="bg-transparent border border-zinc-700 text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-900 transition-colors w-full sm:w-auto">
                    Get in Touch
                  </button>
                </div>
              </div>
            </div>

            <RevealOnScroll className="mt-12 md:mt-20">
               <div 
                  className="w-full h-[300px] md:h-[500px] bg-zinc-900 rounded-sm overflow-hidden relative border border-zinc-800"
                  style={{ transform: `translateY(${scrollY * 0.05}px)` }} // Subtle Parallax
               >
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop" 
                    className="w-full h-full object-cover grayscale opacity-50 mix-blend-overlay"
                    alt="Mechanical Engineering"
                  />
                  {/* Technical Overlay */}
                  <div className="absolute inset-0 bg-grid opacity-20"></div>
                  <div className="absolute bottom-4 right-4 font-mono text-xs text-zinc-500">FIG 1.0 // PROTOTYPING</div>
                  <div className="absolute top-4 left-4 font-mono text-xs text-zinc-500">SCALE 1:1</div>
               </div>
            </RevealOnScroll>
          </section>

          {/* Marquee Skills */}
          <Marquee items={["CAD Design", "Thermodynamics", "Robotics", "FEA Analysis", "Prototyping", "Sustainable Design"]} />

          {/* About Section */}
          <section id="about" className="py-20 md:py-32 px-6 bg-zinc-950 relative z-10 border-b border-zinc-900">
            <div className="container mx-auto max-w-6xl">
              <RevealOnScroll>
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4 block flex items-center gap-2">
                       <span className="w-2 h-2 bg-zinc-500 rounded-full"></span> About Me
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight text-white">
                      Applying <span className="italic text-zinc-400">first principles</span> to solve complex physical problems.
                    </h2>
                    <div className="space-y-6 text-lg text-zinc-400 leading-relaxed font-light">
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
                       className="aspect-[3/4] bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800 relative"
                       style={{ transform: `translateY(${scrollY * -0.05}px)` }} // Reverse Parallax
                     >
                        <div className="absolute inset-4 border border-zinc-700/50"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white"></div>
                        {/* Placeholder for portrait */}
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900 font-mono">
                          IMG_PORTRAIT.RAW
                        </div>
                     </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Projects - Masonry Grid */}
          <section id="projects" className="py-20 md:py-32 px-6 bg-zinc-950 relative z-10">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-end mb-12 md:mb-20 border-b border-zinc-900 pb-8">
                <div>
                   <span className="font-mono text-xs text-zinc-500 mb-2 block">SELECTED WORKS</span>
                   <h2 className="text-4xl md:text-7xl font-serif text-white">Portfolio</h2>
                </div>
                <span className="font-mono text-zinc-600 hidden md:block text-xl">(04)</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-x-16">
                {projects.map((project, index) => (
                  <RevealOnScroll key={index} className={index % 2 !== 0 ? "md:pt-32" : ""}>
                    <div className="group cursor-pointer mb-12 md:mb-0">
                      <div className={`aspect-[4/3] ${project.imageColor} rounded-sm overflow-hidden mb-6 relative transition-all duration-500 group-hover:opacity-90 border border-zinc-800`}>
                        <div className="absolute top-4 right-4 font-mono text-[10px] text-zinc-500/50 bg-black/20 px-2 py-1 backdrop-blur-sm rounded">{project.id}</div>
                        <div className={`absolute inset-0 flex items-center justify-center font-serif text-2xl italic opacity-60 ${project.textColor}`}>
                          {project.category}
                        </div>
                        {/* Blueprint Lines */}
                        <div className="absolute inset-0 border border-white/5 m-4"></div>
                      </div>
                      <div className="flex justify-between items-start border-t border-zinc-900 pt-4">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-serif mb-2 text-zinc-200 group-hover:text-zinc-500 transition-colors">{project.title}</h3>
                          <p className="text-zinc-500 max-w-sm text-sm md:text-base font-mono">{project.description}</p>
                        </div>
                        <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-200" />
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>

          {/* --- SPLIT SECTIONS: EXPERIENCE & RESEARCH --- */}

          {/* Experience Section - Vertical Timeline */}
          <section id="experience" className="py-20 md:py-32 px-6 bg-zinc-900 relative z-10 border-t border-zinc-800">
            <div className="container mx-auto max-w-6xl">
              <RevealOnScroll>
                <div className="flex items-center gap-4 mb-16">
                   <Clock className="text-zinc-500" size={24} />
                   <h2 className="text-3xl md:text-5xl font-serif text-white">Professional History</h2>
                </div>

                <div className="relative border-l border-zinc-800 ml-3 md:ml-0 space-y-16">
                  {[
                    { role: "Senior Mechanical Engineer", company: "TechDynamics", year: "2021-Pres", desc: "Leading assembly fixture automation." },
                    { role: "Design Engineer", company: "Future Robotics", year: "2018-2021", desc: "End-effector design & FEA analysis." },
                    { role: "Intern", company: "AeroParts Inc", year: "2017-2018", desc: "Quality control & GD&T drafting." }
                  ].map((job, i) => (
                    <div key={i} className="relative pl-8 md:pl-12 group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] bg-zinc-950 border border-zinc-500 rounded-full group-hover:bg-white transition-colors"></div>
                      
                      <div className="grid md:grid-cols-4 gap-4 items-baseline">
                         <span className="font-mono text-sm text-zinc-500 md:col-span-1">{job.year}</span>
                         <div className="md:col-span-3">
                           <h4 className="text-xl md:text-2xl font-medium text-zinc-200 group-hover:text-white transition-colors">{job.role}</h4>
                           <div className="text-zinc-400 font-serif italic mb-2">{job.company}</div>
                           <p className="text-zinc-500 text-sm max-w-lg">{job.desc}</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Research / Thesis Section - File Grid */}
          <section id="thesis" className="py-20 md:py-32 px-6 bg-zinc-950 relative z-10 border-t border-zinc-900">
            <div className="container mx-auto max-w-6xl">
              <RevealOnScroll>
                <div className="flex items-center gap-4 mb-16 justify-end text-right">
                   <div>
                     <h2 className="text-3xl md:text-5xl font-serif text-white">Research & Publications</h2>
                     <span className="font-mono text-xs text-zinc-500">ACADEMIC ARCHIVE</span>
                   </div>
                   <BookOpen className="text-zinc-500" size={24} />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                   {[
                      { title: "Additive Mfg. Optimization", type: "Master's Thesis", year: "2023", id: "DOC-01" },
                      { title: "Hexapod Robot Kinematics", type: "Capstone", year: "2020", id: "DOC-02" },
                      { title: "Sustainable Composites", type: "Paper", year: "2021", id: "DOC-03" }
                    ].map((paper, i) => (
                      <div key={i} className="group bg-zinc-900 p-8 rounded-sm border border-zinc-800 hover:border-zinc-600 transition-all hover:-translate-y-1 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FileText size={40} />
                         </div>
                         <div className="font-mono text-xs text-zinc-600 mb-6">{paper.id} // {paper.year}</div>
                         <h4 className="text-xl font-serif text-zinc-200 mb-2 group-hover:text-white">{paper.title}</h4>
                         <p className="text-sm text-zinc-500 font-mono mb-8">{paper.type}</p>
                         
                         <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                            Download PDF <Download size={14} />
                         </button>
                      </div>
                    ))}
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Recent Blogs Preview */}
          <section id="blogs" className="py-20 md:py-32 px-6 bg-black text-white relative z-10">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-center mb-12 md:mb-16 border-b border-zinc-800 pb-6">
                <h2 className="text-3xl md:text-5xl font-serif">Recent Writing</h2>
                <button onClick={handleViewAllBlogs} className="text-xs md:text-sm font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">View All</button>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {blogPosts.slice(0, 2).map((post) => (
                  <div key={post.id} className="group cursor-pointer" onClick={handleViewAllBlogs}>
                    <div className="flex items-center gap-3 text-sm text-zinc-500 font-mono mb-4">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                      <span className="text-zinc-400">{post.category}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif mb-4 text-zinc-200 group-hover:text-zinc-500 transition-colors">{post.title}</h3>
                    <p className="text-zinc-500 leading-relaxed mb-6">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-white">
                      Read Article <ChevronRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact / Footer */}
          <section id="contact" className="py-20 md:py-32 px-6 bg-zinc-900 relative z-10">
            <div className="container mx-auto max-w-6xl">
              <RevealOnScroll>
                <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                  {/* Contact Info Side */}
                  <div>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6 text-white">Let's start a project.</h2>
                    <p className="text-lg text-zinc-400 mb-12">
                      Available for freelance design engineering projects, consulting, and robotic systems development.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-zinc-300">
                        <Mail className="w-5 h-5 text-zinc-500" />
                        <span>contact@alexengineer.com</span>
                      </div>
                      <div className="flex items-center gap-4 text-zinc-300">
                        <Linkedin className="w-5 h-5 text-zinc-500" />
                        <span>linkedin.com/in/alexeng</span>
                      </div>
                      <div className="flex items-center gap-4 text-zinc-300">
                        <Github className="w-5 h-5 text-zinc-500" />
                        <span>github.com/alexeng</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form Side */}
                  <div className="bg-zinc-950 p-6 md:p-8 rounded-sm border border-zinc-800">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Name</label>
                          <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white focus:outline-none focus:border-zinc-600 transition-colors font-sans" placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Email</label>
                          <input type="email" className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white focus:outline-none focus:border-zinc-600 transition-colors font-sans" placeholder="jane@example.com" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Subject</label>
                        <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white focus:outline-none focus:border-zinc-600 transition-colors font-sans" placeholder="Project Inquiry" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Message</label>
                        <textarea rows="4" className="w-full bg-zinc-900 border border-zinc-800 rounded-sm p-3 text-white focus:outline-none focus:border-zinc-600 transition-colors resize-none font-sans" placeholder="Tell me about your project needs..."></textarea>
                      </div>

                      <button className="w-full bg-white text-zinc-900 font-medium py-4 rounded-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-widest">
                        Send Message <Send size={18} />
                      </button>
                    </form>
                  </div>
                </div>
                
                <div className="mt-20 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between text-sm text-zinc-600 font-mono gap-4 items-center">
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