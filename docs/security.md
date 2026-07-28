# Security trong Microservices

## Vấn đề trong hệ thống monolithic vs microservices

- Với **Monolithic Application**, chúng ta thường chỉ có **một entry point**.
  - Dễ dàng đặt **Authentication & Authorization** ở ngay cổng vào.
  - Mọi request đều đi qua một luồng bảo mật duy nhất.

- Với **Microservices**, tình hình phức tạp hơn:
  - Có **nhiều service độc lập**.
  - Mỗi service có thể có **API riêng**.
  - Người dùng không chỉ gọi API trực tiếp, mà service này còn có thể gọi service khác.

```mermaid
flowchart LR
    Client -->|Request| API_Gateway
    API_Gateway --> Service_A
    API_Gateway --> Service_B
    Service_A --> Service_C
```

Câu hỏi đặt ra: **Chúng ta bảo mật thế nào trong một hệ thống phân tán như vậy?**

## Tại sao security trong microservices lại quan trọng?

- Trong kiến trúc microservices, hệ thống được chia thành nhiều dịch vụ nhỏ, chạy độc lập và thường xuyên giao tiếp qua mạng.
- Điều này làm tăng **bề mặt tấn công**, vì mỗi dịch vụ là một điểm yếu tiềm năng.
- Việc **phân quyền và kiểm soát truy cập** trở nên phức tạp hơn so với ứng dụng monolith.
- Nếu không chú ý bảo mật kỹ, hệ thống có thể bị tấn công, dữ liệu nhạy cảm bị lộ, hoặc kẻ xấu có thể chiếm quyền điều khiển dịch vụ.

### Ví dụ minh họa:

Giả sử một hệ thống gồm 3 microservices:

- User Service
- Order Service
- Payment Service

Nếu không kiểm soát tốt, hacker có thể tấn công một service yếu, rồi từ đó truy cập các service khác để lấy cắp thông tin thanh toán hoặc sửa đổi dữ liệu.

**Diagram minh họa bề mặt tấn công trong microservices**

```mermaid
flowchart LR
    subgraph Client
        A[User Client]
    end
    subgraph Microservices
        US[User Service]
        OS[Order Service]
        PS[Payment Service]
    end
    A --> US
    US --> OS
    OS --> PS
    style US fill:#a2d5f2,stroke:#333,stroke-width:2px
    style OS fill:#f9d5e5,stroke:#333,stroke-width:2px
    style PS fill:#f7d794,stroke:#333,stroke-width:2px
    classDef vulnerable fill:#f87171,stroke:#b91c1c,stroke-width:3px
    OS:::vulnerable
```

## Các thách thức bảo mật phổ biến trong microservices

- **Authentication và Authorization:** Xác định ai đang gọi service và họ có quyền làm gì.
- **Data protection:** Bảo vệ dữ liệu trong truyền tải và lưu trữ.
- **Service-to-service communication:** Đảm bảo dịch vụ chỉ giao tiếp với dịch vụ hợp lệ.
- **API Gateway & Rate limiting:** Ngăn chặn tấn công DDoS và quản lý lưu lượng.
- **Secrets management:** Quản lý khóa, token, mật khẩu an toàn.
- **Token Management** Quản lý access token, refresh token, token expiration. Đảm bảo hiệu năng khi phải xác thực hàng ngàn request mỗi giây.

### Ví dụ:

- Một dịch vụ có thể nhận yêu cầu từ client hoặc dịch vụ khác, nhưng cần xác minh token để xác nhận danh tính.
- Dữ liệu nhạy cảm như thông tin thẻ tín dụng phải được mã hóa trong khi lưu trữ và truyền tải.

## Authentication và Authorization

- **Authentication (Xác thực):** Ai đang gọi API này? Người đó có hợp lệ hay không?
- **Authorization (Phân quyền):** Kiểm tra họ được phép làm gì. Người dùng có quyền gọi endpoint này không?

### Cách triển khai phổ biến:

Sử dụng **OAuth2 / OpenID Connect** kết hợp với **JWT**.

- Người dùng đăng nhập qua Identity Provider (ví dụ: Keycloak, Auth0)
- Nhận về một JWT token có chứa các quyền hạn (claims)
- Token được gửi trong header Authorization của mỗi request
- Microservice verify token, đọc thông tin để quyết định cho phép truy cập hay không

### Ví dụ JWT header trong HTTP request:

GET /orders HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

