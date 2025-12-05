
export const OFFICIAL_SEAL_CONFIG = {
    // The Official CEO Signature (Murad Aljohani) - Blue Ink (Bird Design)
    signature: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg width="520" height="260" viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg">
  <!-- رسم الطائر -->
  <path d="M90 110 q20 -25 45 0 q-25 20 -45 0" stroke="#0044aa" stroke-width="4" fill="none" />
  <circle cx="110" cy="102" r="3" fill="#0044aa" />
  <path d="M85 118 q40 70 120 25 q-40 -50 -120 -25" stroke="#0044aa" stroke-width="4" fill="none" />
  <path d="M110 130 q35 -15 70 20 q-40 10 -70 -20" stroke="#0044aa" stroke-width="3" fill="none" />
  <path d="M200 145 q25 20 40 0 q-15 -10 -40 0" stroke="#0044aa" stroke-width="3" fill="none" />
  <path d="M50 150 Q140 15 260 100 Q380 180 470 60" stroke="#0044aa" stroke-width="3" fill="none" />
  <text x="150" y="185" font-size="46" font-family="Tahoma" fill="#0044aa">م مراد الجهني</text>
  <path d="M140 200 L400 200 q40 0 60 -20" stroke="#0044aa" stroke-width="3" fill="none" />
  <circle cx="430" cy="215" r="20" stroke="#0044aa" stroke-width="3" fill="none" />
</svg>`)}`,

    // THE UPDATED OFFICIAL ULTRA-REALISTIC SEAL (Ink Stamp Effect)
    seal: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="grungeMask">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -9" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" result="composite" />
        </filter>

        <filter id="inkBleed" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="texture" />
            <feDisplacementMap in="SourceGraphic" in2="texture" scale="3" xChannelSelector="R" yChannelSelector="G" />
            <feComposite operator="in" in2="SourceGraphic" /> 
        </filter>

        <path id="pathUp" d="M 50,200 A 150,150 0 1,1 350,200" fill="none" />
        <path id="pathDown" d="M 65,200 A 135,135 0 0,0 335,200" fill="none" />
    </defs>

    <g filter="url(#inkBleed)" fill="#1a3c6e" stroke="#1a3c6e" style="mask: url(#grungeMask)">
        
        <circle cx="200" cy="200" r="190" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="1000 5" />
        
        <circle cx="200" cy="200" r="175" stroke-width="2" fill="none" />

        <text font-family="'Courier New', Courier, serif" font-weight="900" font-size="32" letter-spacing="1">
            <textPath href="#pathUp" startOffset="50%" text-anchor="middle">
                MYLAF MURAD ACADEMY
            </textPath>
        </text>

        <text font-family="'Courier New', Courier, serif" font-weight="bold" font-size="28" letter-spacing="3">
            <textPath href="#pathDown" startOffset="50%" text-anchor="middle">
                EST. 2025
            </textPath>
        </text>

        <g transform="translate(200, 200)">
            <text x="0" y="-55" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-weight="900" font-size="46" stroke-width="0">مُعْتَمَد</text>
            
            <text x="0" y="-10" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-weight="bold" font-size="24" stroke-width="0.5">م. مراد الجهني</text>
            
            <g transform="translate(-20, 25) rotate(-6) scale(1.4)">
                <path d="M-50,10 Q-30,-15 0,10 T40,5 T80,20" stroke-width="2.5" fill="none" stroke-linecap="round" />
                <path d="M70,20 Q20,60 -90,30" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.85" />
                <circle cx="-50" cy="10" r="2.5" fill="#1a3c6e" stroke="none" />
                <circle cx="80" cy="20" r="2" fill="#1a3c6e" stroke="none" />
            </g>

            <g stroke-width="0.8" fill="none" opacity="0.3">
                <path d="M-120,60 Q-60,90 0,60 T120,60" />
                <path d="M-120,70 Q-60,100 0,70 T120,70" />
                <path d="M-120,80 Q-60,110 0,80 T120,80" />
            </g>
        </g>
    </g>
    
    <rect x="0" y="0" width="400" height="400" filter="url(#grungeMask)" fill="white" opacity="0.1" style="mix-blend-mode: overlay;" />
</svg>`)}`,
    
    // Legacy support kept empty
    filters: `` 
};
