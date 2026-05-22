import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-resend-canvas text-resend-ink font-sans selection:bg-resend-accent-blue-glow selection:text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}
