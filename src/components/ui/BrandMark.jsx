import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official Luxury BrandMark / Logo Component for Glamour Emporium
 * Unified across Header, Footer, and Campaign touchpoints with the official circular emblem.
 */
export default function BrandMark({
  size = "md", // "sm" | "md" | "lg" | "xl"
  layout = "horizontal", // "horizontal" | "stacked" | "monogram-only" | "compact" | "full" | "logo-only"
  variant = "dark", // "dark" (on dark bg) | "light" (on light bg)
  showMonogram = true,
  showDescriptor = true,
  className = "",
  monogramClassName = "",
  textClassName = "",
  descriptorClassName = "",
}) {
  const isLarge = size === "xl" || size === "lg";
  const isSmall = size === "sm";
  const isCompact = layout === "compact" || layout === "monogram-only" || layout === "logo-only";
  const isLightMode = variant === "light";

  return (
    <div
      className={cn(
        "inline-flex items-center select-none",
        layout === "stacked" ? "flex-col items-start gap-3" : "gap-3 sm:gap-4",
        className
      )}
    >
      {/* Official Circular Glamour Emporium Emblem */}
      {showMonogram && (
        <div
          className={cn(
            "relative rounded-full overflow-hidden shrink-0 transition-all duration-300 border border-[#c9a87c]/50 bg-[#0c0b0a] shadow-[0_2px_12px_rgba(0,0,0,0.5)]",
            isSmall && "w-8 h-8",
            size === "md" && "w-10 h-10 sm:w-11 sm:h-11",
            size === "lg" && "w-14 h-14 sm:w-16 sm:h-16 border-[1.5px]",
            size === "xl" && "w-20 h-20 sm:w-24 sm:h-24 border-2",
            monogramClassName
          )}
          aria-hidden="true"
        >
          <Image
            src="/images/logo/logo-mark.webp"
            alt="Glamour Emporium Official Emblem"
            fill
            sizes="120px"
            className="object-cover"
            priority={size === "md" || size === "lg"}
          />
        </div>
      )}

      {/* Typographic Wordmark & Descriptor */}
      {!isCompact && (
        <div className="flex flex-col justify-center">
          <span
            className={cn(
              "font-serif font-light tracking-[0.18em] uppercase leading-tight transition-colors",
              isLightMode ? "text-[#292c27]" : "text-[#f5f2eb]",
              isSmall && "text-base tracking-[0.14em]",
              size === "md" && "text-lg sm:text-xl lg:text-2xl",
              size === "lg" && "text-2xl sm:text-3xl lg:text-4xl tracking-[0.2em]",
              size === "xl" && "text-3xl sm:text-5xl lg:text-6xl tracking-[0.22em]",
              textClassName
            )}
          >
            GLAMOUR EMPORIUM
          </span>

          {showDescriptor && (
            <span
              className={cn(
                "font-sans uppercase font-medium leading-none mt-1",
                isLightMode ? "text-[#66685e]" : "text-[#c9a87c]",
                isSmall && "text-[7px] tracking-[0.24em]",
                size === "md" && "text-[8px] sm:text-[9px] tracking-[0.32em]",
                size === "lg" && "text-[10px] sm:text-[11px] tracking-[0.35em]",
                size === "xl" && "text-xs sm:text-sm tracking-[0.38em]",
                descriptorClassName
              )}
            >
              UNISEX SALON • PANIPAT
            </span>
          )}
        </div>
      )}
    </div>
  );
}

