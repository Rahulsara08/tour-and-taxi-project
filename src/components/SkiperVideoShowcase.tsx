import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Phone, 
  Headphones, 
  MapPin, 
  Shield, 
  Clock, 
  Car, 
  Calendar,
  Compass,
  Navigation
} from 'lucide-react';

// Import local generated realistic scene images
import scene1 from '../../assets/promo_scene_1.png';
import scene2 from '../../assets/promo_scene_2.png';
import scene3 from '../../assets/promo_scene_3.png';
import scene4 from '../../assets/promo_scene_4.png';
import scene5 from '../../assets/promo_scene_5.png';
import scene6 from '../../assets/promo_scene_6.png';
import scene7 from '../../assets/promo_scene_7.png';
import scene8 from '../../assets/promo_scene_8.png';
import guideAvatar from '../../assets/guide_avatar.png';

// Ambient Sound Synthesizer using Web Audio API for an authentic Rajasthani drone soundscape
class AmbientDroneSynth {
  private ctx: AudioContext | null = null;
  private rootOsc: OscillatorNode | null = null;
  private fifthOsc: OscillatorNode | null = null;
  private thirdOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning: boolean = false;

  start() {
    if (this.isRunning) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Warm lowpass filter to simulate organic acoustic tanpura/sitar drone
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.0, this.ctx.currentTime); // fade in
      
      // Root note (C3 - 130.81 Hz)
      this.rootOsc = this.ctx.createOscillator();
      this.rootOsc.type = 'sawtooth';
      this.rootOsc.frequency.setValueAtTime(130.81, this.ctx.currentTime);

      // Perfect Fifth (G3 - 196.00 Hz)
      this.fifthOsc = this.ctx.createOscillator();
      this.fifthOsc.type = 'triangle';
      this.fifthOsc.frequency.setValueAtTime(196.00, this.ctx.currentTime);

      // Major Third (E3 - 164.81 Hz) for warmth
      this.thirdOsc = this.ctx.createOscillator();
      this.thirdOsc.type = 'triangle';
      this.thirdOsc.frequency.setValueAtTime(164.81, this.ctx.currentTime);

      // Connections
      this.rootOsc.connect(this.filter);
      this.fifthOsc.connect(this.filter);
      this.thirdOsc.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      // Start Oscillators
      this.rootOsc.start();
      this.fifthOsc.start();
      this.thirdOsc.start();

      // Smooth fade in
      this.gainNode.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2.5);
      this.isRunning = true;
    } catch (e) {
      console.warn("Web Audio API failed to load:", e);
    }
  }

  stop() {
    if (!this.isRunning) return;
    if (this.gainNode && this.ctx) {
      // Smooth fade out
      this.gainNode.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          this.rootOsc?.stop();
          this.fifthOsc?.stop();
          this.thirdOsc?.stop();
          this.ctx?.close();
        } catch(e) {}
          this.isRunning = false;
      }, 600);
    }
  }
}

