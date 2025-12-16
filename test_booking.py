#!/usr/bin/env python3
"""Test booking creation"""
import os
import sys

os.environ['DATABASE_URL'] = 'sqlite:///bookings.db'
os.environ['SECRET_KEY'] = 'b5a83cf2804f9a54c140c626e510f13743f349e576b7bb433bf2252c1e7be16c'

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api import create_app

def test_booking():
    """Test creating a booking"""
    app = create_app('development')
    
    print("🎵 Testing DJ Event Booking...\n")
    
    with app.test_client() as client:
        # Create a test booking
        booking_data = {
            "name": "Jan Kowalski",
            "email": "jan.kowalski@example.com",
            "phone": "+48123456789",
            "event_date": "2026-03-15",
            "event_time": "20:00",
            "event_duration_hours": 4,
            "event_type": "club",
            "venue_name": "Klub Muzyczny",
            "venue_address": "ul. Przykładowa 123",
            "venue_city": "Warszawa",
            "guest_count": 150,
            "special_requests": "Proszę o muzykę house i techno",
            "service_id": 1
        }
        
        print("📝 Booking Details:")
        print(f"   Customer: {booking_data['name']}")
        print(f"   Email: {booking_data['email']}")
        print(f"   Phone: {booking_data['phone']}")
        print(f"   Date: {booking_data['event_date']} at {booking_data['event_time']}")
        print(f"   Duration: {booking_data['event_duration_hours']} hours")
        print(f"   Venue: {booking_data['venue_name']}, {booking_data['venue_city']}")
        print(f"   Type: {booking_data['event_type']}")
        print(f"   Guests: {booking_data['guest_count']}")
        print(f"   Special Requests: {booking_data['special_requests']}\n")
        
        response = client.post('/api/book-event',
            json=booking_data,
            content_type='application/json'
        )
        
        if response.status_code == 200:
            data = response.get_json()
            print("✅ BOOKING SUCCESSFUL!")
            print(f"   Booking ID: {data.get('booking_id')}")
            print(f"   Status: Confirmed")
            print(f"   Confirmation: {data.get('message')}")
            if not data.get('confirmation_sent'):
                print(f"   Note: Email not sent (configure MAIL settings in .env)")
            else:
                print(f"   Email confirmation sent!")
        else:
            data = response.get_json()
            print(f"❌ BOOKING FAILED")
            print(f"   Status Code: {response.status_code}")
            print(f"   Error: {data.get('error', 'Unknown error')}")
        
        # Show all bookings
        print("\n📊 All Bookings in Database:")
        from api.models import DJBooking
        with app.app_context():
            bookings = DJBooking.query.all()
            print(f"   Total bookings: {len(bookings)}")
            for b in bookings:
                print(f"   #{b.id}: {b.event_date} at {b.event_time} - {b.venue_name} ({b.status})")

if __name__ == '__main__':
    test_booking()
