'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface BookingFormProps {
  selectedDate: Date | null
  selectedService: number | null
}

export function BookingForm({ selectedDate, selectedService }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    venue_name: '',
    venue_address: '',
    venue_city: '',
    event_time: '20:00',
    event_duration_hours: 4,
    event_type: 'club',
    guest_count: 100,
    special_requests: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate) {
      setError('Proszę wybrać datę z kalendarza')
      return
    }

    if (!selectedService) {
      setError('Proszę wybrać usługę')
      return
    }

    setLoading(true)
    setError('')

    try {
      const bookingData = {
        ...formData,
        event_date: format(selectedDate, 'yyyy-MM-dd'),
        service_id: selectedService
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          venue_name: '',
          venue_address: '',
          venue_city: '',
          event_time: '20:00',
          event_duration_hours: 4,
          event_type: 'club',
          guest_count: 100,
          special_requests: ''
        })
      } else {
        setError(data.error || 'Wystąpił błąd podczas rezerwacji')
      }
    } catch (err) {
      setError('Nie udało się połączyć z serwerem')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (success) {
    return (
      <div className="card-dark p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h3 className="text-2xl font-bold mb-2 gradient-text">Dziękujemy za rezerwację!</h3>
          <p className="text-gray-400">
            Potwierdzenie zostało wysłane na adres email. Skontaktujemy się z Tobą w ciągu 24 godzin.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="btn-gradient px-6 py-3 rounded-lg font-semibold"
        >
          Nowa rezerwacja
        </button>
      </div>
    )
  }

  return (
    <div className="card-dark p-6">
      <h3 className="text-2xl font-bold mb-6 gradient-text">Formularz rezerwacji</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {selectedDate && (
        <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm text-gray-400">Wybrany termin:</p>
          <p className="text-lg font-bold">{format(selectedDate, 'd MMMM yyyy', { locale: require('date-fns/locale/pl').pl })}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Imię i nazwisko *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            placeholder="Jan Kowalski"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            placeholder="jan@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Telefon *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            placeholder="+48 123 456 789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Typ eventu *</label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
          >
            <option value="club">Klub</option>
            <option value="festival">Festiwal</option>
            <option value="private">Event prywatny</option>
            <option value="corporate">Event firmowy</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Godzina rozpoczęcia *</label>
            <input
              type="time"
              name="event_time"
              value={formData.event_time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Czas trwania (godz) *</label>
            <input
              type="number"
              name="event_duration_hours"
              value={formData.event_duration_hours}
              onChange={handleChange}
              min="2"
              max="12"
              required
              className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nazwa miejsca *</label>
          <input
            type="text"
            name="venue_name"
            value={formData.venue_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            placeholder="Nazwa klubu/lokalu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Adres</label>
          <input
            type="text"
            name="venue_address"
            value={formData.venue_address}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            placeholder="ul. Przykładowa 123"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Miasto *</label>
          <input
            type="text"
            name="venue_city"
            value={formData.venue_city}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            placeholder="Warszawa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Liczba gości</label>
          <input
            type="number"
            name="guest_count"
            value={formData.guest_count}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Specjalne życzenia</label>
          <textarea
            name="special_requests"
            value={formData.special_requests}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-dark border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="Opisz swoje oczekiwania, preferencje muzyczne, dodatkowe informacje..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedDate || !selectedService}
          className="w-full btn-gradient px-6 py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Wysyłanie...' : 'Wyślij zapytanie'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          * Pola wymagane
        </p>
      </form>
    </div>
  )
}