// 8 Choreographed Scenes spanning exactly 2 Minutes and 10 Seconds (130s)
const PROMO_SCENES = [
  {
    id: 1,
    title: "Welcome to Rajasthan",
    start: 0,
    end: 15,
    image: scene1,
    script: "Welcome to Shri Gurukripa Tours & Taxi — your trusted travel partner across the royal land of Rajasthan.",
    tag: "Royal Greeting",
    icon: Compass,
    animation: { scaleStart: 1.0, scaleEnd: 1.15, xStart: -2, xEnd: 2, yStart: 0, yEnd: 0 }
  },
  {
    id: 2,
    title: "Jaipur & Udaipur",
    start: 15,
    end: 35,
    image: scene2,
    script: "From the majestic palaces of Jaipur to the serene lakes of Udaipur...",
    tag: "Palaces & Lakes",
    icon: MapPin,
    animation: { scaleStart: 1.16, scaleEnd: 1.02, xStart: 2, xEnd: -3, yStart: 2, yEnd: -2 }
  },
  {
    id: 3,
    title: "Jodhpur & Jaisalmer",
    start: 35,
    end: 55,
    image: scene3, // Show Jodhpur first
    imageAlt: scene4, // Switch to Jaisalmer golden dunes halfway
    script: "...from the blue streets of Jodhpur to the golden dunes of Jaisalmer, we bring unforgettable journeys to life.",
    tag: "Blue City & Desert Dunes",
    icon: Sparkles,
    animation: { scaleStart: 1.0, scaleEnd: 1.14, xStart: -2, xEnd: 2, yStart: -2, yEnd: 2 }
  },
  {
    id: 4,
    title: "Our Travel Services",
    start: 55,
    end: 75,
    image: scene5,
    script: "Whether you need airport transfers, outstation taxis, Rajasthan tour packages, Char Dham pilgrimages, corporate travel, wedding transportation, or luxury car rentals...",
    tag: "Diverse Offerings",
    icon: Car,
    animation: { scaleStart: 1.0, scaleEnd: 1.12, xStart: -3, xEnd: 3, yStart: 0, yEnd: 0 }
  },
  {
    id: 5,
    title: "Safety & Driver Expertise",
    start: 75,
    end: 90,
    image: scene6,
    script: "...our premium fleet and professional drivers ensure a safe, comfortable, and memorable experience.",
    tag: "Professional Drivers",
    icon: Shield,
    animation: { scaleStart: 1.12, scaleEnd: 1.0, xStart: 0, xEnd: 0, yStart: 2, yEnd: -2 }
  },
  {
    id: 6,
    title: "GPS-Enabled Confidence",
    start: 90,
    end: 105,
    image: scene7,
    script: "Travel with confidence in our GPS-enabled vehicles, enjoy 24×7 customer support, instant booking assistance, and personalized travel solutions designed just for you.",
    tag: "GPS & 24/7 Support",
    icon: Clock,
    animation: { scaleStart: 1.02, scaleEnd: 1.15, xStart: 2, xEnd: -2, yStart: -2, yEnd: 2 }
  },
  {
    id: 7,
    title: "Trusted Hospitality",
    start: 105,
    end: 118,
    image: scene7, 
    script: "Thousands of travelers trust Shri Gurukripa for punctual service, clean vehicles, and exceptional hospitality.",
    tag: "Traveler Trust",
    icon: Calendar,
    animation: { scaleStart: 1.14, scaleEnd: 1.04, xStart: -2, xEnd: 2, yStart: 0, yEnd: 0 }
  },
  {
    id: 8,
    title: "Explore Rajasthan Today",
    start: 118,
    end: 130,
    image: scene8,
    script: "Experience Rajasthan like never before. Call now: 9950072777. Shri Gurukripa Tours & Taxi — Safe, Trusted, and Comfortable Journeys.",
    tag: "Outro & Contact",
    icon: Phone,
    animation: { scaleStart: 1.0, scaleEnd: 1.1, xStart: 0, xEnd: 0, yStart: 0, yEnd: 0 }
  }
];

// Speech Bubble with dynamic typing animation
const SpeechBubble = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="bg-slate-900/90 border border-orange-500/30 text-white rounded-2xl p-4 shadow-2xl relative backdrop-blur-md">
      <div className="absolute left-[-8px] bottom-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-slate-900/90" />
      <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest text-orange-400 mb-1 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Guide Kabir (Shri Gurukripa Host)
      </p>
      <p className="text-white text-xs md:text-sm font-semibold leading-relaxed">
        {displayedText}
      </p>
    </div>
  );
};

