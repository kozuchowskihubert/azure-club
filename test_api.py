#!/usr/bin/env python3
"""Quick test script for ARCH1TECT Booking API"""
import os
import sys

# Set up environment
os.environ['DATABASE_URL'] = 'sqlite:///bookings.db'
os.environ['SECRET_KEY'] = 'b5a83cf2804f9a54c140c626e510f13743f349e576b7bb433bf2252c1e7be16c'

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api import create_app

def test_api():
    """Test the API endpoints"""
    app = create_app('development')
    
    print("🧪 Testing ARCH1TECT Booking API...\n")
    
    with app.test_client() as client:
        # Test 1: Health check
        print("1️⃣  Testing /api/health...")
        response = client.get('/api/health')
        if response.status_code == 200:
            data = response.get_json()
            print(f"   ✅ Status: {data.get('status')}")
            print(f"   📝 Message: {data.get('message')}")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
        
        # Test 2: Get services
        print("\n2️⃣  Testing /api/services...")
        response = client.get('/api/services')
        if response.status_code == 200:
            data = response.get_json()
            services = data.get('services', [])
            print(f"   ✅ Found {len(services)} DJ services:")
            for service in services:
                print(f"      • {service['name']} - {service['base_price']} PLN")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
        
        # Test 3: Check availability
        print("\n3️⃣  Testing /api/check-availability...")
        response = client.post('/api/check-availability',
            json={'date': '2025-03-15'},
            content_type='application/json'
        )
        if response.status_code == 200:
            data = response.get_json()
            print(f"   ✅ Available: {data.get('available')}")
            print(f"   📝 Message: {data.get('message')}")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
        
        print("\n🎉 API tests completed!\n")

if __name__ == '__main__':
    test_api()
