import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MbuyaZivai from "@/components/MbuyaZivai";

const Downloads = () => {
  const { toast } = useToast();

  const theory_papers = [
    { year: "2021", link: "https://example.com/theory_2021.pdf" },
    { year: "2020", link: "https://example.com/theory_2020.pdf" },
    { year: "2019", link: "https://example.com/theory_2019.pdf" },
  ];

  const practical_papers = [
    { year: "2021", link: "https://example.com/practical_2021.pdf" },
    { year: "2020", link: "https://example.com/practical_2020.pdf" },
    { year: "2019", link: "https://example.com/practical_2019.pdf" },
  ];

  const programming_notes = [
    { part: "1", link: "https://example.com/programming_notes_part1.pdf" },
    { part: "2", link: "https://example.com/programming_notes_part2.pdf" },
    { part: "3", link: "https://example.com/programming_notes_part3.pdf" },
  ];

  const handleDownload = (link: string, type: string, identifier: string) => {
    if (link === "#") {
      toast({
        title: "Not Available",
        description: "This resource is currently not available.",
        variant: "destructive",
      });
      return;
    }
    
    window.open(link, "_blank");
    toast({
      title: "Download Started",
      description: `${type} ${identifier} will begin downloading shortly.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Resources</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Theory Papers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {theory_papers.map((paper) => (
                  <Button
                    key={paper.year}
                    onClick={() => handleDownload(paper.link, "Theory Paper", paper.year)}
                    variant="outline"
                    className="w-full"
                  >
                    {paper.year}
                  </Button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Practical Papers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {practical_papers.map((paper) => (
                  <Button
                    key={paper.year}
                    onClick={() => handleDownload(paper.link, "Practical Paper", paper.year)}
                    variant="outline"
                    className="w-full"
                  >
                    {paper.year}
                  </Button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Programming Notes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {programming_notes.map((note) => (
                  <Button
                    key={note.part}
                    onClick={() => handleDownload(note.link, "Programming Notes Part", note.part)}
                    variant="outline"
                    className="w-full"
                  >
                    Part {note.part}
                  </Button>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
              <MbuyaZivai />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
