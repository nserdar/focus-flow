#!/bin/bash

# PostgreSQL veritabanını Docker ile başlatma scripti

echo "🚀 Starting PostgreSQL database..."

# Veritabanını başlat
docker-compose -f docker-compose.dev.yml up -d

# Veritabanının hazır olmasını bekle
echo "⏳ Waiting for database to be ready..."
sleep 5

# Health check
until docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U focusflow > /dev/null 2>&1; do
  echo "⏳ Database is not ready yet, waiting..."
  sleep 2
done

echo "✅ PostgreSQL database is ready!"
echo ""
echo "📊 Connection details:"
echo "   Host: localhost"
echo "   Port: 5434"
echo "   Database: focusflow_db"
echo "   Username: focusflow"
echo "   Password: focusflow"
echo ""
echo "🔍 To view logs: docker-compose -f docker-compose.dev.yml logs -f postgres"
echo "🛑 To stop: docker-compose -f docker-compose.dev.yml down"

