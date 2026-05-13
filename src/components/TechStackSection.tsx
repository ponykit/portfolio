'use client';

import { motion } from 'framer-motion';
import { techStacks } from '@/data/techStacks';

export default function TechStackSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-purple-400 text-sm uppercase tracking-wider mb-4">
            TECH STACK
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">사용 기술</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {techStacks.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group relative"
            >
              <div className="px-6 py-3 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all">
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
