export default function LogoMark({ size = 22, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="20" y1="36" x2="20" y2="15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="20" cy="13" r="2.6" fill="currentColor" />
      <path d="M13,18 Q20,10 27,18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M7,22 Q20,3 33,22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="20" y1="36" x2="12" y2="41" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="20" y1="36" x2="28" y2="41" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="20" y1="36" x2="20" y2="42" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
