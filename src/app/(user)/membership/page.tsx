'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { membershipService } from '@/services/membership.service';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const membershipSchema = z.object({
  // Step 1: Personal Details
  fullName: z.string().min(2, 'Full name is required'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
  emailAddress: z.string().email('Invalid email'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  
  // Step 2: Address Details
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  city: z.string().min(2, 'City is required'),
  pinCode: z.string().regex(/^\d{6}$/, 'Pin code must be 6 digits'),
  fullAddress: z.string().min(10, 'Full address is required'),
  
  // Step 3: Nominee Details
  nomineeName: z.string().min(2, 'Nominee name is required'),
  relationship: z.string().min(2, 'Relationship is required'),
  nomineeMobile: z.string().regex(/^\d{10}$/, 'Nominee mobile must be 10 digits'),
  nomineeAddress: z.string().min(10, 'Nominee address is required'),
  
  // Step 4: KYC Details
  aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'Invalid PAN format'),
  
  // Step 5: Bank Details
  accountHolder: z.string().min(2, 'Account holder name is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().regex(/^\d{9,18}$/, 'Account number must be 9-18 digits'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, 'Invalid IFSC format'),
  upiId: z.string().optional(),
});

type MembershipForm = z.infer<typeof membershipSchema>;

const steps = [
  'Personal Details',
  'Address Details',
  'Nominee Details',
  'KYC Details',
  'Bank Details',
];

