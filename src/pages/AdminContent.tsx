import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Upload, BookOpen, Bell, FileText, Image, Loader2 } from 'lucide-react';

export default function AdminContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');

  // Study tip state
  const [tipTitle, setTipTitle] = useState('');
  const [tipContent, setTipContent] = useState('');
  const [tipCategory, setTipCategory] = useState('');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'book' | 'picture'>('book');

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    setIsAdmin(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedBookTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      const isValidType = uploadType === 'book' 
        ? allowedBookTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx)$/i)
        : allowedImageTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      
      if (!isValidType) {
        toast.error(`Invalid file type. ${uploadType === 'book' ? 'Please select a PDF or DOC file.' : 'Please select an image file (JPG, PNG, GIF, WEBP).'}`);
        e.target.value = '';
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const bucketName = uploadType === 'book' ? 'books' : 'pictures';
      
      // Clean filename - remove special characters
      const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}_${cleanName}`;
      const filePath = fileName;

      console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        // Check for specific error types
        if (uploadError.message?.includes('Bucket not found')) {
          throw new Error(`Storage bucket "${bucketName}" not found. Please contact administrator.`);
        }
        if (uploadError.message?.includes('row-level security')) {
          throw new Error('Upload permission denied. Please check storage bucket policies.');
        }
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);
      toast.success(`${uploadType === 'book' ? 'Book' : 'Image'} uploaded successfully!`);
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast.error('Please fill in all announcement fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('announcements')
        .insert({
          title: announcementTitle.trim(),
          content: announcementContent.trim(),
          created_by: user.id,
          is_active: true
        });

      if (error) throw error;

      toast.success('Announcement created successfully!');
      setAnnouncementTitle('');
      setAnnouncementContent('');
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast.error(error.message || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudyTip = async () => {
    if (!tipTitle.trim() || !tipContent.trim() || !tipCategory.trim()) {
      toast.error('Please fill in all study tip fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('study_tips')
        .insert({
          title: tipTitle.trim(),
          content: tipContent.trim(),
          category: tipCategory.trim(),
          created_by: user.id,
          is_active: true
        });

      if (error) throw error;

      toast.success('Study tip created successfully!');
      setTipTitle('');
      setTipContent('');
      setTipCategory('');
    } catch (error: any) {
      console.error('Error creating study tip:', error);
      toast.error(error.message || 'Failed to create study tip');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          variant="outline" 
          onClick={() => navigate('/exams')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">Manage announcements, study materials, and resources</p>
        </div>

        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements">
              <Bell className="h-4 w-4 mr-2" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="tips">
              <FileText className="h-4 w-4 mr-2" />
              Study Tips
            </TabsTrigger>
            <TabsTrigger value="uploads">
              <Upload className="h-4 w-4 mr-2" />
              File Uploads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Create Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    placeholder="Enter announcement title"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    maxLength={200}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-content">Content</Label>
                  <Textarea
                    id="announcement-content"
                    placeholder="Enter announcement content (line breaks and numbering will be preserved)"
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    className="whitespace-pre-wrap font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Tip: Use line breaks and numbers - they will display exactly as typed</p>
                </div>
                <Button 
                  onClick={handleCreateAnnouncement} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Announcement'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create Study Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tip-title">Title</Label>
                  <Input
                    id="tip-title"
                    placeholder="Enter study tip title"
                    value={tipTitle}
                    onChange={(e) => setTipTitle(e.target.value)}
                    maxLength={200}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tip-category">Category</Label>
                  <Input
                    id="tip-category"
                    placeholder="e.g., Programming, Algorithms, Theory"
                    value={tipCategory}
                    onChange={(e) => setTipCategory(e.target.value)}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tip-content">Content</Label>
                  <Textarea
                    id="tip-content"
                    placeholder="Enter study tip content (formatting will be preserved)"
                    value={tipContent}
                    onChange={(e) => setTipContent(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    className="whitespace-pre-wrap font-mono text-sm"
                  />
                </div>
                <Button 
                  onClick={handleCreateStudyTip} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Study Tip'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploads">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Type</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={uploadType === 'book' ? 'default' : 'outline'}
                      onClick={() => setUploadType('book')}
                      className="flex-1"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Book/Document
                    </Button>
                    <Button
                      type="button"
                      variant={uploadType === 'picture' ? 'default' : 'outline'}
                      onClick={() => setUploadType('picture')}
                      className="flex-1"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Picture
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Select File (Max 10MB)</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileSelect}
                    accept={uploadType === 'book' ? '.pdf,.doc,.docx' : 'image/*'}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      {selectedFile.size > 10 * 1024 * 1024 && (
                        <span className="text-destructive ml-2">⚠️ File too large! Max 10MB</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> {uploadType === 'book' 
                      ? 'Books are uploaded to a private bucket. Students can download them through the Downloads page.'
                      : 'Pictures are uploaded to a public bucket and can be accessed by all users.'
                    }
                  </p>
                </div>

                <Button 
                  onClick={handleFileUpload} 
                  disabled={uploading || !selectedFile}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
