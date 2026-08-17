'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { membershipService } from '@/services/membership.service';
import { toast } from 'sonner';

const editMembershipSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
  emailAddress: z.string().email('Invalid email'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  city: z.string().min(2, 'City is required'),
  pinCode: z.string().regex(/^\d{6}$/, 'Pin code must be 6 digits'),
  fullAddress: z.string().min(10, 'Full address is required'),
  nomineeName: z.string().min(2, 'Nominee name is required'),
  relationship: z.string().min(2, 'Relationship is required'),
  nomineeMobile: z.string().regex(/^\d{10}$/, 'Nominee mobile must be 10 digits'),
  nomineeAddress: z.string().min(10, 'Nominee address is required'),
  aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'Invalid PAN format'),
  accountHolder: z.string().min(2, 'Account holder name is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().regex(/^\d{9,18}$/, 'Account number must be 9-18 digits'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, 'Invalid IFSC format'),
  upiId: z.string().optional(),
});

type EditMembershipForm = z.infer<typeof editMembershipSchema>;

export default function AdminMembershipEditPage() {
  const router = useRouter();
  const params = useParams();
  const membershipId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditMembershipForm>({
    resolver: zodResolver(editMembershipSchema),
  });

  useEffect(() => {
    fetchMembership();
  }, [membershipId]);

  const fetchMembership = async () => {
    try {
      setLoading(true);
      const response = await membershipService.getAllForms(1, 100);
      const form = response.data.find((item: any) => item.id === membershipId);

      if (!form) {
        toast.error('Membership form not found');
        router.push('/admin/membership');
        return;
      }

      reset({
        fullName: form.fullName || '',
        mobileNumber: form.mobileNumber || '',
        emailAddress: form.emailAddress || '',
        gender: form.gender || '',
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split('T')[0] : '',
        country: form.country || '',
        state: form.state || '',
        district: form.district || '',
        city: form.city || '',
        pinCode: form.pinCode || '',
        fullAddress: form.fullAddress || '',
        nomineeName: form.nomineeName || '',
        relationship: form.relationship || '',
        nomineeMobile: form.nomineeMobile || '',
        nomineeAddress: form.nomineeAddress || '',
        aadharNumber: form.aadharNumber || '',
        panNumber: form.panNumber || '',
        accountHolder: form.accountHolder || '',
        bankName: form.bankName || '',
        accountNumber: form.accountNumber || '',
        ifscCode: form.ifscCode || '',
        upiId: form.upiId || '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch membership form');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EditMembershipForm) => {
    try {
      setSaving(true);
      await membershipService.updateForm(membershipId, data);
      toast.success('Membership details updated successfully');
      router.push(`/admin/membership/${membershipId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update membership details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Membership Details</h1>
          <p className="text-gray-600 mt-1">Update the user’s submitted membership information</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/admin/membership/${membershipId}`)}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 1: Personal Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" {...register('fullName')} />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input id="mobileNumber" {...register('mobileNumber')} />
                  {errors.mobileNumber && <p className="text-sm text-red-500">{errors.mobileNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input id="emailAddress" type="email" {...register('emailAddress')} />
                  {errors.emailAddress && <p className="text-sm text-red-500">{errors.emailAddress.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <select id="gender" {...register('gender')} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                  {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 2: Address Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" {...register('country')} />
                  {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" {...register('state')} />
                  {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input id="district" {...register('district')} />
                  {errors.district && <p className="text-sm text-red-500">{errors.district.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...register('city')} />
                  {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinCode">Pin Code *</Label>
                  <Input id="pinCode" {...register('pinCode')} />
                  {errors.pinCode && <p className="text-sm text-red-500">{errors.pinCode.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullAddress">Full Address *</Label>
                  <textarea id="fullAddress" rows={3} {...register('fullAddress')} className="w-full px-3 py-2 border rounded-lg" />
                  {errors.fullAddress && <p className="text-sm text-red-500">{errors.fullAddress.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 3: Nominee Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nomineeName">Nominee Name *</Label>
                  <Input id="nomineeName" {...register('nomineeName')} />
                  {errors.nomineeName && <p className="text-sm text-red-500">{errors.nomineeName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Input id="relationship" {...register('relationship')} />
                  {errors.relationship && <p className="text-sm text-red-500">{errors.relationship.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomineeMobile">Nominee Mobile *</Label>
                  <Input id="nomineeMobile" {...register('nomineeMobile')} />
                  {errors.nomineeMobile && <p className="text-sm text-red-500">{errors.nomineeMobile.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nomineeAddress">Nominee Address *</Label>
                  <textarea id="nomineeAddress" rows={3} {...register('nomineeAddress')} className="w-full px-3 py-2 border rounded-lg" />
                  {errors.nomineeAddress && <p className="text-sm text-red-500">{errors.nomineeAddress.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 4: KYC Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                  <Input id="aadharNumber" {...register('aadharNumber')} />
                  {errors.aadharNumber && <p className="text-sm text-red-500">{errors.aadharNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input id="panNumber" {...register('panNumber')} />
                  {errors.panNumber && <p className="text-sm text-red-500">{errors.panNumber.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 5: Bank Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Account Holder Name *</Label>
                  <Input id="accountHolder" {...register('accountHolder')} />
                  {errors.accountHolder && <p className="text-sm text-red-500">{errors.accountHolder.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input id="bankName" {...register('bankName')} />
                  {errors.bankName && <p className="text-sm text-red-500">{errors.bankName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input id="accountNumber" {...register('accountNumber')} />
                  {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code *</Label>
                  <Input id="ifscCode" {...register('ifscCode')} />
                  {errors.ifscCode && <p className="text-sm text-red-500">{errors.ifscCode.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID (Optional)</Label>
                  <Input id="upiId" {...register('upiId')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push(`/admin/membership/${membershipId}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
