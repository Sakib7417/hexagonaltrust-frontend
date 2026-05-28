'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { Shield, Target, Heart, Users, Award, TrendingUp,Eye,ShieldCheck } from 'lucide-react';

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
                At Hexagonal, our mission is to create meaningful change in healthcare, education, employment, and social welfare through the collective support of people. We aim to establish affordable hospitals, support children’s education, generate employment opportunities, and serve communities with impactful social initiatives.

To maintain trust, transparency, and effective community management, Hexagonal is limited to a maximum of 2000 members who will together contribute towards building a better and stronger future.
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
                  <span>Affordable healthcare and better medical support for everyone</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="text-blue-600 mt-1" size={20} />
                  <span>Empowering children through quality education</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="text-blue-600 mt-1" size={20} />
                  <span>Creating employment opportunities for a stronger future</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="text-blue-600 mt-1" size={20} />
                  <span>Serving society through community welfare and social development</span>
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
           Hexagonal was started with a vision to create a remarkable change in society through the support and contribution of people. Our mission is focused on improving the medical field by opening hospitals where people can receive quality treatment at affordable and cheaper rates..
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Along with healthcare, Hexagonal is also dedicated to supporting the education of children, creating employment opportunities, and contributing to various social welfare services that help build a stronger and better future for communities.

We believe that when people join hands together, real change becomes possible..
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
