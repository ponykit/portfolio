'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { contactInfo } from '@/data/contact';

export default function ContactSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            함께 멋진 결과를 만들어봐요
          </h2>
          <p className="text-gray-400">
            새로운 프로젝트나 협업 제안은 언제나 환영입니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <Mail className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-white">{contactInfo.email}</p>
              </div>
            </a>

            <a
              href={`https://${contactInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <FaGithub className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">GitHub</p>
                <p className="text-white">{contactInfo.github}</p>
              </div>
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <motion.a
              href={`mailto:${contactInfo.email}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              연락하기 →
            </motion.a>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Keep Building</p>
        </div>
      </div>
    </section>
  );
}
