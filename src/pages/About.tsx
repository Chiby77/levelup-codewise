
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-accent mb-6 animate-fadeIn">About Us</h1>
          
          <div className="prose prose-lg mb-12 animate-fadeIn">
            <p className="text-lg text-gray-300 mb-6">
              We are dedicated to bringing quality Computer Science education to students across Zimbabwe. 
              Our team of experienced educators specializes in A Level Computer Science, making complex 
              programming concepts accessible and engaging for all students.
            </p>
          </div>

          <div className="bg-[#111] rounded-lg p-8 shadow-lg border border-accent/20 mb-12 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-accent mb-4">Our Story</h2>
            <p className="text-gray-300">
              A Level Computer Science Experts started as a humble WhatsApp group in Masvingo, 
              initiated by Brave Machangu as what began as a casual endeavor. What started as a 
              simple idea soon blossomed into something much bigger, expanding to serve students 
              across the whole of Zimbabwe. Through the dedicated efforts of L Chenyika, J Mapasure, 
              and T Chibi, it has evolved into Zimbabwe's premier destination for computer science 
              education and career guidance.
            </p>
          </div>

          <div className="bg-[#111] rounded-lg p-8 shadow-lg border border-accent/20 mb-12 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-accent mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent via-[#8B5CF6] to-[#D946EF] p-1 mb-4">
                  <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-accent">TC</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">T Chibi</h3>
                <p className="text-accent/80 mb-2">Lead Educator</p>
                <p className="text-gray-400 text-sm">Programming & Algorithm Specialist</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent via-[#8B5CF6] to-[#D946EF] p-1 mb-4">
                  <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-accent">JM</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">J Mapesure</h3>
                <p className="text-accent/80 mb-2">Senior Educator</p>
                <p className="text-gray-400 text-sm">Theory & Systems Architecture</p>
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
  );
};

export default About;
