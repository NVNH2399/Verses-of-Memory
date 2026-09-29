import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * LƯU Ý VỀ DỮ LIỆU DEMO:
 * - Thông tin tác giả (năm sinh/mất, tiểu sử ngắn) dựa trên dữ kiện lịch sử có thật.
 * - Phần "content" / "excerpt" của các bài thơ trong seed này là VĂN BẢN MINH HỌA
 *   được viết riêng cho mục đích demo cấu trúc dữ liệu, KHÔNG phải trích dẫn nguyên tác.
 *   Khi đưa dữ liệu thật vào production, hãy thay bằng văn bản đã được kiểm chứng
 *   bản quyền/nguồn gốc rõ ràng.
 */

async function main() {
  console.log("🌱 Seeding database...");

  // Xoá dữ liệu cũ để seed lại từ đầu (an toàn cho môi trường dev)
  await prisma.poem.deleteMany();
  await prisma.author.deleteMany();
  await prisma.moment.deleteMany();
  await prisma.affiliateProduct.deleteMany();
  await prisma.user.deleteMany();

  // ---- Tác giả 1: Public domain (mất > 50 năm) ----
  const chieu = await prisma.author.create({
    data: {
      name: "Nguyễn Đình Chiểu",
      slug: "nguyen-dinh-chieu",
      bio: "Nhà thơ, nhà giáo, thầy thuốc Nam Bộ, tác giả nhiều áng văn thơ yêu nước chống thực dân Pháp cuối thế kỷ 19.",
      birthYear: 1822,
      deathYear: 1888,
      isPublicDomain: true,
      poems: {
        create: [
          {
            title: "Khúc ca người nghĩa sĩ (văn bản minh họa)",
            slug: "khuc-ca-nguoi-nghia-si",
            period: "chống Pháp",
            tags: ["chống Pháp", "quê hương", "nghĩa sĩ"],
            excerptOnly: false,
            content:
              "[Văn bản minh họa cho mục đích demo — không phải nguyên tác]\n\n" +
              "Trên đồng ruộng khói súng còn vương,\n" +
              "Người nông dân buông cày cầm giáo mác.\n" +
              "Đất mẹ đau, lòng dân chẳng khuất,\n" +
              "Máu anh hùng tô thắm sử xanh.",
            excerpt:
              "Trên đồng ruộng khói súng còn vương, người nông dân buông cày cầm giáo mác...",
          },
          {
            title: "Lời quê (văn bản minh họa)",
            slug: "loi-que",
            period: "chống Pháp",
            tags: ["chống Pháp", "đạo lý"],
            excerptOnly: false,
            content:
              "[Văn bản minh họa cho mục đích demo — không phải nguyên tác]\n\n" +
              "Ai về nhắn với non sông,\n" +
              "Rằng đây một tấm lòng không đổi dời.\n" +
              "Dẫu cho vật đổi sao dời,\n" +
              "Chữ trung chữ hiếu trọn đời không phai.",
            excerpt: "Ai về nhắn với non sông, rằng đây một tấm lòng không đổi dời...",
          },
        ],
      },
    },
  });

  // ---- Tác giả 2: Public domain (mất > 50 năm) ----
  const chau = await prisma.author.create({
    data: {
      name: "Phan Bội Châu",
      slug: "phan-boi-chau",
      bio: "Chí sĩ yêu nước, nhà cách mạng và nhà thơ đầu thế kỷ 20, khởi xướng phong trào Đông Du chống thực dân Pháp.",
      birthYear: 1867,
      deathYear: 1940,
      isPublicDomain: true,
      poems: {
        create: [
          {
            title: "Chí lớn ra khơi (văn bản minh họa)",
            slug: "chi-lon-ra-khoi",
            period: "chống Pháp",
            tags: ["chống Pháp", "chí khí", "ra đi"],
            excerptOnly: false,
            content:
              "[Văn bản minh họa cho mục đích demo — không phải nguyên tác]\n\n" +
              "Làm trai cho đáng nên trai,\n" +
              "Chí lớn tung hoành bốn bể ngoài.\n" +
              "Non sông còn đó chờ tay dựng,\n" +
              "Há để thân nam chịu cúi đầu.",
            excerpt: "Làm trai cho đáng nên trai, chí lớn tung hoành bốn bể ngoài...",
          },
          {
            title: "Gửi bạn đồng chí (văn bản minh họa)",
            slug: "gui-ban-dong-chi",
            period: "chống Pháp",
            tags: ["chống Pháp", "tình bạn", "cách mạng"],
            excerptOnly: false,
            content:
              "[Văn bản minh họa cho mục đích demo — không phải nguyên tác]\n\n" +
              "Bạn hỡi, đường xa chớ ngại ngần,\n" +
              "Non sông còn đợi bước ân cần.\n" +
              "Gian nan mấy độ lòng không đổi,\n" +
              "Ngày hội non sông tất có phần.",
            excerpt: "Bạn hỡi, đường xa chớ ngại ngần, non sông còn đợi bước ân cần...",
          },
          {
            title: "Nhớ nước (văn bản minh họa)",
            slug: "nho-nuoc",
            period: "chống Pháp",
            tags: ["chống Pháp", "nỗi nhớ", "quê hương"],
            excerptOnly: false,
            content:
              "[Văn bản minh họa cho mục đích demo — không phải nguyên tác]\n\n" +
              "Đêm khuya nghe tiếng quốc kêu sương,\n" +
              "Nhớ nước, thương nhà, dạ vấn vương.\n" +
              "Bốn bể ba đào chưa hết sóng,\n" +
              "Một lòng vẫn giữ mối cang thường.",
            excerpt: "Đêm khuya nghe tiếng quốc kêu sương, nhớ nước, thương nhà, dạ vấn vương...",
          },
        ],
      },
    },
  });

  // ---- Tác giả 3: Còn bản quyền (mất chưa quá 50 năm) -> excerptOnly ----
  const huu = await prisma.author.create({
    data: {
      name: "Tố Hữu",
      slug: "to-huu",
      bio: "Nhà thơ cách mạng tiêu biểu của văn học Việt Nam hiện đại, nhiều sáng tác gắn liền với hai cuộc kháng chiến chống Pháp và chống Mỹ.",
      birthYear: 1920,
      deathYear: 2002,
      isPublicDomain: false,
      poems: {
        create: [
          {
            title: "Bài ca ra trận (trích minh họa)",
            slug: "bai-ca-ra-tran",
            period: "chống Mỹ",
            tags: ["chống Mỹ", "hành quân"],
            excerptOnly: true,
            content: null,
            excerpt:
              "(Trích minh họa) Đoàn quân ra đi giữa nắng vàng, mang theo lời hẹn ngày thống nhất...",
            sourceUrl: "https://example.com/nguon-tac-gia-quyen/bai-ca-ra-tran",
          },
          {
            title: "Tiếng hát mùa xuân (trích minh họa)",
            slug: "tieng-hat-mua-xuan",
            period: "chống Mỹ",
            tags: ["chống Mỹ", "hy vọng"],
            excerptOnly: true,
            content: null,
            excerpt:
              "(Trích minh họa) Mùa xuân về trên khắp nẻo đường quê, mang theo bao niềm tin mới...",
            sourceUrl: "https://example.com/nguon-tac-gia-quyen/tieng-hat-mua-xuan",
          },
        ],
      },
    },
  });

  // ---- Khoảnh Khắc: video ngắn kể chuyện lịch sử (demo) ----
  await prisma.moment.createMany({
    data: [
      {
        title: "60 giây: Vì sao có phong trào Đông Du?",
        slug: "60-giay-phong-trao-dong-du",
        platform: "youtube",
        externalUrl: "https://www.youtube.com/watch?v=VIDEO_ID_PLACEHOLDER",
        embedUrl: "https://www.youtube.com/embed/VIDEO_ID_PLACEHOLDER",
        thumbnailUrl: null,
        description:
          "[Nội dung minh họa cho demo] Tóm tắt ngắn gọn bối cảnh ra đời phong trào Đông Du đầu thế kỷ 20.",
        period: "chống Pháp",
        tags: ["chống Pháp", "Đông Du", "60 giây lịch sử"],
      },
      {
        title: "Khoảnh khắc: Ký ức người lính trở về",
        slug: "ky-uc-nguoi-linh-tro-ve",
        platform: "tiktok",
        externalUrl: "https://www.tiktok.com/@example/video/0000000000000000000",
        embedUrl: null,
        thumbnailUrl: null,
        description:
          "[Nội dung minh họa cho demo] Đoạn phỏng vấn ngắn ghi lại hồi ức của một cựu chiến binh.",
        period: "chống Mỹ",
        tags: ["chống Mỹ", "hồi ức", "phỏng vấn"],
      },
      {
        title: "Góc quê: Thăm lại chiến khu xưa",
        slug: "goc-que-tham-lai-chien-khu-xua",
        platform: "facebook",
        externalUrl: "https://www.facebook.com/watch/?v=0000000000000000",
        embedUrl: null,
        thumbnailUrl: null,
        description:
          "[Nội dung minh họa cho demo] Vlog ghé thăm một địa danh lịch sử ở miền quê.",
        period: "khác",
        tags: ["vlog", "địa danh lịch sử"],
      },
    ],
  });

  // ---- Affiliate Shopee (demo) — link là placeholder, thay bằng link affiliate thật ----
  await prisma.affiliateProduct.createMany({
    data: [
      {
        label: "Tuyển tập thơ kháng chiến Việt Nam (bìa cứng)",
        price: "185.000đ",
        imageUrl: null,
        shopeeUrl:
          "https://shopee.vn/search?keyword=tuyen-tap-tho-khang-chien&aff_id=YOUR_AFFILIATE_ID",
        note: "Gợi ý đọc thêm cho ai muốn có bản in đầy đủ tại nhà.",
      },
      {
        label: "Sổ tay chép thơ da PU",
        price: "79.000đ",
        imageUrl: null,
        shopeeUrl:
          "https://shopee.vn/search?keyword=so-tay-chep-tho&aff_id=YOUR_AFFILIATE_ID",
        note: "Dùng để chép lại những câu thơ yêu thích.",
      },
    ],
  });

  // ---- Tài khoản admin mặc định (đổi mật khẩu ngay sau khi seed lần đầu) ----
  const adminPasswordHash = await bcrypt.hash("DoiMatKhauNgay123!", 10);
  await prisma.user.create({
    data: {
      name: "Quản trị viên",
      email: "admin@verses-of-memory.local",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log("✅ Seed done:", {
    authors: [chieu.name, chau.name, huu.name],
    admin: "admin@verses-of-memory.local / DoiMatKhauNgay123! (đổi ngay sau khi seed)",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
