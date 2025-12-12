
import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, BookOpen, Award, Users, CheckCircle2, Globe, Sparkles, Send, BrainCircuit, GraduationCap, Building2, ChevronLeft, Handshake, Briefcase, FileCheck, UserPlus, Layers, Map, Landmark, PenTool, Quote, Eye, ShieldCheck, Star, Cpu, Zap, Trophy, Layout, ShoppingBag, FileText, Download, Library, Book, PlayCircle, ScanLine, Clock, BarChart3, Fingerprint, MapPin, MousePointer, Lightbulb, Scale, Lock, Cloud, Database, Server, Github, Mail } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
import { ExperienceValidationModal } from './ExperienceValidationModal';
import { ProgramDetailsModal } from './ProgramDetailsModal';
import { CertificatePreviewModal } from './CertificatePreviewModal';
import { AccreditationsModal } from './AccreditationsModal';
import { InternationalProgramsModal } from './InternationalProgramsModal';
import { CVBuilderModal } from './CVBuilderModal';
import { TechLibraryModal } from './TechLibraryModal';
import { VideoSection } from './VideoSection';
import { VideoGalleryModal } from './VideoGalleryModal';
import { UniversityRegistrationModal } from './UniversityRegistrationModal';
import { TraineeJourney } from './TraineeJourney';
import { FoundersMessage } from './FoundersMessage';
import { loginWithGithub, loginWithYahoo } from '../src/services/authService';

