'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Code2, FolderOpen, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[760px] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/desk-laptop.png"
          alt="개발자 작업실"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A12] via-[#070A12]/72 to-[#070A12]/8" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070A12]/20 via-transparent to-[#070A12]" />
        <div className="absolute left-0 top-1/4 h-96 w-1/2 bg-purple-600/15 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-8"
        >
          <div className="space-y-4">
            <p className="text-purple-400 text-lg flex items-center gap-2">
              <Sparkles size={20} />
              Hello, I&apos;m
            </p>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl">
              It Kong
            </h1>
            <p className="text-2xl text-gray-300">
              Backend-focused Full-stack Developer
            </p>
          </div>

          <p className="text-gray-400 max-w-2xl leading-relaxed text-lg">
            사용자의 문제를 실제 서비스로 풀어내는 개발자입니다.
            백엔드 아키텍처, 프론트 UX, AI 기능, 운영 안정성까지 함께 고민하며
            작동하는 제품을 만드는 데 집중합니다.
          </p>

          <div className="flex gap-8 pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-400">
                <Code2 className="text-purple-400" size={24} />
                <span className="text-3xl font-bold text-white">17+</span>
              </div>
              <p className="text-sm text-gray-500">Years Experience</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-400">
                <FolderOpen className="text-purple-400" size={24} />
                <span className="text-3xl font-bold text-white">12+</span>
              </div>
              <p className="text-sm text-gray-500">Projects Built</p>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden lg:flex absolute left-1/2 bottom-8 text-purple-400/70"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
