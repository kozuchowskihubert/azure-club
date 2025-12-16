#!/usr/bin/env python3
"""
Add life events to the database
"""
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from app import app, db, Event

# Life events data
LIFE_EVENTS = [
    {
        "name": "Archidesignstudio",
        "date": "2022-01-01",
        "time": "09:00",
        "venue": "Gdańsk",
        "city": "Gdańsk",
        "type": "Praca",
        "description": "Rozpoczęcie nowej pracy w firmie Archidesignstudio",
        "artists": "Hubert Kozuchowski",
        "price": None,
        "capacity": None,
        "image_url": "/images/work-archidesign.jpg",
        "status": "completed"
    },
    {
        "name": "RTIA Events",
        "date": "2014-01-01",
        "time": "09:00",
        "venue": "Gdańsk",
        "city": "Gdańsk",
        "type": "Praca",
        "description": "Rozpoczęcie nowej pracy w firmie RTIA events",
        "artists": "Hubert Kozuchowski",
        "price": None,
        "capacity": None,
        "image_url": "/images/work-rtia.jpg",
        "status": "completed"
    },
    {
        "name": "Pumpingland - Rozpoczęcie Pracy",
        "date": "2013-06-01",
        "time": "09:00",
        "venue": "Gdańsk",
        "city": "Gdańsk",
        "type": "Praca",
        "description": "Rozpoczęcie nowej pracy w firmie Pumpingland",
        "artists": "Hubert Kozuchowski",
        "price": None,
        "capacity": None,
        "image_url": "/images/work-pumpingland.jpg",
        "status": "completed"
    },
    {
        "name": "Narodziny PUMPINGLAND",
        "date": "2013-01-01",
        "time": "20:00",
        "venue": "Gdańsk Club",
        "city": "Gdańsk",
        "type": "Impreza",
        "description": "Narodziny legendarnego projektu PUMPINGLAND - początek wielkiej przygody z muzyką techno! 🎧",
        "artists": "PUMPINGLAND Crew",
        "price": 20,
        "capacity": 500,
        "image_url": "/images/pumpingland-birth.jpg",
        "status": "completed"
    },
    {
        "name": "Clubbasse",
        "date": "2002-01-01",
        "time": "09:00",
        "venue": "Gdańsk",
        "city": "Gdańsk",
        "type": "Praca",
        "description": "Rozpoczęcie nowej pracy w firmie Clubbasse - początek kariery w branży eventowej",
        "artists": "Hubert Kozuchowski",
        "price": None,
        "capacity": None,
        "image_url": "/images/work-clubbasse.jpg",
        "status": "completed"
    }
]

def add_life_events():
    """Add life events to database"""
    with app.app_context():
        print("🔍 Checking existing events...")
        
        added_count = 0
        updated_count = 0
        
        for event_data in LIFE_EVENTS:
            # Check if event already exists (by name and date)
            existing_event = Event.query.filter_by(
                name=event_data['name'],
                date=event_data['date']
            ).first()
            
            if existing_event:
                print(f"⚠️  Event already exists: {event_data['name']} ({event_data['date']})")
                # Update existing event
                for key, value in event_data.items():
                    setattr(existing_event, key, value)
                updated_count += 1
            else:
                # Create new event
                event = Event(**event_data)
                db.session.add(event)
                print(f"✅ Adding: {event_data['name']} ({event_data['date']}) - {event_data['type']}")
                added_count += 1
        
        # Commit all changes
        db.session.commit()
        
        print(f"\n{'='*60}")
        print(f"✅ Successfully processed life events!")
        print(f"   📊 Added: {added_count} events")
        print(f"   🔄 Updated: {updated_count} events")
        print(f"   📅 Total life events: {len(LIFE_EVENTS)}")
        print(f"{'='*60}\n")
        
        # Show all events
        all_events = Event.query.order_by(Event.date.desc()).all()
        print(f"📋 All events in database ({len(all_events)} total):")
        for event in all_events:
            print(f"   • {event.date} | {event.name} | {event.type} | {event.city}")

if __name__ == '__main__':
    print("🚀 Starting life events import...\n")
    add_life_events()
