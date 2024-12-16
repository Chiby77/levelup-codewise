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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6 animate-fadeIn">About Us</h1>
          
          <div className="prose prose-lg mb-12 animate-fadeIn">
            <p className="text-lg text-gray-700 mb-6">
              We are dedicated to bringing quality Computer Science education to students across Zimbabwe. 
              Our team of experienced educators specializes in A Level Computer Science, making complex 
              programming concepts accessible and engaging for all students.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-primary mb-8 animate-fadeIn">
            Our Teaching Journey Across Zimbabwe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachingLocations.map((location, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow animate-fadeIn">
                <img 
                  src={location.image} 
                  alt={`Teaching in ${location.city}`} 
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{location.city}</h3>
                  <p className="text-gray-600">{location.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-lg p-8 shadow-sm animate-fadeIn">
            <h2 className="text-2xl font-semibold text-primary mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To empower Zimbabwean students with the knowledge and skills needed to excel in 
              Computer Science, fostering innovation and technological advancement across the nation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;