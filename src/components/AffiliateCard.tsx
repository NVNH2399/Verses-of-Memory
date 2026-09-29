type AffiliateProductLite = {
  id: string;
  label: string;
  price: string | null;
  imageUrl: string | null;
  shopeeUrl: string;
  note: string | null;
};

/**
 * Thẻ sản phẩm affiliate — LUÔN đi kèm nhãn "Liên kết tiếp thị" để minh bạch
 * với người đọc rằng đây là link kiếm hoa hồng, không phải nội dung biên tập
 * độc lập. rel="sponsored nofollow" theo khuyến nghị của Google cho link quảng cáo.
 */
export function AffiliateCard({ product }: { product: AffiliateProductLite }) {
  return (
    <a
      href={product.shopeeUrl}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="flex gap-3 border border-dashed border-stamp/40 bg-stamp/[0.04] p-3 hover:bg-stamp/[0.08] hover:no-underline"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-border bg-surface font-mono text-[10px] text-muted">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.label}
            className="h-full w-full object-cover"
          />
        ) : (
          "Ảnh SP"
        )}
      </div>
      <div className="min-w-0">
        <p className="stamp-badge mb-1">Liên kết tiếp thị</p>
        <p className="truncate text-sm font-medium text-ink">{product.label}</p>
        {product.price && (
          <p className="text-sm font-semibold text-stamp">{product.price}</p>
        )}
        {product.note && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">{product.note}</p>
        )}
      </div>
    </a>
  );
}

export function AffiliateDisclosure() {
  return (
    <p className="catalog-label border-t border-dashed border-border pt-3 text-left normal-case tracking-normal">
      Một số liên kết trong trang là <strong>liên kết tiếp thị (affiliate)</strong>{" "}
      — nếu bạn mua hàng qua đó, trang có thể nhận một khoản hoa hồng nhỏ, không
      phát sinh thêm chi phí cho bạn. Điều này giúp duy trì thư viện.
    </p>
  );
}
