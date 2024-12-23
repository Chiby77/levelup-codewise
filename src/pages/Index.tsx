import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MbuyaZivai from "@/components/MbuyaZivai";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <MbuyaZivai />
      </div>
    </div>
  );
};

export default Index;