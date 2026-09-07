import BrandMark from "@/components/ui/BrandMark";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative min-h-[85vh] sm:min-h-[90vh] w-full bg-[#0c0b0a] text-[#f5f2eb] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[320px] max-h-[320px] rounded-full bg-[#c9a87c]/6 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* GE Monogram / Brand Emblem with subtle breathe */}
        <div className="animate-pulse motion-reduce:animate-none">
          <BrandMark
            size="lg"
            layout="stacked"
            showMonogram={true}
            showDescriptor={false}
            monogramClassName="border-[#c9a87c]/60 shadow-[0_0_25px_rgba(201,168,124,0.18)]"
            textClassName="text-2xl sm:text-3xl tracking-[0.22em] text-[#f5f2eb]"
          />
        </div>

        {/* Supporting Line */}
        <span className="mt-4 text-[11px] font-mono uppercase tracking-[0.32em] text-[#c9a87c]">
          PREPARING YOUR LOOK...
        </span>

        {/* Elegant growing/moving line animation (Pure CSS) */}
        <div className="mt-6 w-36 h-[1.5px] bg-white/10 overflow-hidden relative rounded-full">
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#c9a87c] to-transparent animate-[shimmer_1.8s_infinite_ease-in-out] motion-reduce:w-full motion-reduce:animate-none" />
        </div>

        <span className="sr-only">Loading page content...</span>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
}
