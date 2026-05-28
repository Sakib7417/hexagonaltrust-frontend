'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { newsService, NewsItem } from '@/services/news.service';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, Loader2 } from 'lucide-react';

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    textEn: '',
    textHi: '',
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews();
      setNews(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch news');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.textEn.trim() || !formData.textHi.trim()) {
      toast.error('Both English and Hindi text are required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await newsService.updateNews(editingId, formData);
        toast.success('News updated successfully');
      } else {
        await newsService.createNews(formData);
        toast.success('News created successfully');
      }
      setFormData({ textEn: '', textHi: '' });
      setEditingId(null);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save news');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setFormData({
      textEn: item.textEn,
      textHi: item.textHi,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      await newsService.deleteNews(id);
      toast.success('News deleted successfully');
      fetchNews();
    } catch (error: any) {
      toast.error('Failed to delete news');
    }
  };

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    try {
      await newsService.toggleNewsStatus(id, !currentActive);
      toast.success(`News ${!currentActive ? 'activated' : 'deactivated'}`);
      fetchNews();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage News Ticker</h1>
        <p className="text-gray-600 mt-1">Create and manage scrolling news items in both English and Hindi</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit News' : 'Create New News Item'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textEn">English Text *</Label>
              <textarea
                id="textEn"
                placeholder="Enter news in English (include emoji if needed)"
                value={formData.textEn}
                onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="textHi">Hindi Text *</Label>
              <textarea
                id="textHi"
                placeholder="समाचार को हिंदी में दर्ज करें (यदि आवश्यक हो तो इमोजी शामिल करें)"
                value={formData.textHi}
                onChange={(e) => setFormData({ ...formData, textHi: e.target.value })}
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {editingId ? 'Update News' : 'Create News'}
                  </>
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ textEn: '', textHi: '' });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">All News Items</h2>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : news.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No news items yet. Create your first one!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {news.map((item) => (
              <Card key={item.id}>
                <CardContent className="py-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 mb-1">English:</p>
                        <p className="text-gray-600">{item.textEn}</p>
                      </div>
                      <Badge variant={item.active ? 'default' : 'secondary'}>
                        {item.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Hindi:</p>
                      <p className="text-gray-600">{item.textHi}</p>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={item.active ? 'default' : 'secondary'}
                        onClick={() => handleToggleStatus(item.id, item.active)}
                      >
                        {item.active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
