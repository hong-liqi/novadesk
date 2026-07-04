import { CaseStudiesSection } from '@/components/case-studies-section';
import { ContactForm } from '@/components/contact-form';
import { HeroSection } from '@/components/hero-section';
import { ProjectsSection } from '@/components/projects-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ProjectsSection />
        <CaseStudiesSection />
        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}
