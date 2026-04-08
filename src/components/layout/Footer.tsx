import Link from 'next/link';

function LeafIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#7DB872" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22c0 0 8-4 8-12C20 4 14 2 12 2c-2 0-8 2-8 8 0 8 8 12 8 12z" />
      <path d="M12 22V8" />
      <path d="M8 14c2-2 4-3 4-3" />
      <path d="M16 11c-2 1.5-4 3-4 3" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-500 pt-12 pb-8 px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LeafIcon />
            <span className="font-display font-medium text-base text-sand-100 tracking-wide">
              bodyscrub<span className="text-moss-400">.sk</span>
            </span>
          </div>
          <p className="text-[13px] leading-relaxed max-w-[280px]">
            Prírodné scrubs vyrobené s láskou na Slovensku. Starostlivosť o telo, ktorá je dobrá pre teba aj planétu.
          </p>
        </div>

        <div>
          <h4 className="text-sand-100 text-xs tracking-[2px] mb-4">OBCHOD</h4>
          <div className="flex flex-col gap-2 text-[13px]">
            <Link href="/produkty" className="hover:text-sand-400 transition-colors">Všetky produkty</Link>
            <Link href="/produkty?category=coffee" className="hover:text-sand-400 transition-colors">Kávové scrubs</Link>
            <Link href="/produkty?category=oil" className="hover:text-sand-400 transition-colors">Olejové scrubs</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sand-100 text-xs tracking-[2px] mb-4">INFO</h4>
          <div className="flex flex-col gap-2 text-[13px]">
            <Link href="/o-nas" className="hover:text-sand-400 transition-colors">O nás</Link>
            <Link href="/blog" className="hover:text-sand-400 transition-colors">Blog</Link>
            <Link href="/kontakt" className="hover:text-sand-400 transition-colors">Kontakt</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sand-100 text-xs tracking-[2px] mb-4">PRÁVNE</h4>
          <div className="flex flex-col gap-2 text-[13px]">
            <Link href="/obchodne-podmienky" className="hover:text-sand-400 transition-colors">Obchodné podmienky</Link>
            <Link href="/ochrana-udajov" className="hover:text-sand-400 transition-colors">Ochrana údajov</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row justify-between text-xs gap-4">
        <span>© {new Date().getFullYear()} bodyscrub.sk. Všetky práva vyhradené.</span>
        <div className="flex gap-4">
          <span className="hover:text-sand-400 cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-sand-400 cursor-pointer transition-colors">Facebook</span>
          <span className="hover:text-sand-400 cursor-pointer transition-colors">TikTok</span>
        </div>
      </div>
    </footer>
  );
}
