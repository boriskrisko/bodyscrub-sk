'use client';

export default function ScrubCircle({
  color,
  size = 120,
  label,
}: {
  color: string;
  size?: number;
  label?: string;
}) {
  const dots = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const r = size * 0.32 + (((i * 7 + 3) % 11) / 11) * size * 0.08;
    return {
      x: Math.cos(a) * r + size / 2,
      y: Math.sin(a) * r + size / 2,
      s: 2 + (((i * 13 + 5) % 7) / 7) * 3,
    };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={size * 0.38} fill={color} opacity="0.15" />
        <circle cx={size / 2} cy={size / 2} r={size * 0.28} fill={color} opacity="0.25" />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={color} opacity="0.4" />
        ))}
      </svg>
      {label && (
        <span
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-[2px] font-medium whitespace-nowrap"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
