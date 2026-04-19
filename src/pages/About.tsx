import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import aboutBackground from "@/assets/about-bg.jpg";
import tinodaisheChibi from "@/assets/tinodaishe-chibi.jpg";
import { Briefcase, GraduationCap, Heart, Users, Building2 } from "lucide-react";

const About = () => {
  const teachingLocations = [
    {
      city: "Harare",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      description: "Interactive programming workshops in the capital city",
    },
    {
      city: "Bulawayo",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      description: "Hands-on coding sessions with local students",
    },
    {
      city: "Mutare",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      description: "Teaching advanced programming concepts",
    },
  ];

  return (
    <div className="min-h-screen relative text-foreground overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${aboutBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-background/95 to-primary/80" />
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-8 animate-fadeIn text-center">
              About Bluewave Academy
            </h1>

            <div className="text-center mb-8 animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-primary">
                  <strong>Bluewave Academy</strong> · Powered by Bluewave Technologies
                </span>
              </div>
            </div>

            <div className="bg-card/60 backdrop-blur rounded-2xl p-8 shadow-elegant border border-primary/30 mb-12 animate-fadeIn">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-1 w-12 bg-gradient-hero rounded-full"></div>
                    <h2 className="text-3xl font-bold text-foreground">Meet Our Founder</h2>
                  </div>
                  <h3 className="text-2xl font-semibold text-primary mb-2">Tinodaishe M. Chibi</h3>

                  <div className="space-y-3 text-muted-foreground mb-6">
                    {[
                      { icon: Building2, title: "Co-founder & CEO of Bluewave Technologies", subtitle: "Powering Bluewave Academy" },
                      { icon: Briefcase, title: "CEO of Intellix Inc", subtitle: "Leading innovation in educational technology" },
                      { icon: Heart, title: "Founder of Bluewave Academy", subtitle: "Making quality computer science education accessible" },
                      { icon: GraduationCap, title: "BTech Software Engineering Student", subtitle: "Harare Institute of Technology (HIT)" },
                    ].map(({ icon: Icon, title, subtitle }) => (
                      <div key={title} className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{title}</p>
                          <p className="text-sm text-muted-foreground">{subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    Tinodaishe's vision is to democratize computer science education across Zimbabwe, empowering the next generation of
                    tech innovators through accessible, high-quality learning resources and mentorship.
                  </p>
                </div>

                <div className="order-1 md:order-2 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
                    <img
                      src={tinodaisheChibi}
                      alt="Tinodaishe M. Chibi"
                      className="relative rounded-2xl shadow-elegant w-full max-w-sm object-cover border-4 border-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/60 backdrop-blur rounded-lg p-8 shadow-elegant border border-primary/20 mb-12 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-primary mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                What started as a vision has blossomed into Zimbabwe's premier destination for computer science education. Through the
                dedicated efforts of Tinodaishe M. Chibi, J Mapasure, and the entire team, Bluewave Academy has evolved into a
                comprehensive platform serving students across the whole of Zimbabwe, providing cutting-edge education, career guidance,
                and digital examination systems.
              </p>
            </div>

            <div className="bg-card/60 backdrop-blur rounded-lg p-8 shadow-elegant border border-primary/20 mb-12 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                <Users className="h-6 w-6" />
                Our Expert Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    initials: "TC",
                    name: "Tinodaishe M. Chibi",
                    role: "Founder & Lead Educator",
                    edu: "BTech Software Engineering - HIT",
                    desc: "Programming & Algorithm Specialist. Co-founder & CEO of Bluewave Technologies, CEO of Intellix Inc, and Founder of Bluewave Academy.",
                  },
                  {
                    initials: "JM",
                    name: "J Mapasure (Jadyen)",
                    role: "Senior Educator",
                    edu: "BSc Machine Learning & AI - UZ",
                    desc: "Theory & Systems Architecture Expert. Specializing in AI and advanced computing concepts.",
                  },
                ].map((m) => (
                  <div key={m.name} className="bg-card/40 rounded-lg p-6 border border-primary/10 hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-hero p-1 flex-shrink-0">
                        <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">{m.initials}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1 text-foreground">{m.name}</h3>
                        <p className="text-primary mb-2 font-medium">{m.role}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>{m.edu}</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-primary mb-8 animate-fadeIn">Our Teaching Journey Across Zimbabwe</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachingLocations.map((location, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-glow transition-shadow animate-fadeIn bg-card/40 border-primary/10"
                >
                  <img
                    src={location.image}
                    alt={`Teaching in ${location.city}`}
                    className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-primary">{location.city}</h3>
                    <p className="text-muted-foreground">{location.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-card/60 backdrop-blur rounded-lg p-8 shadow-elegant border border-primary/20 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-primary mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To empower Zimbabwean students with the knowledge and skills needed to excel in Computer Science, fostering innovation
                and technological advancement across the nation.
              </p>
            </div>

            <div className="mt-12 bg-card/60 backdrop-blur rounded-lg p-8 shadow-elegant border border-primary/20 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-primary mb-4">Programmes We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card/40 p-6 rounded-lg border border-primary/10">
                  <h3 className="text-xl font-semibold mb-3 text-primary">A Level Computer Science</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Theory and practical exam preparation</li>
                    <li>Programming fundamentals</li>
                    <li>Past paper review sessions</li>
                    <li>One-on-one tutoring</li>
                  </ul>
                </div>
                <div className="bg-card/40 p-6 rounded-lg border border-primary/10">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Career Development</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>University application guidance</li>
                    <li>Career path exploration</li>
                    <li>Portfolio development</li>
                    <li>Work experience opportunities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-card/60 backdrop-blur rounded-lg p-8 shadow-elegant border border-primary/20 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-primary mb-4">Location</h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-primary/20">
                <iframe
                  src="https://maps.app.goo.gl/yMY8dqBXFpkc5ALB6"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bluewave Academy Location"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            <div className="mt-16 text-center text-muted-foreground">
              <p className="text-sm">© 2026 Bluewave Academy · Powered by Bluewave Technologies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
