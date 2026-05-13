'use client';

import Image from 'next/image';
import { Project } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ExternalLink, X } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

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

  const modalImages = useMemo(() => {
    if (!project) {
      return [];
    }

    const images = project.images?.length ? project.images : [project.thumbnail];
    return images.slice(0, 6);
  }, [project]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const canViewSite = project?.status === 'live' && project?.siteUrl;
  const selectedImage = modalImages[selectedImageIndex];
  const visibleThumbnails = modalImages.slice(0, 4);
  const hiddenThumbnailCount = Math.max(
    modalImages.length - visibleThumbnails.length,
    0
  );

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/74 backdrop-blur-[2px]"
          />

          <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-8 sm:py-10">
            <div className="flex min-h-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.26 }}
                className={clsx(
                  'relative w-full max-w-[860px] overflow-hidden rounded-xl',
                  'border border-purple-400/70 bg-[#111522]/96',
                  'shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_42px_rgba(124,58,237,0.42)]'
                )}
              >
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="프로젝트 팝업 닫기"
                  className="absolute right-5 top-5 z-20 grid h-8 w-8 place-items-center rounded-md text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>

                <div className="grid gap-7 p-5 sm:p-6 lg:grid-cols-[320px_1fr] lg:p-7">
                  <div className="space-y-4">
                    <div className="relative aspect-[1.18] overflow-hidden rounded-md bg-gray-800/70">
                      {selectedImage && !imageErrors[selectedImageIndex] ? (
                        <Image
                          src={selectedImage}
                          alt={`${project.title} 대표 이미지`}
                          fill
                          sizes="(min-width: 1024px) 320px, 100vw"
                          className="object-cover"
                          onError={() => handleImageError(selectedImageIndex)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-sm text-gray-500">
                          이미지 준비중
                        </div>
                      )}
                    </div>

                    {visibleThumbnails.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {visibleThumbnails.map((image, index) => {
                          const isLastVisible =
                            index === visibleThumbnails.length - 1;
                          const showMore = isLastVisible && hiddenThumbnailCount > 0;

                          return (
                            <button
                              key={`${image}-${index}`}
                              type="button"
                              onClick={() => setSelectedImageIndex(index)}
                              aria-label={`${project.title} 이미지 ${index + 1} 보기`}
                              className={clsx(
                                'relative aspect-square overflow-hidden rounded-md border transition-all',
                                selectedImageIndex === index
                                  ? 'border-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.32)]'
                                  : 'border-white/12 hover:border-purple-300/60'
                              )}
                            >
                              {!imageErrors[index] ? (
                                <Image
                                  src={image}
                                  alt={`${project.title} 썸네일 ${index + 1}`}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                  onError={() => handleImageError(index)}
                                />
                              ) : (
                                <span className="grid h-full w-full place-items-center bg-gray-800 text-xs text-gray-500">
                                  준비중
                                </span>
                              )}
                              {showMore && (
                                <span className="absolute inset-0 grid place-items-center bg-black/55 text-sm font-semibold text-white">
                                  +{hiddenThumbnailCount}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 pt-1 lg:pr-2">
                    <div className="mb-4 flex items-center gap-3 pr-10">
                      <span className="text-lg font-semibold text-purple-400">
                        {project.no}
                      </span>
                      <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
                        {project.title}
                      </h2>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-white/10 px-2.5 py-1 text-[11px] font-medium text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-5">
                      <section>
                        <h3 className="mb-2 text-sm font-bold text-white">
                          프로젝트 개요
                        </h3>
                        <p className="text-sm leading-6 text-gray-300">
                          {project.description}
                        </p>
                      </section>

                      <div className="grid gap-5 md:grid-cols-[1fr_0.95fr]">
                        {project.features.length > 0 && (
                          <section>
                            <h3 className="mb-2 text-sm font-bold text-white">
                              주요 기능
                            </h3>
                            <ul className="space-y-1.5">
                              {project.features.slice(0, 5).map((feature) => (
                                <li
                                  key={feature}
                                  className="flex items-start gap-2 text-sm leading-5 text-gray-300"
                                >
                                  <Check
                                    size={14}
                                    className="mt-0.5 shrink-0 text-purple-400"
                                  />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        )}

                        <section>
                          <h3 className="mb-2 text-sm font-bold text-white">
                            프로젝트 정보
                          </h3>
                          <dl className="space-y-1.5 text-sm">
                            {project.period && (
                              <div className="grid grid-cols-[58px_1fr] gap-3">
                                <dt className="text-gray-500">기간</dt>
                                <dd className="text-gray-200">
                                  {project.period}
                                </dd>
                              </div>
                            )}
                            {project.role && (
                              <div className="grid grid-cols-[58px_1fr] gap-3">
                                <dt className="text-gray-500">역할</dt>
                                <dd className="text-gray-200">
                                  {project.role}
                                </dd>
                              </div>
                            )}
                            {project.techStack.length > 0 && (
                              <div className="grid grid-cols-[58px_1fr] gap-3">
                                <dt className="text-gray-500">기술 스택</dt>
                                <dd className="text-gray-200">
                                  {project.techStack.slice(0, 5).join(', ')}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </section>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="h-10 min-w-36 rounded-md border border-white/16 px-6 text-sm font-medium text-gray-200 transition-colors hover:border-white/30 hover:bg-white/5"
                      >
                        닫기
                      </button>
                      {canViewSite ? (
                        <button
                          type="button"
                          onClick={() => window.open(project.siteUrl, '_blank')}
                          className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-violet-500 to-purple-700 px-6 text-sm font-semibold text-white shadow-[0_0_22px_rgba(124,58,237,0.34)] transition-opacity hover:opacity-95"
                        >
                          사이트 보기
                          <ExternalLink size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="h-10 min-w-36 cursor-not-allowed rounded-md bg-white/8 px-6 text-sm font-medium text-gray-500"
                        >
                          사이트 준비중
                        </button>
                      )}
                    </div>
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
