// app/page.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import QueryForm from './components/QueryForm';
import Footer from './components/Footer';
import WeatherSoilInsights from './components/WeatherSoilInsights';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from './contexts/TranslationContext';

// 3D Farm Globe Component
function FarmGlobe() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[2, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          color="#22c55e"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#3b82f6" intensity={0.5} />
    </Float>
  );
}

// 3D Kerala Map Component with Advanced Animations
function KeralaMap() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate on hover
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group>
      {/* Main Kerala Shape */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[2.5, 3.5, 0.4]} />
          <meshStandardMaterial
            color="#10b981"
            metalness={0.8}
            roughness={0.2}
            emissive="#059669"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* Orbiting Farm Icons */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.4}>
        <mesh position={[3, 2, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.6}
            roughness={0.3}
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.5}>
        <mesh position={[-3, -2, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.6}
            roughness={0.3}
            emissive="#2563eb"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={0.3}>
        <mesh position={[0, 3, 1]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color="#8b5cf6"
            metalness={0.6}
            roughness={0.3}
            emissive="#7c3aed"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Dynamic Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 5, 5]} angle={0.4} intensity={1.2} color="#10b981" />
      <spotLight position={[-5, -5, 5]} angle={0.4} intensity={0.8} color="#3b82f6" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#fbbf24" />
    </group>
  );
}

// Animated Particles Background for About Section
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.05} color="#22c55e" transparent opacity={0.6} />
    </points>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [chatMessages, setChatMessages] = useState([
    { type: 'user', text: 'What fertilizer is best for rice in monsoon?' },
    { type: 'ai', text: 'For rice during monsoon, use NPK 20-10-10 with organic compost. Apply in split doses for better absorption.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const featuresRef = useRef(null);
  const demoRef = useRef(null);
  const aboutRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const demoInView = useInView(demoRef, { once: true, amount: 0.3 });
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });

  const features = [
    {
      icon: '💬',
      title: t.features.aiChat.title,
      description: t.features.aiChat.description,
      link: '#askQuery'
    },
    {
      icon: '🌦️',
      title: t.features.weather.title,
      description: t.features.weather.description,
      link: '#weather-insights'
    },
    {
      icon: '🗣️',
      title: t.features.language.title,
      description: t.features.language.description,
      link: null
    }
  ];

  const handleFeatureClick = (link: string | null) => {
    if (link) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setChatMessages([...chatMessages, { type: 'user', text: inputValue }]);
      setInputValue('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          type: 'ai',
          text: 'Thank you for your question! Our AI is analyzing your query and will provide a detailed response shortly.'
        }]);
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white overflow-x-hidden">
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Suspense fallback={null}>
              <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
              <FarmGlobe />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-block px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full mb-6">
              <span className="text-green-300 text-sm font-medium">{t.hero.badge}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => { document.getElementById('askQuery')?.scrollIntoView({ behavior: 'smooth' }); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold text-lg shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all"
              >
                {t.hero.askQuery}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/50 rounded-full font-semibold text-lg backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                {t.hero.learnMore}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Highlights Section */}
      <section ref={featuresRef} className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-300"
          >
            {t.features.title}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => handleFeatureClick(feature.link)}
                className={`relative group ${feature.link ? 'cursor-pointer' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-green-300">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                  {feature.link && (
                    <div className="mt-4 flex items-center text-green-400 text-sm font-semibold">
                      <span>{t.features.viewDetails}</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather & Soil Insights Section */}
      <WeatherSoilInsights />

      {/* Interactive Demo Section */}
      <div id="askQuery">
        <QueryForm />
      </div>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 px-6 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900/30 to-blue-900/30" />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>
        
        {/* Floating Orbs Background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div 
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Animated Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300">
                    {t.about.title}
                  </span>
                </h2>
              </motion.div>

              {/* Description with Stagger Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t.about.description1}
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t.about.description2}
                </p>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-6 mt-10"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -8, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-400/20 rounded-xl shadow-lg hover:shadow-green-500/20"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={aboutInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-green-400 mb-1"
                  >
                    24/7
                  </motion.div>
                  <div className="text-xs text-gray-400">AI Support</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, y: -8, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl shadow-lg hover:shadow-blue-500/20"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={aboutInView ? { scale: 1 } : {}}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-blue-400 mb-1"
                  >
                    10K+
                  </motion.div>
                  <div className="text-xs text-gray-400">Farmers</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, y: -8, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 rounded-xl shadow-lg hover:shadow-purple-500/20"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={aboutInView ? { scale: 1 } : {}}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-purple-400 mb-1"
                  >
                    98%
                  </motion.div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </motion.div>
              </motion.div>

              {/* Project Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={aboutInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8"
              >
              </motion.div>
            </motion.div>

            {/* Right 3D Canvas */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotateY: -30 }}
              animate={aboutInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="h-[500px] relative"
            >
              {/* Glass Morphism Container */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                  <Suspense fallback={null}>
                    <ParticleField />
                    <KeralaMap />
                    <OrbitControls 
                      enableZoom={false} 
                      enablePan={false} 
                      autoRotate 
                      autoRotateSpeed={1.5}
                      minPolarAngle={Math.PI / 3}
                      maxPolarAngle={Math.PI / 1.5}
                    />
                  </Suspense>
                </Canvas>
              </div>

              {/* Floating Info Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={aboutInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="absolute top-8 -left-4 z-20"
              >
                <div className="bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="text-3xl"
                    >
                      🌾
                    </motion.div>
                    <div>
                      <div className="text-sm font-semibold text-white">AI Powered</div>
                      <div className="text-xs text-green-100">Smart Farming</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                animate={aboutInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.4, type: "spring" }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="absolute bottom-8 -right-4 z-20"
              >
                <div className="bg-gradient-to-br from-blue-500/90 to-cyan-600/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl"
                    >
                      🌦️
                    </motion.div>
                    <div>
                      <div className="text-sm font-semibold text-white">Real-Time</div>
                      <div className="text-xs text-blue-100">Weather Data</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                animate={aboutInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.6, type: "spring" }}
                whileHover={{ scale: 1.1, x: 5 }}
                className="absolute top-1/2 -translate-y-1/2 -left-6 z-20"
              >
                <div className="bg-gradient-to-br from-purple-500/90 to-pink-600/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-3xl"
                    >
                      🗣️
                    </motion.div>
                    <div>
                      <div className="text-sm font-semibold text-white">Regional</div>
                      <div className="text-xs text-purple-100">Languages</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Custom CSS for grid animation */}
        <style jsx>{`
          @keyframes gridMove {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(50px, 50px);
            }
          }
        `}</style>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}