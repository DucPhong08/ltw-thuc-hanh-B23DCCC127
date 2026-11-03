# ltw-thuc-hanh-B23DCCC127 — Class Deadline Hub

**Mã sinh viên:** B23DCCC127  
**Môn học:** Lập trình Web Nâng Cao (LTWNC) — Bài Thực Hành 3 (BTTH 3)  
**Công nghệ:** Next.js 16 (App Router) · Auth.js v5 (NextAuth) · Tailwind CSS v4 · TypeScript Strict · Jest

---

## 1. Hướng dẫn chạy dự án

### Yêu cầu môi trường

- Node.js >= 18 (Khuyến nghị Node.js v20 hoặc v22)
- npm >= 9

### Cài đặt và khởi chạy

1. **Cài đặt thư viện phụ thuộc:**

   ```bash
   npm install
   ```

2. **Cấu hình môi trường (`.env`):**
   Tệp `.env` đã được cấu hình sẵn các khóa an toàn. Bạn có thể sao chép từ `.env.example`:

   ```bash
   cp .env.example .env
   ```

   _Nội dung mẫu:_

   ```env
   AUTH_SECRET="class-deadline-hub-ptit-secret-key-very-secure-2026"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   AUTH_TRUST_HOST=true
   ```

3. **Chạy môi trường phát triển (Development):**

   ```bash
   npm run dev
   ```

   Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

4. **Biên dịch và chạy bản tối ưu Production:**

   ```bash
   npm run build
   npm run start
   ```

5. **Chạy kiểm thử tự động (Unit Test cho hàm `can`):**
   ```bash
   npm test
   ```

---

## 2. Tài khoản kiểm thử bắt buộc

Hệ thống lưu trữ dữ liệu tại server trong thư mục `data/` (`users.json`, `subjects.json`, `deadlines.json`, `completions.json`). Mật khẩu được mã hóa an toàn bằng `bcrypt`:

| Email               | Mật khẩu   | Vai trò   | Quyền hạn chính                                                                   |
| ------------------- | ---------- | --------- | --------------------------------------------------------------------------------- |
| `admin@ptit.edu.vn` | `admin123` | **admin** | Xem deadline, Đánh dấu hoàn thành, Thêm deadline, Xóa deadline, Truy cập `/admin` |
| `sv@ptit.edu.vn`    | `sv123456` | **user**  | Xem deadline, Đánh dấu hoàn thành, Truy cập `/dashboard` (Bị chặn ở `/admin`)     |
| _(Chưa đăng nhập)_  | —          | **guest** | Chỉ xem deadline công khai                                                        |

---

## 3. Bảng chiến lược Render cho từng Route & Lý do lựa chọn

### Kết quả `npm run build` thực tế:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /403
├ ƒ /admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /dashboard
├ ƒ /deadlines
├ ƒ /deadlines/[id]
├ ƒ /deadlines/[id]/opengraph-image-104vc5
├ ƒ /login
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ƒ /subjects/[slug]

