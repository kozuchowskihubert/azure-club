#!/usr/bin/env python3
"""
Remove specific events from database
"""
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from app import app, db, Event

# Events to remove
EVENTS_TO_REMOVE = [
    "Księżniczka Tatusia",
    "Bajteltv"
]

def remove_events():
    """Remove specific events from database"""
    with app.app_context():
        print("🔍 Searching for events to remove...\n")
        
        removed_count = 0
        
        for event_name in EVENTS_TO_REMOVE:
            events = Event.query.filter_by(name=event_name).all()
            
            if events:
                for event in events:
                    print(f"❌ Removing: {event.name} ({event.date}) - {event.type}")
                    db.session.delete(event)
                    removed_count += 1
            else:
                print(f"⚠️  Not found: {event_name}")
        
        # Commit all changes
        db.session.commit()
        
        print(f"\n{'='*60}")
        print(f"✅ Successfully removed {removed_count} events!")
        print(f"{'='*60}\n")
        
        # Show remaining events
        all_events = Event.query.order_by(Event.date.desc()).all()
        print(f"📋 Remaining events in database ({len(all_events)} total):")
        for event in all_events:
            print(f"   • {event.date} | {event.name} | {event.type} | {event.city}")

if __name__ == '__main__':
    print("🗑️  Starting event removal...\n")
    remove_events()
