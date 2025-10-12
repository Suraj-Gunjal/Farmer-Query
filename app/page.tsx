'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import QueryForm from './components/QueryForm';
import Footer from './components/Footer';

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

// 3D Kerala Map Component
function KeralaMap() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.3}>
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 3, 0.3]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.7}
          roughness={0.2}
          emissive="#059669"
          emissiveIntensity={0.2}
        />
      </mesh>
      <ambientLight intensity={0.6} />
      <spotLight position={[5, 5, 5]} angle={0.3} intensity={1} />
    </Float>
  );
}

export default function Home() {
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
      title: 'AI Chat Support',
      description: 'Get instant, intelligent answers to all your farming queries in real-time.'
    },
    {
      icon: '🌦️',
      title: 'Weather & Soil Insights',
      description: 'Real-time weather forecasts and soil health analytics for better decisions.'
    },
    {
      icon: '🗣️',
      title: 'Regional Language Support',
      description: 'Communicate in Malayalam, Tamil, and other regional languages effortlessly.'
    }
  ];

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
              <span className="text-green-300 text-sm font-medium">Government of Kerala Initiative</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300">
              Kerala AI-based Farmer Advisory System
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Smart, Instant, and Localized AI Assistance for Every Farmer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => { document.getElementById('askQuery')?.scrollIntoView({ behavior: 'smooth' }); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold text-lg shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all"
              >
                Ask Your Query
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/50 rounded-full font-semibold text-lg backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                Learn More
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
            Empowering Farmers with AI
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-green-300">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <div id="askQuery">
        <QueryForm />
      </div>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-300">
                Transforming Kerala Agriculture
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                The Government of Kerala's AI-based Farmer Advisory System is a revolutionary initiative designed to empower farmers with cutting-edge technology. Our platform leverages artificial intelligence to provide instant, accurate, and localized farming advice.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From crop selection and pest management to weather predictions and soil health monitoring, our AI assistant is available 24/7 to support Kerala's farming community in achieving sustainable and profitable agriculture.
              </p>
              <div className="mt-8">
                <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
                  <span className="text-blue-300 text-sm font-medium">SIH 25076 Project</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="h-96"
            >
              <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                <Suspense fallback={null}>
                  <KeralaMap />
                  <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                </Suspense>
              </Canvas>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}