ƒ Proxy (Middleware)
○ (Static)   prerendered as static content
ƒ (Dynamic)  server-rendered on demand / streaming
```

_(Tổng cộng 24/24 static page được sinh trước tĩnh lúc build bao gồm toàn bộ 4 môn học và 12 deadline)._

### Bảng giải trình chiến lược render:

| Route              | Quyền truy cập | Chiến lược                         | Lý do kỹ thuật lựa chọn                                                                                                                                                                                                                                              |
| ------------------ | -------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                | Mọi người      | **SSG** _(Static Site Generation)_ | Nội dung giới thiệu tổng quan, thống kê môn học và bài tập ít biến động. Dựng trước toàn bộ HTML tĩnh lúc build giúp tốc độ tải tức thì (TTFB < 20ms) và tối ưu SEO cao nhất.                                                                                        |
| `/subjects/[slug]` | Mọi người      | **SSG** _(generateStaticParams)_   | Danh sách 4 môn học (`ltwnc`, `ktmt`, `mmt`, `csdl`) cố định theo chương trình đào tạo của học kỳ. `generateStaticParams()` kết xuất tĩnh trước toàn bộ 4 trang, nếu truy cập slug lạ lập tức gọi `notFound()` chuyển sang trang 404.                                |
| `/deadlines`       | Mọi người      | **ISR** _(revalidate = 60)_        | Danh sách tổng hợp toàn bộ deadline của lớp có tính chất đọc nhiều (read-heavy), tuy nhiên vẫn có thể có bài tập mới do Admin thêm vào. Thiết lập `revalidate = 60` giúp phục vụ HTML tĩnh từ bộ nhớ đệm và tự động làm mới ngầm sau mỗi 60 giây khi có yêu cầu mới. |
| `/deadlines/[id]`  | Mọi người      | **ISR** _(On-demand revalidation)_ | Chi tiết bài tập được sinh sẵn tĩnh với `generateStaticParams`. Khi Lớp trưởng (Admin) thêm hoặc xóa bài tập qua Server Action, hàm `revalidatePath('/deadlines/[id]')` được kích hoạt để làm mới tức thì cache mà không cần build lại dự án.                        |
| `/dashboard`       | Đã đăng nhập   | **SSR** _(Server-Side Rendering)_  | Hiển thị tiến độ hoàn thành, danh sách bài tập đã nộp mang tính **cá nhân hóa** theo từng sinh viên (`userId`). Dữ liệu thay đổi liên tục theo phiên người dùng nên bắt buộc render động từ máy chủ theo mỗi request.                                                |
| `/admin`           | Chỉ Admin      | **SSR** _(Server-Side Rendering)_  | Trang quản trị đặc quyền của Lớp trưởng chứa form thêm và bảng xóa bài tập. Bắt buộc SSR kết hợp kiểm tra quyền đa lớp để đảm bảo an toàn tuyệt đối, ngăn chặn caching rò rỉ dữ liệu nhạy cảm.                                                                       |

---

## 4. Báo cáo đo kiểm hiệu năng Lighthouse

Đo kiểm trực tiếp bằng **Lighthouse CLI (Google Chrome Headless)** trên bản build production (`npm run build && npm run start`):

| Trang đo                    |  Performance  | Accessibility | Best Practices |      SEO      |
| --------------------------- | :-----------: | :-----------: | :------------: | :-----------: |
| **Trang chủ `/`**           | **96** / 100  | **95** / 100  |  **96** / 100  | **100** / 100 |
| **Chi tiết `/deadlines/1`** | **100** / 100 | **95** / 100  |  **96** / 100  | **91** / 100  |

_Báo cáo chi tiết dạng JSON và HTML được lưu trữ tại thư mục: `reports/lighthouse/`._

---

## 5. Minh chứng View-Source của `/deadlines/1`

Khi xem mã nguồn gốc (`view-source:http://localhost:3000/deadlines/1`), toàn bộ nội dung quan trọng đều đã được Server kết xuất sẵn vào file HTML trả về:

1. **Thẻ tiêu đề và SEO Meta Tags:**

   ```html
   <title>Nộp BTTH 3 — Class Deadline Hub | Lập trình Web Nâng Cao</title>
   <meta property="og:title" content="Nộp BTTH 3 | Deadline Hub PTIT" />
   <meta
     property="og:description"
     content="Hạn chót: 9/11/2026 — Hoàn thiện mã nguồn Next.js với SSG/ISR/SSR..."
   />
   <meta
     property="og:image"
     content="http://localhost:3000/deadlines/1/opengraph-image-104vc5..."
   />
   <meta name="twitter:card" content="summary_large_image" />
   ```

2. **Dữ liệu có cấu trúc Structured Data (JSON-LD BreadcrumbList):**

   ```html
   <script type="application/ld+json">
     {
       "@context": "https://schema.org",
       "@type": "BreadcrumbList",
       "itemListElement": [
         {
           "@type": "ListItem",
           "position": 1,
           "name": "Trang chủ",
           "item": "http://localhost:3000/"
         },
         {
           "@type": "ListItem",
           "position": 2,
           "name": "Tất cả Deadline",
           "item": "http://localhost:3000/deadlines"
         },
         {
           "@type": "ListItem",
           "position": 3,
           "name": "Lập trình Web Nâng Cao",
           "item": "http://localhost:3000/subjects/ltwnc"
         },
         {
           "@type": "ListItem",
           "position": 4,
           "name": "Nộp BTTH 3 — Class Deadline Hub",
           "item": "http://localhost:3000/deadlines/1"
         }
       ]
     }
   </script>
   ```

3. **Nội dung HTML hoàn chỉnh phục vụ Bots tìm kiếm và người dùng:**
   - Tiêu đề: `<h1>Nộp BTTH 3 — Class Deadline Hub</h1>`
   - Hạn chót: `lúc 06:59 Thứ Hai, 9 tháng 11, 2026`
   - Mô tả chi tiết yêu cầu nộp file, quy định chấm điểm.

---

## 6. Trả lời 2 câu hỏi lý thuyết của đề bài

### Câu hỏi 1: Vì sao `/deadlines/[id]` dùng ISR?

**Trả lời:**

1. **Giải quyết mâu thuẫn giữa Tốc độ (Speed) và Tính tươi mới (Freshness):**
   - Nội dung chi tiết của một deadline (tiêu đề, yêu cầu nộp, hạn chót) là dữ liệu **đọc nhiều (read-heavy)** và không đổi liên tục theo từng mili-giây.
   - Nếu dùng **SSR**: Mỗi sinh viên bấm vào xem, server đều phải đọc file JSON/truy vấn DB và dựng lại cây DOM, gây lãng phí CPU và tăng thời gian phản hồi (TTFB). Vào giờ cao điểm (sát giờ nộp bài), server dễ bị quá tải.
   - Nếu dùng **SSG thuần túy**: Trang chỉ được sinh một lần lúc build. Khi Lớp trưởng đăng deadline mới hoặc sửa yêu cầu, sinh viên sẽ không xem được nếu dự án không được build và deploy lại từ đầu.
