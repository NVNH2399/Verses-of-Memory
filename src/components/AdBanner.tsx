/**
 * Khung quảng cáo placeholder — chưa gắn mạng quảng cáo thật nào.
 *
 * Cách kích hoạt quảng cáo thật (vd Google AdSense):
 * 1. Đăng ký & được duyệt tài khoản AdSense (hoặc mạng khác như Adtima, Eclick).
 * 2. Dùng `next/script` để load script mạng quảng cáo trong `layout.tsx`
 *    (chạy phía client, đặt `strategy="afterInteractive"`).
 * 3. Thay nội dung bên trong <div className="ad-slot"> bằng thẻ <ins> / iframe
 *    mà mạng quảng cáo cung cấp cho từng vị trí (header, sidebar, in-content).
 *
 * Cho tới lúc đó, component này chỉ hiện khung trống có nhãn "Quảng cáo" để
 * không phá bố cục và luôn minh bạch với người đọc là đây là vị trí quảng cáo.
 */
export function AdBanner({
  size = "leaderboard",
  className = "",
}: {
  size?: "leaderboard" | "rectangle" | "mobile";
  className?: string;
}) {
  const dimensions: Record<string, string> = {
    leaderboard: "h-[90px] w-full max-w-[728px]", // 728x90
    rectangle: "h-[250px] w-full max-w-[300px]", // 300x250
    mobile: "h-[100px] w-full max-w-[320px]", // 320x100
  };

  return (
    <div className={`mx-auto flex justify-center ${className}`}>
      <div
        className={`ad-slot flex items-center justify-center border border-dashed border-border bg-sidebar/60 ${dimensions[size]}`}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Quảng cáo · vị trí trống
        </span>
      </div>
    </div>
  );
}
