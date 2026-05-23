'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import {
  Shield,
  Users,
  TrendingUp,
  Wallet,
  Award,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Contribution & Reward
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Platform
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A modern platform for managing contributions, automated weekly rewards, and seamless withdrawals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Earning Today
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Hexagonal Trust?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Smart Contributions */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Wallet size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Contributions</h3>
              <p className="text-gray-600">
                Easy payment contributions with UPI integration. Simple, fast, and secure.
              </p>
            </div>

            {/* Weekly Rewards */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Weekly Rewards</h3>
              <p className="text-gray-600">
                Automated ₹500 weekly rewards for eligible users. Earn up to ₹50,000 over 100 weeks!
              </p>
            </div>

            {/* Quick Withdrawals */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Withdrawals</h3>
              <p className="text-gray-600">
                Fast and secure withdrawal processing directly to your UPI account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Register', desc: 'Create your account in seconds' },
              { step: '2', title: 'Contribute', desc: 'Make contributions via UPI' },
              { step: '3', title: 'Earn Rewards', desc: 'Get ₹500 weekly for 100 weeks' },
              { step: '4', title: 'Withdraw', desc: 'Withdraw earnings anytime' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Active Users', value: '10,000+' },
              { icon: Wallet, label: 'Total Contributions', value: '₹50M+' },
              { icon: Award, label: 'Rewards Distributed', value: '₹25M+' },
              { icon: CheckCircle, label: 'Success Rate', value: '99.9%' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6">
                <stat.icon size={48} className="mx-auto mb-4 text-blue-600" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already earning weekly rewards
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
              Create Your Account
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Hexagonal Trust</h3>
              <p className="text-gray-400">
                A modern platform for managing contributions and automated rewards.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white">Home</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white">About Us</Link>
                <Link href="/projects" className="block text-gray-400 hover:text-white">Projects</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <Link href="/login" className="block text-gray-400 hover:text-white">Login</Link>
                <Link href="/register" className="block text-gray-400 hover:text-white">Register</Link>
                <Link href="/dashboard" className="block text-gray-400 hover:text-white">Dashboard</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <p className="text-gray-400">Terms of Service</p>
                <p className="text-gray-400">Privacy Policy</p>
                <p className="text-gray-400">Refund Policy</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Hexagonal Trust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
