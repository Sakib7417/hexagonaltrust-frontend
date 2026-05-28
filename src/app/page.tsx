'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { NewsTicker } from '@/components/ui/news-ticker';
import {
  Shield,
  Users,
  TrendingUp,
  Wallet,
  Award,
  CheckCircle,
  ArrowRight,
  Target,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <Header />

      {/* News Ticker */}
      <NewsTicker language="en" />

      {/* Hero Section */}
      <section   className="
    min-h-screen
    flex items-center
    px-4
    bg-cover
    bg-center
    bg-no-repeat
  "
  style={{
    backgroundImage: "url('/Herobg.png')",
  }}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            An Exclusive Community-Driven Program
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
             Limited to Just 2000 Lifetime  Trustee Members
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Focused on Health, Education,  Employment & Social activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg"
  className="
    px-8 
    py-6 
    text-lg
    bg-gradient-to-r
    from-blue-600
    to-indigo-600
    text-white
    animate-[pulse_2s_infinite]
    shadow-[0_0_20px_rgba(59,130,246,0.6)]
    hover:shadow-[0_0_45px_rgba(59,130,246,1)]
    hover:scale-105
    transition-all
    duration-500
  ">
                Become a Part of Hexagonal Trust
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
         <Swiper
  modules={[Autoplay]}
  spaceBetween={30}
  slidesPerView={1}
  loop={true}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
  breakpoints={{
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  }}
>
  <SwiperSlide>
     {/* Smart Contributions */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Clear Objective</h3>
              <p className="text-gray-600">
              Focused on creating meaningful impact through health, education, and employment initiatives.
              </p>
            </div>
  </SwiperSlide>
           
<SwiperSlide> 
            {/* Weekly Rewards */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Eye size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
              Maintaining complete openness in contributions, member activities, and reward distribution.
              </p>
            </div>
</SwiperSlide>
<SwiperSlide>
            {/* Quick Withdrawals */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Accountability</h3>
              <p className="text-gray-600">
                Ensuring responsible management, ethical operations, and community trust at every step.
              </p>
            </div>
</SwiperSlide>
<SwiperSlide>
             {/* Long term stability */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Long-term Stability</h3>
              <p className="text-gray-600">
               Helping people create a stable and better future through long-term community growth.
              </p>
            </div>
</SwiperSlide>
</Swiper> 
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
              { step: '2', title: 'Contribute', desc: 'Make your contribution to become a part of HexaGonal' },
              { step: '3', title: 'Get Ad Cost', desc: 'Receive advertisement cost benefits every week for 100 weeks' },
              { step: '4', title: 'Promotional Benefits', desc: 'Enjoy exclusive promotional rewards and opportunities.' },
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
              { icon: Users, label: 'Active Users', value: 'NA' },
              { icon: Wallet, label: 'Total Contributions', value: 'NA' },
              { icon: Award, label: 'Rewards Distributed', value: 'NA' },
              { icon: CheckCircle, label: 'Success Rate', value: 'NA' },
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
            Ready to Be the part of Hexagonal?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
           Be a part of a growing community joining hands to support better health, quality education, and employment opportunities for a brighter future together.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
             Become a part of Hexagonal
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
                A modern platform for empowering Health, education , Employment & social services.
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
            <p>&copy; 2026 Hexagonal Trust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