**Diagram Authentication flow**

```mermaid
sequenceDiagram
    User->>Identity Provider: Login (username/password)
    Identity Provider-->>User: JWT Token
    User->>Microservice: Request + JWT Token
    Microservice->>Identity Provider: Verify Token (optional)
    Microservice-->>User: Response (Authorized or Denied)
```

## Secure service-to-service communication

Để dịch vụ giao tiếp an toàn:

- **mTLS (mutual TLS):** Mã hóa và xác thực lẫn nhau giữa các dịch vụ
- **Token-based authorization:** Mỗi request giữa các dịch vụ có kèm token để xác minh quyền truy cập
- **Network policies và service mesh (Istio):** Giới hạn dịch vụ chỉ được phép kết nối tới dịch vụ cần thiết
- **Nguyên tắc least privilege:** Dịch vụ chỉ có quyền truy cập tối thiểu cần thiết

### Ví dụ:

Payment Service chỉ nhận request từ Order Service, không cho phép truy cập từ bất kỳ dịch vụ nào khác.

**Diagram mô hình service-to-service communication**

```mermaid
flowchart LR
    OS[Order Service] -->|mTLS + Token| PS[Payment Service]
    PS -.->|Blocked| US[User Service]

    classDef blocked fill:#f87171,stroke:#b91c1c,stroke-width:2px
    PS:::blocked
```

## Bảo vệ dữ liệu và quản lý secrets

- Dữ liệu truyền qua mạng phải được mã hóa bằng **HTTPS/TLS**.
- Dữ liệu nhạy cảm lưu trữ phải mã hóa (ví dụ: database encryption).
- **Không nên hardcode mật khẩu, token trong code!**
- Sử dụng các công cụ chuyên biệt để quản lý secrets như:
  - HashiCorp Vault
  - AWS Secrets Manager
  - Kubernetes Secrets

### Ví dụ quản lý secrets:

```bash
# Lấy mật khẩu từ Vault khi ứng dụng khởi động
vault kv get secret/api-key
```

## API Gateway và Rate Limiting

- API Gateway là điểm entry duy nhất, nên chịu trách nhiệm chính về bảo mật:
  - Xác thực và phân quyền lần đầu
  - Áp dụng rate limiting để ngăn chặn tấn công DDoS
  - Logging và monitoring để phát hiện hành vi bất thường

### Ví dụ cấu hình rate limiting với API Gateway:

```yaml
rateLimit:
  requestsPerMinute: 100
  blockDuration: 10m
```

```mermaid
flowchart LR
    Client --> API_Gateway[API Gateway]
    API_Gateway --> US[User Service]
    API_Gateway --> OS[Order Service]
    API_Gateway --> PS[Payment Service]
```

## Yêu cầu của một hệ thống bảo mật microservice

Một hệ thống microservice an toàn cần:

- **Centralized Authentication**: Xác thực tập trung, không lặp lại logic trong từng service.
- **Federated Identity**: Hỗ trợ đăng nhập qua Google, Facebook, LDAP...
- **Role-based Access Control (RBAC)**: Gán quyền theo role.
- **Scalability**: Hoạt động tốt với số lượng lớn request.

## Giải pháp: Keycloak

[Keycloak](https://www.keycloak.org/) là một **Identity and Access Management (IAM)** platform mã nguồn mở. Nó giúp chúng ta giải quyết:

- Authentication (login/logout, SSO).
- Authorization (role, group, policy).
- Token-based security với OAuth2, OpenID Connect.
- Dễ dàng tích hợp với NestJS, Spring Boot, hay bất kỳ service nào.

```mermaid
sequenceDiagram
    participant User
    participant Keycloak
    participant API_Gateway
    participant Service_A

    User->>Keycloak: Login (Username/Password)
    Keycloak-->>User: Access Token (JWT)
    User->>API_Gateway: Request + Token
    API_Gateway->>Keycloak: Validate Token
    Keycloak-->>API_Gateway: Token Valid
    API_Gateway->>Service_A: Forward Request + Token
    Service_A->>Keycloak: Verify Role/Permission
    Keycloak-->>Service_A: Authorized
```

## Recap

- Monolithic dễ bảo mật hơn vì chỉ có một điểm vào.
- Microservices yêu cầu **distributed security**: authentication, authorization, token, service-to-service.
- Keycloak cung cấp một giải pháp **tập trung, hiện đại, mở rộng** để quản lý danh tính và phân quyền.
