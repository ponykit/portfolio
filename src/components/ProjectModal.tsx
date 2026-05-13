'use client';

import { Project } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import clsx from 'clsx';
import { useEffect } from 'react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* 모달 */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className={clsx(
                  'relative w-full max-w-4xl',
                  'bg-gray-900 rounded-2xl',
                  'border border-gray-700',
                  'shadow-2xl'
                )}
              >
                {/* 닫기 버튼 */}
                <button
                  onClick={onClose}
                  className={clsx(
                    'absolute top-4 right-4 z-10',
                    'p-2 rounded-lg',
                    'bg-gray-800 hover:bg-gray-700',
                    'text-gray-400 hover:text-white',
                    'transition-all'
                  )}
                >
                  <X size={24} />
                </button>

                {/* 모달 헤더 */}
                <div className="p-8 border-b border-gray-800">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-purple-500">
                          {project.id}
                        </span>
                        <h2 className="text-3xl font-bold text-white">
                          {project.title}
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 모달 바디 */}
                <div className="p-8 space-y-8">
                  {/* 프로젝트 이미지들 */}
                  <div className="grid grid-cols-2 gap-4">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className={clsx(
                          'relative aspect-[4/3] rounded-lg overflow-hidden',
                          'bg-gray-800/50',
                          index === 0 && 'col-span-2'
                        )}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl opacity-20">🖼️</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 프로젝트 설명 */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">프로젝트 설명</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {project.detailDescription}
                    </p>
                  </div>

                  {/* 프로젝트 정보 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">기간</h4>
                      <p className="text-white">{project.duration}</p>
                    </div>
                    {project.client && (
                      <div>
                        <h4 className="text-sm text-gray-500 mb-2">클라이언트</h4>
                        <p className="text-white">{project.client}</p>
                      </div>
                    )}
                    <div className={project.client ? '' : 'col-span-2'}>
                      <h4 className="text-sm text-gray-500 mb-2">역할</h4>
                      <p className="text-white">{project.role}</p>
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">기술 스택</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className={clsx(
                            'px-4 py-2 rounded-lg',
                            'bg-gray-800 text-gray-300',
                            'border border-gray-700',
                            'text-sm'
                          )}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={onClose}
                      className={clsx(
                        'flex-1 py-3 rounded-lg',
                        'bg-gray-800 text-white',
                        'hover:bg-gray-700',
                        'transition-colors'
                      )}
                    >
                      닫기
                    </button>
                    {project.demoUrl && (
                      <button
                        onClick={() => window.open(project.demoUrl, '_blank')}
                        className={clsx(
                          'flex-1 py-3 rounded-lg',
                          'bg-purple-600 text-white',
                          'hover:bg-purple-700',
                          'transition-colors',
                          'flex items-center justify-center gap-2'
                        )}
                      >
                        사이트 보기
                        <ExternalLink size={18} />
                      </button>
                    )}
                    {project.githubUrl && (
                      <button
                        onClick={() => window.open(project.githubUrl, '_blank')}
                        className={clsx(
                          'py-3 px-6 rounded-lg',
                          'bg-gray-800 text-white',
                          'hover:bg-gray-700',
                          'transition-colors',
                          'flex items-center gap-2'
                        )}
                      >
                        <FaGithub size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
