import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  size?: number;
  className?: string;
  decorative?: boolean;
};

export function BrandMark({ size = 28, className, decorative = false }: BrandMarkProps) {
  return (
    <Image
      src="/brand/ballondor-community-mark.svg"
      width={size}
      height={size}
      alt={decorative ? "" : "Ballon d’Or Community Ballot"}
      aria-hidden={decorative || undefined}
      className={className}
    />
  );
}

export function BrandLockup({ home = false }: { home?: boolean }) {
  return (
    <Link className="brand-lockup" href={home ? "#top" : "/#top"}>
      <BrandMark decorative />
      <span className="wordmark">BALLON D’OR <span>2026</span></span>
    </Link>
  );
}
