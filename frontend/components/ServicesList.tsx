'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: number
  name: string
  description: string
  service_type: string
  base_price: number
  price_per_hour: number
  min_hours: number
  max_hours: number
  includes_equipment: boolean
  includes_lighting: boolean
  includes_mc_services: boolean
}

interface ServicesListProps {
  selectedService: number | null
  onSelectService: (id: number) => void
}

export function ServicesList({ selectedService, onSelectService }: ServicesListProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`)
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card-dark p-6">
        <p className="text-gray-400">Ładowanie usług...</p>
      </div>
    )
  }

  return (
    <div className="card-dark p-6">
      <h3 className="text-2xl font-bold mb-4 gradient-text">Wybierz usługę</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all text-left
              ${selectedService === service.id
                ? 'border-primary bg-primary/10'
                : 'border-white/10 hover:border-white/30'
              }
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-bold">{service.name}</h4>
              <span className="text-primary font-bold">{service.base_price} PLN</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{service.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-white/5 rounded">
                {service.price_per_hour} PLN/godz
              </span>
              <span className="px-2 py-1 bg-white/5 rounded">
                {service.min_hours}-{service.max_hours} godz
              </span>
              {service.includes_equipment && (
                <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded">
                  ✓ Sprzęt
                </span>
              )}
              {service.includes_lighting && (
                <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded">
                  ✓ Oświetlenie
                </span>
              )}
              {service.includes_mc_services && (
                <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded">
                  ✓ MC
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
