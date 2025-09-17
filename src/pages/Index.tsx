
import Navbar from "@/components/Navbar";
import NextGenHero from "@/components/NextGenHero";
import ModernStatsSection from "@/components/ModernStatsSection";
import EnhancedFeatureSection from "@/components/EnhancedFeatureSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <NextGenHero />
      <ModernStatsSection />
      <EnhancedFeatureSection />
    </div>
  );
};

export default Index;
