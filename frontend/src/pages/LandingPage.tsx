import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { AboutStatsSection } from '../components/landing/AboutStatsSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans selection:bg-purple-500/30">
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
