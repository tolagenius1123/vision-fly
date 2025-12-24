"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
}

const AnimatedStat = ({ value, suffix, label, inView }: StatProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-300 text-sm md:text-base">{label}</div>
    </div>
  );
};

const globeDots = [
  { x: 520, y: 180, r: 2, o: 0.7 }, { x: 680, y: 200, r: 1.5, o: 0.8 }, { x: 600, y: 150, r: 2.5, o: 0.6 },
  { x: 540, y: 220, r: 1.8, o: 0.9 }, { x: 660, y: 180, r: 2, o: 0.7 }, { x: 580, y: 300, r: 1.5, o: 0.8 },
  { x: 620, y: 280, r: 2.2, o: 0.6 }, { x: 500, y: 320, r: 1.8, o: 0.75 }, { x: 700, y: 300, r: 2, o: 0.85 },
  { x: 560, y: 350, r: 1.6, o: 0.7 }, { x: 640, y: 340, r: 2.1, o: 0.65 }, { x: 480, y: 280, r: 1.9, o: 0.8 },
  { x: 720, y: 260, r: 2.3, o: 0.7 }, { x: 530, y: 400, r: 1.7, o: 0.75 }, { x: 670, y: 380, r: 2, o: 0.6 },
  { x: 590, y: 420, r: 1.5, o: 0.85 }, { x: 610, y: 200, r: 2.4, o: 0.7 }, { x: 550, y: 250, r: 1.8, o: 0.9 },
  { x: 650, y: 230, r: 2, o: 0.65 }, { x: 510, y: 370, r: 2.2, o: 0.8 }, { x: 690, y: 350, r: 1.6, o: 0.75 },
  { x: 570, y: 160, r: 2.5, o: 0.7 }, { x: 630, y: 170, r: 1.9, o: 0.85 }, { x: 495, y: 240, r: 2.1, o: 0.6 },
  { x: 705, y: 220, r: 1.7, o: 0.8 }, { x: 545, y: 310, r: 2.3, o: 0.7 }, { x: 655, y: 290, r: 1.5, o: 0.9 },
  { x: 515, y: 190, r: 2, o: 0.75 }, { x: 685, y: 330, r: 1.8, o: 0.65 }, { x: 575, y: 380, r: 2.4, o: 0.8 },
  { x: 625, y: 360, r: 1.6, o: 0.7 }, { x: 485, y: 350, r: 2.2, o: 0.85 }, { x: 715, y: 280, r: 1.9, o: 0.6 },
  { x: 555, y: 430, r: 2.1, o: 0.75 }, { x: 645, y: 400, r: 1.7, o: 0.8 }, { x: 525, y: 270, r: 2.5, o: 0.7 },
  { x: 675, y: 250, r: 1.5, o: 0.9 }, { x: 595, y: 320, r: 2.3, o: 0.65 }, { x: 605, y: 240, r: 1.8, o: 0.85 },
  { x: 535, y: 340, r: 2, o: 0.7 }, { x: 665, y: 310, r: 2.4, o: 0.75 }, { x: 505, y: 200, r: 1.6, o: 0.8 },
];

const scatterDots = [
  { x: 150, y: 150, r: 1.5, o: 0.5 }, { x: 200, y: 250, r: 1.2, o: 0.4 }, { x: 120, y: 350, r: 1.8, o: 0.6 },
  { x: 280, y: 180, r: 1.3, o: 0.5 }, { x: 350, y: 280, r: 1.6, o: 0.4 }, { x: 180, y: 400, r: 1.4, o: 0.55 },
  { x: 250, y: 120, r: 1.7, o: 0.45 }, { x: 320, y: 350, r: 1.2, o: 0.5 }, { x: 400, y: 200, r: 1.5, o: 0.4 },
  { x: 140, y: 280, r: 1.8, o: 0.6 }, { x: 380, y: 150, r: 1.3, o: 0.5 }, { x: 220, y: 380, r: 1.6, o: 0.45 },
  { x: 800, y: 150, r: 1.5, o: 0.5 }, { x: 850, y: 250, r: 1.2, o: 0.4 }, { x: 920, y: 180, r: 1.8, o: 0.6 },
  { x: 780, y: 320, r: 1.3, o: 0.5 }, { x: 950, y: 280, r: 1.6, o: 0.4 }, { x: 1000, y: 200, r: 1.4, o: 0.55 },
  { x: 880, y: 350, r: 1.7, o: 0.45 }, { x: 1050, y: 150, r: 1.2, o: 0.5 }, { x: 820, y: 400, r: 1.5, o: 0.4 },
  { x: 970, y: 320, r: 1.8, o: 0.6 }, { x: 1100, y: 250, r: 1.3, o: 0.5 }, { x: 900, y: 120, r: 1.6, o: 0.45 },
  { x: 160, y: 200, r: 1.4, o: 0.5 }, { x: 300, y: 420, r: 1.7, o: 0.4 }, { x: 1020, y: 380, r: 1.5, o: 0.55 },
  { x: 240, y: 320, r: 1.2, o: 0.45 }, { x: 860, y: 420, r: 1.8, o: 0.5 }, { x: 420, y: 380, r: 1.3, o: 0.4 },
];

const flightPaths = [
  { d: "M 200 350 Q 400 100 600 250", delay: 0.2 },
  { d: "M 600 200 Q 800 50 1000 200", delay: 0.4 },
  { d: "M 300 400 Q 600 200 900 350", delay: 0.6 },
  { d: "M 400 250 Q 550 400 700 300", delay: 0.8 },
  { d: "M 150 200 Q 350 300 550 180", delay: 1.0 },
  { d: "M 650 350 Q 850 150 1050 300", delay: 1.2 },
];

const nodePoints = [
  { cx: 200, cy: 350 }, { cx: 600, cy: 250 }, { cx: 1000, cy: 200 },
  { cx: 300, cy: 400 }, { cx: 900, cy: 350 }, { cx: 400, cy: 250 },
  { cx: 700, cy: 300 }, { cx: 150, cy: 200 }, { cx: 550, cy: 180 },
  { cx: 650, cy: 350 }, { cx: 1050, cy: 300 }, { cx: 500, cy: 320 },
];

const GlobalReach = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { value: 200, suffix: "+", label: "Destinations" },
    { value: 10000, suffix: "+", label: "Affordable Flights Booked" },
    { value: 6, suffix: "", label: "Continents" },
    { value: 8, suffix: "", label: "Years in Business" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 bg-[#0a1628] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-30">
        <svg
          viewBox="0 0 1200 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#0a1628" />
            </radialGradient>
          </defs>
          
          <ellipse cx="600" cy="300" rx="280" ry="280" fill="url(#globeGradient)" opacity="0.5" />
          
          {globeDots.map((dot, i) => (
            <circle
              key={`globe-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="#4a90a4"
              opacity={dot.o}
            />
          ))}
          
          {scatterDots.map((dot, i) => (
            <circle
              key={`scatter-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="#4a90a4"
              opacity={dot.o}
            />
          ))}
          
          {mounted && flightPaths.map((path, i) => (
            <motion.path
              key={`path-${i}`}
              d={path.d}
              stroke="#136f8a"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.8 } : {}}
              transition={{ duration: 1.5, delay: path.delay }}
            />
          ))}

          {mounted && nodePoints.map((point, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={point.cx}
              cy={point.cy}
              r="5"
              fill="#136f8a"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Stop dreaming, start traveling.
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Connecting thousands of Nigerians to the world with affordable, seamless travel since 2017.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {stats.map((stat, index) => (
            <AnimatedStat
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              inView={isInView}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalReach;
