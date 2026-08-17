'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, MapPin, FileText, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { membershipService } from '@/services/membership.service';

export default function AdminMembershipDetailPage() {
  const router = useRouter();
  const params = useParams();
  const membershipId = params.id as string;
  
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembership();
  }, [membershipId]);

  const fetchMembership = async () => {
    try {
      setLoading(true);
      const response = await membershipService.getAllForms(1, 100);
      const form = response.data.find((f: any) => f.id === membershipId);
      
      if (form) {
        setMembership(form);
      } else {
        toast.error('Membership form not found');
        router.push('/admin/membership');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch membership');
      router.push('/admin/membership');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!membership) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/admin/membership')}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Membership Details</h1>
            <p className="text-gray-600 mt-1">
              Submitted on {format(new Date(membership.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/membership/${membership.id}/edit`)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Edit Details
        </Button>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Unique ID</p>
              <p className="font-mono font-bold text-purple-600">{membership.user.uniqueId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{membership.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{membership.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge>{membership.user.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{membership.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mobile Number</p>
              <p className="font-medium">{membership.mobileNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p>{membership.emailAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="capitalize">{membership.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p>{format(new Date(membership.dateOfBirth), 'MMM dd, yyyy')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Address Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={20} />
            Step 2: Address Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-medium">{membership.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p>{membership.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">District</p>
              <p>{membership.district}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p>{membership.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pin Code</p>
              <p className="font-mono">{membership.pinCode}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Full Address</p>
              <p>{membership.fullAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Nominee Details */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Nominee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Nominee Name</p>
              <p className="font-medium">{membership.nomineeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Relationship</p>
              <p className="capitalize">{membership.relationship}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nominee Mobile</p>
              <p className="font-mono">{membership.nomineeMobile}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Nominee Address</p>
              <p>{membership.nomineeAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: KYC Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Step 4: KYC Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Aadhar Number</p>
              <p className="font-mono font-bold">{membership.aadharNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">PAN Number</p>
              <p className="font-mono font-bold">{membership.panNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Step 5: Bank Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Account Holder Name</p>
              <p className="font-medium">{membership.accountHolder}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bank Name</p>
              <p>{membership.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="font-mono">{membership.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">IFSC Code</p>
              <p className="font-mono">{membership.ifscCode}</p>
            </div>
            {membership.upiId && (
              <div>
                <p className="text-sm text-gray-500">UPI ID</p>
                <p className="font-mono">{membership.upiId}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
