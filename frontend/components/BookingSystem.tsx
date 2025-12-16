'use client'

import { useState } from 'react'
import { BookingCalendar } from './BookingCalendar'
import { BookingForm } from './BookingForm'
import { ServicesList } from './ServicesList'

export function BookingSystem() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedService, setSelectedService] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Calendar & Services */}
      <div className="space-y-8">
        <BookingCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <ServicesList
          selectedService={selectedService}
          onSelectService={setSelectedService}
        />
      </div>

      {/* Right Column: Booking Form */}
      <div>
        <BookingForm
          selectedDate={selectedDate}
          selectedService={selectedService}
        />
      </div>
    </div>
  )
}