export default function MembershipFormPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [existingForm, setExistingForm] = useState<any>(null);
  const [isValidStep, setIsValidStep] = useState(false);
  const [checkingForm, setCheckingForm] = useState(true);

  // Check if user already submitted a form
  useEffect(() => {
    checkExistingForm();
  }, []);

  const checkExistingForm = async () => {
    try {
      const response = await membershipService.getForm();
      if (response.data) {
        setExistingForm(response.data);
      }
    } catch (error) {
      console.error('Error checking existing form:', error);
    } finally {
      setCheckingForm(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MembershipForm>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      emailAddress: '',
      gender: '',
      dateOfBirth: '',
      country: '',
      state: '',
      district: '',
      city: '',
      pinCode: '',
      fullAddress: '',
      nomineeName: '',
      relationship: '',
      nomineeMobile: '',
      nomineeAddress: '',
      aadharNumber: '',
      panNumber: '',
      accountHolder: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
    },
  });

  const validateCurrentStep = (values: any) => {
    switch (currentStep) {
      case 1:
        setIsValidStep(!!(
          values.fullName && values.mobileNumber && values.emailAddress && 
          values.gender && values.dateOfBirth
        ));
        break;
      case 2:
        setIsValidStep(!!(
          values.country && values.state && values.district && 
          values.city && values.pinCode && values.fullAddress
        ));
        break;
      case 3:
        setIsValidStep(!!(
          values.nomineeName && values.relationship && 
          values.nomineeMobile && values.nomineeAddress
        ));
        break;
      case 4:
        setIsValidStep(!!(
          values.aadharNumber && values.panNumber
        ));
        break;
      case 5:
        setIsValidStep(!!(
          values.accountHolder && values.bankName && 
          values.accountNumber && values.ifscCode
        ));
        break;
    }
  };

  // Subscribe to form changes to validate current step
  useEffect(() => {
    const subscription = watch((value) => {
      validateCurrentStep(value);
    });
    return () => subscription.unsubscribe();
  }, [currentStep, watch]);

  // Show existing form if already submitted
  if (checkingForm) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (existingForm) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={24} />
              Membership Form Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your membership form has been successfully submitted and is pending approval.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-800">
                <strong>Submitted on:</strong> {new Date(existingForm.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            {/* Personal Details */}
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3">Step 1: Personal Details</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{existingForm.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-medium">{existingForm.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{existingForm.emailAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="capitalize">{existingForm.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p>{new Date(existingForm.dateOfBirth).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3">Step 2: Address Details</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{existingForm.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p>{existingForm.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p>{existingForm.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p>{existingForm.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pin Code</p>
                  <p className="font-mono">{existingForm.pinCode}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Full Address</p>
                  <p>{existingForm.fullAddress}</p>
                </div>
              </div>
            </div>

            {/* Nominee Details */}
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3">Step 3: Nominee Details</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Nominee Name</p>
                  <p className="font-medium">{existingForm.nomineeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p className="capitalize">{existingForm.relationship}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nominee Mobile</p>
                  <p className="font-mono">{existingForm.nomineeMobile}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Nominee Address</p>
                  <p>{existingForm.nomineeAddress}</p>
                </div>
              </div>
            </div>

            {/* KYC Details */}
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3">Step 4: KYC Details</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Aadhar Number</p>
                  <p className="font-mono font-bold">{existingForm.aadharNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PAN Number</p>
                  <p className="font-mono font-bold">{existingForm.panNumber}</p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Step 5: Bank Details</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Account Holder Name</p>
                  <p className="font-medium">{existingForm.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bank Name</p>
                  <p>{existingForm.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-mono">{existingForm.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IFSC Code</p>
                  <p className="font-mono">{existingForm.ifscCode}</p>
                </div>
                {existingForm.upiId && (
                  <div>
                    <p className="text-sm text-gray-500">UPI ID</p>
                    <p className="font-mono">{existingForm.upiId}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    console.log('Handle Next called, current step:', currentStep);
    console.log('Is valid step:', isValidStep);
    
    // If on last step, submit the form
    if (currentStep === 5) {
      console.log('On step 5, triggering form submit');
      // Call onSubmit directly with current form values
      const currentValues = watch();
      console.log('Current form values:', currentValues);
      onSubmit(currentValues);
      return;
    }
    
    if (!isValidStep) {
      toast.error('Please fill all required fields');
      console.log('Validation failed');
      return;
    }
    
    console.log('Moving to step:', currentStep + 1);
    setCurrentStep(currentStep + 1);
  };

  const onSubmit = async (data: MembershipForm) => {
    console.log('=== onSubmit called ===');
    console.log('Current step:', currentStep);
    console.log('Form data:', JSON.stringify(data, null, 2));
    console.log('Is valid step:', isValidStep);
    
    // Only submit if on step 5
    if (currentStep !== 5) {
      console.log('Not on step 5, returning');
      return;
    }
    
    try {
      console.log('Starting form submission...');
      setLoading(true);
      
      // Send as JSON instead of FormData
      console.log('Sending request to backend...');
      await membershipService.submitForm(data);
      
      console.log('Form submitted successfully!');
      toast.success('Membership form submitted successfully!');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  if (existingForm) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Membership Form Already Submitted
              </h2>
              <p className="text-green-700 mb-4">
                Your membership form has been successfully submitted and is under review.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Step 1: Personal Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...register('fullName')} />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input id="mobileNumber" {...register('mobileNumber')} placeholder="10 digits" />
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
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Step 2: Address Details</h3>
            
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
                <Input id="pinCode" {...register('pinCode')} placeholder="6 digits" />
                {errors.pinCode && <p className="text-sm text-red-500">{errors.pinCode.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullAddress">Full Address *</Label>
                <textarea
                  id="fullAddress"
                  {...register('fullAddress')}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
                {errors.fullAddress && <p className="text-sm text-red-500">{errors.fullAddress.message}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Step 3: Nominee Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomineeName">Nominee Name *</Label>
                <Input id="nomineeName" {...register('nomineeName')} />
                {errors.nomineeName && <p className="text-sm text-red-500">{errors.nomineeName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship *</Label>
                <Input id="relationship" {...register('relationship')} placeholder="e.g., Father, Spouse" />
                {errors.relationship && <p className="text-sm text-red-500">{errors.relationship.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomineeMobile">Nominee Mobile *</Label>
                <Input id="nomineeMobile" {...register('nomineeMobile')} placeholder="10 digits" />
                {errors.nomineeMobile && <p className="text-sm text-red-500">{errors.nomineeMobile.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nomineeAddress">Nominee Address *</Label>
                <textarea
                  id="nomineeAddress"
                  {...register('nomineeAddress')}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
                {errors.nomineeAddress && <p className="text-sm text-red-500">{errors.nomineeAddress.message}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Step 4: KYC Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                <Input id="aadharNumber" {...register('aadharNumber')} placeholder="12 digits" />
                {errors.aadharNumber && <p className="text-sm text-red-500">{errors.aadharNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input id="panNumber" {...register('panNumber')} placeholder="ABCDE1234F" />
                {errors.panNumber && <p className="text-sm text-red-500">{errors.panNumber.message}</p>}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Step 5: Bank Details</h3>
            
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
                <Input id="ifscCode" {...register('ifscCode')} placeholder="e.g., SBIN0001234" />
                {errors.ifscCode && <p className="text-sm text-red-500">{errors.ifscCode.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID (Optional)</Label>
                <Input id="upiId" {...register('upiId')} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Membership Registration</h1>
        <p className="text-gray-600 mt-1">Complete all 5 steps to register your membership</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep > index + 1
                  ? 'bg-green-500 text-white'
                  : currentStep === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {currentStep > index + 1 ? '✓' : index + 1}
            </div>
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-medium">{step}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep} of 5</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                <ChevronLeft size={16} className="mr-2" />
                Previous
              </Button>

              <Button 
                type="button" 
                onClick={handleNext}
                disabled={loading || !isValidStep}
              >
                {loading ? (
                  'Submitting...'
                ) : currentStep === 5 ? (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Submit Form
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
