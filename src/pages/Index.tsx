import Navbar from "@/components/Navbar";
import NextGenHero from "@/components/NextGenHero";
import ModernStatsSection from "@/components/ModernStatsSection";
import EnhancedFeatureSection from "@/components/EnhancedFeatureSection";
import { BluewaveAcademyPromo } from "@/components/BluewaveAcademyPromo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <NextGenHero />
      <div className="container mx-auto px-4">
        <BluewaveAcademyPromo />
      </div>
      <ModernStatsSection />
      <EnhancedFeatureSection />
    </div>
  );
};

export default Index;
