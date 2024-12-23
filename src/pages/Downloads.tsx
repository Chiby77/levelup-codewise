import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

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

  const handleDownload = (link: string, type: string) => {
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
      description: `Your ${type} download should begin shortly.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Downloads</h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Theory Papers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {theory_papers.map((paper) => (
              <Button
                key={paper.year}
                onClick={() => handleDownload(paper.link, `${paper.year} Theory Paper`)}
                variant="outline"
                className="w-full"
              >
                {paper.year} Paper
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practical Papers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {practical_papers.map((paper) => (
              <Button
                key={paper.year}
                onClick={() => handleDownload(paper.link, `${paper.year} Practical Paper`)}
                variant="outline"
                className="w-full"
              >
                {paper.year} Paper
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Programming Notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {programming_notes.map((note) => (
              <Button
                key={note.part}
                onClick={() => handleDownload(note.link, `Programming Notes Part ${note.part}`)}
                variant="outline"
                className="w-full"
              >
                Part {note.part}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Downloads;
