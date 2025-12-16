#!/bin/bash
# Get Neon PostgreSQL URL from Vercel and save to backend/.env

echo "🔍 Pobieranie POSTGRES_URL z Vercel..."

# Get POSTGRES_URL from Vercel production
POSTGRES_URL=$(vercel env ls | grep "POSTGRES_URL " | awk '{print $2}')

if [ -z "$POSTGRES_URL" ]; then
    echo "❌ Nie znaleziono POSTGRES_URL w Vercel"
    echo ""
    echo "Ręcznie:"
    echo "1. Idź na: https://vercel.com/hubertkozuchowski-3144s-projects/azure-club/settings/environment-variables"
    echo "2. Znajdź POSTGRES_URL (Production)"
    echo "3. Skopiuj wartość i dodaj do backend/.env"
    exit 1
fi

echo "✅ POSTGRES_URL znaleziono (encrypted w Vercel)"
echo ""
echo "📋 Aby dostać aktualną wartość:"
echo "1. Idź na: https://vercel.com/hubertkozuchowski-3144s-projects/azure-club/settings/environment-variables"
echo "2. Znajdź POSTGRES_URL"
echo "3. Kliknij 'eye icon' aby zobaczyć wartość"
echo "4. Skopiuj i wklej do backend/.env jako DATABASE_URL"
echo ""
echo "Lub użyj Neon Dashboard:"
echo "https://console.neon.tech → Twój projekt → Connection String"
