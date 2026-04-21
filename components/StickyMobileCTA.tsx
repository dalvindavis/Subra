import Link from "next/link";

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-[#07070B]/90 p-3 backdrop-blur-xl md:hidden">
      <Link href="/analyze"
        className="block rounded-[16px] bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.24)]">
        Run Free Scan — No Signup Required
      </Link>
    </div>
  );
}