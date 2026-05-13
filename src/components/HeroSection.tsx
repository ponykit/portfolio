'use client';

import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* 왼쪽 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-purple-400 text-lg flex items-center gap-2">
              <Code2 size={20} />
              Hello, I&apos;m
            </p>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white">
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
                <div className="text-purple-400 text-2xl">📁</div>
                <span className="text-3xl font-bold text-white">12+</span>
              </div>
              <p className="text-sm text-gray-500">Projects Built</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {['Java', 'Kotlin', 'AWS'].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 text-sm"
              >
                {tech}
              </div>
            ))}
            <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 text-sm">
              AI Product Builder
            </div>
          </div>
        </motion.div>

        {/* 오른쪽 영역 - 개발자 작업실 비주얼 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative space-y-4">
            {/* Code Editor Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="font-mono text-xs space-y-2">
                <div className="text-purple-400">
                  <span className="text-blue-400">const</span>{' '}
                  <span className="text-white">solution</span> ={' '}
                  <span className="text-green-400">&quot;Build real products&quot;</span>;
                </div>
                <div className="text-gray-500">
                  {/* Backend + Frontend + AI */}
                  <span>{'// Backend + Frontend + AI'}</span>
                </div>
                <div className="text-purple-400">
                  <span className="text-blue-400">function</span>{' '}
                  <span className="text-yellow-400">solve</span>
                  <span className="text-white">(</span>
                  <span className="text-orange-400">problem</span>
                  <span className="text-white">) {'{'}</span>
                </div>
                <div className="pl-4 text-white">
                  <span className="text-blue-400">return</span> design
                  <span className="text-gray-400">.</span>
                  <span className="text-yellow-400">implement</span>
                  <span className="text-white">(</span>
                  <span className="text-orange-400">problem</span>
                  <span className="text-white">);</span>
                </div>
                <div className="text-white">{'}'}</div>
              </div>
            </div>

            {/* Sticky Note */}
            <div className="absolute -right-4 top-32 rotate-6 bg-yellow-400/90 backdrop-blur-sm p-4 rounded-lg shadow-xl w-48">
              <div className="font-handwriting text-gray-900 text-sm space-y-1">
                <p className="font-bold">Today&apos;s Focus</p>
                <p>✓ API Design</p>
                <p>✓ Data Pipeline</p>
                <p className="text-gray-700">→ User Flow</p>
              </div>
            </div>

            {/* Wireframe Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl mt-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-20 h-3 bg-purple-500/30 rounded" />
                  <div className="w-12 h-3 bg-purple-500/20 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-gray-700/30 rounded" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-12 bg-purple-500/20 rounded" />
                    <div className="h-12 bg-gray-700/30 rounded" />
                  </div>
                </div>
                <div className="pt-2 text-xs text-gray-500 text-center">
                  Wireframe Draft
                </div>
              </div>
            </div>

            {/* Purple Glow */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