// Travel Route Animation Overlay component
const TravelRouteOverlay = ({ sceneId, time }: { sceneId: number; time: number }) => {
  if (sceneId !== 2 && sceneId !== 3) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-20 right-6 z-35 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl p-3.5 w-48 shadow-xl font-sans"
    >
      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-orange-400 tracking-wider mb-2">
        <Navigation size={12} className="rotate-45" /> Live Transit Path
      </div>
      
      {sceneId === 2 ? (
        // Route Jaipur -> Udaipur
        <div className="relative">
          <svg className="w-full h-16" viewBox="0 0 160 60">
            <path 
              d="M 20,40 Q 80,10 140,50" 
              fill="none" 
              stroke="#475569" 
              strokeWidth="2.5" 
              strokeDasharray="4 4" 
            />
            {/* Active animation path */}
            <motion.path 
              d="M 20,40 Q 80,10 140,50" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="3" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 20, ease: "linear" }}
            />
            {/* Jaipur Node */}
            <circle cx="20" cy="40" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
            <text x="10" y="55" fill="#94a3b8" fontSize="8" fontWeight="bold">Jaipur</text>
            
            {/* Udaipur Node */}
            <circle cx="140" cy="50" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
            <text x="120" y="42" fill="#94a3b8" fontSize="8" fontWeight="bold">Udaipur</text>

            {/* Moving Car Icon */}
            <motion.g
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              style={{
                offsetPath: "path('M 20,40 Q 80,10 140,50')",
                offsetRotate: "auto"
              }}
            >
              <circle cx="0" cy="0" r="6" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
              <path d="M -3,-2 L 3,-2 L 2,2 L -2,2 Z" fill="#ffffff" />
            </motion.g>
          </svg>
        </div>
      ) : (
        // Route Jodhpur -> Jaisalmer
        <div className="relative">
          <svg className="w-full h-16" viewBox="0 0 160 60">
            <path 
              d="M 20,20 Q 75,50 140,30" 
              fill="none" 
              stroke="#475569" 
              strokeWidth="2.5" 
              strokeDasharray="4 4" 
            />
            {/* Active animation path */}
            <motion.path 
              d="M 20,20 Q 75,50 140,30" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="3" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 20, ease: "linear" }}
            />
            {/* Jodhpur Node */}
            <circle cx="20" cy="20" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
            <text x="10" y="35" fill="#94a3b8" fontSize="8" fontWeight="bold">Jodhpur</text>
            
            {/* Jaisalmer Node */}
            <circle cx="140" cy="30" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <text x="110" y="20" fill="#94a3b8" fontSize="8" fontWeight="bold">Jaisalmer</text>

            {/* Moving Car Icon */}
            <motion.g
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              style={{
                offsetPath: "path('M 20,20 Q 75,50 140,30')",
                offsetRotate: "auto"
              }}
            >
              <circle cx="0" cy="0" r="6" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
              <path d="M -3,-2 L 3,-2 L 2,2 L -2,2 Z" fill="#ffffff" />
            </motion.g>
          </svg>
        </div>
      )}
    </motion.div>
  );
};

