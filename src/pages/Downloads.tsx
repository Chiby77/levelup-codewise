
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, File, BookOpen, Code, Database, Braces } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import downloadsBackground from "@/assets/downloads-bg.jpg";

const Downloads = () => {
  const { toast } = useToast();
  const [downloadInProgress, setDownloadInProgress] = useState<string | null>(null);

  const theory_papers = [
    { year: "2025 P1 MS", link: "https://drive.google.com/file/d/1VDD_ohIIsnHs6bIWkYt9DnqYykhAgi2B/view?usp=sharing" },
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
    { part: "3B", link: "https://drive.google.com/file/d/1e_QWZC9aSYoVE70UB_Mk4Jh3TfMQtd96/view?usp=sharing" },
    { part: "4", link: "https://www.mediafire.com/file/x21isg79y8w3qo0/programming_part_4.pdf/file" },
    { part: "5", link: "https://www.mediafire.com/file/emvommfbnojk8ai/Programming_part_5%2528pure_coding_revision%2529.pdf/file" },
    { part: "7", link: "https://www.mediafire.com/file/9l0r7qpjqc14hnq/programming_part_7.pdf/file" },
    { part: "7B", link: "https://drive.google.com/file/d/1Cftnuiym3Dz9lLaj7l0m75nZbR-B5l2U/view?usp=sharing" },
    { part: "8", link: "https://www.mediafire.com/file/drhmgbatfp4qe7j/programming_part_8.pdf/file" },
    { part: "9", link: "https://drive.google.com/file/d/1g27E94rbIYrAIHE_zagnWWzY8L03MEKe/view?usp=sharing" },
    { part: "10", link: "https://drive.google.com/file/d/15O6h21gjQjEpDlJ1ZnoEY6N39RgS0PVF/view?usp=sharing" },
  ];

  const special_resources = [
    { 
      title: "Upper 6 Computer Science", 
      link: "https://drive.google.com/file/d/1qE5fM9z6Y8lHvzRtXu7D77CN3wFmbmhM/view?usp=sharing",
      category: "Textbook",
      icon: BookOpen
    },
    { 
      title: "CODES BIBLE (Updated April 2021)", 
      link: "https://drive.google.com/file/d/1ox2_Ut6ysQZHC9L87HT78suuVY3OkClZ/view?usp=sharing",
      category: "Reference",
      icon: Code
    },
    { 
      title: "String Manipulation Q&S", 
      link: "https://drive.google.com/file/d/1ZhHeAPIGxg_c8RV33sI90mvInNY94whx/view?usp=sharing",
      category: "Examples",
      icon: Code
    },
    { 
      title: "Python eBook 3.0", 
      link: "https://drive.google.com/file/d/1HTjHYUAl5QVxGHadMIP5pOsxjDk6IkzV/view?usp=sharing",
      category: "Python",
      icon: Braces
    },
    { 
      title: "Kapondeni", 
      link: "https://drive.google.com/file/d/1dS0KnWMR0a4wGwsisN_dyw0roJDsfMOe/view?usp=sharing",
      category: "Reference",
      icon: BookOpen
    },
    { 
      title: "Connecting Database to VB", 
      link: "https://drive.google.com/file/d/1mrA_FXuPiStEljyjV4tR8sQIPttLK84l/view?usp=sharing",
      category: "Database",
      icon: Database
    },
    { 
      title: "Coding Essentials (Series 1)", 
      link: "https://drive.google.com/file/d/1oOdhlumAxjnw-HAjJ8WEVymo8mdvgxmP/view?usp=sharing",
      category: "Essentials",
      icon: Code
    },
    { 
      title: "Array Binary Tree", 
      link: "https://drive.google.com/file/d/1MvLow2HUZ5zNx_lnZvGwh6kGFqbY6Qvh/view?usp=sharing",
      category: "Data Structures",
      icon: Braces
    },
    { 
      title: "Structured Programming", 
      link: "https://drive.google.com/file/d/1kTssJpL29snEsn0e6isKJgcCle4ItCGE/view?usp=sharing",
      category: "Principles",
      icon: Code
    },
  ];

  const handleDownload = async (type: string, identifier: string, link: string) => {
    if (link === "#") {
      toast({
        title: "Not Available",
        description: `${type} ${identifier} is currently not available`,
        variant: "destructive",
      });
      return;
    }

    try {
      setDownloadInProgress(`${type}-${identifier}`);
      
      // Show loading toast
      toast({
        title: "Starting Download",
        description: link.includes("drive.google.com") 
          ? "Opening Google Drive in a new tab..." 
          : "Opening MediaFire in a new tab...",
      });

      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Show success toast after a delay
      setTimeout(() => {
        toast({
          title: "Download Ready",
          description: link.includes("drive.google.com") 
            ? "Click the download button on Google Drive to get your file."
            : "Click the download button on MediaFire's page to get your file.",
        });
        setDownloadInProgress(null);
      }, 2000);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
      setDownloadInProgress(null);
    }
  };

  return (
    <div className="min-h-screen relative text-foreground overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${downloadsBackground})` }}
      />
      <div className="absolute inset-0 bg-background/90" />
      <div className="relative z-10">
        <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 space-y-6 sm:space-y-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent mb-4 animate-fadeIn">Study Resources</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl sm:max-w-2xl mx-auto px-4">
            Access our comprehensive collection of learning materials to help you excel in your A Level Computer Science studies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div onClick={() => document.getElementById('programming-notes')?.scrollIntoView({behavior: 'smooth'})}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#111] p-6 rounded-lg shadow-lg hover:shadow-accent/5 transition-all cursor-pointer border border-accent/10 hover:border-accent/30">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                <Code className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Programming Notes</h2>
                <p className="text-sm text-gray-400">{programming_notes.length} resources</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Comprehensive programming guides covering all syllabus topics.
            </p>
          </div>
          
          <div onClick={() => document.getElementById('special-resources')?.scrollIntoView({behavior: 'smooth'})}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#111] p-6 rounded-lg shadow-lg hover:shadow-accent/5 transition-all cursor-pointer border border-accent/10 hover:border-accent/30">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Special Resources</h2>
                <p className="text-sm text-gray-400">{special_resources.length} resources</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Advanced topics and specialized learning materials for deeper understanding.
            </p>
          </div>
          
          <div onClick={() => document.getElementById('past-papers')?.scrollIntoView({behavior: 'smooth'})}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#111] p-6 rounded-lg shadow-lg hover:shadow-accent/5 transition-all cursor-pointer border border-accent/10 hover:border-accent/30">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Past Papers</h2>
                <p className="text-sm text-gray-400">{theory_papers.length + practical_papers.length} papers</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Previous exam papers with marking schemes for effective revision.
            </p>
          </div>
        </div>

        {/* Programming Notes Section */}
        <div id="programming-notes" className="scroll-mt-24">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#111] border-accent/20">
            <CardHeader className="bg-gradient-to-r from-accent/20 to-transparent">
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                <Code className="h-6 w-6 text-accent" />
                Programming Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
              {programming_notes.map((note) => (
                <Button
                  key={note.part}
                  variant="outline"
                  className={`w-full border-accent/20 bg-[#1a1a1a] text-white hover:bg-accent/20 transition-colors ${
                    downloadInProgress === `Programming Notes Part-${note.part}` ? 'opacity-70 cursor-wait' : ''
                  }`}
                  onClick={() => handleDownload("Programming Notes Part", note.part, note.link)}
                  disabled={downloadInProgress === `Programming Notes Part-${note.part}`}
                >
                  {downloadInProgress === `Programming Notes Part-${note.part}` ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-accent border-t-transparent rounded-full" />
                  ) : (
                    <Download className="mr-2 h-4 w-4 text-accent" />
                  )}
                  Part {note.part}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Special Resources Section */}
        <div id="special-resources" className="scroll-mt-24">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#111] border-accent/20">
            <CardHeader className="bg-gradient-to-r from-accent/20 to-transparent">
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                <BookOpen className="h-6 w-6 text-accent" />
                Special Topics & Advanced Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {special_resources.map((resource, index) => (
                <div 
                  key={index} 
                  className="bg-[#1a1a1a] rounded-lg p-4 border border-accent/10 hover:border-accent/30 transition-all cursor-pointer"
                  onClick={() => handleDownload(resource.title, "", resource.link)}
                >
                  <div className="flex items-center gap-3">
                    <resource.icon className="h-8 w-8 text-accent" />
                    <div>
                      <h3 className="font-medium text-white">{resource.title}</h3>
                      <p className="text-sm text-gray-400">{resource.category}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-full mt-3 text-accent hover:bg-accent/10 ${
                      downloadInProgress === `${resource.title}-` ? 'opacity-70 cursor-wait' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(resource.title, "", resource.link);
                    }}
                    disabled={downloadInProgress === `${resource.title}-`}
                  >
                    {downloadInProgress === `${resource.title}-` ? (
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-accent border-t-transparent rounded-full" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Past Papers Section */}
        <div id="past-papers" className="scroll-mt-24">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#111] border-accent/20">
            <CardHeader className="bg-gradient-to-r from-accent/20 to-transparent">
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                <FileText className="h-6 w-6 text-accent" />
                Past Papers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-accent">Paper 1 (Theory)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {theory_papers.map((paper) => (
                    <Button
                      key={paper.year}
                      variant="outline"
                      className={`w-full border-accent/20 bg-[#1a1a1a] text-white hover:bg-accent/20 transition-colors ${
                        downloadInProgress === `Theory Paper-${paper.year}` ? 'opacity-70 cursor-wait' : ''
                      }`}
                      onClick={() => handleDownload("Theory Paper", paper.year, paper.link)}
                      disabled={downloadInProgress === `Theory Paper-${paper.year}`}
                    >
                      {downloadInProgress === `Theory Paper-${paper.year}` ? (
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-accent border-t-transparent rounded-full" />
                      ) : (
                        <Download className="mr-2 h-4 w-4 text-accent" />
                      )}
                      {paper.year} Paper 1
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-accent">Paper 2 (Practical)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {practical_papers.map((paper) => (
                    <Button
                      key={paper.year}
                      variant="outline"
                      className={`w-full border-accent/20 bg-[#1a1a1a] text-white hover:bg-accent/20 transition-colors ${
                        downloadInProgress === `Practical Paper-${paper.year}` ? 'opacity-70 cursor-wait' : ''
                      }`}
                      onClick={() => handleDownload("Practical Paper", paper.year, paper.link)}
                      disabled={downloadInProgress === `Practical Paper-${paper.year}`}
                    >
                      {downloadInProgress === `Practical Paper-${paper.year}` ? (
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-accent border-t-transparent rounded-full" />
                      ) : (
                        <Download className="mr-2 h-4 w-4 text-accent" />
                      )}
                      {paper.year} Paper 2
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Having trouble downloading? Contact us at 
            <a href="mailto:support@csexperts.co.zw" className="text-accent hover:underline ml-1">
              support@csexperts.co.zw
            </a>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Downloads;
