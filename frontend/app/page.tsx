'use client'

import { BookingSystem } from '@/components/BookingSystem'
import { FeaturedEvent } from '@/components/FeaturedEvent'

export default function Home() {
  return (
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-white/10 bg-dark-light sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold gradient-text">ARCH1TECT</h1>
            <nav className="hidden md:flex gap-6">
              <a href="#event" className="hover:text-primary transition-colors font-semibold">Featured Event</a>
              <a href="#booking" className="hover:text-primary transition-colors">Booking</a>
              <a href="#services" className="hover:text-primary transition-colors">Services</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            Book Your Event
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Professional DJ services for clubs, festivals, private and corporate events
          </p>
          <a href="#event" className="inline-block px-8 py-4 bg-gradient-primary rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-105">
            Zobacz Nadchodzący Event →
          </a>
        </div>
      </section>

      {/* Featured Event Section */}
      <section id="event">
        <FeaturedEvent />
      </section>

      {/* Booking System */}
      <section id="booking" className="py-12 px-4">
        <div className="container mx-auto">
          <BookingSystem />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 ARCH1TECT. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
