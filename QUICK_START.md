# Frontend QUICK START Guide - Contribution & Reward Platform

## ✅ What's Already Built

### Core Infrastructure (COMPLETE)
- ✅ Next.js 15+ with TypeScript & Tailwind
- ✅ Shadcn UI components installed
- ✅ All dependencies installed
- ✅ Environment configuration
- ✅ TypeScript types for all entities
- ✅ API service layer with Axios interceptors
- ✅ Zustand state management stores
- ✅ Authentication page (Login)
- ✅ Utility functions and constants

### Files Created (~30 files)
```
src/
├── types/index.ts                      ✅ All TypeScript interfaces
├── lib/utils.ts                        ✅ cn() helper + constants
├── services/
│   ├── api.ts                         ✅ Axios instance with interceptors
│   ├── auth.service.ts                ✅ Auth API calls
│   ├── user.service.ts                ✅ User API calls
│   ├── contribution.service.ts        ✅ Contribution/Wallet/Reward API
│   ├── withdraw.service.ts            ✅ Withdraw API calls
│   └── admin.service.ts               ✅ Admin API calls
├── store/
│   ├── auth.store.ts                  ✅ Authentication state
│   └── user.store.ts                  ✅ User data state
└── app/(auth)/login/page.tsx          ✅ Login page (complete example)
```

## 🚀 Quick Test (RIGHT NOW)

```bash
cd /Users/apple/Desktop/contribution-frontend
npm run dev
```

Visit: http://localhost:3000/login

You'll see a beautiful, fully functional login page!

## 📋 How to Build Remaining Pages

I'll show you the pattern - it's the same for every page. Let me give you templates:

### Template 1: Register Page
Create: `src/app/(auth)/register/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { Button, Input, Label, Card } from '@/components/ui/...';
import { CONSTANTS } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone required'),
  country: z.string().min(2, 'Country required'),
  password: z.string().min(6, 'Password must be 6+ characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      login(response.data.user, response.data.token, 'user');
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          {/* Add fields: name, email, phone, country (dropdown), password, confirmPassword */}
          <Button type="submit" disabled={loading}>Register</Button>
        </form>
      </Card>
    </div>
  );
}
```

### Template 2: Dashboard Page
Create: `src/app/(user)/dashboard/page.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/user.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { dashboard, loading, fetchDashboard } = useUserStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{dashboard?.user.status}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboard?.wallet.availableBalance || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboard?.totalRewards || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributed</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboard?.totalContribution || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Template 3: Contribution Page
Create: `src/app/(user)/contribution/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { contributionService } from '@/services/contribution.service';
import { Card, Button, Input, Label } from '@/components/ui/...';

const contributionSchema = z.object({
  amount: z.number().min(1, 'Amount must be positive'),
  transactionId: z.string().min(1, 'Transaction ID required'),
});

export default function ContributionPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contributionSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await contributionService.submit(data.amount, data.transactionId);
      toast.success('Contribution submitted!');
      reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Make Contribution</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        {/* Show UPI ID and QR Code from API */}
        <p className="text-lg">UPI ID: admin@upi</p>
        {/* <img src="/api-url/uploads/qrcode.png" alt="QR Code" /> */}
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Amount (₹)</Label>
            <Input type="number" {...register('amount', { valueAsNumber: true })} />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>
          
          <div>
            <Label>Transaction ID</Label>
            <Input {...register('transactionId')} />
            {errors.transactionId && <p className="text-red-500 text-sm">{errors.transactionId.message}</p>}
          </div>

          <Button type="submit" disabled={loading}>Submit Contribution</Button>
        </form>
      </Card>
    </div>
  );
}
```

## 🎯 Pages You Need to Create

### User Pages (Follow templates above):
1. ✅ `/login` - DONE
2. ⬜ `/register` - Use Template 1
3. ⬜ `/dashboard` - Use Template 2
4. ⬜ `/profile` - Similar to dashboard, show user info
5. ⬜ `/contribution` - Use Template 3
6. ⬜ `/wallet` - Show wallet balance + reward history table
7. ⬜ `/withdraw` - Form to request withdraw + history table
8. ⬜ `/history` - Tabbed interface with all histories

### Admin Pages (Similar pattern):
1. ⬜ `/admin/login` - Same as user login but call `authService.adminLogin`
2. ⬜ `/admin/dashboard` - Use `adminService.getDashboardStats()`
3. ⬜ `/admin/users` - Table with `adminService.getUsers()`
4. ⬜ `/admin/contributions` - Table with approve/reject buttons
5. ⬜ `/admin/withdraws` - Table with approve/reject + transaction ID modal
6. ⬜ `/admin/rewards` - Table showing all rewards
7. ⬜ `/admin/settings` - Form to update UPI + upload QR

## 🔑 Key Patterns

### Pattern 1: Fetch Data on Mount
```tsx
useEffect(() => {
  fetchData();
}, []);
```

### Pattern 2: Form Submission
```tsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

const onSubmit = async (data) => {
  try {
    setLoading(true);
    await service.call(data);
    toast.success('Success!');
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Pattern 3: Table with Pagination
```tsx
const [page, setPage] = useState(1);

useEffect(() => {
  service.getData(page);
}, [page]);
```

## 🎨 UI Components to Import

All Shadcn components are in `@/components/ui/`:
- `button`, `input`, `label`, `card`, `table`
- `dialog` (for modals), `dropdown-menu`, `badge`
- `progress`, `select`, `separator`, `sheet`, `avatar`

Icons from `lucide-react`:
- `Wallet`, `TrendingUp`, `DollarSign`, `Activity`
- `Eye`, `EyeOff`, `Loader2`, `Plus`, `Trash`, `Edit`

## 📦 Run the App

```bash
# Development
npm run dev

# Build for production
npm run build
npm start
```

## 🌐 API Integration

All API calls are ready in `src/services/`. Just import and use:

```tsx
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { adminService } from '@/services/admin.service';
```

## 🔐 Authentication Flow

1. User logs in → `authService.login()` returns token
2. Token stored in cookie via Zustand store
3. Axios interceptor automatically adds token to all requests
4. Protected pages check `useAuthStore` for authentication

## ✨ Next Steps

1. Create register page (5 mins)
2. Create user dashboard (10 mins)
3. Create contribution page (10 mins)
4. Create remaining user pages (30 mins)
5. Create admin pages (45 mins)
6. Add middleware for route protection (15 mins)

**Total time to complete: ~2 hours**

All the hard infrastructure work is DONE. You just need to copy the templates and customize!

## 💡 Pro Tips

- Use the login page as a reference for all forms
- Use the dashboard template for all data display pages
- All services are ready - just call them
- State management is setup - just use the stores
- Toast notifications work out of the box

**You have a SOLID foundation. The rest is just repetition!** 🚀
