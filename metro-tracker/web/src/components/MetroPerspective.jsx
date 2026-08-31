/** Line-art metro in perspective. Decorative only — one use, in the hero. */
export default function MetroPerspective() {
  return (
    <svg
      viewBox="30 140 1000 560"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mp-ink" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="45%" stopColor="#a78bfa" />
          <stop offset="75%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <filter id="mp-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g fill="none" stroke="#64748b" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round">
        <path d="M118 353 L146 345" />
        <path d="M188 379 L225 366" />
        <path d="M268 408 L316 390" />
        <path d="M369 445 L429 420" />
        <path d="M489 490 L565 456" />
        <path d="M629 541 L723 497" />
        <path d="M789 600 L904 545" />
        <path d="M970 667 L1108 599" />
      </g>

      <g fill="none" stroke="#94a3b8" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round">
        <path d="M58 331 L1060 700" />
        <path d="M78 327 L1210 626" />
      </g>

      <g
        fill="none"
        stroke="url(#mp-ink)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#mp-glow)"
      >
        <path d="M55 296 L600 168 C700 172 800 196 852 246 C886 280 890 318 866 364 C840 414 730 446 600 452 L55 330 Z" />
        <path d="M624 198 C702 204 780 226 824 264 L824 304 C784 270 700 246 624 242 Z" />
        <path d="M640 300 C716 304 792 322 838 350" strokeWidth="2.2" strokeOpacity="0.75" />
      </g>

      <g fill="none" stroke="#cbd5e1" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round">
        <path d="M55 301 L600 196" />
        <path d="M55 311 L600 268" />
        <path d="M55 326 L600 440" strokeOpacity="0.32" />
        <path d="M120 288 L120 306" />
        <path d="M197 274 L197 300" />
        <path d="M284 257 L284 293" />
        <path d="M382 238 L382 285" />
        <path d="M491 217 L491 277" />
      </g>

      <g filter="url(#mp-glow)">
        <ellipse cx="852" cy="344" rx="13" ry="8" fill="#fde68a" opacity="0.85" transform="rotate(18 852 344)" />
        <ellipse cx="826" cy="382" rx="10" ry="6" fill="#fca5a5" opacity="0.7" transform="rotate(18 826 382)" />
      </g>

      <path
        d="M55 334 L600 458 C740 452 850 420 878 372"
        fill="none"
        stroke="#0f172a"
        strokeWidth="9"
        strokeOpacity="0.55"
        strokeLinecap="round"
      />
    </svg>
  );
}
