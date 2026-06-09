# 📱 Expo ile Telefonda Test Etme

## Hızlı Başlangıç

### 1. Bağımlılıkları Yükle
```bash
cd focusflow-mobile
npm install
```

### 2. Expo'yu Başlat (QR Kod için)
```bash
npm start
# veya
npx expo start --tunnel
```

### 3. QR Kodu Tarayın
- **iOS**: iPhone kamerası ile QR kodu tarayın → Expo Go açılacak
- **Android**: Expo Go uygulamasını açın → QR kodu tarayın

## 📋 Adım Adım Kurulum

### Adım 1: Expo Go Uygulamasını İndirin

**iOS (iPhone):**
- App Store'dan "Expo Go" uygulamasını indirin

**Android:**
- Play Store'dan "Expo Go" uygulamasını indirin

### Adım 2: API IP Adresini Ayarlayın

Bilgisayarınızın IP adresini öğrenin:
```bash
ipconfig getifaddr en0  # WiFi için
# veya
ipconfig getifaddr en1  # Ethernet için
```

**app.config.js** dosyasında IP'yi güncelleyin:
```javascript
extra: {
  apiUrl: "http://192.168.1.102:8081/api"  // IP'nizi buraya yazın
}
```

**src/config/api.ts** dosyasında da güncelleyin:
```typescript
return 'http://192.168.1.102:8081/api';  // IP'nizi buraya yazın
```

### Adım 3: Expo'yu Başlatın

```bash
cd focusflow-mobile
npm start
```

Terminal'de QR kod görünecek!

### Adım 4: QR Kodu Tarayın

- **iOS**: iPhone kamerası ile QR kodu tarayın
- **Android**: Expo Go uygulamasında "Scan QR code" butonuna tıklayın

## 🔧 Önemli Notlar

### Aynı WiFi Ağında Olmalısınız
- ✅ Bilgisayarınız ve telefonunuz **aynı WiFi ağında** olmalı
- ✅ API'nin çalıştığından emin olun (`http://localhost:8081`)

### Firewall Ayarları
- ✅ macOS Firewall'ın 8081 portunu engellemediğinden emin olun
- ✅ Sistem Tercihleri > Güvenlik > Firewall

### Tunnel Modu (Farklı Ağlarda)
Eğer telefon ve bilgisayar farklı ağlardaysa:
```bash
npx expo start --tunnel
```

## 🐛 Sorun Giderme

### QR Kod Görünmüyor
```bash
# Tunnel modunu deneyin
npx expo start --tunnel

# Veya farklı port
npx expo start --port 8082
```

### API Bağlantı Hatası
1. IP adresini kontrol edin:
```bash
ipconfig getifaddr en0
```

2. API'nin çalıştığını test edin:
```bash
curl http://YOUR_IP:8081/actuator/health
```

3. app.config.js ve src/config/api.ts'de IP'yi güncelleyin

### Network Hatası
- Bilgisayar ve telefon aynı WiFi'de mi?
- Firewall 8081 portunu engelliyor mu?
- Tunnel modunu deneyin: `npx expo start --tunnel`

## 📱 Test Senaryoları

1. **Login/Register** - Kullanıcı oluşturma ve giriş
2. **Tasks** - Task oluşturma, listeleme, güncelleme
3. **Goals** - Goal oluşturma ve yönetme
4. **Focus Sessions** - Focus session başlatma ve bitirme
5. **Pagination** - Liste sayfalama testi
6. **Search** - Arama ve filtreleme testi

## 🎯 API Endpoint'leri

Tüm endpoint'ler Swagger UI'da görüntülenebilir:
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **API Base**: http://YOUR_IP:8081/api

