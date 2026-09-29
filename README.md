# Verses of Memory

Thư viện thơ ca kháng chiến (chống Pháp, chống Mỹ) — MVP đầu tiên, tập trung vào module **Thơ**.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL (khuyến nghị dùng [Neon](https://neon.tech))

## Thiết kế giao diện

Giao diện lấy cảm hứng từ **thẻ mục lục thư viện** (card catalog) kết hợp bố cục kiểu **Wikipedia**:

- Sidebar điều hướng cố định bên trái + ô tra cứu trên thanh đầu trang.
- Mỗi bài thơ / tác giả có một "thẻ mục lục" (catalog card) viền nét đứt, nổi bên phải nội dung — giống infobox — kèm mã số tự sinh (`POM-xxxxx`, `TG-xxxxx`).
- Trang `/tho` trình bày như một bảng mục lục có đánh số thứ tự, hỗ trợ tìm kiếm theo tiêu đề/tác giả/từ khoá qua `?q=`.
- Font tiêu đề: Source Serif 4 · UI: IBM Plex Sans · nội dung thơ: Lora · nhãn/mã số: Courier Prime (kiểu máy đánh chữ trên thẻ thư viện).
- Bảng màu giấy cũ: nền `#F7F5EF`, viền `#C9C2B2`, mực xanh catalog `#1F5C99`, đỏ dấu mượn sách `#9B3A2E` (dùng cho nhãn thời kỳ/trích đoạn).

## Quy tắc dữ liệu

- `Author.isPublicDomain = false` → mọi bài thơ của tác giả đó **phải** có `excerptOnly = true`. Trang chi tiết chỉ hiển thị `excerpt` + link `sourceUrl`, **không** hiển thị `content` đầy đủ.
- `Author.isPublicDomain = true` → hiển thị `content` đầy đủ bình thường.

Quy tắc này được thực thi ở tầng UI (`src/app/tho/[slug]/page.tsx`): chỉ render nội dung đầy đủ khi `author.isPublicDomain === true` **và** `poem.excerptOnly === false`.

## Bắt đầu

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Sao chép `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Vào **Neon Dashboard → project của bạn → Connection Details**, lấy **2 connection string** rồi điền vào `.env`:

- **Pooled connection** (hostname có chữ `-pooler`) → dán vào `DATABASE_URL`. Dùng cho app chạy bình thường.
- **Direct connection** (hostname KHÔNG có `-pooler`) → dán vào `DIRECT_URL`. **Bắt buộc** cho `prisma migrate`, vì Prisma Migrate cần kết nối trực tiếp, không qua PgBouncer.

```
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/verses_of_memory?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/verses_of_memory?sslmode=require"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

> **Gặp lỗi `P1001: Can't reach database server`?** Thường do 1 trong các nguyên nhân sau:
> 1. Bạn đang dùng nhầm **pooled URL** (`-pooler`) cho cả `DATABASE_URL` lẫn `DIRECT_URL` — phải tách riêng như trên.
> 2. Project Neon đang ở trạng thái **suspended** (gói free tự ngủ khi không dùng) — vào Neon Dashboard mở project lên (chạy thử 1 query trong SQL Editor) để đánh thức, rồi chạy lại lệnh migrate.
> 3. Copy connection string bị thiếu/thừa ký tự (dấu ngoặc kép, khoảng trắng) — copy lại nguyên văn từ Neon.
> 4. Firewall/antivirus trên máy chặn cổng 5432 ra ngoài — thử tắt tạm để test.

### 3. Chạy migration

```bash
npx prisma migrate dev --name init
```

Lệnh này sẽ tạo bảng theo `prisma/schema.prisma` trên database Neon và generate Prisma Client.

### 4. Seed dữ liệu mẫu

```bash
npm run seed
```

Script `prisma/seed.ts` sẽ tạo 3 tác giả (2 tác giả public domain có nội dung đầy đủ, 1 tác giả còn bản quyền chỉ có trích đoạn) cùng 2-3 bài thơ mỗi tác giả.

> **Lưu ý:** nội dung thơ trong seed là văn bản minh họa được viết riêng cho demo, không phải trích dẫn nguyên tác — xem chú thích đầu file `prisma/seed.ts`.

### 5. Chạy dev server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Đăng nhập / Đăng ký / Trang quản trị

- **Xác thực**: NextAuth (Credentials provider, JWT session) — không dùng OAuth nên không cần bảng `Account`/`Session`, chỉ cần bảng `User` (email + mật khẩu hash bcrypt + `role`).
- **Đăng ký** (`/dang-ky`): tài khoản tự đăng ký luôn có `role = USER`.
- **Đăng nhập** (`/dang-nhap`): dùng email + mật khẩu.
- **Trang quản trị** (`/admin`): chỉ `role = ADMIN` mới vào được — chặn ở 2 lớp: `middleware.ts` (edge, toàn bộ `/admin/**`) và `requireAdmin()` (server-side, trong từng layout/action) để phòng hờ.
- Quản lý được: **Thơ**, **Tác giả**, **Khoảnh Khắc**, **Sản phẩm affiliate**, **Người dùng** (nâng/hạ quyền ADMIN ⇄ USER). CRUD dùng Next.js Server Actions (`src/lib/actions/admin-actions.ts`), không cần viết API route riêng.

### Tài khoản admin mặc định (từ seed)

```
Email:     admin@verses-of-memory.local
Mật khẩu:  DoiMatKhauNgay123!
```

⚠️ Đổi mật khẩu này ngay sau khi seed lần đầu (hiện chưa có trang "đổi mật khẩu" trong UI — có thể cập nhật trực tiếp qua `npx prisma studio`, hoặc tự đăng ký tài khoản mới rồi vào `/admin/nguoi-dung` để nâng lên `ADMIN`, sau đó xoá tài khoản admin mặc định).

### Cấu hình bắt buộc thêm

Trước khi chạy `npm run dev`, đảm bảo `.env` có thêm:

```
NEXTAUTH_SECRET="..."   # tạo bằng: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

## Cấu trúc trang

| Route                  | Mô tả                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| `/`                    | Trang chủ: giới thiệu, duyệt theo thời kỳ, mục "mới thêm", Khoảnh Khắc mới |
| `/tho`                 | Mục lục thơ: lọc theo tác giả/thời kỳ, tìm kiếm `?q=`, sắp xếp, phân trang |
| `/tho/[slug]`          | Chi tiết bài thơ, thẻ mục lục (infobox), gợi ý bài liên quan, box affiliate |
| `/tho/ngau-nhien`      | Chuyển hướng tới một bài thơ ngẫu nhiên trong thư viện                  |
| `/tac-gia`             | Mục lục tác giả theo A–Z (kiểu ngăn kéo catalog)                        |
| `/tac-gia/[slug]`      | Trang tác giả: tiểu sử + danh sách bài thơ                              |
| `/khoanh-khac`         | Danh sách video ngắn kể chuyện lịch sử                                  |
| `/khoanh-khac/[slug]`  | Chi tiết một khoảnh khắc: nhúng video (YouTube) hoặc link ra nền tảng gốc |
| `/dang-nhap`           | Đăng nhập                                                               |
| `/dang-ky`             | Đăng ký tài khoản mới                                                   |
| `/admin`               | Bàn quản lý (chỉ ADMIN): tổng quan + CRUD Thơ/Tác giả/Khoảnh Khắc/Affiliate/Người dùng |

## Module Khoảnh Khắc (video ngắn)

- Model `Moment` trong `schema.prisma`: `platform` ("youtube" | "tiktok" | "facebook"), `externalUrl`, `embedUrl`, `thumbnailUrl`, `description`, `period`, `tags`.
- **YouTube**: nếu có `embedUrl` (dạng `https://www.youtube.com/embed/VIDEO_ID`), trang chi tiết sẽ nhúng iframe trực tiếp.
- **TikTok / Facebook**: hiện tại chỉ hiển thị nút "Xem trên nền tảng gốc" trỏ tới `externalUrl`, vì nhúng embed thật của 2 nền tảng này cần load script phía client (`embed.js` của TikTok, SDK của Facebook) — có thể bổ sung sau bằng Client Component riêng nếu cần nhúng trực tiếp trong trang.
- Muốn thêm khoảnh khắc mới: thêm record vào bảng `Moment` (qua Prisma Studio `npx prisma studio`, hoặc mở rộng seed script).

## Affiliate Shopee

- Model `AffiliateProduct`: `label`, `price`, `imageUrl`, `shopeeUrl`, `note`.
- Component `AffiliateCard` + `AffiliateDisclosure` (`src/components/AffiliateCard.tsx`) hiển thị sản phẩm kèm nhãn **"Liên kết tiếp thị"** bắt buộc, và dùng `rel="sponsored nofollow"` theo khuyến nghị của Google cho link quảng cáo.
- Link Shopee trong seed data là **placeholder** (`aff_id=YOUR_AFFILIATE_ID`) — thay bằng link affiliate thật từ chương trình Shopee Affiliate / Accesstrade / involve Asia... khi bạn đã đăng ký.
- Box affiliate hiện ở cuối trang chi tiết thơ và trang chi tiết khoảnh khắc (lấy 2 sản phẩm mới nhất). Có thể mở rộng để gắn affiliate theo từng bài cụ thể bằng cách thêm quan hệ `poemId`/`momentId` optional vào `AffiliateProduct` nếu muốn kiểm soát chi tiết hơn.

## Khung quảng cáo

- Component `AdBanner` (`src/components/AdBanner.tsx`) render khung placeholder có nhãn "Quảng cáo", 3 kích thước: `leaderboard` (728×90, đầu trang), `rectangle` (300×250, sidebar & cuối bài), `mobile` (320×100).
- Đây **chỉ là chỗ trống có đặt chỗ sẵn** — chưa gắn mạng quảng cáo thật. Cách kích hoạt (xem chú thích trong file):
  1. Đăng ký & được duyệt tài khoản mạng quảng cáo (Google AdSense, Adtima, Eclick...).
  2. Load script mạng quảng cáo qua `next/script` trong `layout.tsx` (`strategy="afterInteractive"`).
  3. Thay nội dung bên trong mỗi `AdBanner` bằng thẻ `<ins>`/iframe mà mạng quảng cáo cung cấp cho từng vị trí.
- Vị trí hiện có: đầu trang (dưới thanh header, toàn site), sidebar (cột trái, toàn site), và cuối bài thơ/khoảnh khắc.

## Các chức năng đã bổ sung

- **Tìm kiếm**: ô tra cứu ở header, khớp theo tiêu đề / tên tác giả / từ khoá (`/tho?q=`).
- **Sắp xếp & phân trang** ở `/tho` (8 thẻ/trang), giữ trạng thái qua query param nên có thể chia sẻ link.
- **Mục lục tác giả A–Z** với thanh nhảy nhanh tới từng ngăn chữ cái.
- **Thẻ ngẫu nhiên**: `/tho/ngau-nhien` chọn ngẫu nhiên một bài thơ, tương tự "Random article" của Wikipedia.
- **Gợi ý liên quan**: cuối mỗi bài thơ hiển thị các bài cùng tác giả hoặc cùng thời kỳ.
- **Trạng thái loading** (`loading.tsx`) và **trang 404 tuỳ chỉnh** (`not-found.tsx`) theo phong cách thư viện.

## Hướng mở rộng tiếp theo (gợi ý, chưa làm)

- Module Story/Khoảnh Khắc, trang admin quản trị nội dung (hiện out of scope theo yêu cầu ban đầu).
- Đánh dấu "đã đọc" / bộ sưu tập cá nhân (cần auth).
- Duyệt theo tag riêng (`/tho?tag=`) — schema đã có sẵn `tags: String[]`, chỉ cần thêm UI lọc.
- Sitemap.xml / robots.ts để tối ưu SEO khi deploy thật.

## Ngoài phạm vi MVP này

- Auth / trang admin
- Module Story / Khoảnh Khắc
- Page builder kéo-thả
- Hệ thống bình luận
