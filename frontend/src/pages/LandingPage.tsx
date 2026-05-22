import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { AboutStatsSection } from '../components/landing/AboutStatsSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-resend-canvas text-resend-ink font-sans selection:bg-resend-accent-blue-glow selection:text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutStatsSection />
      </main>
      <LandingFooter />
    </div>
  );
}
