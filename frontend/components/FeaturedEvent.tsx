'use client'

export function FeaturedEvent() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        {/* Featured Event Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-dark to-primary mb-12">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-wide">
                🔥 Nadchodzący Event
              </span>
              <span className="px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full text-sm font-bold">
                20-22 Lutego 2025
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              Lady Scorpio Presents
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-yellow-300">
              ZIMOWY ZLOT BALTIC HOUSE
            </h3>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <span className="text-lg">ul. Pińska 1, Kotobrzeg (Podczele)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎵</span>
                <span className="text-lg">Za Sterem: ARCH1TECT</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-3xl mb-2">🎧</div>
                <div className="font-bold">ARCH1TECT</div>
                <div className="text-sm text-gray-300">Main DJ</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-3xl mb-2">🎤</div>
                <div className="font-bold">DJ Gregory</div>
                <div className="text-sm text-gray-300">Special Guest</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-3xl mb-2">🎵</div>
                <div className="font-bold">Angelo Davilla</div>
                <div className="text-sm text-gray-300">Live Set</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-3xl mb-2">🔊</div>
                <div className="font-bold">DJ Bear</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#booking"
                className="px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Zarezerwuj swoje miejsce
              </a>
              <a
                href="https://www.ladyscorpiomusic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-black/60 backdrop-blur-sm border-2 border-white/30 font-bold rounded-lg hover:bg-black/80 transition-all"
              >
                Więcej informacji
              </a>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-dark/20 rounded-full blur-3xl" />
        </div>

        {/* Event Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-dark p-6">
            <div className="text-4xl mb-3">📅</div>
            <h4 className="text-xl font-bold mb-2 gradient-text">3-dniowy Event</h4>
            <p className="text-gray-400">
              20-22 Lutego 2025<br />
              Czwartek - Sobota<br />
              Rozpoczęcie: 20:00
            </p>
          </div>

          <div className="card-dark p-6">
            <div className="text-4xl mb-3">🎶</div>
            <h4 className="text-xl font-bold mb-2 gradient-text">Muzyka</h4>
            <p className="text-gray-400">
              House • Techno • Electro<br />
              Baltic House Climate<br />
              Non-stop DJ Sets
            </p>
          </div>

          <div className="card-dark p-6">
            <div className="text-4xl mb-3">🏠</div>
            <h4 className="text-xl font-bold mb-2 gradient-text">Lokalizacja</h4>
            <p className="text-gray-400">
              Rare Rotation<br />
              ul. Pińska 1<br />
              Kotobrzeg (Podczele)
            </p>
          </div>
        </div>

        {/* Lineup Section */}
        <div className="card-dark p-8 mb-12">
          <h3 className="text-3xl font-bold mb-6 gradient-text text-center">
            Line-up
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-dark rounded-lg border border-white/10">
              <div className="text-5xl">🎧</div>
              <div>
                <h4 className="text-2xl font-bold mb-1">ARCH1TECT</h4>
                <p className="text-primary font-semibold mb-2">Headliner • Za sterem</p>
                <p className="text-sm text-gray-400">
                  Professional DJ services • House & Techno specialist • Festival experience
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-dark rounded-lg border border-white/10">
              <div className="text-5xl">🎤</div>
              <div>
                <h4 className="text-2xl font-bold mb-1">DJ Gregory</h4>
                <p className="text-primary font-semibold mb-2">Special Guest</p>
                <p className="text-sm text-gray-400">
                  House music legend • International DJ • Baltic House regular
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-dark rounded-lg border border-white/10">
              <div className="text-5xl">🎵</div>
              <div>
                <h4 className="text-2xl font-bold mb-1">Angelo Davilla</h4>
                <p className="text-primary font-semibold mb-2">Live Set</p>
                <p className="text-sm text-gray-400">
                  Electronic music producer • Live performances • Techno vibes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-dark rounded-lg border border-white/10">
              <div className="text-5xl">🔊</div>
              <div>
                <h4 className="text-2xl font-bold mb-1">DJ Bear & More</h4>
                <p className="text-primary font-semibold mb-2">Support Artists</p>
                <p className="text-sm text-gray-400">
                  Mikrus • Vodegny • Local talents • Warming up the crowd
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="bg-gradient-primary p-1 rounded-2xl">
          <div className="bg-dark rounded-2xl p-8">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 gradient-text">
                Bilety i Rezerwacje
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                Zarezerwuj swoje miejsce na największym zimowym evencie Baltic House!
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="bg-white/5 px-6 py-3 rounded-lg">
                  <div className="text-sm text-gray-400">Wejściówka 3-dniowa</div>
                  <div className="text-2xl font-bold text-primary">Zapytaj o cenę</div>
                </div>
                <div className="bg-white/5 px-6 py-3 rounded-lg">
                  <div className="text-sm text-gray-400">Wejściówka 1-dniowa</div>
                  <div className="text-2xl font-bold text-primary">Zapytaj o cenę</div>
                </div>
              </div>
              <a
                href="#booking"
                className="inline-block px-10 py-4 bg-gradient-primary font-bold text-lg rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-xl"
              >
                Zarezerwuj teraz →
              </a>
              <p className="text-sm text-gray-500 mt-4">
                Kontakt: booking@arch1tect.pl • +48 503 691 808
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
