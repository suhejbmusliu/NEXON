import SmoothScroll from '@/components/layout/SmoothScroll';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SceneRoot from '@/components/scene/SceneRoot';
import ScrollProgress from '@/components/ui/ScrollProgress';
import HeroSection from '@/components/sections/01-Hero/HeroSection';
import ChipSection from '@/components/sections/02-ChipBreakdown/ChipSection';
import BodySection from '@/components/sections/03-Body/BodySection';
import MovementSection from '@/components/sections/04-Movement/MovementSection';
import FutureSection from '@/components/sections/05-Future/FutureSection';

export default function Page() {
  return (
    <SmoothScroll>
      <SceneRoot />
      <ScrollProgress />
      <NavBar />
      <main className="pointer-events-none relative z-10">
        <HeroSection />
        <ChipSection />
        <BodySection />
        <MovementSection />
        <FutureSection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
