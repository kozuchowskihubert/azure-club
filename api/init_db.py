"""Database initialization script with sample DJ services."""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import create_app, db
from api.models.event_service import EventService


def init_db():
    """Initialize database with DJ services."""
    app = create_app('development')
    
    with app.app_context():
        # Create tables
        print("🎵 Creating database tables...")
        db.create_all()
        
        # Check if services already exist
        if EventService.query.first() is not None:
            print("✅ Database already initialized with services.")
            return
        
        print("🎧 Adding DJ services...")
        
        # Add DJ services
        services = [
            EventService(
                name='DJ Set - Klub',
                description='Profesjonalny set DJ dla klubów. Zawiera pełen sprzęt, oświetlenie i dostosowanie repertuaru do miejsca.',
                service_type='dj_set_club',
                base_price=1500.00,
                price_per_hour=400.00,
                min_hours=2,
                max_hours=6,
                is_active=True,
                includes_equipment=True,
                includes_lighting=True,
                includes_mc_services=False,
                requires_consultation=False
            ),
            EventService(
                name='DJ Set - Festiwal',
                description='Występy na dużych eventach i festiwalach. Doświadczenie w graniu dla tysięcy ludzi na open air i indoor.',
                service_type='dj_set_festival',
                base_price=3000.00,
                price_per_hour=600.00,
                min_hours=1,
                max_hours=4,
                is_active=True,
                includes_equipment=True,
                includes_lighting=False,
                includes_mc_services=False,
                requires_consultation=True
            ),
            EventService(
                name='Event Prywatny',
                description='DJ na imprezy prywatne - wesela, urodziny, eventy firmowe. Dostosowanie muzyki do Twoich preferencji.',
                service_type='private_event',
                base_price=2000.00,
                price_per_hour=500.00,
                min_hours=3,
                max_hours=8,
                is_active=True,
                includes_equipment=True,
                includes_lighting=True,
                includes_mc_services=True,
                requires_consultation=False
            ),
            EventService(
                name='Event Firmowy',
                description='Profesjonalna oprawa muzyczna eventów korporacyjnych. Doświadczenie z wieloma międzynarodowymi firmami.',
                service_type='corporate_event',
                base_price=2500.00,
                price_per_hour=550.00,
                min_hours=2,
                max_hours=6,
                is_active=True,
                includes_equipment=True,
                includes_lighting=True,
                includes_mc_services=True,
                requires_consultation=True
            ),
            EventService(
                name='Produkcja Muzyczna',
                description='Tworzenie autorskich utworów, remiksów i sound designu. Od pomysłu po mastering - kompleksowa produkcja.',
                service_type='production',
                base_price=1000.00,
                price_per_hour=200.00,
                min_hours=4,
                max_hours=20,
                is_active=True,
                includes_equipment=False,
                includes_lighting=False,
                includes_mc_services=False,
                requires_consultation=True
            ),
            EventService(
                name='DJ Masterclass',
                description='Warsztaty i szkolenia DJ. Nauka technik DJskich, produkcji muzycznej i występów na żywo.',
                service_type='workshop',
                base_price=800.00,
                price_per_hour=150.00,
                min_hours=2,
                max_hours=8,
                is_active=True,
                includes_equipment=True,
                includes_lighting=False,
                includes_mc_services=False,
                requires_consultation=True
            )
        ]
        
        for service in services:
            db.session.add(service)
        
        db.session.commit()
        
        print(f"✅ Added {len(services)} DJ services")
        print("\n🎉 Database initialized successfully!")
        print("\nAvailable services:")
        for service in services:
            print(f"   - {service.name} ({service.service_type})")


if __name__ == '__main__':
    init_db()
