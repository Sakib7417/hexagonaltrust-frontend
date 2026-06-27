'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminService } from '@/services/admin.service';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminService.getSettings();
      setUpiId(response.upiId || '');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminService.updateSettings(upiId);
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage payment configuration</p>
      </div>

      {/* UPI Settings */}
      <Card>
        <CardHeader>
          <CardTitle>UPI Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">Admin UPI ID</Label>
            <Input
              id="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="admin@upi"
            />
            <p className="text-sm text-gray-500">
              This UPI ID will be shown to users for making contributions
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              'Saving...'
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Save UPI ID
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
