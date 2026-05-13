'use client';

import { useState } from 'react';
import { projects } from '@/data/projects';
import { contactInfo, techStack } from '@/data/contact';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { Project } from '@/types/project';
import { motion } from 'framer-motion';
import { Mail, Phone, Code2 } from 'lucide-react';
import { FaInstagram, FaGithub } from 'react-icons/fa';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* 히어로 섹션 */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-6"
          >
            <div className="space-y-4">
              <p className="text-purple-400 text-lg flex items-center gap-2">
                <Code2 size={20} />
                Hello, I&apos;m ✨
              </p>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white">
                Your Name
              </h1>
              <p className="text-2xl text-gray-300">Designer & Developer</p>
            </div>

            <p className="text-gray-400 max-w-2xl leading-relaxed">
              사용자의 경험을 가치있게 만드는 디자인과
              <br />
              효율적인 코드로 작업하는 개발자입니다.
            </p>

            <div className="flex gap-8 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-400">
                  <Code2 className="text-purple-400" size={24} />
                  <span className="text-3xl font-bold text-white">3+</span>
                </div>
                <p className="text-sm text-gray-500">Years Experience</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="text-purple-400 text-2xl">📁</div>
                  <span className="text-3xl font-bold text-white">12+</span>
                </div>
                <p className="text-sm text-gray-500">Completed Projects</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 프로젝트 섹션 */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-purple-400 text-sm uppercase tracking-wider mb-4">
              MY PROJECTS
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              프로젝트 한눈에 보기
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              지금까지 다양한 프로젝트를 통해 쌓은 경험을 통해 새로운
              <br />
              가치를 만들어내고 있습니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">TECH STACK</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="text-5xl group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 연락처 섹션 */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              함께 멋진 결과를 만들어보시죠! 👋
            </h2>
            <p className="text-gray-400">
              새로운 프로젝트나 협업에 대한 문의는 언제나 환영입니다
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
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Phone className="text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-white">{contactInfo.phone}</p>
                </div>
              </a>

              {contactInfo.instagram && (
                <a
                  href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <FaInstagram className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Instagram</p>
                    <p className="text-white">{contactInfo.instagram}</p>
                  </div>
                </a>
              )}

              {contactInfo.github && (
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
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = `mailto:${contactInfo.email}`}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                문의하기 →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 Your Name. All rights reserved.</p>
        </div>
      </footer>

      {/* 프로젝트 모달 */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}
