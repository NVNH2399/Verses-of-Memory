export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-3 w-40 animate-pulse bg-border/60" />
      <div className="h-7 w-2/3 animate-pulse bg-border/60" />
      <div className="space-y-2 pt-2">
        <div className="h-4 w-full animate-pulse bg-border/40" />
        <div className="h-4 w-5/6 animate-pulse bg-border/40" />
        <div className="h-4 w-3/4 animate-pulse bg-border/40" />
      </div>
      <p className="catalog-label pt-2">Đang tra cứu thẻ mục lục…</p>
    </div>
  );
}
