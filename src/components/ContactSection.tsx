'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { contactInfo } from '@/data/contact';

export default function ContactSection() {
  return (
    <section className="relative min-h-[288px] overflow-hidden border-t border-purple-400/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/keep-building.png"
          alt="Keep Building"
          fill
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B15] via-[#080B15]/76 to-[#080B15]/16" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B15]/24 via-transparent to-[#080B15]/62" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.34),transparent_62%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid min-h-[190px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(270px,360px)_minmax(0,0.78fr)] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-lg lg:justify-self-start"
          >
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
              함께 멋진 결과를 만들어봐요!
              <span className="inline-block">👋</span>
            </h2>
            <p className="mb-6 text-sm leading-7 text-gray-300 sm:text-base">
              새로운 프로젝트나 협업 제안은 언제나 환영입니다.
            </p>

            <motion.a
              href={`mailto:${contactInfo.email}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-12 items-center gap-3 rounded-md bg-gradient-to-r from-violet-500 to-purple-700 px-8 text-sm font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.42)] transition-opacity hover:opacity-95"
            >
              연락하기
              <ArrowRight size={17} />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[360px] space-y-3 justify-self-center"
          >
            <a
              href={`mailto:${contactInfo.email}`}
              className="group flex items-center gap-4 rounded-xl py-1.5 transition-colors"
            >
              <div className="rounded-lg bg-purple-500/10 p-2 transition-colors group-hover:bg-purple-500/20">
                <Mail className="text-purple-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-gray-100 sm:text-base">
                  {contactInfo.email}
                </p>
              </div>
            </a>

            <a
              href={`https://${contactInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl py-1.5 transition-colors"
            >
              <div className="rounded-lg bg-purple-500/10 p-2 transition-colors group-hover:bg-purple-500/20">
                <FaGithub className="text-purple-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-gray-100 sm:text-base">
                  {contactInfo.github}
                </p>
              </div>
            </a>
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center border-t border-white/10 pt-6 text-xs text-gray-500 sm:text-sm">
          <p>© 2026 It Kong. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}
