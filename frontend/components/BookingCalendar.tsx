'use client'

import { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isPast } from 'date-fns'
import { pl } from 'date-fns/locale'

interface BookingCalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  useEffect(() => {
    // Fetch booked dates from API
    fetchBookedDates()
  }, [currentMonth])

  const fetchBookedDates = async () => {
    setLoading(true)
    try {
      // For now, use static dates. In production, fetch from API
      setBookedDates([
        '2026-01-18', '2026-01-25', '2026-02-01', '2026-02-14',
        '2026-03-15'  // Our test booking
      ])
    } catch (error) {
      console.error('Error fetching booked dates:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDayClassName = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const classes = ['day-cell']

    if (!isSameMonth(day, currentMonth)) {
      classes.push('opacity-30')
    }
    if (isPast(day) && !isToday(day)) {
      classes.push('past')
    }
    if (bookedDates.includes(dateStr)) {
      classes.push('booked')
    }
    if (selectedDate && isSameDay(day, selectedDate)) {
      classes.push('selected')
    }
    if (isToday(day)) {
      classes.push('today')
    }
    if (!isPast(day) && !bookedDates.includes(dateStr)) {
      classes.push('available')
    }

    return classes.join(' ')
  }

  const handleDayClick = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    if (!isPast(day) && !bookedDates.includes(dateStr) && isSameMonth(day, currentMonth)) {
      onSelectDate(day)
    }
  }

  return (
    <div className="card-dark p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-white/5 rounded transition-colors"
        >
          ←
        </button>
        <h3 className="text-xl font-bold">
          {format(currentMonth, 'LLLL yyyy', { locale: pl })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-white/5 rounded transition-colors"
        >
          →
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-400 font-semibold">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {/* Days */}
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isBooked = bookedDates.includes(dateStr)
          const isAvailable = !isPast(day) && !isBooked && isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              disabled={!isAvailable}
              className={`
                aspect-square p-2 rounded-lg text-sm font-medium transition-all
                ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}
                ${isPast(day) && !isToday(day) ? 'text-gray-600 cursor-not-allowed' : ''}
                ${isBooked ? 'bg-red-900/20 text-red-400 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-gradient-primary text-white' : ''}
                ${isToday(day) ? 'border-2 border-primary' : ''}
                ${isAvailable && !isSelected ? 'hover:bg-white/5 cursor-pointer' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-primary" />
          <span className="text-gray-400">Wybrany</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-900/20" />
          <span className="text-gray-400">Zarezerwowany</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-primary" />
          <span className="text-gray-400">Dzisiaj</span>
        </div>
      </div>
    </div>
  )
}
