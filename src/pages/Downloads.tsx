import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Downloads = () => {
  const { toast } = useToast();

  const theory_papers = [
    { year: "2023", link: "#" },
    { year: "2022", link: "#" },
    { year: "2021", link: "#" },
    { year: "2020", link: "#" },
    { year: "2019", link: "#" },
    { year: "2018", link: "#" },
  ];

  const practical_papers = [
    { year: "2023", link: "#" },
    { year: "2022", link: "#" },
    { year: "2021", link: "#" },
    { year: "2020", link: "#" },
    { year: "2019", link: "#" },
    { year: "2018", link: "#" },
  ];

  const programming_notes = [
    { part: "1", link: "#" },
    { part: "2", link: "#" },
    { part: "3", link: "#" },
    { part: "4", link: "#" },
    { part: "5", link: "#" },
    { part: "6", link: "#" },
    { part: "7", link: "#" },
    { part: "8", link: "#" },
  ];

  const handleDownload = (type: string, identifier: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${type} ${identifier}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 space-y-8">
        <h1 className="text-4xl font-bold text-primary mb-6">Study Resources</h1>

        {/* Theory Papers Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Paper 1 (Theory) Past Papers
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theory_papers.map((paper) => (
              <Button
                key={paper.year}
                variant="outline"
                className="w-full"
                onClick={() => handleDownload("Theory Paper", paper.year)}
              >
                <Download className="mr-2 h-4 w-4" />
                {paper.year} Paper 1
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Practical Papers Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-6 w-6" />
              Paper 2 (Practical) Past Papers
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {practical_papers.map((paper) => (
              <Button
                key={paper.year}
                variant="outline"
                className="w-full"
                onClick={() => handleDownload("Practical Paper", paper.year)}
              >
                <Download className="mr-2 h-4 w-4" />
                {paper.year} Paper 2
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Programming Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Programming Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {programming_notes.map((note) => (
              <Button
                key={note.part}
                variant="outline"
                className="w-full"
                onClick={() => handleDownload("Programming Notes Part", note.part)}
              >
                <Download className="mr-2 h-4 w-4" />
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