'use client';

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import RegisterFormComponent from './register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <Suspense fallback={<div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 64px)' }}><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
        <RegisterFormComponent />
      </Suspense>
    </div>
  );
}
