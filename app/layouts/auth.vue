<template>
  <div class="auth-layout">

    <!-- Animated Background -->
    <div class="auth-bg">
      <!-- Gradient Mesh Orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>

      <!-- Floating geometric shapes -->
      <div class="shape shape-ring shape-ring-1"></div>
      <div class="shape shape-ring shape-ring-2"></div>
      <div class="shape shape-dot-grid"></div>

      <!-- Decorative lines -->
      <svg class="deco-lines" viewBox="0 0 1366 768" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <path d="M-50 400 Q200 200 500 350 T1050 200 T1500 350" stroke="url(#grad-line-1)" stroke-width="1.5" fill="none" opacity="0.4"/>
        <path d="M-50 550 Q300 350 650 480 T1200 300 T1600 480" stroke="url(#grad-line-2)" stroke-width="1" fill="none" opacity="0.3"/>
        <path d="M100 -50 Q250 300 200 600 T300 900" stroke="url(#grad-line-3)" stroke-width="1" fill="none" opacity="0.25"/>
        <path d="M1100 -50 Q1200 250 1150 550 T1250 900" stroke="url(#grad-line-3)" stroke-width="1" fill="none" opacity="0.2"/>
        <defs>
          <linearGradient id="grad-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0"/>
            <stop offset="40%" stop-color="#2563EB" stop-opacity="1"/>
            <stop offset="100%" stop-color="#0EA5E9" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="grad-line-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#60A5FA" stop-opacity="0"/>
            <stop offset="50%" stop-color="#60A5FA" stop-opacity="1"/>
            <stop offset="100%" stop-color="#60A5FA" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="grad-line-3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6" stop-opacity="0"/>
            <stop offset="50%" stop-color="#3B82F6" stop-opacity="1"/>
            <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>


    </div>

    <!-- Centered Form -->
    <div class="auth-center">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* ── Layout ── */
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EFF6FF;
  position: relative;
  overflow: hidden;
  padding: 24px;
}

/* ── Background ── */
.auth-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* Gradient Orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
}

.orb-1 {
  width: 560px;
  height: 560px;
  background: radial-gradient(circle at 40% 40%, #93C5FD 0%, #BFDBFE 40%, transparent 70%);
  top: -160px;
  left: -120px;
  animation: orbFloat1 12s ease-in-out infinite;
}

.orb-2 {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle at 60% 60%, #60A5FA 0%, #93C5FD 40%, transparent 70%);
  bottom: -140px;
  right: -100px;
  animation: orbFloat2 15s ease-in-out infinite;
  opacity: 0.75;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #DBEAFE 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbFloat3 10s ease-in-out infinite;
  opacity: 0.6;
}

.orb-4 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #BAE6FD 0%, transparent 70%);
  top: 20%;
  right: 18%;
  animation: orbFloat2 8s ease-in-out infinite reverse;
  opacity: 0.5;
  filter: blur(50px);
}

/* Rings */
.shape-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(37, 99, 235, 0.12);
}

.shape-ring-1 {
  width: 420px;
  height: 420px;
  top: -80px;
  left: -80px;
  animation: rotateSlow 30s linear infinite;
  border-style: dashed;
}

.shape-ring-2 {
  width: 300px;
  height: 300px;
  bottom: -60px;
  right: -60px;
  animation: rotateSlow 20s linear infinite reverse;
  border-color: rgba(14, 165, 233, 0.15);
}

/* Dot grid */
.shape-dot-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(37, 99, 235, 0.1) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
}

/* Decorative SVG lines */
.deco-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}



/* ── Center Card ── */
.auth-center {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
}

/* ── Animations ── */
@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -20px) scale(1.04); }
  66%       { transform: translate(-15px, 25px) scale(0.97); }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(-25px, -30px) scale(1.06); }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50%       { transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes rotateSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}


/* ── Responsive ── */
@media (max-width: 600px) {
  .floating-badge { display: none; }
  .shape-ring     { display: none; }
}
</style>
