import Navbar from "@/components/Navbar";
import NextGenHero from "@/components/NextGenHero";
import ModernStatsSection from "@/components/ModernStatsSection";
import EnhancedFeatureSection from "@/components/EnhancedFeatureSection";
import { BluewaveAcademyPromo } from "@/components/BluewaveAcademyPromo";
import { MbuyaZivaiPromo } from "@/components/MbuyaZivaiPromo";
import FloatingChatButton from "@/components/FloatingChatButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <NextGenHero />
      <div className="container mx-auto px-4">
        <BluewaveAcademyPromo />
      </div>
      <MbuyaZivaiPromo />
      <ModernStatsSection />
      <EnhancedFeatureSection />
      
      {/* Footer */}
      <footer className="py-8 border-t bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Bluewave Technologies. All rights reserved.</p>
          <p className="mt-1">Co-founder & CEO: Tinodaishe M. Chibi</p>
        </div>
      </footer>
      
      <FloatingChatButton />
    </div>
  );
};

export default Index;
