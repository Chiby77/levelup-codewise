import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Eye, EyeOff, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DownloadMaterial {
  id: string;
  title: string;
  link: string;
  category: string;
  material_type: string;
  year?: string;
  is_active: boolean;
  order_number: number;
  created_at: string;
}

export const AdminDownloads: React.FC = () => {
  const [materials, setMaterials] = useState<DownloadMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    category: 'theory_papers',
    material_type: 'pdf',
    year: '',
    is_active: true,
    order_number: 0
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('downloads_materials')
        .select('*')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.link.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      if (editingId) {
        // Update existing material
        const { error } = await supabase
          .from('downloads_materials')
          .update({
            title: formData.title,
            link: formData.link,
            category: formData.category,
            material_type: formData.material_type,
            year: formData.year,
            is_active: formData.is_active,
            order_number: formData.order_number
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Material updated successfully');
      } else {
        // Create new material
        const { error } = await supabase
          .from('downloads_materials')
          .insert({
            ...formData,
            created_by: user.id
          });

        if (error) throw error;
        toast.success('Material added successfully');
      }

      resetForm();
      await fetchMaterials();
    } catch (error: any) {
      console.error('Error saving material:', error);
      toast.error(error.message || 'Failed to save material');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material: DownloadMaterial) => {
    setEditingId(material.id);
    setFormData({
      title: material.title,
      link: material.link,
      category: material.category,
      material_type: material.material_type,
      year: material.year || '',
      is_active: material.is_active,
      order_number: material.order_number
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const { error } = await supabase
        .from('downloads_materials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Material deleted successfully');
      await fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('downloads_materials')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Material ${!currentStatus ? 'activated' : 'deactivated'}`);
      await fetchMaterials();
    } catch (error) {
      console.error('Error toggling material status:', error);
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      link: '',
      category: 'theory_papers',
      material_type: 'pdf',
      year: '',
      is_active: true,
      order_number: materials.length
    });
  };

  if (loading && materials.length === 0) {
    return <div className="text-center p-8">Loading materials...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Material' : 'Add New Material'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 2023 Past Paper"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link/URL *</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory_papers">Theory Papers</SelectItem>
                    <SelectItem value="practical_papers">Practical Papers</SelectItem>
                    <SelectItem value="programming_notes">Programming Notes</SelectItem>
                    <SelectItem value="special_resources">Special Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="material_type">Material Type</Label>
                <Select value={formData.material_type} onValueChange={(value) => setFormData({ ...formData, material_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="link">External Link</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year (optional)</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update Material' : 'Add Material'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Materials ({materials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.title}</TableCell>
                  <TableCell>{material.category.replace('_', ' ')}</TableCell>
                  <TableCell>{material.material_type.toUpperCase()}</TableCell>
                  <TableCell>{material.year || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={material.is_active ? 'default' : 'secondary'}>
                      {material.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(material)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(material.id, material.is_active)}
                      >
                        {material.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(material.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};