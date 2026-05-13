'use client';

import { motion } from 'framer-motion';
import { techStacks } from '@/data/techStacks';

export default function TechStackSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-purple-400 text-sm uppercase tracking-wider mb-3">
            TECH STACK
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">사용 기술</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-6"
        >
          {techStacks.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ scale: 1.15, y: -4 }}
                className="flex flex-col items-center gap-2 group w-20"
                title={tech.name}
              >
                <Icon
                  size={44}
                  style={{ color: tech.color }}
                  className="transition-transform"
                />
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
