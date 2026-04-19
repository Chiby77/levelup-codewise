import Navbar from "@/components/Navbar";
import NextGenHero from "@/components/NextGenHero";
import ModernStatsSection from "@/components/ModernStatsSection";
import EnhancedFeatureSection from "@/components/EnhancedFeatureSection";
import { BluewaveAcademyPromo } from "@/components/BluewaveAcademyPromo";
import { MbuyaZivaiPromo } from "@/components/MbuyaZivaiPromo";
import FloatingChatButton from "@/components/FloatingChatButton";
import { Waves } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <NextGenHero />
      <ModernStatsSection />
      <div className="container mx-auto px-4">
        <BluewaveAcademyPromo />
      </div>
      <MbuyaZivaiPromo />
      <EnhancedFeatureSection />

      {/* Footer */}
      <footer className="py-10 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-primary p-1.5 rounded-md">
                <Waves className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Bluewave Academy</span>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>© 2026 Bluewave Technologies. All rights reserved.</p>
              <p className="mt-0.5">Co-founder &amp; CEO: Tinodaishe M. Chibi</p>
            </div>
          </div>
        </div>
      </footer>

      <FloatingChatButton />
    </div>
  );
};

export default Index;
