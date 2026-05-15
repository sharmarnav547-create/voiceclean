export default function LogoIcon({ className = "" }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d4ff" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* Background shape */}
      <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" fillOpacity="0.1" />
      {/* Sound waves */}
      <rect x="8" y="12" width="3" height="8" rx="1.5" fill="url(#logo-gradient)" />
      <rect x="14.5" y="8" width="3" height="16" rx="1.5" fill="url(#logo-gradient)" />
      <rect x="21" y="10" width="3" height="12" rx="1.5" fill="url(#logo-gradient)" />
      {/* AI Node point */}
      <circle cx="22.5" cy="10" r="2.5" fill="#00d4ff" />
    </svg>
  );
}
