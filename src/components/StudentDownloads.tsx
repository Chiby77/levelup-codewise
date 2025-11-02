import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadMaterial {
  id: string;
  title: string;
  link: string;
  category: string;
  material_type: string;
  year: string | null;
  order_number: number;
  is_active: boolean;
}

export const StudentDownloads = () => {
  const [materials, setMaterials] = useState<DownloadMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('downloads_materials')
        .select('*')
        .eq('is_active', true)
        .order('order_number');

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (link: string, title: string) => {
    try {
      const a = document.createElement('a');
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`Opening ${title}...`);
    } catch (error) {
      toast.error('Failed to open download link');
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg bg-[#111] border-accent/20">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading materials...</p>
        </CardContent>
      </Card>
    );
  }

  if (materials.length === 0) {
    return (
      <Card className="shadow-lg bg-[#111] border-accent/20">
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No materials available at the moment</p>
        </CardContent>
      </Card>
    );
  }

  // Group materials by category
  const groupedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, DownloadMaterial[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedMaterials).map(([category, items]) => (
        <Card key={category} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[#111] border-accent/20">
          <CardHeader className="bg-gradient-to-r from-accent/20 to-transparent">
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <FileText className="h-6 w-6 text-accent" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((material) => (
                <div
                  key={material.id}
                  className="bg-[#1a1a1a] rounded-lg p-4 border border-accent/10 hover:border-accent/30 transition-all"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-2">{material.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                          {material.material_type}
                        </span>
                        {material.year && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {material.year}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-accent hover:bg-accent/10"
                      onClick={() => handleDownload(material.link, material.title)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
