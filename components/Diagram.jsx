// Schematic side-elevation diagrams, technical-datasheet style.
export default function Diagram({ d, name }) {
  if (d.kind === "biped") {
    return (
      <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" aria-label={`${name} dimension schematic`}>
        <g stroke="#16181d" strokeWidth="2" fill="none" strokeLinecap="round">
          <rect x="112" y="130" width="76" height="44" rx="10" />
          <line x1="132" y1="174" x2="124" y2="230" />
          <line x1="168" y1="174" x2="176" y2="230" />
          <line x1="124" y1="230" x2="130" y2="284" />
          <line x1="176" y1="230" x2="170" y2="284" />
          <line x1="120" y1="284" x2="140" y2="284" />
          <line x1="160" y1="284" x2="180" y2="284" />
          <circle cx="130" cy="298" r="12" strokeDasharray="3 4" />
          <circle cx="170" cy="298" r="12" strokeDasharray="3 4" />
        </g>
        <g stroke="#c8501e" strokeWidth="1.5">
          <line x1="248" y1="130" x2="248" y2="310" />
          <line x1="240" y1="130" x2="256" y2="130" />
          <line x1="240" y1="310" x2="256" y2="310" />
        </g>
        <text x="262" y="222" fontFamily="var(--mono)" fontSize="13" fill="#c8501e" transform="rotate(90 262 222)" textAnchor="middle">{d.dim}</text>
        <text x="150" y="52" fontFamily="var(--mono)" fontSize="11" fill="#8a8f98" textAnchor="middle">interchangeable foot modes</text>
        <text x="150" y="68" fontFamily="var(--mono)" fontSize="11" fill="#8a8f98" textAnchor="middle">point / sole / wheel</text>
        <line x1="60" y1="326" x2="240" y2="326" stroke="#e2e0da" strokeWidth="1" />
      </svg>
    );
  }
  const [tx, ty, tw, th] = d.torso;
  const headY = d.headY;
  const hipY = ty + th;
  const kneeY = Math.min(hipY + 78, 266);
  const ankleY = 300;
  const cxL = tx + tw * 0.28;
  const cxR = tx + tw * 0.72;
  return (
    <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" aria-label={`${name} dimension schematic`}>
      <g stroke="#16181d" strokeWidth="2" fill="none" strokeLinecap="round">
        <circle cx="150" cy={headY} r="22" />
        <rect x={tx} y={ty} width={tw} height={th} rx="10" />
        <line x1={tx} y1={ty + 16} x2={tx - 30} y2={ty + 78} />
        <line x1={tx + tw} y1={ty + 16} x2={tx + tw + 30} y2={ty + 78} />
        <line x1={cxL} y1={hipY} x2={cxL - 5} y2={kneeY} />
        <line x1={cxR} y1={hipY} x2={cxR + 5} y2={kneeY} />
        <line x1={cxL - 5} y1={kneeY} x2={cxL - 8} y2={ankleY} />
        <line x1={cxR + 5} y1={kneeY} x2={cxR + 8} y2={ankleY} />
        <line x1={cxL - 18} y1={ankleY} x2={cxL + 2} y2={ankleY} />
        <line x1={cxR - 2} y1={ankleY} x2={cxR + 18} y2={ankleY} />
      </g>
      <g stroke="#c8501e" strokeWidth="1.5">
        <line x1="248" y1={d.dimTop} x2="248" y2={ankleY} />
        <line x1="240" y1={d.dimTop} x2="256" y2={d.dimTop} />
        <line x1="240" y1={ankleY} x2="256" y2={ankleY} />
      </g>
      <text x="262" y={(d.dimTop + ankleY) / 2} fontFamily="var(--mono)" fontSize="13" fill="#c8501e" transform={`rotate(90 262 ${(d.dimTop + ankleY) / 2})`} textAnchor="middle">{d.dim}</text>
      <line x1="60" y1="320" x2="240" y2="320" stroke="#e2e0da" strokeWidth="1" />
    </svg>
  );
}
