"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

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

function generateGlobePoints(count: number) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const lat = (Math.acos(2 * ((i * 0.618033988749895) % 1) - 1) * 180) / Math.PI - 90;
    const lng = ((i * 137.508) % 360) - 180;
    points.push({
      lat,
      lng,
      size: 0.3 + (i % 3) * 0.15,
      color: "rgba(255, 255, 255, 0.4)",
    });
  }
  return points;
}

const arcsData = [
  { startLat: 6.5244, startLng: 3.3792, endLat: 51.5074, endLng: -0.1278 },
  { startLat: 6.5244, startLng: 3.3792, endLat: 40.7128, endLng: -74.006 },
  { startLat: 6.5244, startLng: 3.3792, endLat: 25.2048, endLng: 55.2708 },
  { startLat: 6.5244, startLng: 3.3792, endLat: 43.6532, endLng: -79.3832 },
  { startLat: 6.5244, startLng: 3.3792, endLat: -26.2041, endLng: 28.0473 },
];

const GlobalReach = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [mounted, setMounted] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);

  const pointsData = generateGlobePoints(800);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (globeRef.current && globeReady) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.controls().enableZoom = false;
      globeRef.current.pointOfView({ lat: 10, lng: 0, altitude: 2.5 });
    }
  }, [globeReady]);

  const onGlobeReady = useCallback(() => {
    setGlobeReady(true);
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
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Stop dreaming, start traveling.
              </h2>
              <p className="text-gray-300 text-lg md:text-xl">
                Connecting thousands of Nigerians to the world with affordable, seamless travel since 2017.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-6 md:gap-8"
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

          <div className="order-1 lg:order-2 flex justify-center items-center">
            <motion.div
              className="w-full h-[300px] md:h-[400px] relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {mounted && (
                <Globe
                  ref={globeRef}
                  onGlobeReady={onGlobeReady}
                  width={400}
                  height={400}
                  backgroundColor="rgba(0,0,0,0)"
                  globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
                  showGlobe={true}
                  showAtmosphere={true}
                  atmosphereColor="#065777"
                  atmosphereAltitude={0.25}
                  pointsData={pointsData}
                  pointLat="lat"
                  pointLng="lng"
                  pointColor="color"
                  pointAltitude={0.01}
                  pointRadius="size"
                  arcsData={arcsData}
                  arcStartLat="startLat"
                  arcStartLng="startLng"
                  arcEndLat="endLat"
                  arcEndLng="endLng"
                  arcColor={() => ["#065777", "#06b6d4"]}
                  arcDashLength={0.4}
                  arcDashGap={0.2}
                  arcDashAnimateTime={3000}
                  arcStroke={0.5}
                  enablePointerInteraction={false}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;
