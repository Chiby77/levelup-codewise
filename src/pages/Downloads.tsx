import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Downloads = () => {
  const { toast } = useToast();

  const theory_papers = [
    { year: "2023", link: "https://www.mediafire.com/file/7t4ok30r5fcm5rq/Computer_Science_MS2023_1-Edited.pdf/file" },
    { year: "2022", link: "https://www.mediafire.com/file/ynzwanlu9y0atry/A_LEVEL_COMP_SCIE_2022_P1_MS.pdf/file" },
    { year: "2021", link: "https://www.mediafire.com/file/bt0ziv07o2ubgk4/2021_bluebook_Computer_Science.pdf/file" },
    { year: "2020", link: "https://www.mediafire.com/file/u21z60w1hgdyya8/2020_paper_1.pdf/file" },
    { year: "2019", link: "https://www.mediafire.com/file/70ovlmxfpwmgix3/2019_paper_1.pdf/file" },
    { year: "2018", link: "https://www.mediafire.com/file/kc8mbjqwmzkznoy/2018_paper_1.pdf/file" },
    { year: "2017", link: "https://www.mediafire.com/file/10dfw9r7fn4jmlr/2017_paper_1.pdf/file" },
    { year: "2016", link: "https://www.mediafire.com/file/j202ce5mgdri8c0/2016_paper_1.pdf/file" },
    { year: "2015", link: "https://www.mediafire.com/file/vvlblbuawfxbfcw/2015_paper1.pdf/file" },
  ];

  const practical_papers = [
    { year: "2023", link: "https://www.mediafire.com/file/dqv7qvajuewn9yi/6023_2023_2_CYBERWAVE_MS.pdf/file" },
    { year: "2022", link: "https://www.mediafire.com/file/2ty2uux3z759i1z/Computer_Science_Paper_2_2022.pdf/file" },
    { year: "2021", link: "https://www.mediafire.com/file/hnded91agzg2gjm/Computer_Science_6023-2_2021.pdf/file" },
    { year: "2020", link: "https://www.mediafire.com/file/hotm1dd3sbu2awq/2020_paper_2.pdf/file" },
    { year: "2019", link: "https://www.mediafire.com/file/ets75idtd2syutb/2019_paper_2.pdf/file" },
    { year: "2018", link: "https://www.mediafire.com/file/z41u3ahebs7oqk6/2018_paper_2.pdf/file" },
    { year: "2018 Specimen", link: "https://www.mediafire.com/file/mdypgh22bwi5gb6/2018_paper_2_specimen-1.pdf/file" },
    { year: "2017", link: "https://www.mediafire.com/file/6p9r59bta2ni48y/2017_paper_2.pdf/file" },
  ];

  const programming_notes = [
    { part: "1", link: "https://www.mediafire.com/file/sm6mju7lumr2pzr/PROGRAMMING_PART_1.pdf/file" },
    { part: "2", link: "https://www.mediafire.com/file/8n8x77e172pmm0x/PROGRAMMING_PART_2.pdf/file" },
    { part: "3", link: "https://www.mediafire.com/file/lix0pihvmewndyi/Programming_Part_3.pdf/file" },
    { part: "4", link: "https://www.mediafire.com/file/x21isg79y8w3qo0/programming_part_4.pdf/file" },
    { part: "5", link: "https://www.mediafire.com/file/emvommfbnojk8ai/Programming_part_5%2528pure_coding_revision%2529.pdf/file" },
    { part: "6", link: "#" },
    { part: "7", link: "https://www.mediafire.com/file/9l0r7qpjqc14hnq/programming_part_7.pdf/file" },
    { part: "8", link: "https://www.mediafire.com/file/drhmgbatfp4qe7j/programming_part_8.pdf/file" },
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
