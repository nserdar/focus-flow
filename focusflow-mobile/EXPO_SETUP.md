# Expo Setup ve QR Kod Kullanımı

## Hızlı Başlangıç

### 1. Bağımlılıkları Yükle
```bash
cd focusflow-mobile
npm install
```

### 2. Expo'yu Başlat
```bash
npm start
# veya
./start-expo.sh
```

### 3. QR Kodu Tarayın
- **iOS**: iPhone kamerası ile QR kodu tarayın
- **Android**: Expo Go uygulaması ile QR kodu tarayın

## API Bağlantısı

### IP Adresi Ayarlama

Telefonunuzdan API'ye erişmek için bilgisayarınızın IP adresini güncelleyin:

1. **IP adresinizi öğrenin:**
```bash
ipconfig getifaddr en0  # macOS WiFi
# veya
ipconfig getifaddr en1  # macOS Ethernet
```

2. **app.config.js dosyasını güncelleyin:**
```javascript
extra: {
  apiUrl: "http://YOUR_IP:8081/api"  // Örnek: "http://192.168.1.102:8081/api"
}
```

3. **src/config/api.ts dosyasını güncelleyin:**
```typescript
return 'http://YOUR_IP:8081/api';  // Physical device için
```

### Önemli Notlar

- ✅ Bilgisayarınız ve telefonunuz **aynı WiFi ağında** olmalı
- ✅ API'nin çalıştığından emin olun (`http://localhost:8081`)
- ✅ Firewall'ın 8081 portunu engellemediğinden emin olun

## Expo Go Kurulumu

### iOS
1. App Store'dan "Expo Go" uygulamasını indirin
2. QR kodu iPhone kamerası ile tarayın
3. Expo Go'da açılacak

### Android
1. Play Store'dan "Expo Go" uygulamasını indirin
2. Expo Go uygulamasını açın
3. QR kodu tarayın

## Komutlar

```bash
# Expo başlat (QR kod ile)
npm start

# Android emulator için
npm run android

# iOS simulator için (macOS only)
npm run ios

# Web browser için
npm run web
```

## Sorun Giderme

### QR Kod Görünmüyor
- Terminal çıktısını kontrol edin
- `npx expo start --tunnel` komutunu kullanın
- Expo Go uygulamasının güncel olduğundan emin olun

### API Bağlantı Hatası
- IP adresinin doğru olduğundan emin olun
- API'nin çalıştığını kontrol edin: `curl http://YOUR_IP:8081/actuator/health`
- Firewall ayarlarını kontrol edin

### Network Hatası
- Bilgisayar ve telefon aynı WiFi'de mi kontrol edin
- Tunnel modunu deneyin: `npx expo start --tunnel`

