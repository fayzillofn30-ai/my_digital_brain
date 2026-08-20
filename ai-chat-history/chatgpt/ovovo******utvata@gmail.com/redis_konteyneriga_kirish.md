# Redis konteyneriga kirish

### 👤 Foydalanuvchi:

fayzillo@Jarvis:~/Desktop$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS       PORTS                                         NAMES
59892b21ce5a   redis:latest   "docker-entrypoint.s…"   6 hours ago    Up 6 hours   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp   redis
7ca595b1323a   nginx          "/docker-entrypoint.…"   17 hours ago   Up 8 hours   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp       nginx_demo
fayzillo@Jarvis:~/Desktop$ 


Men redisgs terminaldan qanday kira olaman

### 🤖 ChatGPT:

Redis konteyneriga kirishning eng oddiy usuli:

```bash
docker exec -it redis redis-cli
```

Agar hammasi to'g'ri bo'lsa, quyidagini ko'rasiz:

```text
127.0.0.1:6379>
```

Endi Redis buyruqlarini yozishingiz mumkin:

```redis
PING
```

Natija:

```text
PONG
```

Masalan:

```redis
SET name Fayzillo
GET name
KEYS *
DEL name
```

---

Agar avval konteynerning shell'iga kirishni istasangiz:

```bash
docker exec -it redis bash
```

Agar `bash` bo'lmasa:

```bash
docker exec -it redis sh
```

Keyin ichidan:

```bash
redis-cli
```

---

Sizning holatingizda konteyner nomi `redis`, shuning uchun eng to'g'ri va qisqa buyruq:

```bash
docker exec -it redis redis-cli
```

Docker o'rganayotganingiz uchun shu usulni tavsiya qilaman — shell'ga kirmasdan kerakli dasturni (`redis-cli`) to'g'ridan-to'g'ri ishga tushirish eng qulay.

---

### 👤 Foydalanuvchi:

redis keylarini ko'rish

### 🤖 ChatGPT:

Redis CLI ichida bo'lsangiz:

```redis
KEYS *
```

Masalan:

```text
127.0.0.1:6379> KEYS *
1) "user:1"
2) "session:abc"
3) "cache:products"
```

### Agar kalitlar juda ko'p bo'lsa (production uchun tavsiya)

```redis
SCAN 0
```

Yoki ma'lum prefiks bo'yicha:

```redis
SCAN 0 MATCH user:*
```

### Key qiymatini ko'rish

Masalan, `user:1` kaliti bo'lsa:

```redis
GET user:1
```

Agar kalit turi `string` bo'lsa, qiymatini qaytaradi.

Avval kalit turini bilmoqchi bo'lsangiz:

```redis
TYPE user:1
```

Natija, masalan:

```text
string
hash
list
set
zset
```

Keyin turiga qarab:

- **string** → `GET key`
- **hash** → `HGETALL key`
- **list** → `LRANGE key 0 -1`
- **set** → `SMEMBERS key`
- **zset** → `ZRANGE key 0 -1 WITHSCORES`

Docker ichidan bir qatorda ham bajarishingiz mumkin:

```bash
docker exec -it redis redis-cli KEYS '*'
```

---

