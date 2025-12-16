#!/usr/bin/env python3
"""
Update venue addresses for work events
"""
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from app import app, db, Event

def update_venues():
    """Update venue addresses to remove specific workplace locations"""
    with app.app_context():
        print("🔍 Updating venue addresses...\n")
        
        updated_count = 0
        
        # Get all work-related events
        work_events = Event.query.filter_by(type="Praca").all()
        
        for event in work_events:
            old_venue = event.venue
            # Set venue to just the city name
            event.venue = event.city
            
            print(f"🔄 Updated: {event.name}")
            print(f"   Old venue: {old_venue}")
            print(f"   New venue: {event.venue}\n")
            
            updated_count += 1
        
        # Commit all changes
        db.session.commit()
        
        print(f"{'='*60}")
        print(f"✅ Successfully updated {updated_count} work events!")
        print(f"{'='*60}\n")
        
        # Show all events
        all_events = Event.query.order_by(Event.date.desc()).all()
        print(f"📋 All events in database ({len(all_events)} total):")
        for event in all_events:
            print(f"   • {event.date} | {event.name} | {event.venue} | {event.type}")

if __name__ == '__main__':
    print("🚀 Starting venue update...\n")
    update_venues()
