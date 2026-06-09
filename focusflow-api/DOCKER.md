# Docker Setup Guide

Bu dokümantasyon Focus Flow API için Docker kullanımını açıklar.

## Hızlı Başlangıç

### Sadece PostgreSQL Veritabanı

```bash
# Veritabanını başlat
docker-compose -f docker-compose.dev.yml up -d

# Veritabanını durdur
docker-compose -f docker-compose.dev.yml down

# Veritabanını ve verileri sil
docker-compose -f docker-compose.dev.yml down -v
```

### PostgreSQL + pgAdmin

```bash
# PostgreSQL ve pgAdmin'i başlat
docker-compose up -d

# Servisleri durdur
docker-compose down

# Servisleri ve verileri sil
docker-compose down -v
```

### Tam Stack (PostgreSQL + API + pgAdmin)

```bash
# Tüm servisleri başlat
docker-compose -f docker-compose.full.yml up -d

# Servisleri durdur
docker-compose -f docker-compose.full.yml down

# Servisleri ve verileri sil
docker-compose -f docker-compose.full.yml down -v
```

## Veritabanı Bağlantı Bilgileri

### Localhost'tan Bağlantı (Geliştirme)

```
Host: localhost
Port: 5432
Database: focusflow
Username: focusflow
Password: focusflow
```

### Docker Container'dan Bağlantı

```
Host: postgres
Port: 5432
Database: focusflow_db (docker-compose.full.yml için)
Database: focusflow (diğerleri için)
Username: focusflow
Password: focusflow
```

## pgAdmin Kullanımı

1. Tarayıcıda `http://localhost:5050` adresine gidin
2. Giriş bilgileri:
   - Email: `admin@focusflow.com`
   - Password: `admin`
3. Yeni server ekleyin:
   - Name: FocusFlow DB
   - Host: `postgres` (veya `localhost` dışarıdan bağlanıyorsanız)
   - Port: `5432`
   - Username: `focusflow`
   - Password: `focusflow`

## Komutlar

### Veritabanı Loglarını Görüntüle

```bash
docker-compose logs -f postgres
```

### Veritabanına Bağlan (psql)

```bash
docker-compose exec postgres psql -U focusflow -d focusflow
```

### Veritabanı Yedekleme

```bash
docker-compose exec postgres pg_dump -U focusflow focusflow > backup.sql
```

### Veritabanı Geri Yükleme

```bash
docker-compose exec -T postgres psql -U focusflow focusflow < backup.sql
```

### Volume'leri Listele

```bash
docker volume ls | grep focusflow
```

### Volume'leri Temizle

```bash
docker volume rm focusflow-api_postgres_data
docker volume rm focusflow-api_pgadmin_data
```

## Sorun Giderme

### Port Zaten Kullanılıyor

Eğer 5432 portu zaten kullanılıyorsa, `docker-compose.yml` dosyasında portu değiştirin:

```yaml
ports:
  - "5433:5432"  # Host portunu değiştirin
```

### Veritabanı Bağlantı Hatası

1. Container'ın çalıştığını kontrol edin:
```bash
docker-compose ps
```

2. Health check durumunu kontrol edin:
```bash
docker-compose ps postgres
```

3. Logları kontrol edin:
```bash
docker-compose logs postgres
```

### Verileri Sıfırlama

```bash
# Container'ları durdur ve volume'leri sil
docker-compose down -v

# Yeniden başlat
docker-compose up -d
```

## Production Kullanımı

Production için:

1. Güçlü şifreler kullanın
2. Volume'leri düzenli yedekleyin
3. Health check'leri aktif tutun
4. Resource limitleri ayarlayın
5. Network güvenliğini yapılandırın

Örnek production docker-compose.yml:

```yaml
services:
  postgres:
    # ... diğer ayarlar
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}  # Environment variable kullanın
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

