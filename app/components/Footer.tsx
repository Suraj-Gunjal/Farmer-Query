'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  const footerLinks = {
    [t.footer.quickLinks]: [
      { name: t.footer.home, href: '#' },
      { name: t.footer.about, href: '#about' },
      { name: t.footer.features, href: '#features' },
      { name: t.footer.contact, href: '#contact' }
    ],
    [t.footer.resources]: [
      { name: t.footer.documentation, href: '#' },
      { name: t.footer.faq, href: '#' },
      { name: t.footer.tutorials, href: '#' }
    ],
    [t.footer.support]: [
      { name: t.footer.helpCenter, href: '#' },
      { name: t.footer.privacyPolicy, href: '#' },
      { name: t.footer.termsOfService, href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: '🐦', href: '#', color: 'hover:text-sky-400' },
    { name: 'Instagram', icon: '📷', href: '#', color: 'hover:text-pink-400' },
    { name: 'YouTube', icon: '📹', href: '#', color: 'hover:text-red-400' },
    { name: 'WhatsApp', icon: '💬', href: '#', color: 'hover:text-green-400' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-green-500/50">
                  🌾
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-400">
                    Kerala Farmer AI
                  </h3>
                  <p className="text-xs text-gray-400">Government of Kerala</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {t.footer.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-xs text-green-300">
                  
                </div>
                <div className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-xs text-blue-300">
                  AI Powered
                </div>
                <div className="px-3 py-1 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full text-xs text-purple-300">
                  24/7 Support
                </div>
              </div>
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={itemVariants}>
              <h4 className="text-lg font-bold mb-4 text-green-300">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-green-400 group-hover:w-4 transition-all duration-300" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-300">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-gray-300 text-sm mb-6">
              {t.footer.newsletterDescription}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.emailPlaceholder}
                required
                className="flex-1 px-6 py-3 bg-slate-800/50 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold text-sm shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all whitespace-nowrap"
              >
                {t.footer.subscribe}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Social Links & Bottom Bar */}
        <div className="text-center text-gray-400 text-sm pt-8 border-t border-white/10">
          <p>{t.footer.copyright}</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
      </div>
    </footer>
  );
}