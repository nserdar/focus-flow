#!/bin/bash

# Focus Flow Mobile - Expo Başlatma Scripti

echo "🚀 Focus Flow Mobile uygulaması başlatılıyor..."
echo ""
echo "📱 QR Kodu görmek için:"
echo "   1. Expo Go uygulamasını telefonunuza indirin"
echo "   2. QR kodu tarayın"
echo ""
echo "🌐 API URL: http://192.168.1.102:8081/api"
echo ""

cd "$(dirname "$0")"

# IP adresini kontrol et
IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "192.168.1.102")
echo "💻 Bilgisayar IP: $IP"
echo ""

# Expo başlat
npx expo start --tunnel