interface LandingPageProps {
  onStart: () => void;
  onSearch: (query: string) => void;
  onOpenTraining?: () => void;
  onOpenJobs?: () => void;
  onOpenMarket?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSearch, onOpenTraining, onOpenJobs, onOpenMarket }) => {
  const [chatQuery, setChatQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false); 
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isCertPreviewOpen, setIsCertPreviewOpen] = useState(false);
  const [isAccreditationsOpen, setIsAccreditationsOpen] = useState(false);
  const [isInternationalProgramsOpen, setIsInternationalProgramsOpen] = useState(false);
  
  // NEW FEATURES
  const [isCVBuilderOpen, setIsCVBuilderOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  
  // UNIVERSITY FLOW STATES
  const [isUniversityRegOpen, setIsUniversityRegOpen] = useState(false);
  const [isTraineeJourneyOpen, setIsTraineeJourneyOpen] = useState(false);
  
  // VIDEO MODAL
  const [isVideoGalleryOpen, setIsVideoGalleryOpen] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  // Dynamic Banner State
  const [motivationIndex, setMotivationIndex] = useState(0);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatQuery.trim()) {
      onSearch(chatQuery);
    }
  };

  const handleStartJourney = () => {
      // Trigger the new University Registration Flow
      setIsUniversityRegOpen(true);
  };

  const handleGithubLogin = async () => {
    try {
        await loginWithGithub();
        onStart(); // Navigate to dashboard upon success
    } catch (e) {
        console.error("Github Login Failed from Landing", e);
    }
  };

  const handleYahooLogin = async () => {
    try {
        await loginWithYahoo();
        onStart(); // Navigate to dashboard upon success
    } catch (e) {
        console.error("Yahoo Login Failed from Landing", e);
    }
  };

  // --- HERO SLIDER DATA ---
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop",
      title: "ابدأ رحلتك التعليمية الآن",
      subtitle: "انضم لأكبر منصة تعليمية وتوظيفية. شهادات مهنية، مسارات وظيفية ذكية، وشراكات عربية ودولية.",
      cta: "سجّل الآن مجاناً",
      highlight: "القبول والتسجيل مفتوح",
      action: handleStartJourney
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
      title: "بوابة الوظائف الوطنية",
      subtitle: "استعرض آلاف الوظائف الحكومية والخاصة. تحديث فوري ومصداقية تامة.",
      cta: "تصفح الوظائف",
      highlight: "توظيف فوري",
      action: () => onOpenJobs && onOpenJobs()
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
      title: "شهادات معتمدة توثق مهاراتك",
      subtitle: "عزز سيرتك الذاتية بشهادات معترف بها من جهات اعتماد عربية ودولية مرموقة.",
      cta: "استعرض الشهادات",
      highlight: "اعتماد مهني",
      action: () => setIsCertPreviewOpen(true)
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
      title: "شراكات مع عمالقة التكنولوجيا",
      subtitle: "تحالفات تقنية مع كبرى الشركات العالمية لتقديم تدريب يواكب متطلبات سوق العمل الرقمي.",
      cta: "شركاء النجاح",
      highlight: "فرص وظيفية",
      action: () => setIsAccreditationsOpen(true)
    }
  ];

  // Motivational Messages
  const motivationMessages = [
    { text: "ابدأ رحلتك الآن وطور مهاراتك!", icon: <Sparkles className="w-6 h-6 text-yellow-400" /> },
    { text: "تعلم تقنياً، احصل على شهادة معترف بها!", icon: <Award className="w-6 h-6 text-blue-400" /> },
    { text: "حقق طموحك وارتقِ بمستواك المهني!", icon: <Trophy className="w-6 h-6 text-emerald-400" /> },
    { text: "مستقبلك يبدأ بقرار.. انضم للنخبة!", icon: <Zap className="w-6 h-6 text-purple-400" /> }
  ];

  const accreditationsList = [
      "Microsoft", "Google Cloud", "Cisco", "Oracle", "IBM", "AWS", "Adobe", 
      "CompTIA", "PMI", "Pearson VUE", "Coursera", "Udacity", "edX", 
      "ITSB", "GSDC", "EBTD", "IAQT", "IEEE", "ACET", "Arab Trainers Union"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    const motivationTimer = setInterval(() => {
        setMotivationIndex((prev) => (prev + 1) % motivationMessages.length);
    }, 3500);

    return () => {
        clearInterval(timer);
        clearInterval(motivationTimer);
    };
  }, []);

  return (
    <>
    <CVBuilderModal isOpen={isCVBuilderOpen} onClose={() => setIsCVBuilderOpen(false)} />
    {isLibraryOpen && <TechLibraryModal onClose={() => setIsLibraryOpen(false)} />}
    <VideoGalleryModal isOpen={isVideoGalleryOpen} onClose={() => setIsVideoGalleryOpen(false)} />
    
    {/* UNIVERSITY FLOW MODALS */}
    <UniversityRegistrationModal 
        isOpen={isUniversityRegOpen} 
        onClose={() => setIsUniversityRegOpen(false)}
        onComplete={() => setIsTraineeJourneyOpen(true)}
    />
    {isTraineeJourneyOpen && <TraineeJourney onClose={() => setIsTraineeJourneyOpen(false)} />}

    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white pt-16">
      
      {/* 1. HERO TEASER VIDEO CAROUSEL */}
      <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden border-y border-white/5 group bg-black">
        <div className="absolute inset-0 z-0">
             <video 
                 autoPlay 
                 muted 
                 loop 
                 playsInline
                 className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                 poster="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80"
             >
                 <source src="https://assets.mixkit.co/videos/preview/mixkit-university-library-with-students-walking-4777-large.mp4" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent"></div>
        </div>

        {slides.map((slide, index) => (
            <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full">
                    <div className={`max-w-2xl transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-bold text-blue-300 mb-6 backdrop-blur-md">
                            <GraduationCap className="w-4 h-4" />
                            <span>{slide.highlight}</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-xl tracking-tight">{slide.title}</h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-lg shadow-black drop-shadow-md border-l-4 border-amber-500 pl-4 bg-black/20 p-2 rounded-r-lg backdrop-blur-sm">{slide.subtitle}</p>
                        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                            <button onClick={slide.action} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-3 group active:scale-95 touch-manipulation">
                                {slide.cta} <ArrowRight className="w-6 h-6 rtl:rotate-180 group-hover:-translate-x-1 transition-transform"/>
                            </button>
                            <button onClick={() => setIsVideoGalleryOpen(true)} className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg border border-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-md active:scale-95 touch-manipulation">
                                <PlayCircle className="w-6 h-6"/> شاهد الفيديو
                            </button>
                            {index === 0 && (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleGithubLogin} 
                                        className="px-6 py-4 bg-[#24292e] hover:bg-[#1b1f23] text-white rounded-xl font-bold text-lg border border-white/10 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 touch-manipulation"
                                        title="تسجيل الدخول باستخدام GitHub"
                                    >
                                        <Github className="w-6 h-6"/>
                                    </button>
                                    <button 
                                        onClick={handleYahooLogin} 
                                        className="px-6 py-4 bg-[#5f01d1] hover:bg-[#5000b0] text-white rounded-xl font-bold text-lg border border-white/10 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 touch-manipulation"
                                        title="تسجيل الدخول باستخدام Yahoo"
                                    >
                                        <Mail className="w-6 h-6"/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* 2. SMART ASSISTANT */}
      <div className="w-full px-4 py-16 bg-gradient-to-b from-[#0f172a] to-blue-900/10">
          <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center mb-6">
                  <div className="bg-blue-600/20 p-3 rounded-2xl mb-4 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <BrainCircuit className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">محرك البحث الذكي</h2>
                  <p className="text-gray-400">مساعدك الذكي للبحث عن الوظائف، تحليل المسار المهني، واقتراح الدورات.</p>
              </div>

              <form onSubmit={handleChatSubmit} className="relative group max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative flex items-center bg-[#1e293b]/90 border border-white/10 rounded-2xl p-2 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
                      <textarea
                          placeholder="اكتب ما تبحث عنه... مثال: أريد خطة لتعلم البرمجة، أو ابحث لي عن وظائف إدارية"
                          className="w-full bg-transparent text-white placeholder-gray-400 text-lg px-4 py-3 outline-none resize-none h-[60px] md:h-[60px] scrollbar-hide flex items-center pt-4"
                          value={chatQuery}
                          onChange={(e) => setChatQuery(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSubmit(e); }}}
                      />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg flex-shrink-0 mx-1 active:scale-95">
                          <Send className="w-5 h-5 rtl:rotate-180" />
                      </button>
                  </div>
              </form>
          </div>
      </div>

      {/* 3. VIDEO STRIP: TECHNOLOGY & COURSES */}
      <VideoSection 
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-on-multiple-monitors-42792-large.mp4"
        title="تقنيات المستقبل بين يديك"
        subtitle="أكثر من 600 دورة تدريبية في البرمجة، الذكاء الاصطناعي، والأمن السيبراني. تعلم وطبق عملياً."
        overlayColor="bg-emerald-900/60"
        alignment="right"
        height="h-[400px]"
        ctaText="تصفح الكتالوج"
        onCtaClick={onOpenTraining}
      />

      {/* 4. INTERNATIONAL ACCREDITATIONS BANNER */}
      <div className="relative w-full py-16 overflow-hidden cursor-pointer group" onClick={() => setIsAccreditationsOpen(true)}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 border-y-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-500"></div>
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-sm">
              <div className="bg-white/10 px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg flex items-center gap-3 backdrop-blur-md shadow-2xl">
                  <Search className="w-6 h-6 text-blue-400"/>
                  اضغط لمعرفة تفاصيل الاعتمادات العالمية
              </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex-1 text-center md:text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4">
                      <Globe className="w-4 h-4"/> International Training Accreditation
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                      🌍 اعتمادات دولية تضمن <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">جودة تعليمك</span>
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                      تلتزم أكاديمية ميلاف مراد بتقديم برامج تدريبية رائدة بمعايير عالمية، معتمدة من جهات ومراجع تعليمية خارجية ذات ثقة دولية. نوفّر لك برامج احترافية قابلة للاستخدام في العالم العربي والدول الناطقة بالإنجليزية، وتتناسب مع متطلبات سوق العمل التقني العالمي.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-3 text-sm text-gray-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> شهادات تدريبية معتمدة عربيًا ودوليًا
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-200">
                          <Fingerprint className="w-5 h-5 text-emerald-400 shrink-0"/> باركود تحقق رسمي ورقم اعتماد فريد
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> معايير تقييم ومراجعة خارجية لضمان الجودة
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-200">
                          <Briefcase className="w-5 h-5 text-emerald-400 shrink-0"/> قابلية استخدام الشهادة في الوظائف التقنية عالميًا
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-200">
                          <Award className="w-5 h-5 text-emerald-400 shrink-0"/> برامج تدريبية مهنية غير أكاديمية لكنها قوية وموثوقة
                      </div>
                  </div>

                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mx-auto md:mx-0 group-hover:scale-105">
                      <Search className="w-5 h-5"/> استعرض الاعتمادات الدولية
                  </button>
              </div>

              <div className="w-full md:w-96 flex items-center justify-center relative">
                  <div className="absolute w-[400px] h-[400px] border border-blue-500/10 rounded-full animate-spin-slow pointer-events-none"></div>
                  <div className="absolute w-[300px] h-[300px] border border-emerald-500/10 rounded-full animate-spin-slow-reverse pointer-events-none"></div>
                  <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                          <ShieldCheck className="w-10 h-10 text-blue-400"/>
                      </div>
                      <h3 className="font-bold text-white text-xl mb-1">معتمد دولياً</h3>
                      <p className="text-xs text-gray-400 font-mono mb-4">Aligned with ISO 21001</p>
                      <div className="flex justify-center gap-2">
                          <ScanLine className="w-8 h-8 text-white opacity-50"/>
                          <Globe className="w-8 h-8 text-white opacity-50"/>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 5. NEW SECTION: LEARNING ROADMAP & GLOBAL JOURNEY */}
      <div className="py-24 bg-[#0f172a] relative overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          
          {/* 5.1 Global Vision Banner */}
          <div className="relative mb-20">
              <div className="max-w-7xl mx-auto px-4 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-full mb-6 animate-pulse">
                      <Globe className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                      نحو تعليم عالمي... <span className="text-blue-500">بلا حدود</span>
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                      أكاديمية ميلاف مراد — منصة عربية بروح دولية، تصل إلى المتعلم أينما كان.
                      نربط الشرق بالغرب عبر تقنيات التعليم الرقمي.
                  </p>
                  
                  {/* Glowing Points Simulation */}
                  <div className="relative h-64 mt-12 w-full max-w-4xl mx-auto opacity-60">
                      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-contain bg-no-repeat bg-center filter invert"></div>
                      {[...Array(8)].map((_, i) => (
                          <div key={i} className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{top: `${Math.random()*80}%`, left: `${Math.random()*90}%`, animationDuration: `${2+Math.random()*2}s`}}></div>
                      ))}
                  </div>
              </div>
          </div>

          {/* 5.2 Statistics Ribbon */}
          <div className="bg-[#1e293b]/50 border-y border-white/5 backdrop-blur-sm py-12 mb-20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent animate-pulse"></div>
              <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                      {[
                          { val: '+500', label: 'برنامج تدريبي', icon: <Briefcase className="w-5 h-5"/> },
                          { val: '+1000', label: 'كتاب ومصدر', icon: <Book className="w-5 h-5"/> },
                          { val: '+1200', label: 'فيديو تعليمي', icon: <PlayCircle className="w-5 h-5"/> },
                          { val: '+27', label: 'دولة', icon: <Globe className="w-5 h-5"/> },
                          { val: '2020', label: 'التأسيس', icon: <Building2 className="w-5 h-5"/> },
                          { val: '100%', label: 'نظام آمن', icon: <ShieldCheck className="w-5 h-5"/> },
                      ].map((stat, idx) => (
                          <div key={idx} className="group cursor-default">
                              <div className="flex justify-center text-blue-500 mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                              <div className="text-3xl font-black text-white mb-1 font-mono group-hover:text-blue-400 transition-colors">{stat.val}</div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{stat.label}</div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* 5.3 Learning Roadmap Timeline */}
          <div className="max-w-7xl mx-auto px-4 mb-24">
              <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-white mb-4">خارطة الطريق التعليمية</h3>
                  <p className="text-gray-400">رحلتك من التسجيل إلى الاحتراف في 6 خطوات مدروسة</p>
              </div>
              
              <div className="relative overflow-x-auto pb-8 scrollbar-hide">
                  <div className="flex gap-4 min-w-max px-4">
                      {[
                          { step: 1, title: 'التسجيل', desc: 'إنشاء الهوية الموحدة', icon: <UserPlus className="w-6 h-6"/>, color: 'bg-blue-600' },
                          { step: 2, title: 'التوجيه الذكي', desc: 'تحليل AI للمهارات', icon: <BrainCircuit className="w-6 h-6"/>, color: 'bg-purple-600' },
                          { step: 3, title: 'المحتوى', desc: 'مكتبة عالمية متجددة', icon: <Library className="w-6 h-6"/>, color: 'bg-amber-600' },
                          { step: 4, title: 'التطبيق', desc: 'مشاريع ومختبرات', icon: <Cpu className="w-6 h-6"/>, color: 'bg-emerald-600' },
                          { step: 5, title: 'التقييم', desc: 'اختبارات دقيقة', icon: <FileCheck className="w-6 h-6"/>, color: 'bg-red-600' },
                          { step: 6, title: 'الشهادة', desc: 'اعتماد دولي موثق', icon: <Award className="w-6 h-6"/>, color: 'bg-yellow-500' },
                      ].map((item, i) => (
                          <div key={i} className="relative w-64 bg-[#1e293b] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20">
                              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                  {item.icon}
                              </div>
                              <div className="absolute top-6 right-6 text-gray-600 text-4xl font-black opacity-20">{item.step}</div>
                              <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                              <p className="text-sm text-gray-400">{item.desc}</p>
                              {i < 5 && (
                                  <div className="hidden md:block absolute top-1/2 -left-6 transform -translate-y-1/2 z-10 text-gray-600">
                                      <ChevronLeft className="w-8 h-8"/>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* 5.4 Testimonials Slider */}
          <div className="bg-black/20 py-16 mb-20 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                  <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400"/> قصص نجاح من الوطن العربي
                  </h3>
              </div>
              <div className="relative w-full">
                  <div className="flex animate-scroll-horizontal gap-6 w-[200%] px-4">
                      {[...Array(10)].map((_, i) => (
                          <div key={i} className="w-80 bg-[#1e293b] p-6 rounded-2xl border border-white/5 shrink-0 hover:border-blue-500/30 transition-colors">
                              <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                      {['SA','EG','AE','MA','DZ'][i%5]}
                                  </div>
                                  <div>
                                      <div className="text-sm font-bold text-white">متدرب {['سعودي','مصري','إماراتي','مغربي','جزائري'][i%5]}</div>
                                      <div className="flex text-yellow-500 text-[10px] gap-0.5">
                                          <Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/>
                                      </div>
                                  </div>
                              </div>
                              <p className="text-sm text-gray-400 leading-relaxed">
                                  "تجربة تعليمية مميزة، المحتوى التقني قوي جداً والشهادات ساعدتني في الحصول على وظيفة."
                              </p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* 5.5 Appreciation & Global Journey */}
          <div className="max-w-7xl mx-auto px-4 mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* CARD 1: Partners & Logo */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2rem] p-1 relative overflow-hidden shadow-2xl group h-[400px] border border-gray-200">
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#1e3a8a]"></div>
                  <div className="h-full w-full bg-white rounded-[1.8rem] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                      {/* Abstract Background pattern */}
                      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                      
                      {/* Academy Logo (Center) */}
                      <div className="w-32 h-32 bg-[#1e3a8a] text-white rounded-3xl flex items-center justify-center text-6xl font-black shadow-2xl z-10 mb-12 transform group-hover:scale-110 transition-transform duration-500 relative">
                          M
                          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white">
                              <Award className="w-6 h-6 text-white"/>
                          </div>
                      </div>

                      {/* 5 Partners */}
                      <div className="w-full grid grid-cols-5 gap-4 items-center justify-items-center opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500">
                           {/* Partner 1 */}
                           <div className="flex flex-col items-center gap-2">
                               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center"><Globe className="w-6 h-6 text-blue-600"/></div>
                               <span className="text-[10px] font-bold text-gray-500">Global Edu</span>
                           </div>
                           {/* Partner 2 */}
                           <div className="flex flex-col items-center gap-2">
                               <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center"><Cpu className="w-6 h-6 text-red-600"/></div>
                               <span className="text-[10px] font-bold text-gray-500">Tech Core</span>
                           </div>
                           {/* Partner 3 */}
                           <div className="flex flex-col items-center gap-2">
                               <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center"><Cloud className="w-6 h-6 text-green-600"/></div>
                               <span className="text-[10px] font-bold text-gray-500">Cloud Sys</span>
                           </div>
                           {/* Partner 4 */}
                           <div className="flex flex-col items-center gap-2">
                               <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center"><Database className="w-6 h-6 text-purple-600"/></div>
                               <span className="text-[10px] font-bold text-gray-500">Data Hub</span>
                           </div>
                           {/* Partner 5 */}
                           <div className="flex flex-col items-center gap-2">
                               <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-orange-600"/></div>
                               <span className="text-[10px] font-bold text-gray-500">Security</span>
                           </div>
                      </div>
                      
                      <div className="absolute bottom-6 text-center w-full">
                          <p className="text-gray-400 text-xs tracking-widest uppercase">Trusted by Industry Leaders</p>
                      </div>
                  </div>
              </div>

              {/* CARD 2: Virtual Building */}
              <div className="rounded-[2rem] overflow-hidden shadow-2xl relative group h-[400px] border border-white/10 bg-[#0f172a]">
                  {/* 3D Building Image */}
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-700 scale-105 group-hover:scale-100" />
                  
                  {/* UI Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/50"></div>
                  
                  {/* Floating Elements (Virtual Interface) */}
                  <div className="absolute top-8 left-8 right-8">
                      <div className="flex justify-between items-start">
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg">
                              <div className="flex items-center gap-2 text-xs font-bold text-white">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                  SYSTEM ONLINE
                              </div>
                          </div>
                          <div className="bg-blue-600/80 backdrop-blur-md px-4 py-2 rounded-lg text-white text-xs font-bold shadow-lg shadow-blue-500/30">
                              VIRTUAL CAMPUS
                          </div>
                      </div>
                  </div>

                  {/* Center 3D Model Label */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border border-white/30 w-32 h-32 rounded-full flex items-center justify-center animate-spin-slow">
                          <div className="border border-white/50 w-24 h-24 rounded-full"></div>
                      </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                      <h3 className="text-2xl font-bold text-white mb-2">مقر الأكاديمية الافتراضي</h3>
                      <p className="text-sm text-gray-300">بيئة تعليمية ثلاثية الأبعاد تفاعلية بالكامل. تجربة تحاكي الحرم الجامعي الحقيقي.</p>
                  </div>
              </div>
          </div>

          {/* 5.6 Massive CTA Banner */}
          <div className="max-w-5xl mx-auto px-4 relative">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-blue-900/50 group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                  
                  {/* Floating Icons */}
                  <div className="absolute top-10 left-10 animate-bounce delay-700"><Book className="w-12 h-12 text-white/30"/></div>
                  <div className="absolute bottom-10 right-10 animate-bounce delay-1000"><GraduationCap className="w-16 h-16 text-white/30"/></div>
                  <div className="absolute top-1/2 right-20 animate-pulse"><PlayCircle className="w-10 h-10 text-white/20"/></div>

                  <div className="relative z-10">
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-6">ابدأ رحلتك الآن</h2>
                      <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">الطريق نحو الإبداع والاحتراف يبدأ من هنا. سجل مجاناً واكتشف عالم الفرص.</p>
                      
                      <button onClick={handleStartJourney} className="px-12 py-5 bg-white text-blue-700 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 mx-auto">
                          ابدأ رحلتك التعليمية مجانًا <ArrowRight className="w-6 h-6 rtl:rotate-180"/>
                      </button>
                  </div>
              </div>
          </div>

          {/* 5.7 Transparency Strip */}
          <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ShieldCheck className="w-4 h-4"/> سياسة الاعتماد الدولي</span>
              <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Scale className="w-4 h-4"/> قواعد النزاهة الأكاديمية</span>
              <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Lock className="w-4 h-4"/> حماية البيانات والخصوصية</span>
              <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><FileCheck className="w-4 h-4"/> مضمون الشهادة</span>
          </div>
      </div>

      {/* 6. SERVICES & RESOURCES */}
      <div className="py-16 bg-[#0f172a]">
          <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                  <Star className="w-6 h-6 text-amber-400"/>
                  خدمات ومصادر احترافية
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* MARKETPLACE BANNER */}
                  <div 
                    onClick={onOpenMarket}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-500 h-64 border border-white/5"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-900"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="relative p-6 h-full flex flex-col justify-end">
                          <div className="absolute top-6 left-6 w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                              <ShoppingBag className="w-6 h-6 text-emerald-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-white mb-2">سوق خدمات ميلاف</h3>
                          <p className="text-emerald-100/70 text-sm mb-4 font-light">بيع وشراء الخدمات المصغرة والمهارات بضمان كامل.</p>
                          <div className="flex items-center text-emerald-400 text-sm font-bold gap-2 mt-auto">
                              دخول السوق <ArrowRight className="w-4 h-4 rtl:rotate-180"/>
                          </div>
                      </div>
                  </div>

                  {/* CV SERVICE BANNER */}
                  <div 
                    onClick={() => setIsCVBuilderOpen(true)}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-500 h-64 border border-white/5"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                      <div className="relative p-6 h-full flex flex-col justify-end">
                          <div className="absolute top-6 left-6 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
                              <FileText className="w-6 h-6 text-blue-400"/>
                          </div>
                          <h3 className="text-2xl font-black text-white mb-2">خدمة السيرة الذاتية</h3>
                          <p className="text-blue-100/70 text-sm mb-4 font-light">تصميم احترافي تلقائي مع خبراء التوظيف. استلام فوري.</p>
                          <div className="flex items-center text-blue-400 text-sm font-bold gap-2 mt-auto">
                              اطلب الآن <Download className="w-4 h-4"/>
                          </div>
                      </div>
                  </div>

                  {/* LIBRARY BANNER */}
                  <div 
                    onClick={() => setIsLibraryOpen(true)}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-500 h-64 border border-amber-500/20"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-[#0f172a]"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                      <div className="relative p-6 h-full flex flex-col justify-end">
                          <div className="absolute top-6 left-6 w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                              <Library className="w-6 h-6 text-amber-400"/>
                          </div>
                          <div className="mb-2">
                              <span className="text-[10px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded shadow-lg shadow-amber-500/20">NEW</span>
                          </div>
                          <h3 className="text-2xl font-black text-white mb-2">مكتبة المجلات التقنية</h3>
                          <p className="text-amber-100/70 text-sm mb-4 font-light">أكثر من 1000 مجلة ومصدر عربي مفتوح المصدر.</p>
                          <div className="flex items-center text-amber-400 text-sm font-bold gap-2 mt-auto group-hover:gap-3 transition-all">
                              تصفح المكتبة <BookOpen className="w-4 h-4"/>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 7. VIDEO STRIP: GLOBAL MARKETPLACE */}
      <VideoSection 
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-call-center-4638-large.mp4"
        title="سوق الخدمات الحرة"
        subtitle="منصة تجمع المحترفين وأصحاب الأعمال. بيع خدماتك، أو وظف أفضل المهارات لتنفيذ مشاريعك."
        overlayColor="bg-purple-900/60"
        alignment="left"
        height="h-[400px]"
        ctaText="دخول السوق"
        onCtaClick={onOpenMarket}
      />

      {/* 8. PROFESSIONAL BANNERS */}
      <div className="py-20 bg-[#0f172a] relative overflow-hidden border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Banner 1: Job Portal */}
                  <div 
                    onClick={() => onOpenJobs && onOpenJobs()}
                    className="group relative cursor-pointer overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(30,58,138,0.3)] hover:-translate-y-1 active:scale-[0.98]"
                  >
                      <div className="absolute inset-0 bg-[#0f172a] group-hover:scale-105 transition-transform duration-[1000ms]"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-[#0f172a] opacity-90"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                      <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full min-h-[300px]">
                          <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                                  <Briefcase className="w-4 h-4" /> بوابة التوظيف الوطنية
                              </div>
                              <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                                  اكتشف وظائفنا<br />
                                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">كل الفرص بين يديك</span>
                              </h3>
                              <p className="text-gray-400 text-sm md:text-base max-w-sm leading-relaxed">
                                  تحديث فوري للوظائف العسكرية، المدنية، والقطاع الخاص. ابحث عن فرصتك الآن.
                              </p>
                          </div>
                          <div className="mt-8 flex items-center justify-between">
                              <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                                  استعرض الوظائف <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1"/>
                              </span>
                              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-amber-500 transition-colors">
                                  <Search className="w-8 h-8 text-white"/>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Banner 2: Buy Experience */}
                  <div 
                    onClick={() => setIsExperienceModalOpen(true)}
                    className="group relative cursor-pointer overflow-hidden rounded-[2rem] shadow-2xl border border-amber-500/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:-translate-y-1 active:scale-[0.98]"
                  >
                      <div className="absolute inset-0 bg-[#fffbeb]"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white opacity-90"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                      <div className="absolute -bottom-10 -left-10 w-48 h-48 border-[4px] border-amber-200 rounded-full opacity-50"></div>
                      <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full min-h-[300px]">
                          <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
                                  <Award className="w-4 h-4" /> اعتماد الخبرات المهنية
                              </div>
                              <h3 className="text-3xl md:text-4xl font-black text-[#0f172a] leading-tight mb-4">
                                  اشتري خبرتك<br />
                                  <span className="text-blue-600">اعتمد مهاراتك اليوم</span>
                              </h3>
                              <p className="text-gray-600 text-sm md:text-base max-w-sm leading-relaxed">
                                  وثّق خبراتك السابقة بشهادة معتمدة من الأكاديمية. توقيع رسمي وختم معتمد فوراً.
                              </p>
                          </div>
                          <div className="mt-8 flex items-center justify-between">
                              <span className="text-sm font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                  إصدار الشهادة <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1"/>
                              </span>
                              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <Star className="w-8 h-8 text-white fill-white"/>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 9. VIDEO STRIP: UNIFIED ADMISSION & AI */}
      <VideoSection 
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-human-brain-99-large.mp4"
        title="القبول الموحد & الذكاء الاصطناعي"
        subtitle="نظام تسجيل مركزي يربطك بكافة الخدمات الأكاديمية. مدعوم بأحدث خوارزميات الذكاء الاصطناعي لتحليل مسارك."
        overlayColor="bg-black/70"
        alignment="center"
        height="h-[400px]"
        ctaText="سجل دخولك الآن"
        onCtaClick={() => setIsAuthModalOpen(true)}
      />

      {/* 10. WHY CHOOSE MYLAF MURAD */}
      <div className="relative py-24 bg-[#0B1221] overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>التميز الأكاديمي</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  لماذا تختار <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">أكاديمية ميلاف مراد</span>؟
               </h2>
               
               <div className="h-12 flex items-center justify-center">
                  {motivationMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-2 text-xl md:text-2xl text-blue-200 font-light transition-all duration-700 absolute ${idx === motivationIndex ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-4 blur-sm pointer-events-none'}`}
                      >
                         {msg.icon}
                         {msg.text}
                      </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="md:col-span-1 bg-gradient-to-br from-[#1e293b]/50 to-[#0f172a]/80 backdrop-blur-sm border border-white/5 hover:border-blue-500/30 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 group">
                    <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Cpu className="w-7 h-7 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">برامج تقنية متقدمة</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        مناهج مصممة وفق أحدث معايير الذكاء الاصطناعي والتقنية العالمية، تضمن لك البقاء في الطليعة.
                    </p>
                </div>

                <div className="md:col-span-2 bg-gradient-to-r from-[#1e3a8a]/40 to-[#0f172a]/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(30,58,138,0.2)] transition-all">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Award className="w-48 h-48 text-white rotate-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between h-full gap-6">
                        <div className="max-w-md">
                            <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <FileCheck className="w-7 h-7 text-amber-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">شهادات موقعة ومختومة رسمياً</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                جميع الشهادات تصدر بتوقيع "الحبر الأزرق" الرسمي وختم الأكاديمية الذهبي، مع رقم مرجعي قابل للتحقق الدولي.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 bg-gradient-to-br from-[#1e293b]/50 to-[#0f172a]/80 backdrop-blur-sm border border-white/5 hover:border-emerald-500/30 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 group">
                    <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Globe className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">تعليم عن بعد عالمي</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        ادرس من أي مكان في العالم عبر منصة متطورة تدعم الفصول الافتراضية والاختبارات الذكية.
                    </p>
                </div>

                <div className="md:col-span-1 bg-gradient-to-br from-[#1e293b]/50 to-[#0f172a]/80 backdrop-blur-sm border border-white/5 hover:border-purple-500/30 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 group">
                    <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <GraduationCap className="w-7 h-7 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">مستوى الدبلوم المهني</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        برامجنا مصممة لتصل بك إلى مستوى الدبلوم المهني المتقدم، مما يعزز فرصك في الترقي الوظيفي.
                    </p>
                </div>

                <div className="md:col-span-1 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-center shadow-lg hover:shadow-blue-600/40 transition-shadow">
                    <h3 className="text-2xl font-black text-white mb-4">هل أنت جاهز؟</h3>
                    <p className="text-blue-100 text-sm mb-6">أكثر من 500 برنامج تدريبي في انتظارك.</p>
                    <div className="space-y-3 w-full">
                         <button onClick={onOpenTraining} className="w-full py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 active:scale-95">
                             اكتشف برامجنا <Layout className="w-4 h-4"/>
                         </button>
                         <button onClick={() => setIsAuthModalOpen(true)} className="w-full py-3 bg-blue-900/30 text-white border border-white/20 rounded-xl font-bold hover:bg-blue-900/50 transition-colors active:scale-95">
                             سجل الآن مجاناً
                         </button>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5 pt-10">
                <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">
                    أكثر من 20 اعتماد وشراكة عالمية
                </p>
                <div className="relative w-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0B1221] to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0B1221] to-transparent z-10"></div>
                    <div className="flex w-[200%] animate-scroll-horizontal gap-12 items-center">
                        {[...accreditationsList, ...accreditationsList].map((acc, i) => (
                            <span key={i} className="text-xl md:text-2xl font-black text-gray-700 whitespace-nowrap uppercase hover:text-white transition-colors cursor-default">
                                {acc}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
         </div>
         <style>{`
             @keyframes scrollHorizontal {
                 0% { transform: translateX(0); }
                 100% { transform: translateX(-50%); }
             }
             .animate-scroll-horizontal {
                 animation: scrollHorizontal 40s linear infinite;
             }
             .animate-scroll-horizontal:hover {
                 animation-play-state: paused;
             }
         `}</style>
      </div>

      {/* 11. VIDEO STRIP: LIBRARY & VISION */}
      <VideoSection 
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-flying-over-an-open-book-2228-large.mp4"
        title="المعرفة قوة"
        subtitle="مكتبة رقمية ضخمة تحتوي على آلاف المراجع والكتب. رؤيتنا هي تمكينك بالعلم والمعرفة لبناء غدٍ أفضل."
        overlayColor="bg-amber-900/60"
        alignment="center"
        height="h-[400px]"
        ctaText="دخول المكتبة"
        onCtaClick={() => setIsLibraryOpen(true)}
      />

      <FoundersMessage />

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={() => { setIsAuthModalOpen(false); onStart(); }}
      />
      <UserProfileModal 
        isOpen={isAcademyOpen} 
        onClose={() => setIsAcademyOpen(false)} 
        initialView="academy"
      />
      <ExperienceValidationModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
      />
      <ProgramDetailsModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        program={selectedProgram}
      />
      <CertificatePreviewModal
        isOpen={isCertPreviewOpen}
        onClose={() => setIsCertPreviewOpen(false)}
      />
      <AccreditationsModal
        isOpen={isAccreditationsOpen}
        onClose={() => setIsAccreditationsOpen(false)}
      />
      <InternationalProgramsModal
        isOpen={isInternationalProgramsOpen}
        onClose={() => setIsInternationalProgramsOpen(false)}
      />
    </div>
    </>
  );
};
