'use client';

import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import TechStackSection from '@/components/TechStackSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070A12] text-white">
      <HeroSection />
      <ProjectsSection />
      <TechStackSection />
      <ContactSection />
    </main>
  );
}
