# 🚀 Expo'yu Başlatma - QR Kod İçin

## Doğru Komutlar

### 1. Doğru Dizine Gidin
```bash
cd "/Users/akin/Desktop/Focus Flow/focusflow-mobile"
```

### 2. Bağımlılıkları Yükleyin (İlk kez)
```bash
npm install
```

### 3. Expo'yu Başlatın
```bash
npm start
```

veya

```bash
npx expo start
```

## 📱 QR Kod Görünecek

Terminal'de şu şekilde bir çıktı göreceksiniz:

```
› Metro waiting on exp://192.168.1.102:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

┌─────────────────────────┐
│                         │
│      [QR CODE]          │
│                         │
└─────────────────────────┘

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

## 🔧 Tunnel Modu (Farklı WiFi'lerde)

Eğer telefon ve bilgisayar farklı WiFi ağlarındaysa:

```bash
npx expo start --tunnel
```

## 📋 Hızlı Komutlar

```bash
# Doğru dizine git
cd "/Users/akin/Desktop/Focus Flow/focusflow-mobile"

# Expo başlat
npm start

# Veya script ile
./start-expo-qr.sh
```

## ⚠️ Önemli

- ✅ `focusflow-api` dizininde DEĞİL, `focusflow-mobile` dizininde olmalısınız
- ✅ `npm start` komutu `focusflow-mobile` dizininde çalışır
- ✅ Terminal çıktısında QR kod görünecek

