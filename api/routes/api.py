"""Main API routes for DJ booking system."""
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from api import db
from api.models.customer import Customer
from api.models.dj_booking import DJBooking
from api.models.event_service import EventService
from api.models.notification import Notification
from api.config.email import send_contact_email, send_booking_confirmation
import re

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'ARCH1TECT DJ Booking API',
        'timestamp': datetime.utcnow().isoformat()
    }), 200


@bp.route('/services', methods=['GET'])
def list_services():
    """
    Get list of available DJ services.
    """
    try:
        services = EventService.query.filter_by(is_active=True).all()
        return jsonify({
            'success': True,
            'services': [service.to_dict() for service in services]
        }), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching services: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Nie udało się pobrać listy usług'
        }), 500


@bp.route('/check-availability', methods=['POST'])
def check_availability():
    """
    Check if a specific date/time is available for booking.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('date'):
            return jsonify({
                'success': False,
                'error': 'Data jest wymagana'
            }), 400
        
        # Parse date
        try:
            booking_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Nieprawidłowy format daty'
            }), 400
        
        # Check for existing bookings on this date
        existing_bookings = DJBooking.query.filter_by(
            event_date=booking_date
        ).filter(
            DJBooking.status.in_(['pending', 'confirmed'])
        ).all()
        
        is_available = len(existing_bookings) == 0
        
        return jsonify({
            'success': True,
            'available': is_available,
            'date': data['date'],
            'message': 'Termin dostępny' if is_available else 'Termin zajęty'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f'Error checking availability: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Błąd podczas sprawdzania dostępności'
        }), 500


@bp.route('/contact', methods=['POST'])
def contact_form():
    """
    Handle contact form submissions.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'message']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Brakujące wymagane pola: {", ".join(missing_fields)}'
            }), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({
                'success': False,
                'error': 'Nieprawidłowy format adresu email'
            }), 400
        
        # Send email
        email_sent = send_contact_email(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            message=data['message']
        )
        
        return jsonify({
            'success': True,
            'message': 'Wiadomość została wysłana. Odpiszę tak szybko jak to możliwe!',
            'email_sent': email_sent
        }), 200
        
    except Exception as e:
        current_app.logger.error(f'Contact form error: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Przepraszamy, wystąpił błąd. Spróbuj ponownie lub zadzwoń: +48 503 691 808'
        }), 500


@bp.route('/book-event', methods=['POST'])
def book_event():
    """
    Create a new DJ booking.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'event_type', 'event_date', 'event_time', 'venue_name']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Brakujące wymagane pola: {", ".join(missing_fields)}'
            }), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({
                'success': False,
                'error': 'Nieprawidłowy format adresu email'
            }), 400
        
        # Parse date and time
        try:
            event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
            event_time = datetime.strptime(data['event_time'], '%H:%M').time()
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Nieprawidłowy format daty lub godziny'
            }), 400
        
        # Validate that the event is not in the past
        if event_date < datetime.now().date():
            return jsonify({
                'success': False,
                'error': 'Nie można zarezerwować terminu w przeszłości'
            }), 400
        
        # Check availability
        existing_booking = DJBooking.query.filter_by(
            event_date=event_date
        ).filter(
            DJBooking.status.in_(['pending', 'confirmed'])
        ).first()
        
        if existing_booking:
            return jsonify({
                'success': False,
                'error': 'Ten termin jest już zarezerwowany. Proszę wybrać inną datę.'
            }), 400
        
        # Find or create customer
        customer = Customer.query.filter_by(email=data['email']).first()
        
        if customer:
            # Update existing customer
            name_parts = data['name'].split(' ', 1)
            customer.first_name = name_parts[0] if name_parts else 'Klient'
            customer.last_name = name_parts[1] if len(name_parts) > 1 else ''
            customer.phone = data['phone']
            customer.company = data.get('company')
            customer.updated_at = datetime.utcnow()
        else:
            # Create new customer
            name_parts = data['name'].split(' ', 1)
            customer = Customer(
                first_name=name_parts[0] if name_parts else 'Klient',
                last_name=name_parts[1] if len(name_parts) > 1 else '',
                email=data['email'],
                phone=data['phone'],
                company=data.get('company'),
                address=data.get('venue_address'),
                city=data.get('venue_city')
            )
            db.session.add(customer)
            db.session.flush()  # Get customer ID
        
        # Find or create service
        service_name = data.get('service', 'DJ Set - Club')
        service = EventService.query.filter_by(name=service_name).first()
        
        if not service:
            # Use first available service as fallback
            service = EventService.query.first()
            if not service:
                # Create a basic service
                service = EventService(
                    name='DJ Set - Club',
                    description='Professional DJ set for club events',
                    service_type='dj_set_club',
                    base_price=1500.00,
                    min_hours=2,
                    max_hours=8,
                    is_active=True
                )
                db.session.add(service)
                db.session.flush()
        
        # Create booking
        event_title = f"{data['event_type'].title()} - {data['venue_name']}"
        
        booking = DJBooking(
            customer_id=customer.id,
            service_id=service.id,
            event_date=event_date,
            event_time=event_time,
            event_duration_hours=data.get('duration', 4),
            event_type=data['event_type'],
            venue_name=data['venue_name'],
            venue_address=data.get('venue_address'),
            venue_city=data.get('venue_city'),
            guest_count=data.get('guest_count'),
            special_requests=data.get('special_requests'),
            budget=data.get('budget'),
            preferred_contact_method=data.get('preferred_contact', 'email'),
            status='pending',
            event_title=event_title,
            calendar_platforms='Google Calendar,Apple Calendar,Outlook,Office 365'
        )
        
        db.session.add(booking)
        db.session.commit()
        
        # Prepare booking data for email
        booking_data = {
            'id': booking.id,
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'event_date': event_date.strftime('%Y-%m-%d'),
            'event_time': event_time.strftime('%H:%M'),
            'event_type': data['event_type'],
            'venue_name': data['venue_name'],
            'venue_address': data.get('venue_address', ''),
            'duration': data.get('duration', 4),
            'service': service.name,
            'special_requests': data.get('special_requests', '')
        }
        
        # Send booking confirmation emails
        email_sent = send_booking_confirmation(booking_data)
        
        # Update booking confirmation status
        if email_sent:
            booking.confirmation_sent = True
            db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Rezerwacja została przyjęta! Skontaktuję się wkrótce.',
            'booking_id': booking.id,
            'booking_data': {
                'event_date': booking_data['event_date'],
                'event_time': booking_data['event_time'],
                'venue_name': booking_data['venue_name'],
                'event_type': booking_data['event_type'],
                'duration': booking_data['duration']
            },
            'email_sent': email_sent
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Booking error: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Przepraszamy, wystąpił błąd. Spróbuj ponownie lub zadzwoń: +48 503 691 808'
        }), 500
