import { CaseStudiesSection } from '@/components/case-studies-section';
import { ContactForm } from '@/components/contact-form';
import { HeroSection } from '@/components/hero-section';
import { ProjectsSection } from '@/components/projects-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getAppUrls } from '@/lib/app-urls';

export default function HomePage() {
  const adminSettingsUrl = `${getAppUrls().admin.replace(/\/$/, '')}/settings`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ProjectsSection />
        <CaseStudiesSection />
        <ContactForm adminSettingsUrl={adminSettingsUrl} />
      </main>
      <SiteFooter />
    </div>
  );
}
