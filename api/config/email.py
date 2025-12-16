"""Email configuration and sending functions for ARCH1TECT DJ bookings."""
import os
from datetime import datetime
from flask import current_app
from flask_mail import Message
from api import mail
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


def send_booking_confirmation(booking_data: Dict[str, Any]) -> bool:
    """
    Send booking confirmation emails to customer and admin.
    
    Args:
        booking_data (dict): Dictionary containing booking information
            - name: Customer name
            - email: Customer email
            - phone: Customer phone
            - event_date: Event date (YYYY-MM-DD)
            - event_time: Event time (HH:MM)
            - event_type: Type of event
            - venue_name: Venue name
            - venue_address: Venue address
            - duration: Event duration in hours
            - service: Service name
            - special_requests: Special requests
            
    Returns:
        bool: True if emails sent successfully
    """
    
    # Format date for display
    try:
        date_obj = datetime.strptime(booking_data['event_date'], '%Y-%m-%d')
        formatted_date = date_obj.strftime('%d.%m.%Y (%A)')
        # Translate day names to Polish
        day_translation = {
            'Monday': 'Poniedziałek',
            'Tuesday': 'Wtorek',
            'Wednesday': 'Środa',
            'Thursday': 'Czwartek',
            'Friday': 'Piątek',
            'Saturday': 'Sobota',
            'Sunday': 'Niedziela'
        }
        for eng, pl in day_translation.items():
            formatted_date = formatted_date.replace(eng, pl)
    except:
        formatted_date = booking_data['event_date']
    
    # Admin email
    booking_email = os.environ.get('BOOKING_EMAIL', 'booking@arch1tect.pl')
    
    # ========== Customer Confirmation Email ==========
    customer_msg = Message(
        subject=f'✅ Potwierdzenie rezerwacji - {formatted_date}',
        recipients=[booking_data['email']]
    )
    
    customer_msg.html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #0a0a0a;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #DC143C 0%, #8B2A9E 100%); padding: 40px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🎧</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Rezerwacja Potwierdzona!
            </h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">
                ARCH1TECT DJ • PRODUCER
            </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px; background-color: #1a1a1a;">
            <p style="color: #f0f0f0; font-size: 16px; margin: 0 0 20px 0;">
                Cześć <strong>{booking_data['name']}</strong>,
            </p>
            
            <p style="color: #b0b0b0; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                Dziękuję za zarezerwowanie mojego występu! Z przyjemnością potwierdzam umówione wydarzenie.
            </p>
            
            <!-- Booking Details Box -->
            <div style="background: linear-gradient(135deg, #1a0a14 0%, #0f0517 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #DC143C;">
                <h2 style="color: #DC143C; font-size: 18px; margin: 0 0 20px 0; text-align: center;">
                    🎵 Szczegóły Wydarzenia
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #DC143C;">📅</span>
                            <strong style="color: #f0f0f0; margin-left: 8px;">Data:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 15px; color: #f0f0f0; font-weight: bold;">
                            {formatted_date}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #DC143C;">🕐</span>
                            <strong style="color: #f0f0f0; margin-left: 8px;">Godzina:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 15px; color: #DC143C; font-weight: bold;">
                            {booking_data['event_time']}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #DC143C;">⏱️</span>
                            <strong style="color: #f0f0f0; margin-left: 8px;">Czas trwania:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 15px; color: #f0f0f0;">
                            {booking_data.get('duration', 4)} godzin
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #DC143C;">🎪</span>
                            <strong style="color: #f0f0f0; margin-left: 8px;">Typ:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 15px; color: #f0f0f0;">
                            {booking_data.get('event_type', 'Event').title()}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #DC143C;">📍</span>
                            <strong style="color: #f0f0f0; margin-left: 8px;">Miejsce:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 15px; color: #f0f0f0;">
                            {booking_data.get('venue_name', 'TBD')}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #DC143C;">🔧</span>
                            <strong style="color: #f0f0f0; margin-left: 8px;">Usługa:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 15px; color: #f0f0f0;">
                            {booking_data.get('service', 'DJ Set')}
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Special Requests -->
            {f'''
            <div style="margin: 25px 0;">
                <h3 style="color: #f0f0f0; font-size: 16px; margin: 0 0 10px 0;">
                    📝 Dodatkowe informacje:
                </h3>
                <div style="background: #0f0f0f; padding: 15px; border-left: 4px solid #8B2A9E; border-radius: 4px; color: #b0b0b0; line-height: 1.6;">
                    {booking_data.get('special_requests', 'Brak dodatkowych informacji')}
                </div>
            </div>
            ''' if booking_data.get('special_requests') else ''}
            
            <!-- Important Info -->
            <div style="background: #1a0a14; border: 2px solid #8B2A9E; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <div style="display: flex; align-items: flex-start;">
                    <div style="font-size: 24px; margin-right: 15px;">ℹ️</div>
                    <div>
                        <h3 style="color: #8B2A9E; font-size: 16px; margin: 0 0 15px 0;">
                            Ważne informacje
                        </h3>
                        <ul style="color: #b0b0b0; margin: 0; padding-left: 20px; line-height: 1.8;">
                            <li>Skontaktuję się 48h przed wydarzeniem w celu ostatecznego potwierdzenia</li>
                            <li>W razie potrzeby zmiany terminu, prosimy o kontakt <strong>minimum 7 dni wcześniej</strong></li>
                            <li>Przygotuj dostęp do miejsca oraz informacje techniczne (dostępna moc, sprzęt)</li>
                            <li>W razie pytań jestem dostępny pod numerem telefonu lub email</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Contact Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="tel:+48503691808" style="display: inline-block; background: linear-gradient(135deg, #DC143C 0%, #8B2A9E 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                    📞 Zadzwoń w razie pytań
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 25px 20px; background-color: #0a0a0a; text-align: center; border-top: 1px solid #333;">
            <h3 style="color: #ffffff; margin: 0 0 10px 0; font-size: 18px;">
                ARCH1TECT - Professional DJ & Producer
            </h3>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">
                📞 Telefon: <a href="tel:+48503691808" style="color: #DC143C; text-decoration: none;">+48 503 691 808</a>
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">
                ✉️ Email: <a href="mailto:booking@arch1tect.pl" style="color: #DC143C; text-decoration: none;">booking@arch1tect.pl</a>
            </p>
            <p style="margin: 15px 0 5px 0; color: #666; font-size: 12px;">
                <a href="https://lively-river-087542903.3.azurestaticapps.net" style="color: #8B2A9E; text-decoration: none;">www.arch1tect.pl</a>
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    # ========== Admin Notification Email ==========
    admin_msg = Message(
        subject=f'🎧 Nowa rezerwacja DJ - {formatted_date} o {booking_data["event_time"]}',
        recipients=[booking_email]
    )
    
    admin_msg.html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #DC143C 0%, #8B2A9E 100%); padding: 25px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                🎧 Nowa Rezerwacja Wydarzenia
            </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px; background-color: #f9fafb;">
            <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0;">
                Szczegóły rezerwacji:
            </h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #DC143C;">
                <h3 style="color: #DC143C; margin-top: 0; font-size: 16px;">👤 Dane klienta:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Imię i nazwisko:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937;">
                            {booking_data['name']}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Telefon:
                        </td>
                        <td style="padding: 12px 0;">
                            <a href="tel:{booking_data['phone']}" style="color: #DC143C; text-decoration: none; font-weight: bold;">
                                {booking_data['phone']}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Email:
                        </td>
                        <td style="padding: 12px 0;">
                            <a href="mailto:{booking_data['email']}" style="color: #8B2A9E; text-decoration: none;">
                                {booking_data['email']}
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #8B2A9E;">
                <h3 style="color: #8B2A9E; margin-top: 0; font-size: 16px;">🎵 Szczegóły wydarzenia:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151; width: 35%;">
                            Data:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937; font-weight: bold; font-size: 16px;">
                            {formatted_date}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Godzina:
                        </td>
                        <td style="padding: 12px 0; color: #DC143C; font-weight: bold; font-size: 18px;">
                            {booking_data['event_time']}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Czas trwania:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937;">
                            {booking_data.get('duration', 4)} godzin
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Typ wydarzenia:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937;">
                            {booking_data.get('event_type', 'Event')}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Miejsce:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937;">
                            {booking_data.get('venue_name', 'TBD')}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Usługa:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937;">
                            {booking_data.get('service', 'DJ Set')}
                        </td>
                    </tr>
                </table>
            </div>
            
            {f'''
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">📝 Szczególne życzenia:</h3>
                <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #DC143C; border-radius: 4px; color: #4b5563; line-height: 1.6;">
                    {booking_data.get('special_requests', 'Brak szczegółowych informacji')}
                </div>
            </div>
            ''' if booking_data.get('special_requests') else ''}
            
            <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <strong>💡 Akcja wymagana:</strong> Skontaktuj się z klientem w ciągu 24h w celu potwierdzenia szczegółów.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; background-color: #f3f4f6; text-align: center; border-top: 2px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                System rezerwacji ARCH1TECT DJ
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    try:
        # Send both emails
        mail.send(customer_msg)
        logger.info(f"✅ Booking confirmation sent to customer: {booking_data['email']}")
        
        mail.send(admin_msg)
        logger.info(f"✅ Booking notification sent to admin: {booking_email}")
        
        return True
    except Exception as e:
        logger.error(f"❌ Error sending booking confirmation: {e}")
        return False


def send_contact_email(name: str, email: str, phone: str, message: str) -> bool:
    """
    Send contact form email to admin.
    
    Args:
        name: Sender name
        email: Sender email
        phone: Sender phone
        message: Message content
        
    Returns:
        bool: True if email sent successfully
    """
    admin_email = os.environ.get('BOOKING_EMAIL', 'booking@arch1tect.pl')
    
    msg = Message(
        subject=f'📧 Nowa wiadomość od {name}',
        recipients=[admin_email]
    )
    
    msg.html = f"""
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #DC143C;">📧 Nowa wiadomość kontaktowa</h2>
        <p><strong>Od:</strong> {name}</p>
        <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
        <p><strong>Telefon:</strong> <a href="tel:{phone}">{phone}</a></p>
        <hr>
        <h3>Wiadomość:</h3>
        <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #DC143C;">
            {message}
        </p>
    </div>
</body>
</html>
    """
    
    try:
        mail.send(msg)
        logger.info(f"✅ Contact email sent from {email}")
        return True
    except Exception as e:
        logger.error(f"❌ Error sending contact email: {e}")
        return False
