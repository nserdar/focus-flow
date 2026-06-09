# Focus Flow Test Talimatları

## 🚀 Sistem Durumu

### Backend (Spring Boot)
- **Port**: 8081
- **API Base URL**: http://localhost:8081/api
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **Health Check**: http://localhost:8081/actuator/health

### Frontend (Next.js)
- **Port**: 3000
- **URL**: http://localhost:3000

### Veritabanı (PostgreSQL)
- **Port**: 5434
- **Database**: focusflow_db
- **Username**: focusflow
- **Password**: focusflow

## 📝 Test Adımları

### 1. Backend Kontrolü
```bash
# Backend sağlık kontrolü
curl http://localhost:8081/actuator/health

# Swagger UI'yi aç
open http://localhost:8081/swagger-ui.html
```

### 2. Frontend Test

1. **Login Sayfası**: http://localhost:3000/login
   - Yeni kullanıcı kaydı için "create a new account" linkine tıklayın

2. **Kayıt Ol**:
   - Email: test@example.com
   - Password: test123456
   - Kayıt ol butonuna tıklayın

3. **Dashboard**:
   - Otomatik olarak dashboard'a yönlendirileceksiniz
   - İstatistikleri görebilirsiniz

4. **Tasks Sayfası**:
   - Navbar'dan "Tasks" linkine tıklayın
   - "New Task" butonu ile yeni görev oluşturun
   - Görevleri düzenleyip silebilirsiniz

5. **Goals Sayfası**:
   - Navbar'dan "Goals" linkine tıklayın
   - "New Goal" butonu ile yeni hedef oluşturun

6. **Focus Sessions**:
   - Navbar'dan "Focus" linkine tıklayın
   - Bir task seçin
   - Focus session başlatın
   - Timer ile çalışın

## 🔧 Sorun Giderme

### Backend başlamıyorsa:
```bash
cd focusflow-api
./mvnw spring-boot:run
```

### Veritabanı başlamıyorsa:
```bash
cd focusflow-api
./start-db.sh
```

### Frontend başlamıyorsa:
```bash
cd focusflow-web
npm run dev
```

## ✅ Test Senaryoları

1. ✅ Kullanıcı kaydı
2. ✅ Kullanıcı girişi
3. ✅ Task oluşturma/düzenleme/silme
4. ✅ Goal oluşturma/düzenleme/silme
5. ✅ Focus session başlatma/bitirme
6. ✅ Dashboard istatistikleri

## 📊 API Endpoints

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/tasks` - Tüm görevler
- `POST /api/tasks` - Yeni görev
- `GET /api/goals` - Tüm hedefler
- `POST /api/goals` - Yeni hedef
- `POST /api/focus-sessions` - Focus session başlat
- `PUT /api/focus-sessions/{id}/finish` - Focus session bitir

