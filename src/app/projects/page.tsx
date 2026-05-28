'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Rocket, Users, TrendingUp, Calendar, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const project = {
    title: 'Hexagonal Hospital',
    description: 'A state-of-the-art multi-specialty hospital providing world-class healthcare services with advanced medical technology, experienced doctors, and compassionate care for all patients.',
    status: 'Fully Operational',
    progress: 100,
    icon: Rocket,
    startDate: 'Jan 2024',
    endDate: 'Dec 2025',
    team: '20+ staff',
    images: [
      '/Hexa.jpeg',
      '/Hexa2.jpeg',
      '/Hexa3.jpeg',
    ],
    features: [
      '24/7 Emergency Services',
      'Advanced ICU & Operation Theaters',
      'Multi-Specialty Departments',
      'Modern Diagnostic Facilities',
      'Patient-Centric Care',
      'In-House Pharmacy with All Essential Medicines Available'
    ],
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <Header />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Ongoing Projects</h1>
          <p className="text-xl text-gray-600">
            Building healthcare infrastructure for a healthier tomorrow
          </p>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            {/* Main Image Gallery */}
            <div className="relative h-64 md:h-[500px] overflow-hidden group">
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={24} className="text-gray-800" />
              </button>

              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <Badge className="text-sm px-4 py-1 bg-green-100 text-green-700">
                  {project.status}
                </Badge>
              </div>

              {/* Image Counter */}
              <div className="absolute top-6 left-6 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {project.images.length}
              </div>

              {/* Title */}
              <div className="absolute bottom-6 left-8 right-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 bg-white/90 rounded-xl flex items-center justify-center">
                    <project.icon size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-white">{project.title}</h3>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                {project.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 p-4 bg-gray-50 overflow-x-auto">
              {project.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? 'border-blue-600 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Project Content */}
            <div className="p-8">
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">{project.description}</p>

              {/* Features */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4 text-xl">Key Features:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-semibold text-gray-700">Project Progress</span>
                  <span className="font-bold text-blue-600 text-lg">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Details */}
              <div className="flex flex-wrap gap-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Timeline</p>
                    <p className="font-semibold">{project.startDate} - {project.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Team</p>
                    <p className="font-semibold">{project.team}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold">{project.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Completed Projects */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recently Completed
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Emergency Medical Center',
                date: 'Dec 2023',
                icon: CheckCircle,
              },
              {
                title: 'Diagnostic Laboratory',
                date: 'Nov 2023',
                icon: CheckCircle,
              },
              {
                title: 'Pharmacy & Medical Store',
                date: 'Oct 2023',
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">Completed: {item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Be Part of Our Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Hexagonal Trust and experience continuous innovation
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
              Join Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 text-center">
        <p>&copy; 2026 Hexagonal Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
