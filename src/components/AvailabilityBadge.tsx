import { ELERHETOSEG_INFO, type Elerhetoseg } from '@/lib/termekek';

export default function AvailabilityBadge({ status, compact = false }: { status: Elerhetoseg; compact?: boolean }) {
  const info = ELERHETOSEG_INFO[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: compact ? 11 : 12,
        fontWeight: 600,
        padding: compact ? '3px 9px' : '5px 11px',
        borderRadius: 20,
        background: info.bg,
        border: `1px solid ${info.border}`,
        color: info.color,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: info.color, flexShrink: 0 }} />
      {compact ? info.short : info.label}
    </span>
  );
}
