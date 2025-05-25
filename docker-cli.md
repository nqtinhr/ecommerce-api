# Docker CLI

```bash
docker run --name ecommerce-app \
  -e POSTGRES_DB=ecom_dev \
  -e POSTGRES_USER=syshero \
  -e POSTGRES_PASSWORD=syshero \
  -v pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:17-alpine
```

### Truy cập database

```bash
docker exec -it ecommerce-app psql -U syshero -d ecom_dev
```

### Vài câu lệnh trong psql

- Muốn biết bạn đang dùng user nào để truy cập vào database thì gõ lệnh `\conninfo` hoặc `SELECT current_user`;
- Hiển thị tất cả database: `\t`
- Hiển thị tất cả user: `\du`
- Hiển thị tất cả bảng trong database: `\dt`
- Hiển thị cấu trúc của 1 bảng: `\d table-name`
- Thoát khỏi `psql`: `\q`
