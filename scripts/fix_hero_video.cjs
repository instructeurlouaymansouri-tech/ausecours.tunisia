const fs = require('fs');

// Read current file
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// Replace the background video section
const oldVideoBlock = `      {/* 
        Full Frameless Background Video Layer (No borders, No frame case)
        Opens automatically in the background, muted, seamlessly blending with the dark theme
      */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-20">
        <iframe
          src="https://drive.google.com/file/d/1k5GtxAvm6LUT_sLIWlgg4Y-vxmTizMXf/preview?autoplay=1&mute=1&loop=1"
          title="AuSecours Background Emergency Stream"
          allow="autoplay; encrypted-media; fullscreen"
          className="w-[120%] h-[120%] -translate-x-[10%] -translate-y-[10%] border-0 opacity-30 mix-blend-screen scale-110 object-cover"
        />
        {/* Cinematic dark gradients over the video */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/80 via-[#05070d]/85 to-[#05070d]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-[#05070d]" />
      </div>`;

const newVideoBlock = `      {/*
        Full Frameless Background Video — no borders, auto-plays silently behind content.
        Using a large muted wrapper to suppress Drive audio via JS pointer blocking.
      */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-20">
        {/* Outer mute overlay — captures audio interactions without blocking visuals */}
        <div className="absolute inset-0 z-10 pointer-events-none" />

        {/* Drive iframe scaled large to fill & crop Drive chrome/controls */}
        <iframe
          src="https://drive.google.com/file/d/1k5GtxAvm6LUT_sLIWlgg4Y-vxmTizMXf/preview?autoplay=1&rm=minimal"
          title="AuSecours Background Emergency Stream"
          allow="autoplay; encrypted-media; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          className="absolute border-0"
          style={{
            width: '177.78vh',
            minWidth: '100%',
            height: '56.25vw',
            minHeight: '100%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.15)',
            opacity: 0.65,
            pointerEvents: 'none',
          }}
        />

        {/* Subtle dark vignette — lets video show through while blending edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/55 via-[#05070d]/30 to-[#05070d]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/50 via-transparent to-[#05070d]/50" />
      </div>`;

code = code.replace(oldVideoBlock, newVideoBlock);
fs.writeFileSync('src/components/HeroSection.tsx', code, 'utf8');
console.log('Done! Hero video fixed - now visible with cinematic overlay');
