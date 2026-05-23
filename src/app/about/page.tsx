'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { Shield, Target, Heart, Users, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <Header />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Hexagonal Trust</h1>
          <p className="text-xl text-gray-600">
            Building a community where contributions are valued and rewarded
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                At Hexagonal Trust, we believe in creating a platform that rewards dedication and commitment. 
                Our mission is to provide a transparent, reliable, and rewarding experience for every user. 
                Through our automated reward system, we ensure that your contributions are recognized and compensated fairly.
              </p>
            </div>
            <div>
              <div className="h-16 w-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Heart size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <Shield className="text-blue-600 mt-1" size={20} />
                  <span>Trust and transparency in all transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="text-blue-600 mt-1" size={20} />
                  <span>Community-focused approach</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="text-blue-600 mt-1" size={20} />
                  <span>Fair and automated reward distribution</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="text-blue-600 mt-1" size={20} />
                  <span>Continuous growth and improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Hexagonal Trust was founded with a simple yet powerful idea: create a platform where every contribution matters 
            and is rewarded consistently. We understood that building trust takes time, which is why we've designed our 
            system to be completely transparent and automated.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our platform ensures that once you make a contribution of ₹25,000 or more, you become eligible for weekly 
            rewards of ₹500 for up to 100 weeks. That's a total of ₹50,000 in rewards! Our automated system guarantees 
            timely distributions without any manual intervention, making the process seamless and reliable.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="text-5xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600 text-lg">Happy Users</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="text-5xl font-bold text-green-600 mb-2">₹25M+</div>
              <div className="text-gray-600 text-lg">Rewards Distributed</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="text-5xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600 text-lg">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your journey towards consistent weekly rewards
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 text-center">
        <p>&copy; 2024 Hexagonal Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
