'use client';

import { Project } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      // Project가 변경될 때 이미지 상태 초기화
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedImageIndex(0);
      setImageErrors({});
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [project, onClose]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const canViewSite = project?.status === 'live' && project?.siteUrl;

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
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className={clsx(
                  'relative w-full max-w-5xl max-h-[90vh] overflow-y-auto',
                  'bg-gray-900 rounded-2xl',
                  'border border-gray-700',
                  'shadow-2xl'
                )}
              >
                {/* 닫기 버튼 */}
                <button
                  onClick={onClose}
                  className={clsx(
                    'sticky top-4 right-4 z-10 ml-auto mr-4 mt-4',
                    'p-2 rounded-lg',
                    'bg-gray-800 hover:bg-gray-700',
                    'text-gray-400 hover:text-white',
                    'transition-all'
                  )}
                >
                  <X size={24} />
                </button>

                {/* 모달 헤더 */}
                <div className="px-8 pb-6 border-b border-gray-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-purple-500">
                          {project.no}
                        </span>
                        <h2 className="text-3xl font-bold text-white">
                          {project.title}
                        </h2>
                      </div>
                      <p className="text-lg text-purple-300 mb-4">
                        {project.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-2">
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
                  {/* 프로젝트 이미지 */}
                  {project.images && project.images.length > 0 && (
                    <div className="space-y-4">
                      {/* 대표 이미지 */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800/50">
                        {!imageErrors[selectedImageIndex] ? (
                          <img
                            src={project.images[selectedImageIndex]}
                            alt={`${project.title} - ${selectedImageIndex + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(selectedImageIndex)}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-6xl opacity-20 mb-2">🖼️</div>
                              <p className="text-sm text-gray-600">
                                이미지 준비중
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 썸네일 리스트 */}
                      {project.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {project.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={clsx(
                                'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden',
                                'border-2 transition-all',
                                selectedImageIndex === index
                                  ? 'border-purple-500'
                                  : 'border-gray-700 hover:border-gray-600'
                              )}
                            >
                              {!imageErrors[index] ? (
                                <img
                                  src={image}
                                  alt={`${project.title} thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={() => handleImageError(index)}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                  <span className="text-xs">🖼️</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 프로젝트 개요 */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      프로젝트 개요
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* 주요 기능 */}
                  {project.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        주요 기능
                      </h3>
                      <ul className="space-y-2">
                        {project.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-gray-400 flex items-start gap-2"
                          >
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 프로젝트 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {project.period && (
                      <div>
                        <h4 className="text-sm text-gray-500 mb-2">기간</h4>
                        <p className="text-white">{project.period}</p>
                      </div>
                    )}
                    {project.role && (
                      <div className={project.period ? '' : 'md:col-span-2'}>
                        <h4 className="text-sm text-gray-500 mb-2">역할</h4>
                        <p className="text-white">{project.role}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">상태</h4>
                      <p className="text-white">
                        {project.status === 'live'
                          ? '운영중'
                          : project.status === 'preparing'
                          ? '준비중'
                          : '비공개'}
                      </p>
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  {project.techStack.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        기술 스택
                      </h3>
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
                  )}

                  {/* 기여 내용 */}
                  {project.contribution.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        기여 내용
                      </h3>
                      <ul className="space-y-2">
                        {project.contribution.map((item, index) => (
                          <li
                            key={index}
                            className="text-gray-400 flex items-start gap-2"
                          >
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                    {canViewSite ? (
                      <button
                        onClick={() => window.open(project.siteUrl, '_blank')}
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
                    ) : (
                      <button
                        disabled
                        className={clsx(
                          'flex-1 py-3 rounded-lg',
                          'bg-gray-700/30 text-gray-500',
                          'cursor-not-allowed',
                          'flex items-center justify-center gap-2'
                        )}
                      >
                        사이트 준비중
                      </button>
                    )}
                    {project.githubUrl && (
                      <button
                        onClick={() =>
                          window.open(project.githubUrl, '_blank')
                        }
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
