
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import aboutBackground from "@/assets/about-bg.jpg";
import tinodaisheChibi from "@/assets/tinodaishe-chibi.jpg";
import { Briefcase, GraduationCap, Heart, MapPin, Users } from "lucide-react";

const About = () => {
  const teachingLocations = [
    {
      city: "Harare",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      description: "Interactive programming workshops in the capital city"
    },
    {
      city: "Bulawayo",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      description: "Hands-on coding sessions with local students"
    },
    {
      city: "Mutare",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      description: "Teaching advanced programming concepts"
    }
  ];

  return (
    <div className="min-h-screen relative text-foreground overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${aboutBackground})` }}
      />
      <div className="absolute inset-0 bg-background/90" />
      <div className="relative z-10">
        <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent mb-8 animate-fadeIn text-center">About Us</h1>
          
          {/* Founder Section */}
          <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] rounded-2xl p-8 shadow-2xl border border-accent/30 mb-12 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                  <h2 className="text-3xl font-bold text-white">Meet Our Founder</h2>
                </div>
                <h3 className="text-2xl font-semibold text-accent mb-2">Tinodaishe M. Chibi</h3>
                
                <div className="space-y-3 text-gray-300 mb-6">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">CEO of Intellix Inc</p>
                      <p className="text-sm text-gray-400">Leading innovation in educational technology</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Founder of Bluewave Academy</p>
                      <p className="text-sm text-gray-400">Powering CS Experts - Making quality computer science education accessible</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">BTech Software Engineering Student</p>
                      <p className="text-sm text-gray-400">Harare Institute of Technology (HIT)</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  Tinodaishe's vision is to democratize computer science education across Zimbabwe, 
                  empowering the next generation of tech innovators through accessible, high-quality 
                  learning resources and mentorship.
                </p>
              </div>
              
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-secondary rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
                  <img 
                    src={tinodaisheChibi} 
                    alt="Tinodaishe M. Chibi" 
                    className="relative rounded-2xl shadow-2xl w-full max-w-sm object-cover border-4 border-accent/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] rounded-lg p-8 shadow-lg border border-accent/20 mb-12 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-accent mb-4">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              What started as a vision has blossomed into Zimbabwe's premier destination for computer science 
              education. Through the dedicated efforts of Tinodaishe M. Chibi, J Mapasure, and the entire team, 
              CS Experts has evolved into a comprehensive platform serving students across the whole of Zimbabwe, 
              providing cutting-edge education, career guidance, and digital examination systems.
            </p>
          </div>

          <div className="bg-[#111] rounded-lg p-8 shadow-lg border border-accent/20 mb-12 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-accent mb-6 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Our Expert Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-accent/10 hover:border-accent/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent via-[#8B5CF6] to-[#D946EF] p-1 flex-shrink-0">
                    <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">TC</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">Tinodaishe M. Chibi</h3>
                    <p className="text-accent/80 mb-2 font-medium">Founder & Lead Educator</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>BTech Software Engineering - HIT</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Programming & Algorithm Specialist. CEO of Intellix Inc and Founder of Bluewave Academy.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-accent/10 hover:border-accent/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent via-[#8B5CF6] to-[#D946EF] p-1 flex-shrink-0">
                    <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">JM</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">J Mapasure (Jadyen)</h3>
                    <p className="text-accent/80 mb-2 font-medium">Senior Educator</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>BSc Machine Learning & AI - UZ</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Theory & Systems Architecture Expert. Specializing in AI and advanced computing concepts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-accent mb-8 animate-fadeIn">
            Our Teaching Journey Across Zimbabwe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachingLocations.map((location, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-accent/10 transition-shadow animate-fadeIn bg-[#111] border-accent/10">
                <img 
                  src={location.image} 
                  alt={`Teaching in ${location.city}`} 
                  className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-accent">{location.city}</h3>
                  <p className="text-gray-300">{location.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-[#111] rounded-lg p-8 shadow-lg border border-accent/20 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-accent mb-4">Our Mission</h2>
            <p className="text-gray-300">
              To empower Zimbabwean students with the knowledge and skills needed to excel in 
              Computer Science, fostering innovation and technological advancement across the nation.
            </p>
          </div>

          <div className="mt-12 bg-[#111] rounded-lg p-8 shadow-lg border border-accent/20 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-accent mb-4">Programmes We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-accent/10">
                <h3 className="text-xl font-semibold mb-3 text-accent">A Level Computer Science</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Theory and practical exam preparation</li>
                  <li>Programming fundamentals</li>
                  <li>Past paper review sessions</li>
                  <li>One-on-one tutoring</li>
                </ul>
              </div>
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-accent/10">
                <h3 className="text-xl font-semibold mb-3 text-accent">Career Development</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>University application guidance</li>
                  <li>Career path exploration</li>
                  <li>Portfolio development</li>
                  <li>Work experience opportunities</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[#111] rounded-lg p-8 shadow-lg border border-accent/20 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-accent mb-4">Location</h2>
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe 
                src="https://maps.app.goo.gl/yMY8dqBXFpkc5ALB6" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="CS Experts Location"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default About;