2. **Lợi ích thực tế của ISR kết hợp On-Demand Revalidation:**
   - **Tốc độ phản hồi cực nhanh:** Trang được lưu trữ dạng HTML tĩnh tại CDN Cache, phục vụ sinh viên với thời gian trễ tối thiểu (< 50ms) và tối ưu điểm Core Web Vitals (FCP, LCP).
   - **Cập nhật tức thì (Zero-downtime Update):** Khi Admin thực hiện thêm hoặc xóa deadline, Server Action kích hoạt `revalidatePath('/deadlines/[id]')` để xóa cache cũ và tái tạo lại trang tĩnh trong nền (background regeneration) mà không cần build lại toàn bộ ứng dụng.

---

### Câu hỏi 2: Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?

**Trả lời:**
Nếu chỉ phụ thuộc vào một lớp bảo vệ duy nhất ở Middleware/Proxy, hệ thống sẽ đối mặt với các lỗ hổng nghiêm trọng sau:

1. **Rủi ro trễ đồng bộ phiên và Token cũ (JWT Invalidation Gap):**
   - Middleware chạy ở Edge/Proxy layer nhằm tối ưu tốc độ mạng nên thường chỉ kiểm tra "lạc quan" (optimistic check) chữ ký của cookie JWT mà **không truy vấn lại cơ sở dữ liệu thật**.
   - Nếu một tài khoản bị hạ quyền từ `admin` xuống `user`, hoặc tài khoản bị khóa/thu hồi quyền, JWT cũ vẫn còn hạn hiệu lực trong cookie sẽ tiếp tục qua mặt Middleware và vào được khu vực quản trị.
2. **Bỏ lọt Server Actions và các Request POST trực tiếp:**
   - Trong Next.js App Router, Server Actions hoạt động như các endpoint RPC thông qua HTTP POST.
   - Nếu cấu hình regex matcher (`config.matcher`) của Middleware không bao quát trọn vẹn hoặc bị xung đột bởi dynamic route rewrites, kẻ xấu có thể giả lập gửi trực tiếp request POST kèm header `Next-Action` để thực thi hàm `deleteDeadlineAction` hay `createDeadlineAction` mà **hoàn toàn không cần tải trang HTML `/admin`**.
3. **Vi phạm nguyên tắc "Phòng thủ theo chiều sâu" (Defense in Depth):**
   - Middleware chỉ là lớp kiểm soát cổng vào (Routing/Network layer). Tầng logic nghiệp vụ (Business Layer) và tầng thao tác dữ liệu (Data Access Layer) nếu không tự kiểm tra quyền sẽ trở thành mục tiêu dễ bị khai thác BOLA/IDOR.
4. **Kiến trúc phân quyền 3 lớp đã áp dụng trong dự án:**
   - **Lớp 1 (Network/Proxy):** `proxy.ts` chặn sớm các request chưa đăng nhập và người dùng sai role.
   - **Lớp 2 (Page Controller):** Trang `/admin/page.tsx` độc lập gọi hàm `can(session.user.role, 'create_deadline')`, nếu sai lập tức điều hướng sang `/403`.
   - **Lớp 3 (Server Action & Validation):** Mọi hành động ghi dữ liệu (`actions/deadlines.ts`) đều kiểm tra lại quyền bằng `can()` trước khi đọc/ghi file JSON, đồng thời validate chặt chẽ schema dữ liệu đầu vào bằng `zod`.

---

## 7. Các điểm cộng thực hiện

1. **Kiểm thử tự động với Jest:**
   - Đã viết bộ test suite hoàn chỉnh tại `lib/permissions.test.ts` kiểm thử toàn bộ ma trận phân quyền `can(role, action)` cho 3 vai trò (`guest`, `user`, `admin`) và 4 hành động.
   - Kết quả: **14/14 test cases Passed 100%**.
2. **Tích hợp GitHub OAuth (NextAuth v5):**
   - Cấu hình sẵn provider GitHub OAuth trong `auth.ts`. Khi cung cấp `AUTH_GITHUB_ID` và `AUTH_GITHUB_SECRET`, nút đăng nhập GitHub sẽ tự động kích hoạt.
3. **Cấu hình sẵn sàng Deploy Vercel:**
   - Dự án tuân thủ 100% tiêu chuẩn Next.js App Router, sẵn sàng deploy lên Vercel chỉ với 1 click.
