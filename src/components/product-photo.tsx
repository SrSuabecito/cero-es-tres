import { isFullPhotoUrl } from "@/lib/menu";

export function ProductPhoto({
  url,
  alt,
  className,
}: {
  url: string | null | undefined;
  alt: string;
  className?: string;
}) {
  if (isFullPhotoUrl(url)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url!} alt={alt} className={className} />;
  }

  return (
    <div
      className={className}
      style={{
        background:
          "repeating-linear-gradient(135deg, #E7DDCB 0 8px, #EFE7D8 8px 16px)",
      }}
    />
  );
}