export default function SkiperVideoShowcase() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Music state
  const [isNarratorOn, setIsNarratorOn] = useState(true); // AI voice narration state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  // Talking Guide State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<AmbientDroneSynth | null>(null);
  const lastSpokenSceneRef = useRef<number | null>(null);

  // Initialize Synth
  useEffect(() => {
    synthRef.current = new AmbientDroneSynth();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  // Monitor SpeechSynthesis state to toggle mouth flapping
  useEffect(() => {
    let mouthInterval: NodeJS.Timeout;
    if (isPlaying && isNarratorOn && showVideoModal) {
      mouthInterval = setInterval(() => {
        const speaking = window.speechSynthesis.speaking;
        setIsSpeaking(speaking);
        if (speaking) {
          setMouthOpen(prev => !prev);
        } else {
          setMouthOpen(false);
        }
      }, 130);
    } else {
      setIsSpeaking(false);
      setMouthOpen(false);
    }
    return () => clearInterval(mouthInterval);
  }, [isPlaying, isNarratorOn, showVideoModal, currentTime]);

  // Sync Narrator and Music when playing/pausing or mute state changes
  useEffect(() => {
    if (isPlaying && showVideoModal) {
      // Manage Music
      if (!isMuted) {
        synthRef.current?.start();
      } else {
        synthRef.current?.stop();
      }

      // Start tick interval
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 130) {
            setIsPlaying(false);
            synthRef.current?.stop();
            return 130;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      synthRef.current?.stop();
      window.speechSynthesis.cancel();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isMuted, showVideoModal]);

  // Handle TTS Narration for Scene Changes
  const activeSceneIndex = PROMO_SCENES.findIndex(
    (s) => currentTime >= s.start && currentTime < s.end
  );
  const activeScene = activeSceneIndex !== -1 ? PROMO_SCENES[activeSceneIndex] : PROMO_SCENES[PROMO_SCENES.length - 1];

  useEffect(() => {
    if (showVideoModal && isPlaying && isNarratorOn) {
      if (lastSpokenSceneRef.current !== activeScene.id) {
        speakText(activeScene.script);
        lastSpokenSceneRef.current = activeScene.id;
      }
    }
  }, [activeScene, isPlaying, isNarratorOn, showVideoModal]);

  // TTS Voiceover implementation
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // stop current utterance

    // Remove numbers and symbols for cleaner pronunciation
    const cleanedText = text
      .replace("9950072777", "9 9 5 0 0 7 2 7 7 7")
      .replace("24×7", "24 hours 7 days a week");

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Find matching English voices, prioritizing Indian English
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('en-IN')) || 
                  voices.find(v => v.lang.includes('en-GB')) ||
                  voices.find(v => v.lang.includes('en-US')) ||
                  voices[0];

    if (voice) utterance.voice = voice;
    utterance.rate = 0.92; // Slightly slower, premium rhythm
    utterance.pitch = 1.02;

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Playback
  const handleTogglePlay = () => {
    // Web Speech and Audio context requires user gesture
    if (!isPlaying && isNarratorOn) {
      speakText(activeScene.script);
      lastSpokenSceneRef.current = activeScene.id;
    }
    setIsPlaying(!isPlaying);
  };

  // Seek Timeline
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetVal = parseInt(e.target.value);
    setCurrentTime(targetVal);
    lastSpokenSceneRef.current = null; // force speech refresh
    if (isPlaying && isNarratorOn) {
      const targetScene = PROMO_SCENES.find((s) => targetVal >= s.start && targetVal < s.end) || PROMO_SCENES[PROMO_SCENES.length - 1];
      speakText(targetScene.script);
      lastSpokenSceneRef.current = targetScene.id;
    }
  };

  // Jump to specific scene/chapter
  const handleJumpToScene = (scene: typeof PROMO_SCENES[0]) => {
    setCurrentTime(scene.start);
    lastSpokenSceneRef.current = null;
    if (isPlaying && isNarratorOn) {
      speakText(scene.script);
      lastSpokenSceneRef.current = scene.id;
    }
  };

  // Format time (seconds to mm:ss)
  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Mouse coordinate tracker for follow-cursor hover
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    });
  };

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => console.error(err));
    }
  };

  // Listener to track escape key/system exit of fullscreen
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Determine current display image (swaps Jodhpur to Jaisalmer at 45 seconds)
  const displayImage = activeScene.id === 3 && currentTime >= 45 ? activeScene.imageAlt : activeScene.image;

  // Percentage complete for progress bars
  const progressPercent = (currentTime / 130) * 100;

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Visual Atmospheric Gradients */}
      <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-orange-650/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[550px] h-[550px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={13} className="text-orange-500 animate-pulse" /> Shri Gurukripa Travel Showreel
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            Shri Gurukripa Travel Showreel
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-2xl mx-auto mt-4 leading-relaxed font-sans">
            Experience our premium desert expeditions, highway cruises, and heritage tours. Play our official interactive trailer below.
          </p>
        </div>

        {/* Video Showcase Entry Card Stage */}
        <div className="flex justify-center items-center w-full max-w-4xl mx-auto relative px-4">
          <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl relative group">
            <div 
              onMouseMove={handlePointerMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                setShowVideoModal(true);
                setIsPlaying(true);
              }}
              className="w-full h-full cursor-none relative flex items-center justify-center select-none"
            >
              {/* Play Hover Button following cursor coordinates */}
              {isHovered && (
                <motion.div
                  style={{
                    position: 'absolute',
                    left: mousePos.x,
                    top: mousePos.y,
                    x: '-50%',
                    y: '-50%',
                    pointerEvents: 'none',
                  }}
                  className="z-30 flex items-center justify-center gap-2.5 px-7 py-3.5 bg-orange-500 text-slate-950 font-black rounded-full shadow-2xl text-xs tracking-widest uppercase border border-orange-400"
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                >
                  <Play size={14} className="fill-slate-950 text-slate-950" /> Play Film (2 Min)
                </motion.div>
              )}

              {/* Top Floating Badge overlay */}
              <div className="absolute top-6 left-6 z-20 pointer-events-none">
                <span className="text-[10px] bg-slate-950/80 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-full font-black tracking-widest uppercase backdrop-blur-md">
                  Interactive AI Cinematic Presentation
                </span>
              </div>

              {/* Right Floating Length Badge */}
              <div className="absolute top-6 right-6 z-20 pointer-events-none">
                <span className="text-[10px] bg-slate-950/90 text-gray-300 px-3 py-1.5 rounded-full font-bold tracking-wider backdrop-blur-md">
                  Duration: 2:10 Min
                </span>
              </div>

              {/* Bottom Tagline Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full px-6">
                <p className="text-[11px] text-white font-bold bg-slate-950/80 py-2.5 px-5 rounded-full inline-block backdrop-blur-md shadow-xl border border-white/5 uppercase tracking-widest">
                  Hover to explore cinematic motion. Click to play with audio.
                </p>
              </div>

              {/* Background teaser image (Scene 1) */}
              <img
                src={scene1}
                alt="Shri Gurukripa Taxi Sunset Heritage"
                className="h-full w-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-110 brightness-95 opacity-80"
              />

              {/* Overlay shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40" />

              {/* Center Play Icon Pulse */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="p-6 bg-orange-500/10 rounded-full backdrop-blur-sm border border-orange-500/30 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <Play size={44} className="fill-orange-400 text-orange-400 translate-x-0.5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL SCREEN IMMERSIVE THEATRE VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-2xl">
            {/* Backdrop Close Click */}
            <div 
              onClick={() => {
                setShowVideoModal(false);
                setIsPlaying(false);
                synthRef.current?.stop();
              }}
              className="absolute inset-0 cursor-zoom-out z-0" 
            />

            {/* Immersive Video Console Window */}
            <motion.div
              ref={playerContainerRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black border-0 md:border border-slate-800 md:rounded-3xl overflow-hidden shadow-2xl relative w-full max-w-6xl aspect-video z-10 flex flex-col md:flex-row h-full md:h-auto"
            >
              {/* MAIN MOVIE SCREEN AREA */}
              <div className="relative flex-1 bg-slate-950 overflow-hidden h-[65%] md:h-auto font-sans">
                
                {/* Visual Image Screen with Ken Burns animation mapped per scene */}
                <AnimatePresence mode="wait">
                  {currentTime < 130 ? (
                    <motion.div
                      key={`${activeScene.id}-${currentTime >= 45 && activeScene.id === 3 ? 'alt' : 'main'}`}
                      initial={{ 
                        scale: activeScene.animation.scaleStart, 
                        x: `${activeScene.animation.xStart}%`, 
                        y: `${activeScene.animation.yStart}%`, 
                        opacity: 0.4
                      }}
                      animate={{ 
                        scale: activeScene.animation.scaleEnd, 
                        x: `${activeScene.animation.xEnd}%`, 
                        y: `${activeScene.animation.yEnd}%`, 
                        opacity: 1 
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: activeScene.end - activeScene.start, 
                        ease: "linear" 
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={displayImage}
                        alt={activeScene.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    // SHOW FINAL LANDING OUTRO PAGE AT 130 SECONDS
                    <motion.div
                      key="outro-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-slate-950 z-20 flex flex-col justify-center items-center text-center p-8 select-text"
                    >
                      {/* Outro Image Background Collage */}
                      <div className="absolute inset-0 z-0 opacity-20">
                        <img src={scene8} alt="Outro Background" className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Content panel */}
                      <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                          <Sparkles size={11} className="text-orange-500 animate-pulse" /> Shri Gurukripa Rajasthan Tours
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
                          Shri Gurukripa Tours & Taxi
                        </h2>
                        <p className="text-orange-400 font-bold uppercase tracking-widest text-xs md:text-sm">
                          Safe, Trusted, and Comfortable Journeys Across Rajasthan
                        </p>
                        <p className="text-gray-300 text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-sans">
                          Your royal journey awaits. Travel in our premium GPS-enabled, fully sanitized vehicles with trained professional drivers. Airport pick-ups, tour packages, corporate events, and wedding rentals.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4 text-left font-sans">
                          <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                            GPS Tracking & Safety
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                            24x7 Customer Support
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                            Premium Fleet & Clean Cars
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                            Hospitality First Drivers
                          </div>
                        </div>

                        {/* Call to Action Button Row */}
                        <div className="flex flex-wrap gap-4 justify-center pt-6 font-sans">
                          <a 
                            href="tel:9950072777" 
                            className="bg-orange-500 hover:bg-orange-650 text-slate-950 font-black px-8 py-3.5 rounded-full text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
                          >
                            <Phone size={16} className="fill-slate-950" /> Call 9950072777
                          </a>
                          <button 
                            onClick={() => {
                              setShowVideoModal(false);
                              setTimeout(() => {
                                const element = document.getElementById("booking-section");
                                if (element) element.scrollIntoView({ behavior: "smooth" });
                              }, 300);
                            }}
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3.5 rounded-full text-sm uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Book Taxi Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Vignette Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/60 pointer-events-none" />

                {/* DYNAMIC TRANSIT MAP ROUTE OVERLAY */}
                {currentTime < 130 && (
                  <TravelRouteOverlay sceneId={activeScene.id} time={currentTime} />
                )}

                {/* TOP HEADER CONTROLS */}
                <div className="absolute top-0 inset-x-0 p-5 flex justify-between items-center z-30 pointer-events-none">
                  <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 font-sans">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Cinematic Trailer</span>
                    <span className="text-[10px] text-gray-400 font-bold border-l border-slate-700 pl-2">
                      {activeScene.title}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowVideoModal(false);
                      setIsPlaying(false);
                      synthRef.current?.stop();
                    }}
                    className="pointer-events-auto w-9 h-9 bg-slate-900/80 hover:bg-slate-800 text-white border border-white/10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow hover:scale-105 active:scale-95"
                    title="Exit Player"
                  >
                    ✕
                  </button>
                </div>

                {/* REALISTIC TALKING CHARACTER NARRATOR OVERLAY */}
                {currentTime < 130 && (
                  <div className="absolute bottom-16 left-6 right-6 z-40 flex items-end gap-4 pointer-events-none">
                    
                    {/* Character Avatar Container with dynamic head bobbing */}
                    <motion.div
                      animate={{
                        y: isSpeaking ? [0, -2, 0, -1, 0] : 0,
                        rotate: isSpeaking ? [-0.5, 0.5, -0.5, 0] : 0
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-orange-500 bg-slate-950 shadow-2xl overflow-hidden shrink-0 pointer-events-auto"
                    >
                      <img 
                        src={guideAvatar} 
                        alt="Kabir - Shri Gurukripa Guide" 
                        className="w-full h-full object-cover scale-110 translate-y-1" 
                      />

                      {/* Blinking Eye 1 Overlay */}
                      <motion.div
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ 
                          duration: 0.15, 
                          repeat: Infinity, 
                          repeatDelay: 3.5 + Math.random() * 2 
                        }}
                        className="absolute top-[49.5%] left-[40.5%] w-1.5 h-1 bg-slate-900 rounded-full z-20"
                      />
                      {/* Blinking Eye 2 Overlay */}
                      <motion.div
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ 
                          duration: 0.15, 
                          repeat: Infinity, 
                          repeatDelay: 3.5 + Math.random() * 2 
                        }}
                        className="absolute top-[49.5%] left-[55.5%] w-1.5 h-1 bg-slate-900 rounded-full z-20"
                      />

                      {/* Lip-Sync Simulated Flapping Mouth */}
                      {isSpeaking && (
                        <motion.div 
                          animate={{ 
                            height: mouthOpen ? [3, 8, 3] : 3,
                            scaleX: mouthOpen ? [1, 1.2, 1] : 1
                          }}
                          transition={{ duration: 0.13, repeat: Infinity }}
                          className="absolute top-[59%] left-[48.5%] -translate-x-1/2 w-3.5 bg-[#661010] rounded-full border border-black/45 z-20 shadow-inner"
                        />
                      )}

                      {/* Audio visualizer waves overlayed on avatar when speaking */}
                      {isSpeaking && (
                        <div className="absolute inset-x-0 bottom-1 flex justify-center items-end gap-0.5 h-4 bg-gradient-to-t from-orange-500/80 to-transparent pt-1 px-3 z-30">
                          <motion.div animate={{ height: [4, 12, 4] }} transition={{ duration: 0.2, repeat: Infinity }} className="w-0.5 bg-white rounded-full" />
                          <motion.div animate={{ height: [8, 4, 10] }} transition={{ duration: 0.15, repeat: Infinity }} className="w-0.5 bg-white rounded-full" />
                          <motion.div animate={{ height: [2, 14, 2] }} transition={{ duration: 0.25, repeat: Infinity }} className="w-0.5 bg-white rounded-full" />
                          <motion.div animate={{ height: [9, 3, 9] }} transition={{ duration: 0.18, repeat: Infinity }} className="w-0.5 bg-white rounded-full" />
                        </div>
                      )}
                    </motion.div>

                    {/* Speech dialog bubble with typewriter text animation */}
                    <div className="flex-1 max-w-xl pointer-events-auto">
                      <SpeechBubble text={activeScene.script} />
                    </div>

                  </div>
                )}

                {/* BOTTOM PLAYBACK CONTROLS */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black to-transparent flex flex-col gap-3 z-30 font-sans">
                  {/* Timeline Scrubber */}
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-[10px] font-mono font-bold text-gray-400 shrink-0 w-8 text-right">
                      {formatTime(currentTime)}
                    </span>
                    <div className="flex-1 relative group py-2">
                      {/* Timeline Slider Track overlay */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-slate-800">
                        <div 
                          className="h-full rounded-full bg-orange-500 absolute left-0" 
                          style={{ width: `${progressPercent}%` }} 
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="130"
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-4 opacity-0 cursor-pointer relative z-10 accent-orange-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 shrink-0 w-8">
                      {formatTime(130)}
                    </span>
                  </div>

                  {/* Playback Controls Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Play/Pause */}
                      <button
                        onClick={handleTogglePlay}
                        className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-full flex items-center justify-center transition-all cursor-pointer shadow hover:scale-105 active:scale-95"
                      >
                        {isPlaying ? <Pause size={16} className="fill-slate-950 text-slate-950" /> : <Play size={16} className="fill-slate-950 translate-x-0.5 text-slate-950" />}
                      </button>

                      {/* Rewind */}
                      <button
                        onClick={() => {
                          setCurrentTime((p) => Math.max(0, p - 10));
                          lastSpokenSceneRef.current = null;
                        }}
                        className="p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Rewind 10s"
                      >
                        <RotateCcw size={16} />
                      </button>

                      {/* Ambient Music Toggle */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`px-3 py-1.5 rounded-full border text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          !isMuted 
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                            : 'bg-slate-900 border-slate-800 text-gray-400'
                        }`}
                        title="Toggle Ambient Sitar"
                      >
                        {!isMuted ? <Volume2 size={12} /> : <VolumeX size={12} />}
                        Sitar: {!isMuted ? "ON" : "OFF"}
                      </button>

                      {/* Voiceover Narrator Toggle */}
                      <button
                        onClick={() => {
                          setIsNarratorOn(!isNarratorOn);
                          if (isNarratorOn) {
                            window.speechSynthesis.cancel();
                          } else {
                            speakText(activeScene.script);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full border text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isNarratorOn 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-slate-900 border-slate-800 text-gray-400'
                        }`}
                        title="Toggle Voice Narrator"
                      >
                        <Headphones size={12} />
                        Narrator: {isNarratorOn ? "ON" : "OFF"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 font-sans">
                      {/* Fullscreen */}
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Toggle Fullscreen"
                      >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CHAPTERS SIDEBAR (RIGHT PANEL) */}
              <div className="w-full md:w-64 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-850 p-5 flex flex-col gap-4 overflow-y-auto h-[35%] md:h-auto select-none font-sans">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-355 flex items-center gap-1.5">
                    <Compass size={13} className="text-orange-500" /> Movie Chapters
                  </h3>
                  <span className="text-[9px] bg-slate-900 text-orange-400 px-2 py-0.5 rounded font-black border border-slate-800">
                    2:10 TOTAL
                  </span>
                </div>
                
                <div className="flex flex-col gap-2.5 flex-1 pr-1">
                  {PROMO_SCENES.map((scene, index) => {
                    const isPassed = currentTime >= scene.end;
                    const isActive = currentTime >= scene.start && currentTime < scene.end;
                    const SceneIcon = scene.icon;

                    return (
                      <button
                        key={scene.id}
                        onClick={() => handleJumpToScene(scene)}
                        className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-orange-500/10 border-orange-500/40 shadow-lg text-white font-bold' 
                            : isPassed 
                            ? 'bg-slate-900/40 border-slate-900/50 text-gray-400 font-bold' 
                            : 'bg-slate-900/20 border-slate-900/40 text-gray-500 hover:border-slate-800 hover:text-gray-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-orange-500 text-slate-950' : 'bg-slate-850 text-gray-400'}`}>
                          <SceneIcon size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-1">
                            <span className="text-[10px] font-bold truncate">
                              {index + 1}. {scene.title}
                            </span>
                            <span className="text-[9px] font-mono shrink-0">
                              {formatTime(scene.start)}
                            </span>
                          </div>
                          <p className="text-[8px] font-medium leading-snug line-clamp-1 mt-0.5 text-gray-400">
                            {scene.script}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  {/* Outro Special Chapter */}
                  <button
                    onClick={() => {
                      setCurrentTime(130);
                      setIsPlaying(false);
                      synthRef.current?.stop();
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                      currentTime >= 130 
                        ? 'bg-orange-500/10 border-orange-500/40 shadow-lg text-white font-bold' 
                        : 'bg-slate-900/20 border-slate-900/40 text-gray-500 hover:border-slate-800 hover:text-gray-350'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${currentTime >= 130 ? 'bg-orange-500 text-slate-950' : 'bg-slate-850 text-gray-400'}`}>
                      <Phone size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-[10px] font-bold">
                          9. Outro & Call Taxi
                        </span>
                        <span className="text-[9px] font-mono">
                          02:10
                        </span>
                      </div>
                      <p className="text-[8px] font-medium leading-snug line-clamp-1 mt-0.5 text-gray-400">
                        Call now: 9950072777. Shri Gurukripa Tours & Taxi.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
