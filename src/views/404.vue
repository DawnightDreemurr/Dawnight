<template>
  <div class="not-found-container">
    <!-- 3D云层和闪电背景 -->
    <div class="weather-world">
      <div class="thunderstorm-3d">
        <div v-for="i in 12" :key="'cloud-'+i" class="cloud-3d" :style="cloudStyle(i)"></div>
      </div>
      <div class="lightning-container">
        <div v-for="i in 5" :key="'lightning-'+i" class="lightning-bolt"></div>
      </div>
    </div>

    <!-- 粒子雨效果 -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>

    <!-- 内容区域 -->
    <div class="error-content">
      <div class="glitch" data-text="404">404</div>
      <h2 class="animated-text">气象卫星失去信号!</h2>
      <p class="subtitle">我们无法定位您请求的页面坐标</p>

      <router-link to="/" class="home-button">
        <span>启动紧急返回协议</span>
        <div class="button-icon">
          <svg viewBox="0 0 24 24">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
        </div>
        <div class="button-liquid"></div>
      </router-link>
    </div>

    <!-- 浮动天气图标 -->
    <div class="floating-icons">
      <div v-for="(icon, index) in weatherIcons" :key="'icon-'+index"
           class="weather-icon" :style="iconStyle(index)">
        {{ icon }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {
      weatherIcons: ['☀️', '🌧️', '⛈️', '🌩️', '❄️', '🌪️', '🌈', '☁️'],
      particles: [],
      ctx: null,
      animationFrame: null
    }
  },
  mounted() {
    this.initParticles();
    this.animateParticles();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    cloudStyle(i) {
      const size = 50 + Math.random() * 100;
      return {
        width: `${size}px`,
        height: `${size/2}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 60}%`,
        opacity: 0.5 + Math.random() * 0.5,
        animationDelay: `${Math.random() * 5}s`,
        filter: `blur(${5 + Math.random() * 10}px)`
      };
    },
    iconStyle(i) {
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        fontSize: `${1 + Math.random() * 2}rem`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${10 + Math.random() * 20}s`
      };
    },
    initParticles() {
      const canvas = this.$refs.particleCanvas;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      this.ctx = canvas.getContext('2d');

      const particleCount = Math.floor(canvas.width * canvas.height / 1000);
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          angle: Math.random() * Math.PI * 2
        });
      }
    },
    animateParticles() {
      const canvas = this.$refs.particleCanvas;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
      this.particles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();

        // 更新位置
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed * 2; // 向下更快

        // 边界检查
        if (p.x < 0 || p.x > canvas.width || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -10;
          p.speed = Math.random() * 2 + 1;
        }
      });

      this.animationFrame = requestAnimationFrame(this.animateParticles);
    },
    handleResize() {
      const canvas = this.$refs.particleCanvas;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }
}
</script>

<style scoped>
.not-found-container {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

.weather-world {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.cloud-3d {
  position: absolute;
  background: rgba(200, 200, 255, 0.1);
  border-radius: 50%;
  filter: blur(10px);
  animation: float 15s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}

.lightning-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lightning-bolt {
  position: absolute;
  background: linear-gradient(to bottom, transparent, white, transparent);
  width: 2px;
  height: 0;
  opacity: 0;
  animation: lightning 6s infinite;
  transform-origin: top;
}

@keyframes lightning {
  0%, 15%, 100% { height: 0; opacity: 0; }
  1% { height: 0; opacity: 0; }
  2% { height: 200px; opacity: 0.8; }
  3% { height: 150px; opacity: 0; }
  5% { height: 300px; opacity: 0.9; }
  6% { height: 0; opacity: 0; }
}

.lightning-bolt:nth-child(1) {
  left: 20%;
  animation-delay: 0.5s;
}
.lightning-bolt:nth-child(2) {
  left: 35%;
  animation-delay: 2s;
  transform: rotate(5deg);
}
.lightning-bolt:nth-child(3) {
  left: 60%;
  animation-delay: 3.5s;
  transform: rotate(-3deg);
}
.lightning-bolt:nth-child(4) {
  left: 75%;
  animation-delay: 1s;
  transform: rotate(7deg);
}
.lightning-bolt:nth-child(5) {
  left: 85%;
  animation-delay: 4s;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.error-content {
  position: relative;
  z-index: 10;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  max-width: 800px;
  background: transparent;
  backdrop-filter: blur(2px);
  border-radius: 20px;
}

.glitch {
  position: relative;
  font-size: 8rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10px #4fc3f7, 0 0 20px #4fc3f7, 0 0 30px #4fc3f7;
  margin: 0;
  animation: glitch-effect 3s infinite;
}

.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: #0ff;
  z-index: -1;
  animation: glitch-effect-2 2s infinite;
}

.glitch::after {
  color: #f0f;
  z-index: -2;
  animation: glitch-effect-3 2.5s infinite;
}

@keyframes glitch-effect {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  80% { transform: translate(3px, -3px); }
}

@keyframes glitch-effect-2 {
  0%, 100% { transform: translate(0); opacity: 1; }
  10% { transform: translate(-5px, 5px); opacity: 0.8; }
  30% { transform: translate(5px, -5px); opacity: 0.5; }
  50% { transform: translate(-5px, -5px); opacity: 0.8; }
  70% { transform: translate(5px, 5px); opacity: 0.5; }
  90% { transform: translate(-5px, 0); opacity: 0.8; }
}

@keyframes glitch-effect-3 {
  0%, 100% { transform: translate(0); opacity: 1; }
  15% { transform: translate(5px, 5px); opacity: 0.5; }
  35% { transform: translate(-5px, -5px); opacity: 0.8; }
  55% { transform: translate(5px, -5px); opacity: 0.5; }
  75% { transform: translate(-5px, 5px); opacity: 0.8; }
  95% { transform: translate(5px, 0); opacity: 0.5; }
}

.animated-text {
  font-size: 2.5rem;
  margin: 1rem 0;
  background: linear-gradient(90deg, #4fc3f7, #2196f3, #3f51b5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: text-gradient 5s ease infinite;
  background-size: 200% 200%;
}

@keyframes text-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #b0bec5;
  position: relative;
  display: inline-block;
}

.subtitle::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4fc3f7, transparent);
  animation: subtitle-underline 3s infinite;
}

@keyframes subtitle-underline {
  0% { transform: scaleX(0); opacity: 0; }
  50% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(0); opacity: 0; }
}

.home-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 15px 30px;
  background: rgba(0, 50, 100, 0.5);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(100, 200, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 100, 255, 0.3);
  z-index: 1;
}

.home-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 25px rgba(0, 150, 255, 0.6);
}

.home-button .button-icon {
  margin-left: 10px;
  transition: transform 0.3s ease;
}

.home-button:hover .button-icon {
  transform: translateX(5px);
}

.button-liquid {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(100, 200, 255, 0.3),
    rgba(0, 100, 255, 0.1)
  );
  transform: rotate(0deg);
  animation: liquid-rotate 6s linear infinite;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.home-button:hover .button-liquid {
  opacity: 1;
}

@keyframes liquid-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.weather-icon {
  position: absolute;
  animation: float-icon linear infinite;
  opacity: 0.7;
  filter: drop-shadow(0 0 5px rgba(100, 200, 255, 0.7));
}

@keyframes float-icon {
  0% { transform: translateY(0) translateX(0) rotate(0deg); }
  100% { transform: translateY(100vh) translateX(50px) rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .glitch {
    font-size: 5rem;
  }

  .animated-text {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .home-button {
    padding: 12px 24px;
    font-size: 0.9rem;
  }

  .cloud-3d {
    filter: blur(5px);
  }
}

@media (max-width: 480px) {
  .error-content {
    padding: 1rem;
    margin: 1rem;
  }

  .glitch {
    font-size: 3.5rem;
  }

  .animated-text {
    font-size: 1.4rem;
  }
}
</style>
