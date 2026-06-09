#!/bin/bash

# Focus Flow Mobile - Expo QR Kod Başlatma

echo "🚀 Focus Flow Mobile - Expo Başlatılıyor..."
echo ""

# IP adresini al
IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "192.168.1.102")
echo "💻 Bilgisayar IP: $IP"
echo "🌐 API URL: http://$IP:8081/api"
echo ""

# app.config.js'de IP'yi güncelle
sed -i '' "s|http://[0-9.]*:8081/api|http://$IP:8081/api|g" app.config.js 2>/dev/null || \
sed -i "s|http://[0-9.]*:8081/api|http://$IP:8081/api|g" app.config.js

# src/config/api.ts'de IP'yi güncelle
sed -i '' "s|http://[0-9.]*:8081/api|http://$IP:8081/api|g" src/config/api.ts 2>/dev/null || \
sed -i "s|http://[0-9.]*:8081/api|http://$IP:8081/api|g" src/config/api.ts

echo "✅ IP adresi güncellendi: $IP"
echo ""
echo "📱 QR Kod için Expo başlatılıyor..."
echo "   Terminal'de QR kod görünecek!"
echo ""

cd "$(dirname "$0")"
npx expo start

