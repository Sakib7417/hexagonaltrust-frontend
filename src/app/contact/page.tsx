'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <Header />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message..."
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">support@hexagonaltrust.com</p>
                    <p className="text-gray-600">info@hexagonaltrust.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 1234567890</p>
                    <p className="text-gray-600">Mon-Sat, 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-600">123 Business Street</p>
                    <p className="text-gray-600">New Delhi, India 110001</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-1">How do I get started?</p>
                    <p className="text-sm text-gray-600">Simply register an account and make your first contribution to start earning rewards.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-1">When do I receive rewards?</p>
                    <p className="text-sm text-gray-600">After contributing ₹25,000+, you'll receive ₹500 weekly for 100 weeks.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-1">How can I withdraw?</p>
                    <p className="text-sm text-gray-600">Submit a withdrawal request from your dashboard with your UPI ID.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Hexagonal Trust?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start earning weekly rewards today
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
              Create Account
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
