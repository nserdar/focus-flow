# 📱 QR Kod ile Telefonda Test Etme

## 🚀 Hızlı Başlangıç

### 1. Terminal'de Expo'yu Başlatın

```bash
cd focusflow-mobile
npm start
# veya
./start-expo-qr.sh
```

### 2. QR Kodu Görün

Terminal'de şu şekilde bir QR kod görünecek:
```
┌─────────────────────────┐
│                         │
│      [QR CODE]          │
│                         │
└─────────────────────────┘
```

### 3. QR Kodu Tarayın

**iOS (iPhone):**
1. iPhone kamerası uygulamasını açın
2. QR kodu kameraya gösterin
3. "Expo Go'da Aç" bildirimine tıklayın

**Android:**
1. Expo Go uygulamasını açın
2. "Scan QR code" butonuna tıklayın
3. QR kodu tarayın

## 🔧 IP Adresi Ayarlama

Telefonunuzdan API'ye erişmek için bilgisayarınızın IP adresini ayarlayın:

### 1. IP Adresinizi Öğrenin
```bash
ipconfig getifaddr en0  # WiFi için
```

### 2. Dosyaları Güncelleyin

**app.config.js:**
```javascript
extra: {
  apiUrl: "http://192.168.1.102:8081/api"  // IP'nizi yazın
}
```

**src/config/api.ts:**
```typescript
return 'http://192.168.1.102:8081/api';  // IP'nizi yazın
```

### 3. Otomatik Güncelleme (Script ile)
```bash
./start-expo-qr.sh
```

Bu script otomatik olarak IP adresinizi bulur ve günceller.

## 📋 Gereksinimler

- ✅ Expo Go uygulaması (iOS/Android)
- ✅ Bilgisayar ve telefon aynı WiFi ağında
- ✅ API çalışıyor olmalı (http://localhost:8081)
- ✅ Firewall 8081 portunu engellememeli

## 🎯 Test Senaryoları

1. **Login** - Yeni kullanıcı oluşturma
2. **Tasks** - Task oluşturma ve listeleme
3. **Goals** - Goal yönetimi
4. **Focus Sessions** - Focus session başlatma
5. **Pagination** - Liste sayfalama
6. **Search** - Arama ve filtreleme

## 🐛 Sorun Giderme

### QR Kod Görünmüyor
- Terminal çıktısını kontrol edin
- `npx expo start --tunnel` komutunu deneyin
- Expo Go uygulamasının güncel olduğundan emin olun

### API Bağlantı Hatası
1. IP adresini kontrol edin
2. API'nin çalıştığını test edin: `curl http://YOUR_IP:8081/actuator/health`
3. app.config.js ve src/config/api.ts'de IP'yi güncelleyin

### Network Hatası
- Bilgisayar ve telefon aynı WiFi'de mi?
- Firewall ayarlarını kontrol edin
- Tunnel modunu deneyin: `npx expo start --tunnel`

## 📞 Destek

Sorun yaşarsanız:
1. Terminal loglarını kontrol edin
2. Expo Go uygulamasını güncelleyin
3. WiFi bağlantısını kontrol edin

